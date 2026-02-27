import Link from 'next/link';

import { LogRain } from '@/components/pages/not-found/LogRain';

export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-4 text-center overflow-hidden">
      <LogRain />
      <h1 className="relative text-8xl font-bold text-fd-foreground">
        404
      </h1>
      <p className="relative text-lg text-fd-muted-foreground">
        No events were generated here
      </p>
      <div className="relative flex gap-3 mt-2">
        <Link
          href="/"
          className="rounded-2xl border px-4 py-2 text-sm transition-colors hover:bg-fd-accent"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
