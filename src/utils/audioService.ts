import { Language } from '../types';

const synth = typeof window !== 'undefined' ? (window.speechSynthesis || null) : null;

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
  try {
    const voices = synth.getVoices();
    const langCode = languageToLangCode[lang];
    const preferences = naturalVoicePreferences[lang];

    for (const prefName of preferences) {
      const found = voices.find(v => v.name.includes(prefName));
      if (found) return found;
    }

    return voices.find(v => v.lang.startsWith(langCode) || v.lang === langCode) || null;
  } catch (e) {
    return null;
  }
};

export const normalizeForHighlight = (text: string): string => {
  return (text || '')
    .replace(/[.,!?:;“”‘’"'()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const playPhrase = (
  text: string, 
  language: Language, 
  rate: number, 
  onBoundary?: (charIndex: number) => void,
  onEnd?: () => void
) => {
  if (!synth) {
     onEnd?.();
     return;
  }
  
  if (synth.speaking) synth.cancel?.();

  if (fallbackInterval) clearInterval(fallbackInterval);
  if (fallbackCheckTimeout) clearTimeout(fallbackCheckTimeout);

  try {
    const normalizedText = normalizeForHighlight(text);
    const normalizedWords = normalizedText.split(' ').filter(w => w.length > 0);

    if (normalizedWords.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    activeUtterance = new SpeechSynthesisUtterance(normalizedText); 
    activeUtterance.lang = languageToLangCode[language] || 'en-US';
    activeUtterance.rate = rate || 1.0;

    const voice = findDeterministicVoice(language);
    if (voice) {
      activeUtterance.voice = voice;
    }

    let boundaryFiredCount = 0;

    activeUtterance.onboundary = (event) => {
      if (event.name === 'word') {
        boundaryFiredCount++;
        if (fallbackInterval) {
          clearInterval(fallbackInterval);
          fallbackInterval = null;
        }
        if (onBoundary) {
          onBoundary(event.charIndex);
        }
      }
    };

    const startFallback = () => {
      if (fallbackInterval || !activeUtterance) return;
      let currentWordIdx = 0;
      const intervalMs = rate === 1.0 ? 230 : 300;

      fallbackInterval = window.setInterval(() => {
        currentWordIdx++;
        if (currentWordIdx < normalizedWords.length) {
          const prevText = normalizedWords.slice(0, currentWordIdx).join(' ');
          const nextCharIndex = prevText.length + (currentWordIdx > 0 ? 1 : 0);
          if (onBoundary) onBoundary(nextCharIndex);
        } else {
          window.setTimeout(() => {
            if (fallbackInterval) {
              clearInterval(fallbackInterval);
              fallbackInterval = null;
            }
          }, 180);
        }
      }, intervalMs);
    };

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
    console.error("Speech playback error:", e);
    if (onEnd) onEnd();
  }
};

export const stopAllPlayback = () => {
  if (!synth) return;
  try {
    synth.cancel?.();
  } catch(e) {}
  if (fallbackInterval) clearInterval(fallbackInterval);
  if (fallbackCheckTimeout) clearTimeout(fallbackCheckTimeout);
  fallbackInterval = null;
  fallbackCheckTimeout = null;
  activeUtterance = null;
};