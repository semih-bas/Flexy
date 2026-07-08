import { getMuscleGroupColor } from '@/lib/muscleGroupColor';

export type PlanPreviewExercise = {
  name: string;
  sets: string;
  muscleGroup?: string;
};

export type PlanPreviewDay = {
  day: string;
  workoutName: string | null;
  exercises: PlanPreviewExercise[];
};

type PlanPreviewModalProps = {
  title: string;
  subtitle: string;
  days: PlanPreviewDay[];
  onClose: () => void;
  onUse: () => void;
  useLabel?: string;
};

// Templates ve My Plans sayfaları aynı salt-okunur haftalık döküm görünümünü paylaşır (ortak
// bileşen: bir UI kalıbı iki yerden fazla kopyalanmasın diye). Rest day girişleri (workoutName
// yok) burada gösterilmez, sadece antrenman günleri listelenir.
export default function PlanPreviewModal({
  title,
  subtitle,
  days,
  onClose,
  onUse,
  useLabel = 'Use Plan',
}: PlanPreviewModalProps) {
  const trainingDays = days.filter((day) => day.workoutName && day.exercises.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close preview backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-2xl shadow-black/40">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">{subtitle}</p>
            <h2 className="mt-1 text-xl font-bold text-foreground">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground-muted/15 bg-foreground/5 text-foreground transition hover:bg-foreground/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="themed-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          {trainingDays.map((day, dayIndex) => (
            <div key={day.day}>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground-muted">
                {day.day}
              </p>
              <h3 className="mt-0.5 text-base font-bold text-foreground">{day.workoutName}</h3>

              <div className="mt-2 space-y-1.5">
                {day.exercises.map((exercise) => (
                  <div
                    key={exercise.name}
                    className="flex items-center justify-between gap-2 rounded-xl border border-foreground/[0.06] bg-surface-raised px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">{exercise.name}</span>
                    {exercise.muscleGroup && (
                      <span
                        className={`shrink-0 text-[11px] font-semibold uppercase tracking-[0.1em] ${getMuscleGroupColor(dayIndex)}`}
                      >
                        {exercise.muscleGroup}
                      </span>
                    )}
                    <span className="shrink-0 rounded-md bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground-muted">
                      {exercise.sets}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/40 hover:text-foreground"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onUse}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
          >
            {useLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
