import AppSidebar from '@/components/layout/AppSidebar';
import TemplatesExplorer from '@/components/templates/TemplatesExplorer';
import { templateCategories, workoutTemplates } from '@/data/workoutTemplates';

export default function TemplatesPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppSidebar />

      <section className="relative z-10 mx-auto flex w-full max-w-[1550px] flex-col px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-brand/20 bg-surface p-5 shadow-lg sm:p-7 lg:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-brand">
                PROGRAM LIBRARY
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.4rem]">
                Workout Templates
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-muted sm:text-base">
                Preview ready-made programs by goal, inspect the weekly structure, and apply the one
                that fits your training week.
              </p>
            </div>

            <div className="rounded-2xl border border-foreground-muted/15 bg-background px-4 py-3 text-sm text-foreground-muted">
              <p className="font-semibold text-foreground">{workoutTemplates.length} programs</p>
              <p className="mt-1 text-foreground-muted">Ready to apply</p>
            </div>
          </div>

          <TemplatesExplorer templates={workoutTemplates} categories={templateCategories} />
        </div>
      </section>
    </main>
  );
}
