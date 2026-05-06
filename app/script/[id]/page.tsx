import { notFound } from 'next/navigation';
import { getScript, getNextScriptId } from '@/lib/storage';
import RecordingClient from '@/components/RecordingClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
  searchParams?: { edit?: string };
}

export default async function ScriptPage({ params, searchParams }: Props) {
  const script = await getScript(params.id);
  if (!script) notFound();
  const nextId = await getNextScriptId(params.id);
  const initialMode = searchParams?.edit === '1' ? 'EDIT' : 'READ';
  return <RecordingClient initial={script} nextScriptId={nextId} initialMode={initialMode} />;
}
