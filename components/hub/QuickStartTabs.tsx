'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const COMMANDS = new Set([
  'git',
  'cd',
  'docker',
  'uv',
  'eventum',
]);

function highlightShell(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) nodes.push('\n');

    // Tokenize the line
    const tokens = line.split(/(\s+|\\$)/);
    let isFirstWord = true;

    tokens.forEach((token, tokenIdx) => {
      if (!token) return;

      if (/^\s+$/.test(token) || token === '\\') {
        nodes.push(token);
        return;
      }

      // Commands (first word of line)
      if (isFirstWord && COMMANDS.has(token)) {
        nodes.push(
          <span key={`${lineIdx}-${tokenIdx}`} className="text-sky-400">
            {token}
          </span>,
        );
        isFirstWord = false;
        return;
      }

      // Subcommands (second word like "clone", "compose", "tool", "generate")
      if (!isFirstWord && /^[a-z][\w-]*$/.test(token) && !token.startsWith('-')) {
        nodes.push(
          <span key={`${lineIdx}-${tokenIdx}`} className="text-emerald-400">
            {token}
          </span>,
        );
        isFirstWord = false;
        return;
      }

      // Flags (--flag, -f)
      if (token.startsWith('-')) {
        nodes.push(
          <span key={`${lineIdx}-${tokenIdx}`} className="text-amber-400">
            {token}
          </span>,
        );
        isFirstWord = false;
        return;
      }

      // URLs
      if (token.startsWith('https://') || token.startsWith('http://')) {
        nodes.push(
          <span key={`${lineIdx}-${tokenIdx}`} className="text-violet-400">
            {token}
          </span>,
        );
        isFirstWord = false;
        return;
      }

      nodes.push(token);
      isFirstWord = false;
    });
  });

  return nodes;
}

interface QuickStartTabsProps {
  slug: string;
  generatorId: string;
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
      className="absolute right-3 top-3 rounded-md border border-fd-border/40 bg-fd-background/80 p-1.5 text-fd-muted-foreground/60 transition-colors hover:text-fd-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export function QuickStartTabs({ slug, generatorId }: QuickStartTabsProps) {
  const [activeTab, setActiveTab] = useState<'cli' | 'docker'>('cli');

  const cliCommand = `uv tool install eventum-generator
git clone https://github.com/eventum-generator/content-packs.git
cd content-packs
eventum generate \\
  --path generators/${slug}/generator.yml \\
  --id ${generatorId} \\
  --live-mode`;

  const dockerCommand = `git clone https://github.com/eventum-generator/content-packs.git
cd content-packs
docker compose up -d`;

  return (
    <div className="rounded-xl border border-fd-border/50 overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-fd-border/50 bg-fd-muted/30">
        <button
          type="button"
          onClick={() => setActiveTab('cli')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'cli'
              ? 'text-fd-foreground border-b-2 border-fd-primary -mb-px'
              : 'text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          CLI
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('docker')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'docker'
              ? 'text-fd-foreground border-b-2 border-fd-primary -mb-px'
              : 'text-fd-muted-foreground hover:text-fd-foreground'
          }`}
        >
          Docker
        </button>
      </div>

      {/* Tab content */}
      <div className="relative bg-fd-muted/10 p-4">
        <CopyButton
          text={activeTab === 'docker' ? dockerCommand : cliCommand}
        />
        <pre className="overflow-x-auto text-sm leading-relaxed text-fd-foreground/90 pr-10">
          <code>
              {highlightShell(
                activeTab === 'docker' ? dockerCommand : cliCommand,
              )}
            </code>
        </pre>
      </div>
    </div>
  );
}
