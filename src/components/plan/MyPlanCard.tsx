import type { FavoritePlan } from './PlanProvider';
import { surfaceGlowSoft } from '@/lib/surfaceStyles';

type MyPlanCardProps = {
  plan: FavoritePlan;
  onPreview: () => void;
  onApply: () => void;
  onDelete: () => void;
};

export default function MyPlanCard({ plan, onPreview, onApply, onDelete }: MyPlanCardProps) {
  const trainingDays = plan.week.filter((day) => day.workoutName && day.exercises.length > 0);
  const savedDate = new Date(plan.savedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised ${surfaceGlowSoft}`}>
      <div className="h-1 w-full bg-brand" />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate text-xl font-extrabold leading-tight text-foreground">{plan.name}</h3>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground-muted">
          Saved {savedDate} · {trainingDays.length} workout day{trainingDays.length === 1 ? '' : 's'}
        </p>

        <div className="mt-3 flex flex-1 flex-wrap items-start gap-2">
          {trainingDays.map((day) => (
            <span
              key={day.day}
              className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground-muted"
            >
              {day.day.slice(0, 3)} · {day.workoutName}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-xl bg-brand py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
          >
            Apply Plan
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/50 hover:text-foreground"
          >
            Preview
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="mt-2 w-full rounded-xl border border-danger/30 bg-danger/10 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
