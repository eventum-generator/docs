'use client';

import { useEffect, useRef } from 'react';

const CHARS = String.raw`ABCDEFabcdef0123456789.:/-{}[]=%><_#@!?$&|~^*+\;(),01アイウエオカキクケコサシスセソタチツテトナニヌネノ`;

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

/* eslint-disable sonarjs/pseudo-random */
function rand(max: number): number {
  return Math.floor(Math.random() * max);
}

function randomChar(): string {
  return CHARS[rand(CHARS.length)];
}

function createDrop(x: number, canvasHeight: number, scatter = false): Drop {
  const word = Math.random() < 0.3 ? LOG_WORDS[rand(LOG_WORDS.length)] : null;
  const length = 8 + rand(18);

  return {
    x,
    y: scatter
      ? Math.random() * (canvasHeight + length * 14) - length * 14
      : -(Math.random() * canvasHeight),
    speed: 0.8 + Math.random() * 1.6,
    length,
    chars: Array.from({ length }, randomChar),
    age: 0,
    word,
    wordPos: rand(Math.max(1, length - 4)),
  };
}
/* eslint-enable sonarjs/pseudo-random */

function getCharColor(
  isHead: boolean,
  isWord: boolean,
  fade: number,
  dark: boolean
): string {
  if (isHead) {
    const a = dark ? 0.9 : 0.7;
    return dark ? `rgba(190,180,255,${a})` : `rgba(110,90,230,${a})`;
  }

  if (isWord) {
    const a = fade * (dark ? 0.6 : 0.5);
    return dark ? `rgba(240,140,220,${a})` : `rgba(180,60,150,${a})`;
  }

  const a = fade * (dark ? 0.3 : 0.2);
  return dark ? `rgba(130,130,239,${a})` : `rgba(90,80,190,${a})`;
}

function drawDrop(
  ctx: CanvasRenderingContext2D,
  drop: Drop,
  h: number,
  fontSize: number,
  colWidth: number,
  dark: boolean
) {
  for (let j = 0; j < drop.length; j++) {
    const charY = drop.y - j * fontSize;
    if (charY < -fontSize || charY > h + fontSize) continue;

    const fade = 1 - j / drop.length;
    const isHead = j === 0;
    const isWord =
      drop.word !== null &&
      j >= drop.wordPos &&
      j < drop.wordPos + drop.word.length;

    const char =
      drop.word && j >= drop.wordPos && j < drop.wordPos + drop.word.length
        ? drop.word[j - drop.wordPos]
        : drop.chars[j];

    const color = getCharColor(isHead, isWord, fade, dark);

    if (isHead) {
      ctx.shadowColor = color;
      ctx.shadowBlur = dark ? 18 : 12;
    }

    ctx.fillStyle = color;
    ctx.fillText(char, drop.x + colWidth / 2, charY);

    if (isHead) {
      ctx.shadowBlur = 0;
    }
  }
}

export function LogRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    // Alias to non-null for use in closures (guaranteed by guards above)
    const canvas: HTMLCanvasElement = cvs;
    const context: CanvasRenderingContext2D = ctx;

    let animationId: number;
    let drops: Drop[] = [];
    let initialized = false;

    const fontSize = 14;
    const colWidth = fontSize + 2;

    function resize() {
      const dpr = globalThis.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      context.scale(dpr, dpr);

      const scatter = !initialized;
      initialized = true;

      const cols = Math.floor(canvas.offsetWidth / colWidth);
      drops = Array.from({ length: cols }, (_, i) =>
        createDrop(i * colWidth, canvas.offsetHeight, scatter)
      );
    }

    function isDark(): boolean {
      return document.documentElement.classList.contains('dark');
    }

    function draw() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dark = isDark();

      context.clearRect(0, 0, w, h);
      context.font = `${fontSize}px monospace`;
      context.textAlign = 'center';

      for (const drop of drops) {
        drop.y += drop.speed;
        drop.age++;

        if (Math.random() < 0.03) { // eslint-disable-line sonarjs/pseudo-random
          drop.chars[rand(drop.chars.length)] = randomChar();
        }

        drawDrop(context, drop, h, fontSize, colWidth, dark);

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
