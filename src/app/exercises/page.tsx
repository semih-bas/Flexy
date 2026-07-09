import AppSidebar from '@/components/layout/AppSidebar';
import ExerciseExplorer from '@/components/exercises/ExerciseExplorer';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { exerciseCategories } from '@/data/exercises';
import { prisma } from '@/lib/prisma';
import { toExercise } from '@/lib/exerciseSerializer';

export default async function ExercisesPage() {
  // exerciseCategories sadece filtre haplarının sabit sırasını taşır (bkz. data dosyası); asıl
  // egzersiz verisi artık DB'den geliyor.
  const rows = await prisma.exercise.findMany({ orderBy: [{ category: 'asc' }, { name: 'asc' }] });
  const exercises = rows.map(toExercise);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AmbientGlow />
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

          <ExerciseExplorer exercises={exercises} categories={exerciseCategories} />
        </div>
      </section>
    </main>
  );
}
