import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';

interface SetupTitleProps {
  text: string;
  baselineSize?: number; // e.g., 96 for text-8xl
  margin?: number;
}

/**
 * SetupTitle - Spec V_15: Rhythmic Motion Update
 * Behavior: Letter-by-letter stagger arrival with landing pulse.
 * Stagger (interpreted "0.3ms" as 30ms step): index * 30ms.
 * Pulse (300ms landing glow): handled by letter-arrival keyframes.
 */
const SetupTitle: React.FC<SetupTitleProps> = ({ text, baselineSize = 96, margin = 20 }) => {
  const [fontSize, setFontSize] = useState(baselineSize);
  const [isReady, setIsReady] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const calculateSize = () => {
      if (!containerRef.current) return;
      const availableWidth = window.innerWidth - (margin * 2);
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      context.font = `800 ${baselineSize}px Inter, sans-serif`;
      
      const metrics = context.measureText(text);
      let scale = 1.0;
      
      if (metrics.width > availableWidth) {
        scale = availableWidth / metrics.width;
      }
      
      let finalScale = scale * 0.85;
      
      const floor = 0.90;
      if (finalScale < floor) {
        finalScale = floor;
      }
      
      setFontSize(baselineSize * finalScale);
      setIsReady(true);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [text, baselineSize, margin]);

  useEffect(() => {
    if (isReady) {
      // Trigger continuous breathing pulse after last letter landing sequence finishes
      // Start Offset (120) + (CharCount * Stagger (30)) + landing pulse duration (300)
      const arrivalDuration = 120 + (text.length * 30) + 300; 
      const timer = setTimeout(() => setShowPulse(true), arrivalDuration);
      return () => clearTimeout(timer);
    }
  }, [isReady, text.length]);

  const letters = text.split('');

  return (
    <div 
      ref={containerRef}
      className={`w-full flex justify-center items-center overflow-visible transition-all duration-1000 ${showPulse ? 'title-pulse' : ''}`}
      style={{ opacity: isReady ? 1 : 0 }}
    >
      <h1 
        className="font-extrabold tracking-tighter uppercase whitespace-nowrap flex"
        style={{ fontSize: `${fontSize}px`, lineHeight: '1' }}
      >
        {letters.map((char, i) => (
          <span
            key={`${text}-${i}`} 
            className="inline-block"
            style={{
              animation: isReady ? `letter-arrival 300ms ease-out forwards` : 'none',
              animationDelay: `${120 + (i * 30)}ms`,
              opacity: 0,
              transform: 'translateY(15px)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default SetupTitle;