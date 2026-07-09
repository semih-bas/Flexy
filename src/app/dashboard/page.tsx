import AppSidebar from "@/components/layout/AppSidebar";
import WeeklyPlanBoard from "@/components/dashboard/WeeklyPlanBoard";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function DashboardPage() {
  return (
    <main className="relative bg-background text-foreground lg:h-screen lg:overflow-hidden">
      <AmbientGlow />
      <AppSidebar />

      <section className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-6 lg:h-full lg:min-h-0 lg:pl-16">
        {/* Kompakt başlık: tek ekran hedefi için dikeyde az yer kaplar */}
        <header className="shrink-0">
          <WelcomeHeader />
        </header>

        <WeeklyPlanBoard />
      </section>
    </main>
  );
}
