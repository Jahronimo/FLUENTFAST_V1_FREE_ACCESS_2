
import { Language } from '../types';

/**
 * V_7_FLUENTFAST — VOICE ADAPTER SPEC v2.0 (NATURAL VOICES)
 * EXTENDED by V_8 — VOICE–TEXT SYNC HIGHLIGHT SPEC v1.0
 * UPDATED by V__8.1_PATCH — VOICE HIGHLIGHT PROGRESSION GUARANTEE v1.0
 */

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

// Rule 2: Persistent reference to prevent garbage collection of boundary callbacks
let activeUtterance: SpeechSynthesisUtterance | null = null;
let fallbackInterval: number | null = null;
let fallbackCheckTimeout: number | null = null;

const languageToLangCode: Record<Language, string> = {
  [Language.ENGLISH]: 'en-US',
  [Language.SPANISH]: 'es-ES',
  [Language.FRENCH]: 'fr-FR',
  [Language.GERMAN]: 'de-DE',
};

const naturalVoicePreferences: Record<Language, string[]> = {
  [Language.ENGLISH]: ['Google US English', 'Samantha', 'Alex', 'Microsoft Zira'],
  [Language.SPANISH]: ['Google español', 'Monica', 'Paulina', 'Microsoft Helena'],
  [Language.FRENCH]: ['Google français', 'Amélie', 'Thomas', 'Microsoft Hortense'],
  [Language.GERMAN]: ['Google Deutsch', 'Anna', 'Microsoft Hedda'],
};

const findDeterministicVoice = (lang: Language): SpeechSynthesisVoice | null => {
  if (!synth) return null;
  const voices = synth.getVoices();
  const langCode = languageToLangCode[lang];
  const preferences = naturalVoicePreferences[lang];

  for (const prefName of preferences) {
    const found = voices.find(v => v.name.includes(prefName));
    if (found) return found;
  }

  return voices.find(v => v.lang.startsWith(langCode) || v.lang === langCode) || null;
};

/**
 * Rule 5.1: Highlight Normalization Function (LOCKED)
 */
export const normalizeForHighlight = (text: string): string => {
  return text
    .replace(/[.,!?:;“”‘’"'()[\]{}]/g, '') // Rule 5.1: Remove specific punctuation
    .replace(/\s+/g, ' ')                  // Collapse multiple spaces
    .trim();
};

/**
 * playPhrase with V_8.1 Progression Guarantee
 */
export const playPhrase = (
  text: string, 
  language: Language, 
  rate: number, 
  onBoundary?: (charIndex: number) => void,
  onEnd?: () => void
) => {
  if (!synth) return;

  // Single-voice lock (Inherited)
  if (synth.speaking) {
    return;
  }

  // Cleanup any previous stale state
  if (fallbackInterval) clearInterval(fallbackInterval);
  if (fallbackCheckTimeout) clearTimeout(fallbackCheckTimeout);

  try {
    const normalizedText = normalizeForHighlight(text);
    const normalizedWords = normalizedText.split(' ');

    // Rule 2: Strongly reference the utterance to prevent GC
    activeUtterance = new SpeechSynthesisUtterance(normalizedText); 
    activeUtterance.lang = languageToLangCode[language];
    activeUtterance.rate = rate;

    const voice = findDeterministicVoice(language);
    if (voice) {
      activeUtterance.voice = voice;
    }

    let boundaryFiredCount = 0;

    activeUtterance.onboundary = (event) => {
      if (event.name === 'word') {
        boundaryFiredCount++;
        // If boundary events start working, we kill the fallback
        if (fallbackInterval) {
          clearInterval(fallbackInterval);
          fallbackInterval = null;
        }
        if (onBoundary) {
          onBoundary(event.charIndex);
        }
      }
    };

    /**
     * Rule 4: Fallback Progression Model (DETERMINISTIC)
     */
    const startFallback = () => {
      if (fallbackInterval || !activeUtterance) return;
      
      let currentWordIdx = 0;
      const intervalMs = rate === 1.0 ? 230 : 300; // Rule 4.3 Timing

      fallbackInterval = window.setInterval(() => {
        currentWordIdx++;
        if (currentWordIdx < normalizedWords.length) {
          // Rule 4.3: Deterministic per-word cadence
          const prevText = normalizedWords.slice(0, currentWordIdx).join(' ');
          const nextCharIndex = prevText.length + (currentWordIdx > 0 ? 1 : 0);
          if (onBoundary) onBoundary(nextCharIndex);
        } else {
          // Rule 4.4: Final Hold
          window.setTimeout(() => {
            if (fallbackInterval) {
              clearInterval(fallbackInterval);
              fallbackInterval = null;
            }
          }, 180);
        }
      }, intervalMs);
    };

    // Rule 3.2: Switch to fallback if boundaries are missing or stalled
    fallbackCheckTimeout = window.setTimeout(() => {
      if (boundaryFiredCount < 2 && normalizedWords.length > 1) {
        startFallback();
      }
    }, 250);

    const cleanup = () => {
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (fallbackCheckTimeout) clearTimeout(fallbackCheckTimeout);
      fallbackInterval = null;
      fallbackCheckTimeout = null;
      activeUtterance = null;
    };

    activeUtterance.onend = () => {
      cleanup();
      if (onEnd) onEnd();
    };

    activeUtterance.onerror = () => {
      cleanup();
      if (onEnd) onEnd();
    };

    synth.speak(activeUtterance);
  } catch (e) {
    console.error("Voice playback failed silently", e);
    if (onEnd) onEnd();
  }
};

export const stopAllPlayback = () => {
  if (synth) {
    synth.cancel();
  }
  if (fallbackInterval) clearInterval(fallbackInterval);
  if (fallbackCheckTimeout) clearTimeout(fallbackCheckTimeout);
  fallbackInterval = null;
  fallbackCheckTimeout = null;
  activeUtterance = null;
};
