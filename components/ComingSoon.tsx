import TopBar from './TopBar';

export default function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="eyebrow mb-4">v2 — Coming soon</div>
        <h1 className="font-display text-6xl tracking-[0.08em] text-gold-high mb-3">{title}</h1>
        <div className="divider-gold mx-auto mb-6" />
        <p className="text-base text-cream/70 leading-relaxed font-light">{subtitle}</p>
      </main>
    </>
  );
}
