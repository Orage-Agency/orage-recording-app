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
        <div className="text-sm text-orage-muted">
          <span className="font-bold text-orage-text">{scripts.length}</span> scripts ·{' '}
          <span className="font-bold text-amber-600">{recommended}</span> ★
        </div>
      </TopBar>
      <LibraryClient scripts={scripts} />
    </>
  );
}
