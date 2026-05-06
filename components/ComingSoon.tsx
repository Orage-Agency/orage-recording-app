import TopBar from './TopBar';

export default function ComingSoon({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs uppercase tracking-wider font-bold mb-4">
          v2 — Coming soon
        </div>
        <h1 className="text-4xl font-bold mb-3">{title}</h1>
        <p className="text-lg text-orage-muted">{subtitle}</p>
      </main>
    </>
  );
}
