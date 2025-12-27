import React, { useState, useEffect } from 'react';
import { playLetterMotion, playTitlePresence } from '../utils/uiAudioService';

interface HomeAnimatedTitlesProps {
  color?: string;
}

const HomeAnimatedTitles: React.FC<HomeAnimatedTitlesProps> = ({ color = '#FFFFFF' }) => {
  const [startSecondary, setStartSecondary] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const primaryText = "FLUENTFAST";
  const secondaryText = "LEARN WITH FRIENDS";

  useEffect(() => {
    const timers: number[] = [];
    primaryText.split('').forEach((_, i) => {
      if (i % 3 === 0) timers.push(window.setTimeout(() => playLetterMotion(), i * 70));
    });
    timers.push(window.setTimeout(() => playTitlePresence(), (primaryText.length - 1) * 70 + 160));
    timers.push(window.setTimeout(() => setStartSecondary(true), 1010));
    timers.push(window.setTimeout(() => setShouldPulse(true), 1800));
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none overflow-visible w-full px-[3vw] transition-all duration-1000 ${shouldPulse ? 'title-pulse' : ''}`}>
      <h1 className="flex font-extrabold tracking-tighter uppercase overflow-visible transition-colors duration-200" style={{ fontSize: '54px', color }}>
        {primaryText.split('').map((char, i) => (
          <span key={i} className="inline-block" style={{
            transform: 'translateY(18px)',
            animation: `primary-motion 160ms ease-out forwards, primary-glow 220ms ease-out forwards`,
            animationDelay: `${i * 70}ms, ${9 * 70 + 160}ms`,
            opacity: 1,
          }}>{char}</span>
        ))}
      </h1>
      <div className="flex text-lg font-light tracking-[0.3em] uppercase mt-[-4px] overflow-visible h-6 transition-colors duration-200" style={{ color, opacity: color === '#FFFFFF' ? 0.6 : 0.8 }}>
        {startSecondary && secondaryText.split('').map((char, i) => (
          <span key={i} className="inline-block whitespace-pre" style={{
            transform: 'translateX(22px)',
            animation: `secondary-motion 180ms ease-out forwards, secondary-bounce 90ms ease-out forwards, secondary-glow 130ms ease-out forwards`,
            animationDelay: `${i * 55}ms, ${i * 55 + 180}ms, ${i * 55 + 180}ms`,
            opacity: 1,
          }}>{char}</span>
        ))}
      </div>
      <style>{`
        @keyframes primary-motion { 0% { transform: translateY(18px); } 100% { transform: translateY(0); } }
        @keyframes primary-glow { 0% { text-shadow: 0 0 0px rgba(255,255,255,0); } 15% { text-shadow: 0 0 35px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,0.8); } 100% { text-shadow: 0 0 0px rgba(255,255,255,0); } }
        @keyframes secondary-motion { 0% { transform: translateX(22px); } 100% { transform: translateX(-6px); } }
        @keyframes secondary-bounce { 0% { transform: translateX(-6px); } 100% { transform: translateX(0); } }
        @keyframes secondary-glow { 0% { text-shadow: 0 0 0px rgba(255,255,255,0); } 25% { text-shadow: 0 0 22px rgba(255,255,255,0.8); } 100% { text-shadow: 0 0 0px rgba(255,255,255,0); } }
      `}</style>
    </div>
  );
};

export default HomeAnimatedTitles;