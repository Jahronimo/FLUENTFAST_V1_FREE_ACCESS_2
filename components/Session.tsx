
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SessionState, SessionMode, Language, SemanticAnchor } from '../types';
import { COLORS, PHRASES, Icons } from '../constants';
import TextFitter from './TextFitter';
import { playPhrase, stopAllPlayback } from '../services/audioService';
import { playTap, playNav, playToggle } from '../services/uiAudioService';

interface SessionProps {
  state: SessionState;
  onUpdate: (update: Partial<SessionState>) => void;
  onExit: () => void;
}

const Session: React.FC<SessionProps> = ({ state, onUpdate, onExit }) => {
  const [panelSize, setPanelSize] = useState({ width: 0, height: 0 });
  const [highlightState, setHighlightState] = useState<{ 
    player: 'blue' | 'white' | null, 
    role: 'target' | 'root' | null, 
    charIndex: number 
  }>({
    player: null,
    role: null,
    charIndex: -1
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const rawControlHeight = clientHeight * 0.08;
    const controlHeight = Math.max(50, Math.min(160, rawControlHeight));
    const panelHeight = (clientHeight - controlHeight) / 2;
    setPanelSize({ width: clientWidth, height: panelHeight });
  }, []);

  useEffect(() => {
    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [calculateLayout]);

  const currentStep = PHRASES[state.currentPhraseIndex] || null;

  const rootLang = state.rootLang;     // LANGUAGE_A (I SPEAK - Reference)
  const targetLang = state.targetLang; // LANGUAGE_B (I WANT TO SPEAK - Practice)

  const bluePhraseTarget = currentStep ? currentStep.player_blue[targetLang] : "";
  const bluePhraseRoot = currentStep ? currentStep.player_blue[rootLang] : "";

  const whitePhraseTarget = currentStep ? currentStep.player_white[targetLang] : "";
  const whitePhraseRoot = currentStep ? currentStep.player_white[rootLang] : "";

  const getAnchorsWithColors = (anchors: SemanticAnchor[], lang: Language) => {
    if (!currentStep) return [];
    return anchors.map((anchor, j) => {
      const colorIndex = (state.currentPhraseIndex + j) % COLORS.UNDERLINES.length;
      return {
        text: anchor[lang],
        color: COLORS.UNDERLINES[colorIndex]
      };
    });
  };

  // Localized Anchors for Blue Player
  const blueAnchorsTarget = useMemo(() => 
    getAnchorsWithColors(currentStep?.anchors_blue || [], targetLang), 
    [currentStep, state.currentPhraseIndex, targetLang]
  );
  const blueAnchorsRoot = useMemo(() => 
    getAnchorsWithColors(currentStep?.anchors_blue || [], rootLang), 
    [currentStep, state.currentPhraseIndex, rootLang]
  );
  
  // Localized Anchors for White Player
  const whiteAnchorsTarget = useMemo(() => 
    getAnchorsWithColors(currentStep?.anchors_white || [], targetLang), 
    [currentStep, state.currentPhraseIndex, targetLang]
  );
  const whiteAnchorsRoot = useMemo(() => 
    getAnchorsWithColors(currentStep?.anchors_white || [], rootLang), 
    [currentStep, state.currentPhraseIndex, rootLang]
  );

  const resetHighlight = useCallback(() => {
    setHighlightState({ player: null, role: null, charIndex: -1 });
  }, []);

  const nextPhrase = () => {
    playTap(); 
    stopAllPlayback();
    resetHighlight();
    const nextIndex = (state.currentPhraseIndex + 1) % PHRASES.length;
    onUpdate({ currentPhraseIndex: nextIndex });
  };

  const prevPhrase = () => {
    playTap();
    stopAllPlayback();
    resetHighlight();
    const prevIndex = (state.currentPhraseIndex - 1 + PHRASES.length) % PHRASES.length;
    onUpdate({ currentPhraseIndex: prevIndex });
  };

  const handleExit = () => {
    playTap();
    stopAllPlayback();
    resetHighlight();
    onExit();
  };

  const cycleMode = () => {
    playToggle();
    const modes = [SessionMode.DEFAULT, SessionMode.UNDERLINE, SessionMode.TEST];
    const currentIndex = modes.indexOf(state.mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    onUpdate({ mode: nextMode });
  };

  const handleToggleSpeed = () => {
    playToggle();
    onUpdate({ playbackRate: state.playbackRate === 1.0 ? 0.75 : 1.0 });
  };

  const handlePlay = (isPlayerWhite: boolean, role: 'target' | 'root') => {
    if (!currentStep) return;
    
    playTap(); 

    const player = isPlayerWhite ? 'white' : 'blue';
    const lang = role === 'target' ? targetLang : rootLang;
    const text = isPlayerWhite 
      ? currentStep.player_white[lang] 
      : currentStep.player_blue[lang];
    
    stopAllPlayback();
    setHighlightState({ player, role, charIndex: 0 });

    playPhrase(
      text, 
      lang, 
      state.playbackRate, 
      (index) => setHighlightState({ player, role, charIndex: index }),
      () => resetHighlight()
    );
  };

  const isTest = state.mode === SessionMode.TEST;
  const showUnderline = state.mode === SessionMode.UNDERLINE;

  return (
    <div ref={containerRef} className="h-screen w-screen flex flex-col bg-black overflow-hidden select-none relative">
      {/* Player Blue Panel (Rotated) */}
      <PlayerPanel
        isRootCard={true} 
        width={panelSize.width}
        height={panelSize.height}
        phraseA={bluePhraseTarget} 
        phraseB={bluePhraseRoot}   
        isTest={isTest}
        showUnderline={showUnderline}
        onPressA={() => handlePlay(false, 'target')}
        onPressB={() => handlePlay(false, 'root')}
        anchorsA={blueAnchorsTarget}
        anchorsB={blueAnchorsRoot}
        contextKey={`${state.currentPhraseIndex}-blue`}
        activeCharIndexA={highlightState.player === 'blue' && highlightState.role === 'target' ? highlightState.charIndex : -1}
        activeCharIndexB={highlightState.player === 'blue' && highlightState.role === 'root' ? highlightState.charIndex : -1}
      />

      {/* YOU START Indicator (Overlaying Player Blue's bottom edge) */}
      <div 
        className="absolute left-6 z-[60] pointer-events-none bg-black border border-white/20 rounded-md px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-[0.15em] shadow-[inset_1px_1.5px_0_rgba(255,255,255,0.1)] rotate-180"
        style={{ top: `calc(50% - 4% - 30px)` }} 
      >
        YOU START
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-around bg-black px-4 shrink-0 shadow-soft z-50" style={{ height: '8%', minHeight: '50px', maxHeight: '160px' }}>
        <ControlButton onPointerDown={handleToggleSpeed}>
          <span className="text-xl font-extrabold text-white tracking-tighter">{state.playbackRate}x</span>
        </ControlButton>
        <ControlButton onPointerDown={prevPhrase}><Icons.Back /></ControlButton>
        <ControlButton onPointerDown={handleExit}><Icons.Exit /></ControlButton>
        <ControlButton onPointerDown={nextPhrase}><Icons.Next /></ControlButton>
        <ControlButton onPointerDown={cycleMode}><Icons.Test /></ControlButton>
      </div>

      {/* Player White Panel (Upright) */}
      <PlayerPanel
        isRootCard={false} 
        width={panelSize.width}
        height={panelSize.height}
        phraseA={whitePhraseTarget} 
        phraseB={whitePhraseRoot}   
        isTest={isTest}
        showUnderline={showUnderline}
        onPressA={() => handlePlay(true, 'target')}
        onPressB={() => handlePlay(true, 'root')}
        anchorsA={whiteAnchorsTarget}
        anchorsB={whiteAnchorsRoot}
        contextKey={`${state.currentPhraseIndex}-white`}
        activeCharIndexA={highlightState.player === 'white' && highlightState.role === 'target' ? highlightState.charIndex : -1}
        activeCharIndexB={highlightState.player === 'white' && highlightState.role === 'root' ? highlightState.charIndex : -1}
      />
    </div>
  );
};

const PlayerPanel: React.FC<{
  isRootCard: boolean;
  width: number;
  height: number;
  phraseA: string;
  phraseB: string;
  isTest: boolean;
  showUnderline: boolean;
  onPressA: () => void;
  onPressB: () => void;
  anchorsA: { text: string; color: string }[];
  anchorsB: { text: string; color: string }[];
  contextKey: string;
  activeCharIndexA: number;
  activeCharIndexB: number;
}> = ({ isRootCard, width, height, phraseA, phraseB, isTest, showUnderline, onPressA, onPressB, anchorsA, anchorsB, contextKey, activeCharIndexA, activeCharIndexB }) => {
  const bgColor = isRootCard ? COLORS.BRAND_BLUE : COLORS.WHITE;
  const rotation = isRootCard ? 'rotate-180' : '';
  const cardBg = isRootCard ? COLORS.WHITE : COLORS.BRAND_BLUE;
  const textColor = isRootCard ? COLORS.BLACK : COLORS.WHITE;

  const inset = 24;
  const gap = 12;
  const usableHeight = height - (inset * 2) - gap;
  
  const heightA = isTest ? usableHeight + gap : usableHeight * 0.7; 
  const heightB = isTest ? 0 : usableHeight * 0.3;               

  const shadowClassA = isRootCard ? 'btn-white-tactile glow-white-press' : 'btn-tactile glow-blue-press';
  const shadowClassB = isRootCard ? 'btn-white-tactile glow-white-press' : 'btn-tactile glow-blue-press';

  return (
    <div className={`relative w-full overflow-hidden flex flex-col items-center justify-start ${rotation}`} style={{ backgroundColor: bgColor, height }}>
      {/* Large Card: I WANT TO SPEAK (Production) */}
      <div 
        onPointerDown={onPressA}
        className={`absolute rounded-3xl overflow-hidden shadow-soft ${shadowClassA}`}
        style={{ top: inset, left: inset, right: inset, height: heightA, backgroundColor: cardBg, color: textColor }}
      >
        <TextFitter 
          key={`a-${contextKey}`} 
          text={phraseA} 
          isRoleA={true} 
          underline={showUnderline && !isTest} 
          containerWidth={width - (inset * 2)} 
          containerHeight={heightA} 
          padding={{ top: 20, bottom: 20, left: 32, right: 32 }}
          anchors={anchorsA}
          activeCharIndex={activeCharIndexA}
          isRootCard={isRootCard}
        />
      </div>

      {/* Small Card: I SPEAK (Reference) */}
      {!isTest && (
        <div 
          onPointerDown={onPressB}
          className={`absolute rounded-3xl overflow-hidden shadow-soft active:opacity-100 ${shadowClassB}`}
          style={{ bottom: inset, left: inset, right: inset, height: heightB, backgroundColor: cardBg, color: textColor, opacity: 0.9 }}
        >
          <TextFitter 
            key={`b-${contextKey}`} 
            text={phraseB} 
            isRoleA={false} 
            underline={showUnderline && !isTest} // Match underlining for meaning enabled
            containerWidth={width - (inset * 2)} 
            containerHeight={heightB} 
            padding={{ top: 10, bottom: 10, left: 24, right: 24 }}
            anchors={anchorsB} // Passing root-localized anchors for match
            activeCharIndex={activeCharIndexB}
            isRootCard={isRootCard}
          />
        </div>
      )}
    </div>
  );
};

const ControlButton: React.FC<{ children: React.ReactNode, onPointerDown: () => void }> = ({ children, onPointerDown }) => (
  <button onPointerDown={onPointerDown} className="btn-tactile h-full flex items-center justify-center text-white px-4">
    <div className="active:brightness-125 active:scale-110 transition-all">
      {children}
    </div>
  </button>
);

export default Session;
