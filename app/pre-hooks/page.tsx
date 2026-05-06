import { getPreHooks } from '@/lib/storage';
import TopBar from '@/components/TopBar';
import StatusPill from '@/components/StatusPill';
import { WEDGE_LABEL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function PreHooksPage() {
  const preHooks = await getPreHooks();

  return (
    <>
      <TopBar>
        <div className="font-display text-[11px] tracking-[0.25em] text-cream/70">
          <span className="text-gold-high">{preHooks.length}</span> pre-hooks
        </div>
      </TopBar>
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {preHooks.map((p) => (
          <article
            key={p.id}
            className="bg-ink-2 rounded-sm border border-[color:var(--border-subtle)] p-6 space-y-4"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <div className="eyebrow mb-1">{p.id.toUpperCase()}</div>
                <h2 className="font-display text-3xl tracking-[0.05em] text-cream-soft leading-tight">
                  {p.title}
                </h2>
              </div>
              <StatusPill status={p.status} />
            </header>

            <Field label="Scene" value={p.scene} />
            <Field label="Action" value={p.action} italic />

            <div className="grid grid-cols-2 gap-3">
              <Meta label="Duration" value={p.duration} />
              <Meta label="Feel" value={p.feel} />
            </div>

            <div>
              <div className="eyebrow mb-2">Pairs with</div>
              <div className="flex flex-wrap gap-1.5">
                {p.pairsWithWedges.map((w) => (
                  <span
                    key={w}
                    className="font-display text-[10px] tracking-[0.2em] px-2 py-1 rounded-sm bg-black/40 text-cream/80 border border-[color:var(--border-subtle)]"
                  >
                    {WEDGE_LABEL[w]}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow mb-2">Shoot notes</div>
              <p className="text-sm text-cream/70 leading-relaxed">{p.shootNotes}</p>
            </div>
          </article>
        ))}
      </main>
    </>
  );
}

function Field({ label, value, italic }: { label: string; value: string; italic?: boolean }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <p className={`text-base leading-relaxed text-cream-soft ${italic ? 'italic text-cream/70 font-light' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-sm font-medium text-cream-soft">{value}</div>
    </div>
  );
}
