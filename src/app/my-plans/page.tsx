import AppSidebar from '@/components/layout/AppSidebar';
import MyPlansExplorer from '@/components/plan/MyPlansExplorer';
import AmbientGlow from '@/components/ui/AmbientGlow';

export default function MyPlansPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AmbientGlow />
      <AppSidebar />

      <section className="relative z-10 mx-auto flex w-full max-w-[1550px] flex-col px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-brand/20 bg-surface p-5 shadow-lg sm:p-7 lg:p-9">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-brand">
              MY PLANS
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.4rem]">
              Saved Plans
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-muted sm:text-base">
              Save your favorite weekly plans and apply them back to your dashboard whenever you
              want a fresh start.
            </p>
          </div>

          <MyPlansExplorer />
        </div>
      </section>
    </main>
  );
}
