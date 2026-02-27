'use client';

import { useEffect, useRef } from 'react';

const CHARS =
  'ABCDEFabcdef0123456789.:/-{}[]=%><_#@!?$&|~^*+\\;(),01アイウエオカキクケコサシスセソタチツテトナニヌネノ';

const LOG_WORDS = [
  '404',
  'ERR',
  'NULL',
  'DROP',
  'WARN',
  'DENY',
  'LOST',
  'FAIL',
  'DEAD',
  'EOF',
  'NaN',
  '0x0',
];

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  age: number;
  word: string | null;
  wordPos: number;
}

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function createDrop(
  x: number,
  canvasHeight: number,
  scatter = false
): Drop {
  const hasWord = Math.random() < 0.3;
  const word = hasWord
    ? LOG_WORDS[Math.floor(Math.random() * LOG_WORDS.length)]
    : null;
  const length = 8 + Math.floor(Math.random() * 18);

  return {
    x,
    y: scatter
      ? Math.random() * (canvasHeight + length * 14) - length * 14
      : -Math.random() * canvasHeight,
    speed: 0.8 + Math.random() * 1.6,
    length,
    chars: Array.from({ length }, randomChar),
    age: 0,
    word,
    wordPos: Math.floor(Math.random() * Math.max(1, length - 4)),
  };
}

export function LogRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let drops: Drop[] = [];
    let initialized = false;

    const fontSize = 14;
    const colWidth = fontSize + 2;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);

      const scatter = !initialized;
      initialized = true;

      const cols = Math.floor(canvas!.offsetWidth / colWidth);
      drops = Array.from({ length: cols }, (_, i) =>
        createDrop(i * colWidth, canvas!.offsetHeight, scatter)
      );
    }

    function isDark(): boolean {
      return document.documentElement.classList.contains('dark');
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const dark = isDark();

      ctx!.clearRect(0, 0, w, h);
      ctx!.font = `${fontSize}px monospace`;
      ctx!.textAlign = 'center';

      for (const drop of drops) {
        drop.y += drop.speed;
        drop.age++;

        if (Math.random() < 0.03) {
          const idx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[idx] = randomChar();
        }

        for (let j = 0; j < drop.length; j++) {
          const charY = drop.y - j * fontSize;
          if (charY < -fontSize || charY > h + fontSize) continue;

          const progress = j / drop.length;
          const fade = 1 - progress;

          const char =
            drop.word && j >= drop.wordPos && j < drop.wordPos + drop.word.length
              ? drop.word[j - drop.wordPos]
              : drop.chars[j];

          const isHead = j === 0;
          const isWord =
            drop.word !== null &&
            j >= drop.wordPos &&
            j < drop.wordPos + drop.word.length;

          let alpha: number;
          let color: string;

          if (isHead) {
            alpha = dark ? 0.9 : 0.7;
            color = dark
              ? `rgba(190, 180, 255, ${alpha})`
              : `rgba(110, 90, 230, ${alpha})`;
          } else if (isWord) {
            alpha = fade * (dark ? 0.6 : 0.5);
            color = dark
              ? `rgba(240, 140, 220, ${alpha})`
              : `rgba(180, 60, 150, ${alpha})`;
          } else {
            alpha = fade * (dark ? 0.3 : 0.2);
            color = dark
              ? `rgba(130, 130, 239, ${alpha})`
              : `rgba(90, 80, 190, ${alpha})`;
          }

          if (isHead) {
            ctx!.shadowColor = color;
            ctx!.shadowBlur = dark ? 18 : 12;
          }

          ctx!.fillStyle = color;
          ctx!.fillText(char, drop.x + colWidth / 2, charY);

          if (isHead) {
            ctx!.shadowBlur = 0;
          }
        }

        if (drop.y - drop.length * fontSize > h) {
          Object.assign(drop, createDrop(drop.x, h));
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
