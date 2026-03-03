export const tagColors: Record<string, string> = {
  release:
    'bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400',
  tutorial:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  announcement:
    'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
  guide:
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
};

export const defaultTagColor =
  'bg-fd-muted-foreground/10 text-fd-muted-foreground/70 border-fd-muted-foreground/20';

export function getTagClassName(tag: string): string {
  return `text-xs font-medium uppercase tracking-wider rounded-full px-2.5 py-1 border ${tagColors[tag] ?? defaultTagColor}`;
}
