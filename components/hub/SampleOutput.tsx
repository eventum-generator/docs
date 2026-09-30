'use client';

import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { useState } from 'react';

import type { SampleOutput as SampleOutputType } from '@/lib/hub-types';

/** End index (exclusive) of the JSON string starting at `start`. */
function stringEnd(json: string, start: number): number {
  let pos = start + 1;
  while (pos < json.length && json[pos] !== '"') {
    pos += json[pos] === '\\' ? 2 : 1;
  }
  return pos + 1;
}

/** Index of the next character after `start` that is not whitespace. */
function nextToken(json: string, start: number): number {
  let pos = start;
  while (pos < json.length && /\s/.test(json[pos])) pos++;
  return pos;
}

/**
 * Indent a JSON document by its structure without re-parsing values, so
 * long numbers and escape sequences stay exactly as written.
 */
function prettyJson(json: string, indent = '  '): string {
  let out = '';
  let depth = 0;
  let pos = 0;
  const newline = () => '\n' + indent.repeat(depth);

  while (pos < json.length) {
    const ch = json[pos];
    let next = pos + 1;
    switch (ch) {
      case '"': {
        next = stringEnd(json, pos);
        out += json.slice(pos, next);
        break;
      }
      case '{':
      case '[': {
        const close = ch === '{' ? '}' : ']';
        const after = nextToken(json, pos + 1);
        if (json[after] === close) {
          out += ch + close;
          next = after + 1;
        } else {
          depth++;
          out += ch + newline();
        }
        break;
      }
      case '}':
      case ']': {
        depth--;
        out += newline() + ch;
        break;
      }
      case ',': {
        out += ',' + newline();
        break;
      }
      case ':': {
        out += ': ';
        break;
      }
      default: {
        if (!/\s/.test(ch)) out += ch;
      }
    }
    pos = next;
  }
  return out;
}

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
        </span>
      );
      nodes.push(':');
    } else if (match[2]) {
      // string value
      nodes.push(
        <span key={key++} className="text-emerald-400">
          {match[2]}
        </span>
      );
    } else if (match[3]) {
      // number
      nodes.push(
        <span key={key++} className="text-amber-400">
          {match[3]}
        </span>
      );
    } else if (match[4]) {
      // boolean
      nodes.push(
        <span key={key++} className="text-sky-400">
          {match[4]}
        </span>
      );
    } else if (match[5]) {
      // null
      nodes.push(
        <span key={key++} className="text-red-400">
          {match[5]}
        </span>
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
        const json = prettyJson(sample.json);
        return (
          <div
            key={sample.title}
            className="rounded-lg border border-fd-border/50 overflow-hidden"
          >
            <div className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted/30">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex items-center gap-2"
              >
                {isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                {sample.title}
              </button>
              {isOpen && <CopyButton text={json} />}
            </div>
            {isOpen && (
              <div className="border-t border-fd-border/30 bg-fd-muted/10 p-4">
                <pre className="overflow-x-auto text-sm leading-relaxed text-fd-muted-foreground">
                  <code>{highlightJson(json)}</code>
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
