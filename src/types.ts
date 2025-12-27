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

export interface LanguageMap {
  [Language.ENGLISH]: string;
  [Language.SPANISH]: string;
  [Language.FRENCH]: string;
  [Language.GERMAN]: string;
}

export interface SemanticAnchor {
  [Language.ENGLISH]: string;
  [Language.SPANISH]: string;
  [Language.FRENCH]: string;
  [Language.GERMAN]: string;
}

export interface PhrasePair {
  id: number;
  player_blue: LanguageMap;
  player_white: LanguageMap;
  anchors_blue: SemanticAnchor[];
  anchors_white: SemanticAnchor[];
}

export interface SessionState {
  targetLang: Language;
  rootLang: Language;
  currentPhraseIndex: number;
  mode: SessionMode;
  playbackRate: 1.0 | 0.75;
}