import StoreButton from "@/components/landing/StoreButton";

const todayExercises = [
  "Bench Press",
  "Incline Dumbbell Press",
  "Triceps Pushdown",
];

export default function HeroSection() {
  return (
    <section className="bg-[#05060a] text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
      <div>
        <p className="mb-4 inline-flex rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm text-brand">
          Mobile-first workout planner
        </p>

        <h1 className="max-w-xl text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
          Plan less.
          <br />
          Train better.
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg">
          Flexy helps you build weekly workout plans, follow today&apos;s
          session, and stay consistent with a clean mobile-first experience.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <StoreButton storeName="App Store" label="Coming soon" />
          <StoreButton storeName="Google Play" label="Coming soon" />
        </div>
      </div>

      <div id="mobile" className="relative mx-auto w-full max-w-sm">
        <div className="absolute inset-0 rounded-[3rem] bg-brand/25 blur-3xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#10131b] p-4 shadow-2xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Today&apos;s focus</p>
              <h2 className="text-2xl font-semibold text-white">Push Day</h2>
            </div>

            <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              Active
            </span>
          </div>

          <div className="space-y-3">
            {todayExercises.map((exercise) => (
              <div
                key={exercise}
                className="flex items-center justify-between rounded-2xl bg-white/5 p-4"
              >
                <span className="text-sm font-medium text-white">{exercise}</span>
                <span className="text-xs text-zinc-400">4 sets</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-brand/25 bg-brand/10 p-4">
            <p className="text-sm font-medium text-brand">Next exercise</p>
            <p className="mt-1 text-sm text-zinc-300">
              Keep your workout simple and focused.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}