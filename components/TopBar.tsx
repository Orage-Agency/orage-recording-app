import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-orage-border">
      <div className="flex items-center gap-4 px-4 sm:px-6 py-3 max-w-[1600px] mx-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-md bg-orage-primary text-white flex items-center justify-center font-bold text-sm">
            O
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">{BRAND.logo.text}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-orage-muted">
          <Link href="/" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-orage-text">Library</Link>
          <Link href="/hooks" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-orage-text">Hooks</Link>
          <Link href="/pre-hooks" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-orage-text">Pre-hooks</Link>
          <Link href="/performance" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-orage-text">Performance</Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
