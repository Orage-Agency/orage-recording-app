import { getScripts } from '@/lib/storage';
import TopBar from '@/components/TopBar';
import PerformanceClient from '@/components/PerformanceClient';

export const dynamic = 'force-dynamic';

export default async function PerformancePage() {
  const scripts = await getScripts();
  return (
    <>
      <TopBar />
      <PerformanceClient initial={scripts} />
    </>
  );
}
