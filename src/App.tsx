import React, { useState, useEffect, useCallback } from 'react';
import Lottie from 'lottie-react';
import './styles/index.css';
import { Page, Language, SessionMode, SessionState } from './types';
import { COLORS, Icons } from './constants';
import LanguageSelection from './components/LanguageSelection';
import Session from './components/Session';
import SetupTitle from './components/SetupTitle';
import HomeAnimatedTitles from './components/HomeAnimatedTitles';
import Koala_1 from './assets/illustrations/Koala_1';
import KoalasGlassesOnHead from './assets/illustrations/Koalas_glasses_on_head_1';
import Koalas_bottom_1 from './assets/illustrations/Koalas_bottom_1';
import { playTap, playHomeEntryPresence } from './utils/uiAudioService';
import { startMusic, stopMusic } from './utils/backgroundMusicService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [prevPage, setPrevPage] = useState<Page | null>(null);
  const [nextPage, setNextPage] = useState<Page | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isKoalaButtonPressed, setIsKoalaButtonPressed] = useState(false);
  
  const [session, setSession] = useState<SessionState>({
    targetLang: Language.SPANISH,
    rootLang: Language.ENGLISH,
    currentPhraseIndex: 0,
    mode: SessionMode.DEFAULT,
    playbackRate: 1.0
  });

  const [knownLang, setKnownLang] = useState<Language>(Language.ENGLISH);
  const [targetLang, setTargetLang] = useState<Language>(Language.SPANISH);

  useEffect(() => {
    playHomeEntryPresence?.();
  }, []);

  useEffect(() => {
    if (currentPage === 'SESSION') {
      startMusic?.();
    } else if (currentPage === 'HOME') {
      stopMusic?.();
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'SPLASH' && !isTransitioning) {
      const timer = setTimeout(() => handleNavigate('SESSION'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isTransitioning]);

  const handleNavigate = useCallback((next: Page) => {
    if (isTransitioning) return;
    if (next === 'SESSION' || currentPage === 'SESSION') {
      setCurrentPage(next);
      return;
    }
    setPrevPage(currentPage);
    setNextPage(next);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(next);
      setPrevPage(null);
      setNextPage(null);
      setIsTransitioning(false);
    }, 1200);
  }, [currentPage, isTransitioning]);

  const renderPageContent = (page: Page | null) => {
    if (!page) return <div className="h-full w-full bg-black flex items-center justify-center text-white">Loading...</div>;
    
    switch (page) {
      case 'HOME':
        return (
          <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden" style={{ backgroundColor: COLORS?.BRAND_BLUE ?? '#6865F0' }}>
            <div className="absolute top-[10vh] z-10 h-[30vh] w-[30vh] animate-float flex items-center justify-center">
               <Koala_1 className="w-full h-full" />
            </div>
            <div className="relative z-20 w-full h-full px-[3vw] flex flex-col items-center justify-center">
              <HomeAnimatedTitles />
              <button 
                onPointerDown={() => { playTap?.(); setIsKoalaButtonPressed(true); }}
                onPointerUp={() => { if(isKoalaButtonPressed) { setIsKoalaButtonPressed(false); handleNavigate('PARTNER'); } }}
                onPointerLeave={() => setIsKoalaButtonPressed(false)}
                className="btn-setup-primary animate-button-entry mt-20 px-16 py-5 rounded-full text-2xl font-extrabold tracking-tight border border-white/10 transition-all duration-100"
                style={{ backgroundColor: isKoalaButtonPressed ? (COLORS?.WHITE ?? '#FFF') : (COLORS?.BRAND_BLUE ?? '#6865F0'), color: isKoalaButtonPressed ? (COLORS?.BRAND_BLUE ?? '#6865F0') : (COLORS?.WHITE ?? '#FFF') }}
              >
                <span className="btn-text-glow">koalas</span>
              </button>
            </div>
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center space-x-4 pointer-events-auto z-10">
              <a href="https://www.instagram.com/fluentfast_koalas/" target="_blank" rel="noopener noreferrer" className="btn-tactile text-white w-[22px] h-[22px] social-icon-animate" style={{ animationDelay: '1.8s' }}>{Icons?.Instagram ? <Icons.Instagram /> : null}</a>
              <a href="https://www.tiktok.com/@fluentfast_koalas" target="_blank" rel="noopener noreferrer" className="btn-tactile text-white w-[22px] h-[22px] social-icon-animate" style={{ animationDelay: '2.5s' }}>{Icons?.TikTok ? <Icons.TikTok /> : null}</a>
            </div>
          </div>
        );
      case 'PARTNER':
        return (
          <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden" style={{ backgroundColor: COLORS?.BRAND_BLUE ?? '#6865F0' }}>
            <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none flex justify-center items-end opacity-100 animate-koala-up">
              <KoalasGlassesOnHead className="w-full h-auto max-h-[30vh]" />
            </div>
            <div className="relative z-10 flex flex-col items-center space-y-8 p-6">
              <SetupTitle text="2-PLAYER" baselineSize={72} />
              <h2 className="text-xl font-medium text-white opacity-70 uppercase tracking-widest mt-4">Koala Conversations</h2>
              <button onPointerDown={() => { playTap?.(); handleNavigate('LANGUAGES'); }} className="btn-setup-primary mt-12 px-20 py-5 rounded-full text-2xl font-extrabold tracking-widest uppercase border border-white/10">
                <span className="btn-text-glow">Next</span>
              </button>
            </div>
          </div>
        );
      case 'LANGUAGES':
        return <LanguageSelection known={knownLang} target={targetLang} onSelectKnown={setKnownLang} onSelectTarget={setTargetLang} onConfirm={() => { playTap?.(); setSession(s => ({ ...s, targetLang, rootLang: knownLang })); handleNavigate('READY'); }} />;
      case 'READY':
        return (
          <div className="relative flex flex-col items-center h-full w-full overflow-hidden" style={{ backgroundColor: COLORS?.BRAND_BLUE ?? '#6865F0' }}>
            <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none flex justify-center items-end px-6">
              <Koalas_bottom_1 className="w-[90vw] h-auto max-h-[40vh]" />
            </div>
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
              <SetupTitle text="READY?" baselineSize={100} />
              <button onPointerDown={() => { playTap?.(); handleNavigate('SPLASH'); }} className="btn-setup-primary px-24 py-6 rounded-full text-4xl font-extrabold mt-12 border border-white/10">
                <span className="btn-text-glow flex items-center">Start <span className="ml-6 opacity-40">→</span></span>
              </button>
            </div>
            <div className="h-[40vh] w-full shrink-0" />
          </div>
        );
      case 'SPLASH':
        return (
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex items-center justify-center rotate-180" style={{ backgroundColor: COLORS?.BRAND_BLUE ?? '#6865F0' }}>
              <h1 className="text-5xl font-extrabold text-white tracking-tighter uppercase">FLUENTFAST</h1>
            </div>
            <div className="h-[8%] bg-black"></div>
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: COLORS?.WHITE ?? '#FFF' }}>
              <h1 className="text-5xl font-extrabold text-[#6865F0] tracking-tighter uppercase">FLUENTFAST</h1>
            </div>
          </div>
        );
      case 'SESSION':
        return <Session state={session} onUpdate={u => setSession(s => ({ ...s, ...u }))} onExit={() => { setSession(s => ({ ...s, currentPhraseIndex: 0 })); handleNavigate('HOME'); }} />;
      default: 
        return <div className="h-full w-full bg-black flex items-center justify-center text-white">Loading...</div>;
    }
  };

  return (
    <div className="swipe-container">
      {isTransitioning && prevPage && <div className="page-surface animate-swipe-exit">{renderPageContent(prevPage)}</div>}
      <div className={`page-surface ${isTransitioning ? 'animate-swipe-enter' : ''}`}>{renderPageContent(isTransitioning ? nextPage : currentPage)}</div>
    </div>
  );
};

export default App;