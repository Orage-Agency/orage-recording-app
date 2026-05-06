import { NextResponse } from 'next/server';
import { getScripts, createScript } from '@/lib/storage';
import type { Script } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const scripts = await getScripts();
  return NextResponse.json(scripts);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Script>;
  const all = await getScripts();
  const nextNumber = Math.max(0, ...all.map((s) => s.number)) + 1;
  const nextRank = Math.max(0, ...all.map((s) => s.priorityRank)) + 1;
  const now = new Date().toISOString();
  const script: Script = {
    id: `script-${Date.now()}`,
    number: body.number ?? nextNumber,
    source: body.source ?? 'GEORGE',
    title: body.title ?? 'Untitled',
    recommended: body.recommended ?? false,
    priorityRank: body.priorityRank ?? nextRank,
    wedge: body.wedge ?? 'AUTOMATION',
    format: body.format ?? 'BEHIND_DESK',
    length: body.length ?? '20 sec',
    energy: body.energy ?? '',
    setup: body.setup ?? '',
    shotDirections: body.shotDirections ?? [],
    sections: body.sections ?? [],
    status: body.status ?? 'draft',
    notes: body.notes ?? '',
    createdAt: now,
    updatedAt: now,
  };
  await createScript(script);
  return NextResponse.json(script, { status: 201 });
}
