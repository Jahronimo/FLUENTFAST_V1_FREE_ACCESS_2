import React from 'react';
import { Language } from '../types';
import { COLORS, LANGUAGES_ORDER } from '../constants';
import SetupTitle from './SetupTitle';

interface LanguageSelectionProps {
  known: Language;
  target: Language;
  onSelectKnown: (l: Language) => void;
  onSelectTarget: (l: Language) => void;
  onConfirm: () => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ known, target, onSelectKnown, onSelectTarget, onConfirm }) => {
  const isReady = !!known && !!target;
  const renderBtn = (lang: Language, isTarget: boolean) => {
    const isSelected = isTarget ? target === lang : known === lang;
    const isDisabled = isTarget ? known === lang : target === lang;
    return (
      <button key={lang} disabled={isDisabled} onPointerDown={() => isTarget ? onSelectTarget(lang) : onSelectKnown(lang)}
        className={`btn-white-tactile rounded-2xl border-4 flex flex-col items-center justify-center transition-all duration-200
          ${isSelected ? 'bg-white text-[#6865F0] border-white' : 'bg-transparent border-white/20 text-white'}
          ${isDisabled ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}
        `}>
        <span className="text-xl font-black">{lang.slice(0, 2)}</span>
        <span className="text-xs font-bold opacity-60 mt-1">{lang}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full w-full p-8 text-white overflow-hidden" style={{ backgroundColor: COLORS.BRAND_BLUE }}>
      <div className="h-[15%] flex flex-col items-center justify-center shrink-0">
        <SetupTitle text="LANGUAGES" baselineSize={56} />
      </div>
      <div className="flex-1 flex flex-col min-h-0 space-y-8 py-4">
        <section className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">I Speak</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">{LANGUAGES_ORDER.map(l => renderBtn(l, false))}</div>
        </section>
        <section className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Target</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">{LANGUAGES_ORDER.map(l => renderBtn(l, true))}</div>
        </section>
      </div>
      <div className="h-[15%] flex items-center justify-center shrink-0 pt-4">
        <button disabled={!isReady} onPointerDown={() => isReady && onConfirm()}
          className={`btn-setup-primary w-full max-w-sm h-20 rounded-full text-2xl font-extrabold uppercase tracking-widest border border-white/10 ${isReady ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}`}>
          <span className="btn-text-glow">Initialize</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;