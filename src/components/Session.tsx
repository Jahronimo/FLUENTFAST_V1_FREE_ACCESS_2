import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SessionState, SessionMode, Language, SemanticAnchor } from '../types';
import { COLORS, PHRASES, Icons } from '../constants';
import TextFitter from './TextFitter';
import { playTap, playToggle } from "../utils/uiAudioService";
import { playPhrase, stopAllPlayback } from "../utils/audioService";

interface SessionProps {
  state: SessionState;
  onUpdate: (update: Partial<SessionState>) => void;
  onExit: () => void;
}

const Session: React.FC<SessionProps> = ({ state, onUpdate, onExit }) => {
  const [panelSize, setPanelSize] = useState({ width: 0, height: 0 });
  const [highlightState, setHighlightState] = useState<{ player: 'blue' | 'white' | null, role: 'target' | 'root' | null, charIndex: number }>({ player: null, role: null, charIndex: -1 });
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const panelHeight = (clientHeight - Math.max(50, Math.min(160, clientHeight * 0.08))) / 2;
    setPanelSize({ width: clientWidth, height: panelHeight });
  }, []);

  useEffect(() => {
    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [calculateLayout]);

  const currentStep = useMemo(() => PHRASES[state.currentPhraseIndex] || null, [state.currentPhraseIndex]);
  const { rootLang, targetLang } = state;

  const getAnchors = (anchors: SemanticAnchor[] | undefined, lang: Language) => (anchors || []).map((a, j) => ({
    text: a?.[lang] || "", 
    color: COLORS?.UNDERLINES ? COLORS.UNDERLINES[(state.currentPhraseIndex + j) % COLORS.UNDERLINES.length] : '#FFFF00'
  }));

  const nextPhrase = () => { playTap?.(); stopAllPlayback?.(); setHighlightState({ player: null, role: null, charIndex: -1 }); onUpdate({ currentPhraseIndex: (state.currentPhraseIndex + 1) % PHRASES.length }); };
  const prevPhrase = () => { playTap?.(); stopAllPlayback?.(); setHighlightState({ player: null, role: null, charIndex: -1 }); onUpdate({ currentPhraseIndex: (state.currentPhraseIndex - 1 + PHRASES.length) % PHRASES.length }); };
  const handleExit = () => { playTap?.(); stopAllPlayback?.(); onExit(); };
  const cycleMode = () => { playToggle?.(); const modes = [SessionMode.DEFAULT, SessionMode.UNDERLINE, SessionMode.TEST]; onUpdate({ mode: modes[(modes.indexOf(state.mode) + 1) % modes.length] }); };
  const handleToggleSpeed = () => { playToggle?.(); onUpdate({ playbackRate: state.playbackRate === 1.0 ? 0.75 : 1.0 }); };

  const handlePlay = (isWhite: boolean, role: 'target' | 'root') => {
    if (!currentStep) return;
    playTap?.();
    const player = isWhite ? 'white' : 'blue';
    const lang = role === 'target' ? targetLang : rootLang;
    const text = isWhite ? currentStep.player_white?.[lang] : currentStep.player_blue?.[lang];
    if (!text) return;
    stopAllPlayback?.();
    setHighlightState({ player, role, charIndex: 0 });
    playPhrase?.(text, lang, state.playbackRate, (idx) => setHighlightState({ player, role, charIndex: idx }), () => setHighlightState({ player: null, role: null, charIndex: -1 }));
  };

  const isTest = state.mode === SessionMode.TEST;
  const showUnderline = state.mode === SessionMode.UNDERLINE;

  return (
    <div ref={containerRef} className="h-screen w-screen flex flex-col bg-black overflow-hidden select-none relative">
      <PlayerPanel isRootCard width={panelSize.width} height={panelSize.height} phraseA={currentStep?.player_blue?.[targetLang] || ""} phraseB={currentStep?.player_blue?.[rootLang] || ""} isTest={isTest} showUnderline={showUnderline} onPressA={() => handlePlay(false, 'target')} onPressB={() => handlePlay(false, 'root')} anchorsA={getAnchors(currentStep?.anchors_blue, targetLang)} anchorsB={getAnchors(currentStep?.anchors_blue, rootLang)} activeCharIndexA={highlightState.player === 'blue' && highlightState.role === 'target' ? highlightState.charIndex : -1} activeCharIndexB={highlightState.player === 'blue' && highlightState.role === 'root' ? highlightState.charIndex : -1} />
      <div className="absolute left-6 z-[60] bg-black border border-white/20 rounded-md px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-[0.15em] shadow-[inset_1px_1.5px_0_rgba(255,255,255,0.1)] rotate-180" style={{ top: `calc(50% - 4% - 30px)` }}>YOU START</div>
      <div className="flex items-center justify-around bg-black px-4 shrink-0 shadow-soft z-50" style={{ height: '8%', minHeight: '50px', maxHeight: '160px' }}>
        <button onPointerDown={handleToggleSpeed} className="btn-tactile text-xl font-extrabold text-white">{state.playbackRate}x</button>
        <button onPointerDown={prevPhrase} className="btn-tactile text-white">{Icons?.Back ? <Icons.Back /> : '<'}</button>
        <button onPointerDown={handleExit} className="btn-tactile text-white">{Icons?.Exit ? <Icons.Exit /> : 'X'}</button>
        <button onPointerDown={nextPhrase} className="btn-tactile text-white">{Icons?.Next ? <Icons.Next /> : '>'}</button>
        <button onPointerDown={cycleMode} className="btn-tactile text-white">{Icons?.Test ? <Icons.Test /> : '?'}</button>
      </div>
      <PlayerPanel isRootCard={false} width={panelSize.width} height={panelSize.height} phraseA={currentStep?.player_white?.[targetLang] || ""} phraseB={currentStep?.player_white?.[rootLang] || ""} isTest={isTest} showUnderline={showUnderline} onPressA={() => handlePlay(true, 'target')} onPressB={() => handlePlay(true, 'root')} anchorsA={getAnchors(currentStep?.anchors_white, targetLang)} anchorsB={getAnchors(currentStep?.anchors_white, rootLang)} activeCharIndexA={highlightState.player === 'white' && highlightState.role === 'target' ? highlightState.charIndex : -1} activeCharIndexB={highlightState.player === 'white' && highlightState.role === 'root' ? highlightState.charIndex : -1} />
    </div>
  );
};

const PlayerPanel: React.FC<{ isRootCard: boolean; width: number; height: number; phraseA: string; phraseB: string; isTest: boolean; showUnderline: boolean; onPressA: () => void; onPressB: () => void; anchorsA: any[]; anchorsB: any[]; activeCharIndexA: number; activeCharIndexB: number; }> = ({ isRootCard, width, height, phraseA, phraseB, isTest, showUnderline, onPressA, onPressB, anchorsA, anchorsB, activeCharIndexA, activeCharIndexB }) => {
  const rotation = isRootCard ? 'rotate-180' : '';
  const cardBg = isRootCard ? (COLORS?.WHITE ?? '#FFF') : (COLORS?.BRAND_BLUE ?? '#6865F0');
  const textColor = isRootCard ? (COLORS?.BLACK ?? '#000') : (COLORS?.WHITE ?? '#FFF');
  const shadowClass = isRootCard ? 'btn-white-tactile glow-white-press' : 'btn-tactile glow-blue-press';
  const inset = 24, gap = 12, usableH = height - (inset * 2) - gap;
  const heightA = isTest ? usableH + gap : usableH * 0.7, heightB = isTest ? 0 : usableH * 0.3;

  return (
    <div className={`relative w-full overflow-hidden ${rotation}`} style={{ backgroundColor: isRootCard ? (COLORS?.BRAND_BLUE ?? '#6865F0') : (COLORS?.WHITE ?? '#FFF'), height }}>
      <div onPointerDown={onPressA} className={`absolute rounded-3xl overflow-hidden shadow-soft ${shadowClass}`} style={{ top: inset, left: inset, right: inset, height: heightA, backgroundColor: cardBg, color: textColor }}>
        <TextFitter text={phraseA} isRoleA underline={showUnderline && !isTest} containerWidth={width - (inset * 2)} containerHeight={heightA} padding={{ top: 20, bottom: 20, left: 32, right: 32 }} anchors={anchorsA} activeCharIndex={activeCharIndexA} isRootCard={isRootCard} />
      </div>
      {!isTest && (
        <div onPointerDown={onPressB} className={`absolute rounded-3xl overflow-hidden shadow-soft active:opacity-100 ${shadowClass}`} style={{ bottom: inset, left: inset, right: inset, height: heightB, backgroundColor: cardBg, color: textColor, opacity: 0.9 }}>
          <TextFitter text={phraseB} isRoleA={false} underline={showUnderline && !isTest} containerWidth={width - (inset * 2)} containerHeight={heightB} padding={{ top: 10, bottom: 10, left: 24, right: 24 }} anchors={anchorsB} activeCharIndex={activeCharIndexB} isRootCard={isRootCard} />
        </div>
      )}
    </div>
  );
};

export default Session;
