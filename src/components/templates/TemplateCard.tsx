import type { WorkoutTemplate } from '@/data/workoutTemplates';
import { surfaceGlowSoft } from '@/lib/surfaceStyles';

type TemplateCardProps = {
  template: WorkoutTemplate;
  onPreview: () => void;
  onUse: () => void;
};

export default function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised ${surfaceGlowSoft}`}
    >
      <div className="h-1 w-full bg-brand" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex w-fit items-center rounded-full border border-foreground-muted/20 bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted">
            {template.level}
          </span>
          <span className="shrink-0 text-xs font-semibold text-foreground-muted">
            {template.daysPerWeek} days per week
          </span>
        </div>

        <span className="mt-3 inline-flex w-fit items-center rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
          {template.highlight}
        </span>

        <h3 className="mt-3 text-lg font-bold leading-tight text-foreground">{template.name}</h3>
        <p className="mt-2 text-sm leading-6 text-foreground-muted">{template.description}</p>

        <div className="mt-3 flex flex-1 flex-wrap items-start gap-2">
          {template.features.map((feature) => (
            <span
              key={feature}
              className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground-muted"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="flex-1 rounded-xl border border-border py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/50 hover:text-foreground"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={onUse}
            className="flex-1 rounded-xl bg-brand py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
          >
            Use Plan
          </button>
        </div>
      </div>
    </div>
  );
}
