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
        <div className="text-sm text-orage-muted">
          <span className="font-bold text-orage-text">{preHooks.length}</span> pre-hooks
        </div>
      </TopBar>
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {preHooks.map((p) => (
          <article
            key={p.id}
            className="bg-white rounded-2xl border-2 border-orage-border p-6 space-y-4"
          >
            <header className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-orage-muted font-mono mb-1">{p.id.toUpperCase()}</div>
                <h2 className="text-2xl font-bold leading-tight">{p.title}</h2>
              </div>
              <StatusPill status={p.status} />
            </header>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
                Scene
              </div>
              <p className="text-base leading-relaxed">{p.scene}</p>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
                Action
              </div>
              <p className="text-base leading-relaxed italic text-orage-muted">{p.action}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Meta label="Duration" value={p.duration} />
              <Meta label="Feel" value={p.feel} />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
                Pairs with
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.pairsWithWedges.map((w) => (
                  <span
                    key={w}
                    className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {WEDGE_LABEL[w]}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
                Shoot notes
              </div>
              <p className="text-sm text-orage-muted leading-relaxed">{p.shootNotes}</p>
            </div>
          </article>
        ))}
      </main>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-orage-muted font-semibold mb-1">
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
