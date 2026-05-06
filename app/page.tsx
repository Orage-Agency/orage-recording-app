import { getScripts } from '@/lib/storage';
import TopBar from '@/components/TopBar';
import LibraryClient from '@/components/LibraryClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const scripts = await getScripts();
  const recommended = scripts.filter((s) => s.recommended).length;

  return (
    <>
      <TopBar>
        <div className="font-display text-[11px] tracking-[0.25em] text-cream/70">
          <span className="text-gold-high">{scripts.length}</span> scripts ·{' '}
          <span className="text-gold">{recommended}</span> ★
        </div>
      </TopBar>
      <LibraryClient scripts={scripts} />
    </>
  );
}
