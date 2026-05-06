import { getScripts } from '@/lib/storage';
import TopBar from '@/components/TopBar';
import LibraryClient from '@/components/LibraryClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const scripts = await getScripts();
  return (
    <>
      <TopBar />
      <LibraryClient scripts={scripts} />
    </>
  );
}
