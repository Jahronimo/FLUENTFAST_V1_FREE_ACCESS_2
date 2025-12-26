
import React from 'react';
import { Language } from '../types';
import { COLORS, LANGUAGES_ORDER } from '../constants';
import SetupTitle from './SetupTitle';

interface LanguageSelectionProps {
  known: Language; // V_13_PATCH: Single selected language
  target: Language; // V_13_PATCH: Single selected language
  onSelectKnown: (l: Language) => void;
  onSelectTarget: (l: Language) => void;
  onConfirm: () => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  known,
  target,
  onSelectKnown,
  onSelectTarget,
  onConfirm
}) => {
  // V_13_PATCH: Invariant is 1 selection per role. Button is essentially always ready with valid state.
  const isReady = !!known && !!target;

  return (
    <div className="flex flex-col h-full w-full p-8 text-white overflow-hidden" style={{ backgroundColor: COLORS.BRAND_BLUE }}>
      {/* Header Section */}
      <div className="h-[15%] flex flex-col items-center justify-center shrink-0">
        <SetupTitle text="LANGUAGES" baselineSize={56} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 space-y-8 py-4">
        {/* Section 1: I SPEAK (LANGUAGE_A - Single-select) */}
        <section className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">I Speak</h2>
            <span className="text-[10px] font-bold uppercase opacity-40">Select One</span>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {LANGUAGES_ORDER.map(lang => {
              const isSelected = known === lang;
              const isDisabled = target === lang;
              return (
                <button
                  key={`known-${lang}`}
                  disabled={isDisabled}
                  onPointerDown={() => onSelectKnown(lang)}
                  className={`btn-white-tactile rounded-2xl border-4 flex flex-col items-center justify-center transition-all duration-200
                    ${isSelected ? 'bg-white text-[#6865F0] border-white' : 'bg-transparent border-white/20 text-white'}
                    ${isDisabled ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}
                  `}
                >
                  <span className="text-xl font-black">{lang === Language.ENGLISH ? 'EN' : lang === Language.SPANISH ? 'ES' : lang === Language.FRENCH ? 'FR' : 'DE'}</span>
                  <span className="text-xs font-bold opacity-60 mt-1">{lang}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: I WANT TO SPEAK (LANGUAGE_B - Single-select) */}
        <section className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">I Want To Speak</h2>
            <span className="text-[10px] font-bold uppercase opacity-40">Target</span>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {LANGUAGES_ORDER.map(lang => {
              const isSelected = target === lang;
              const isDisabled = known === lang;
              return (
                <button
                  key={`target-${lang}`}
                  disabled={isDisabled}
                  onPointerDown={() => onSelectTarget(lang)}
                  className={`btn-white-tactile rounded-2xl border-4 flex flex-col items-center justify-center transition-all duration-200
                    ${isSelected ? 'bg-white text-[#6865F0] border-white' : 'bg-transparent border-white/20 text-white'}
                    ${isDisabled ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}
                  `}
                >
                  <span className="text-xl font-black">{lang === Language.ENGLISH ? 'EN' : lang === Language.SPANISH ? 'ES' : lang === Language.FRENCH ? 'FR' : 'DE'}</span>
                  <span className="text-xs font-bold opacity-60 mt-1">{lang}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Confirmation Section */}
      <div className="h-[15%] flex items-center justify-center shrink-0 pt-4">
        <button
          disabled={!isReady}
          onPointerDown={() => { if(isReady) onConfirm(); }}
          className={`btn-setup-primary w-full max-w-sm h-20 rounded-full text-2xl font-extrabold transition-all duration-200 uppercase tracking-widest border border-white/10
            ${isReady ? 'opacity-100' : 'opacity-30 cursor-not-allowed'}
          `}
        >
          <span className="btn-text-glow">Initialize</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;
