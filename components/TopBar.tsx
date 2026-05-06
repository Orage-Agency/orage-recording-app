import Link from 'next/link';
import { BRAND } from '@/lib/brand';

export default function TopBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-black/85 backdrop-blur border-b border-[color:var(--border-subtle)]">
      <div className="flex items-center gap-6 px-4 sm:px-8 py-4 max-w-[1600px] mx-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="font-display text-cream-soft tracking-[0.3em] text-sm group-hover:text-gold-high transition-colors">
            {BRAND.logo.text}
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-cream-soft/0">
          <NavLink href="/">Library</NavLink>
          <NavLink href="/hooks">Hooks</NavLink>
          <NavLink href="/pre-hooks">Pre-hooks</NavLink>
          <NavLink href="/performance">Performance</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-display text-[11px] tracking-[0.25em] text-gold hover:text-gold-high transition-colors px-3 py-2 min-touch flex items-center"
    >
      {children}
    </Link>
  );
}
