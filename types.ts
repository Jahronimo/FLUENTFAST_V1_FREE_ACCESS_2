
export enum Language {
  ENGLISH = 'ENGLISH',
  SPANISH = 'SPANISH',
  FRENCH = 'FRENCH',
  GERMAN = 'GERMAN'
}

export type Page = 'HOME' | 'PARTNER' | 'LANGUAGES' | 'READY' | 'SPLASH' | 'SESSION';

export enum SessionMode {
  DEFAULT = 'DEFAULT',
  UNDERLINE = 'UNDERLINE',
  TEST = 'TEST'
}

/**
 * Mapping of languages to specific text strings.
 */
export interface LanguageMap {
  [Language.ENGLISH]: string;
  [Language.SPANISH]: string;
  [Language.FRENCH]: string;
  [Language.GERMAN]: string;
}

/**
 * Semantic anchor mapping (V4 §6).
 * Groups words by meaning across languages.
 */
export interface SemanticAnchor {
  [Language.ENGLISH]: string;
  [Language.SPANISH]: string;
  [Language.FRENCH]: string;
  [Language.GERMAN]: string;
}

/**
 * Deterministic database step (V_4).
 * UPDATED by V_11.2: Player-scoped anchor resolution.
 */
export interface PhrasePair {
  id: number;
  player_blue: LanguageMap;
  player_white: LanguageMap;
  anchors_blue: SemanticAnchor[];  // Scoped to Blue Player's phrase
  anchors_white: SemanticAnchor[]; // Scoped to White Player's phrase
}

/**
 * Spec V_12: Bidirectional Language Roles
 */
export interface SessionState {
  targetLang: Language; // LANGUAGE_B (I want to speak)
  rootLang: Language;   // LANGUAGE_A (I speak - resolved for this session)
  currentPhraseIndex: number;
  mode: SessionMode;
  playbackRate: 1.0 | 0.75;
}
