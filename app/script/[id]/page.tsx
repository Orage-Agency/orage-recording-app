import { notFound } from 'next/navigation';
import { getScript, getNextScriptId } from '@/lib/storage';
import RecordingClient from '@/components/RecordingClient';

export const dynamic = 'force-dynamic';

export default async function ScriptPage({ params }: { params: { id: string } }) {
  const script = await getScript(params.id);
  if (!script) notFound();
  const nextId = await getNextScriptId(params.id);
  return <RecordingClient initial={script} nextScriptId={nextId} />;
}
