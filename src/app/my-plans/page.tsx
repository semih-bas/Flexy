import AppSidebar from '@/components/layout/AppSidebar';

export default function MyPlansPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <AppSidebar />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">My Plans</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Your training plans</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            This section will hold your saved workout plans as the experience grows.
          </p>
        </div>
      </section>
    </main>
  );
}
