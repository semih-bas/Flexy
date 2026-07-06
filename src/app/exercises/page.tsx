import AppSidebar from '@/components/layout/AppSidebar';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { exerciseCategories, exercises } from '@/data/exercises';

export default function ExercisesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05060a] text-white">
      <div className="fixed inset-0 -z-10 bg-[url('/backgrounds/exercise-library-bg.png')] bg-cover bg-center" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.06),_rgba(0,0,0,0.68))]" />

      <AppSidebar />

      <section className="relative z-10 mx-auto flex w-full max-w-[1550px] flex-col px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-orange-400/20 bg-[linear-gradient(135deg,_rgba(10,16,28,0.97),_rgba(5,8,13,0.97))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-7 lg:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan-300">
                EXERCISE LIBRARY
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.4rem]">
                Exercise Guide
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Search movements, explore categories, and open a focused guide when you need more detail.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <p className="font-semibold text-white">{exercises.length} exercises</p>
              <p className="mt-1 text-slate-400">Starter collection</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/25 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1018]/80 px-4 py-3 text-sm text-slate-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search exercises"
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {exerciseCategories.map((category) => (
              <button
                key={category}
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </div>
      </section>
    </main>
  );
}
