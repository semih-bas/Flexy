import AppSidebar from "@/components/layout/AppSidebar";
import WeeklyPlanBoard from "@/components/dashboard/WeeklyPlanBoard";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";

export default function DashboardPage() {
  return (
    <main className="bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <AppSidebar />

      <section className="flex min-h-screen flex-col px-5 py-5 sm:px-6 lg:h-full lg:min-h-0 lg:pl-16">
        {/* Kompakt başlık: tek ekran hedefi için dikeyde az yer kaplar */}
        <header className="shrink-0">
          <WelcomeHeader />
        </header>

        <WeeklyPlanBoard />
      </section>
    </main>
  );
}
