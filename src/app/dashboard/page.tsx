import AppSidebar from "@/components/layout/AppSidebar";
import WeeklyPlanBoard from "@/components/dashboard/WeeklyPlanBoard";
import { mockWeekPlan } from "@/data/mockPlan";

export default function DashboardPage() {
  return (
    <main className="bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <AppSidebar />

      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-6 lg:h-full lg:min-h-0 lg:pl-16">
        {/* Kompakt başlık: tek ekran hedefi için dikeyde az yer kaplar */}
        <header className="shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, Semih Baş
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Manage your weekly workout routine.
          </p>
        </header>

        <WeeklyPlanBoard initialPlan={mockWeekPlan} />
      </section>
    </main>
  );
}
