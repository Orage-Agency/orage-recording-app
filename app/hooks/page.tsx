import { getHooks } from '@/lib/storage';
import TopBar from '@/components/TopBar';
import HooksClient from '@/components/HooksClient';

export const dynamic = 'force-dynamic';

export default async function HooksPage() {
  const hooks = await getHooks();
  return (
    <>
      <TopBar>
        <div className="text-sm text-orage-muted">
          <span className="font-bold text-orage-text">{hooks.length}</span> verbal hooks
        </div>
      </TopBar>
      <HooksClient hooks={hooks} />
    </>
  );
}
