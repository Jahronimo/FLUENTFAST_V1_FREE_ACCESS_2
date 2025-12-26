
import React, { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { normalizeForHighlight } from '../services/audioService';

interface TextFitterProps {
  text: string;
  isRoleA: boolean;
  underline: boolean;
  containerWidth: number;
  containerHeight: number;
  padding: { top: number; bottom: number; left: number; right: number };
  anchors?: { text: string; color: string }[];
  activeCharIndex: number;
  isRootCard: boolean; // false for Player White (Bottom), true for Player Blue (Top)
}

/**
 * TextFitter - Maximum Legibility Scaling Component
 * UPDATED by V__8.1_PATCH — HIGHLIGHT PROGRESSION GUARANTEE
 * UPDATED by PATCH — PLAYER WHITE HIGHLIGHT COLOR OVERRIDE (YELLOW)
 */
const TextFitter: React.FC<TextFitterProps> = ({
  text,
  isRoleA,
  underline,
  containerWidth,
  containerHeight,
  padding,
  anchors = [],
  activeCharIndex = -1,
  isRootCard
}) => {
  const [fontSize, setFontSize] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const [underlineRects, setUnderlineRects] = useState<{ rect: DOMRect; color: string }[]>([]);

  const DETERMINISTIC_LINE_HEIGHT = 1.1;
  const MICRO_BACKOFF = 0.975;

  const words = useMemo(() => text.split(/\s+/), [text]);

  /**
   * Rule 5.1 & 5.2: Shared Normalization & Boundary Mapping
   */
  const normalizedText = useMemo(() => normalizeForHighlight(text), [text]);
  const normalizedWords = useMemo(() => normalizedText.split(' '), [normalizedText]);

  const wordBoundaryMap = useMemo(() => {
    const boundaries: { start: number; end: number }[] = [];
    let currentPos = 0;
    
    normalizedWords.forEach((word) => {
      const start = normalizedText.indexOf(word, currentPos);
      const end = start + word.length;
      boundaries.push({ start, end });
      currentPos = end + 1;
    });
    return boundaries;
  }, [normalizedText, normalizedWords]);

  const activeWordIndex = useMemo(() => {
    if (activeCharIndex === -1) return -1;
    return wordBoundaryMap.findIndex(b => activeCharIndex >= b.start && activeCharIndex < b.end);
  }, [activeCharIndex, wordBoundaryMap]);

  useLayoutEffect(() => {
    if (!text || !containerWidth || !containerHeight) return;

    const targetWidth = containerWidth - padding.left - padding.right;
    const targetHeight = containerHeight - padding.top - padding.bottom;

    if (targetWidth <= 0 || targetHeight <= 0) return;

    const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, "");
    
    let wordLow = 1;
    let wordHigh = 1000;
    let wordCeiling = 1;

    while (wordLow <= wordHigh) {
      const mid = Math.floor((wordLow + wordHigh) / 2);
      if (checkWordFit(longestWord, mid, targetWidth)) {
        wordCeiling = mid;
        wordLow = mid + 1;
      } else {
        wordHigh = mid - 1;
      }
    }

    let low = 1;
    let high = wordCeiling;
    let bestSize = 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (checkFullFit(text, mid, targetWidth, targetHeight)) {
        bestSize = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    setFontSize(Math.max(1, Math.floor(bestSize * MICRO_BACKOFF)));
  }, [text, words, containerWidth, containerHeight, isRoleA, padding]);

  useLayoutEffect(() => {
    if (!underline || anchors.length === 0 || !textContentRef.current || fontSize === 1) {
      setUnderlineRects([]);
      return;
    }

    const containerRect = textContentRef.current.getBoundingClientRect();
    const wordElements = Array.from(textContentRef.current.querySelectorAll('[data-word-idx]')) as HTMLElement[];
    const foundRects: { rect: DOMRect; color: string }[] = [];

    const clean = (s: string) => s.replace(/[¡!¿?,.]/g, '').toLowerCase();

    anchors.forEach(({ text: anchorText, color }) => {
      const anchorWords = anchorText.split(/\s+/).map(clean);
      if (anchorWords.length === 0) return;

      for (let i = 0; i <= wordElements.length - anchorWords.length; i++) {
        let match = true;
        for (let j = 0; j < anchorWords.length; j++) {
          const wordText = clean(wordElements[i + j].textContent || "");
          if (wordText !== anchorWords[j]) {
            match = false;
            break;
          }
        }

        if (match) {
          const matchedSpans = wordElements.slice(i, i + anchorWords.length);
          const rects = matchedSpans.map(s => s.getBoundingClientRect());
          const minLeft = Math.min(...rects.map(r => r.left));
          const maxRight = Math.max(...rects.map(r => r.right));
          const maxBottom = Math.max(...rects.map(r => r.bottom));
          const minTop = Math.min(...rects.map(r => r.top));

          foundRects.push({
            rect: new DOMRect(
              minLeft - containerRect.left,
              minTop - containerRect.top,
              maxRight - minLeft,
              maxBottom - minTop
            ),
            color
          });
        }
      }
    });

    setUnderlineRects(foundRects);
  }, [fontSize, underline, anchors, words]);

  function checkWordFit(word: string, size: number, maxWidth: number): boolean {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return true;
    context.font = `${isRoleA ? '800' : '300'} ${size}px Inter, sans-serif`;
    const metrics = context.measureText(word);
    return metrics.width <= maxWidth;
  }

  function checkFullFit(str: string, size: number, maxWidth: number, maxHeight: number): boolean {
    if (!measureRef.current) return false;
    const el = measureRef.current;
    el.style.fontSize = `${size}px`;
    el.style.width = `${maxWidth}px`;
    el.style.lineHeight = `${DETERMINISTIC_LINE_HEIGHT}`;
    el.innerText = str;
    return el.scrollHeight <= maxHeight && el.scrollWidth <= maxWidth;
  }

  const getHighlightStyle = (idx: number): React.CSSProperties => {
    if (idx !== activeWordIndex) return {};
    if (!isRootCard) { // Player White
      return {
        color: '#FFFF00', // Yellow
        WebkitTextStroke: '3px #000000',
        paintOrder: 'stroke fill',
      };
    } else { // Player Blue
      return {
        color: '#D9F0FF',
        WebkitTextStroke: '3px #000000',
        paintOrder: 'stroke fill',
      };
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-center overflow-hidden w-full h-full" style={{ padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` }}>
      <div ref={textContentRef} className={`relative text-center select-none ${isRoleA ? 'font-extrabold' : 'font-light'}`} style={{ fontSize: `${fontSize}px`, lineHeight: DETERMINISTIC_LINE_HEIGHT, transform: `translateY(${isRoleA ? '-4%' : '0'})`, width: '100%' }}>
        {words.map((word, idx) => (
          <React.Fragment key={idx}>
            <span data-word-idx={idx} style={getHighlightStyle(idx)} className="inline-block">{word}</span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
        {underline && underlineRects.map((ur, i) => (
          <div key={i} className="absolute pointer-events-none" style={{ left: ur.rect.left, top: ur.rect.bottom - (fontSize * 0.12), width: ur.rect.width, height: Math.max(2, fontSize * 0.08), backgroundColor: ur.color, borderRadius: '99px', zIndex: -1 }} />
        ))}
      </div>
      <div ref={measureRef} className={`absolute invisible whitespace-normal break-words ${isRoleA ? 'font-extrabold' : 'font-light'}`} style={{ lineHeight: DETERMINISTIC_LINE_HEIGHT, wordBreak: 'keep-all', overflowWrap: 'break-word' }} />
    </div>
  );
};

export default TextFitter;
