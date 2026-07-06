import AppSidebar from '@/components/layout/AppSidebar';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import { exerciseCategories, exercises } from '@/data/exercises';

export default function ExercisesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppSidebar />

      <section className="relative z-10 mx-auto flex w-full max-w-[1550px] flex-col px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-brand/20 bg-surface p-5 shadow-lg sm:p-7 lg:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-brand">
                EXERCISE LIBRARY
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.4rem]">
                Exercise Guide
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-muted sm:text-base">
                Search movements, explore categories, and open a focused guide when you need more detail.
              </p>
            </div>

            <div className="rounded-2xl border border-foreground-muted/15 bg-background px-4 py-3 text-sm text-foreground-muted">
              <p className="font-semibold text-foreground">{exercises.length} exercises</p>
              <p className="mt-1 text-foreground-muted">Starter collection</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[1.6rem] border border-foreground-muted/10 bg-background p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-foreground-muted/15 bg-surface px-4 py-3 text-sm text-foreground-muted">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground-muted" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search exercises"
              className="w-full bg-transparent outline-none placeholder:text-foreground-muted"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {exerciseCategories.map((category) => (
              <button
                key={category}
                type="button"
                className="rounded-full border border-foreground-muted/15 bg-surface px-3 py-2 text-sm text-foreground-muted transition hover:border-brand/40 hover:text-foreground"
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
