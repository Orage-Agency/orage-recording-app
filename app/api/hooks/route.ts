import { NextResponse } from 'next/server';
import { getHooks, createHook } from '@/lib/storage';
import type { VerbalHook, HookFormula, Wedge } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hooks = await getHooks();
  return NextResponse.json(hooks);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<VerbalHook>;
  if (!body.text || body.text.trim().length === 0) {
    return NextResponse.json({ error: 'text required' }, { status: 400 });
  }
  const hook: VerbalHook = {
    id: `h-user-${Date.now().toString(36)}`,
    text: body.text.trim(),
    formula: (body.formula as HookFormula) ?? 'CONTRARIAN',
    pairsWithWedges: (body.pairsWithWedges as Wedge[]) ?? [],
    used: false,
  };
  await createHook(hook);
  return NextResponse.json(hook, { status: 201 });
}
