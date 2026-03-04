'use client';

import { useState } from 'react';
import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react';

import type { SampleOutput as SampleOutputType } from '@/lib/hub-types';

function highlightJson(json: string): React.ReactNode[] {
  const tokenRegex =
    /("(?:[^"\\]|\\.)*")\s*:|("(?:[^"\\]|\\.)*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRegex.exec(json)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(json.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // key
      nodes.push(
        <span key={key++} className="text-violet-400">
          {match[1]}
        </span>,
      );
      nodes.push(':');
    } else if (match[2]) {
      // string value
      nodes.push(
        <span key={key++} className="text-emerald-400">
          {match[2]}
        </span>,
      );
    } else if (match[3]) {
      // number
      nodes.push(
        <span key={key++} className="text-amber-400">
          {match[3]}
        </span>,
      );
    } else if (match[4]) {
      // boolean
      nodes.push(
        <span key={key++} className="text-sky-400">
          {match[4]}
        </span>,
      );
    } else if (match[5]) {
      // null
      nodes.push(
        <span key={key++} className="text-red-400">
          {match[5]}
        </span>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex));
  }

  return nodes;
}

interface SampleOutputProps {
  samples: SampleOutputType[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-fd-border/40 bg-fd-background/80 p-1.5 text-fd-muted-foreground/60 transition-colors hover:text-fd-foreground"
      aria-label="Copy JSON"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export function SampleOutput({ samples }: SampleOutputProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      {samples.map((sample, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={sample.title}
            className="rounded-lg border border-fd-border/50 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted/30"
            >
              <span className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                {sample.title}
              </span>
              {isOpen && (
                <span onClick={(e) => e.stopPropagation()}>
                  <CopyButton text={sample.json} />
                </span>
              )}
            </button>
            {isOpen && (
              <div className="border-t border-fd-border/30 bg-fd-muted/10 p-4">
                <pre className="overflow-x-auto text-sm leading-relaxed text-fd-muted-foreground">
                  <code>{highlightJson(sample.json)}</code>
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
