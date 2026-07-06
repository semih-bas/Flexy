import AppSidebar from "@/components/layout/AppSidebar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppSidebar />

      <section className="mx-auto max-w-6xl px-4 py-10 lg:pl-8">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">
            Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, Semih Baş
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-muted sm:text-base">
            Manage your weekly workout routine.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] border border-brand/20 bg-surface p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand">
                My plan
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Weekly Workout Plan
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                (day) => (
                  <div
                    key={day}
                    className="min-h-44 rounded-3xl border border-foreground-muted/10 bg-background p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                      {day}
                    </p>

                    <h3 className="mt-4 text-lg font-semibold">Rest Day</h3>

                    <div className="mt-4 flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-foreground-muted/20 bg-foreground/5 p-4">
                      <p className="text-center text-sm text-foreground-muted">
                        No workout planned yet.
                      </p>
                    </div>

                    <button className="mt-5 w-full rounded-xl border border-foreground-muted/20 px-4 py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/40 hover:text-foreground">
                      Add Workout
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-brand/20 bg-surface p-5 shadow-sm">
            <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-brand">
              Today
            </p>

            <h2 className="mt-3 text-center text-3xl font-bold">Rest Day</h2>

            <div className="mt-6 rounded-3xl border border-foreground-muted/10 bg-background p-5">
              <p className="font-semibold">
                No workout planned for today.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}