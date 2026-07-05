import Navbar from "@/components/layout/Navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Your weekly workout plan
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Build your week, follow today’s workout, and keep your training
            simple and consistent.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Weekly plan</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Plan your training days at a glance.
                </p>
              </div>

              <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300">
                Add workout
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="min-h-40 rounded-3xl border border-white/10 bg-[#0b1018] p-4"
                >
                  <p className="text-sm font-semibold text-cyan-300">{day}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Rest day
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    No workout planned yet.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
              Today’s focus
            </p>

            <h2 className="mt-3 text-2xl font-semibold">Push Day</h2>

            <div className="mt-5 space-y-3">
              {["Bench Press", "Incline Dumbbell Press", "Triceps Pushdown"].map(
                (exercise) => (
                  <div
                    key={exercise}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="font-medium">{exercise}</p>
                    <p className="mt-1 text-sm text-zinc-400">4 sets</p>
                  </div>
                )
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}