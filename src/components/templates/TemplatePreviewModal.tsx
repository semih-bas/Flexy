import type { WorkoutTemplate } from '@/data/workoutTemplates';
import { buildWeekFromTemplate } from '@/lib/applyTemplate';
import { getMuscleGroupColor } from '@/lib/muscleGroupColor';

// "Categories" içindeki seviye etiketleri (Beginner/Intermediate) "kime uygun" cümlesinde odak
// olarak kullanılmaz; sadece antrenman odağı etiketleri (Strength/Hypertrophy/Home/Conditioning)
// odak cümlesine girer.
const FOCUS_CATEGORIES = new Set(['Strength', 'Hypertrophy', 'Home', 'Conditioning']);

// "Who this is for" cümlesi şablonun mevcut level/categories alanlarından türetilir: ayrı bir
// veri alanı eklemeye gerek yok (türetilebilen veri saklanmaz).
function buildWhoItsFor(template: WorkoutTemplate): string {
  const focus = template.categories.filter((category) => FOCUS_CATEGORIES.has(category));
  const focusText = focus.length > 0 ? focus.join(' and ').toLowerCase() : 'balanced, general training';
  return `Best suited for ${template.level.toLowerCase()} trainees looking for ${focusText}-focused weeks.`;
}

function muscleSummary(exercises: { muscleGroup?: string }[]): string {
  const groups = Array.from(
    new Set(exercises.map((exercise) => exercise.muscleGroup).filter((group): group is string => Boolean(group))),
  );
  return groups.join(', ');
}

type TemplatePreviewModalProps = {
  template: WorkoutTemplate;
  onClose: () => void;
  onUse: () => void;
};

export default function TemplatePreviewModal({ template, onClose, onUse }: TemplatePreviewModalProps) {
  // Gün-egzersiz yerleşimi Use Plan'daki ile aynı mantığı (buildWeekFromTemplate) kullanır: haftalık
  // önizleme, planı gerçekten uyguladığımızda dashboard'da göreceğimiz haftayla birebir tutarlı olur.
  const week = buildWeekFromTemplate(template);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close preview backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground-muted/15 bg-background/80 text-foreground backdrop-blur transition hover:bg-foreground/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="themed-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-border p-6 sm:p-8">
            <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
              Program Preview
            </span>
            <h2 className="mt-3 pr-10 text-2xl font-extrabold text-foreground sm:text-3xl">{template.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">{template.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-foreground-muted/20 bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted">
                {template.level}
              </span>
              <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
                {template.highlight}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted">
                {template.daysPerWeek} days per week
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Weekly Schedule</p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {week.map((day, index) => (
                <div
                  key={day.day}
                  className={`rounded-2xl border p-3 ${
                    day.workoutName
                      ? 'border-foreground/10 bg-surface-raised'
                      : 'border-dashed border-foreground/10 bg-transparent opacity-60'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">
                    {day.day}
                  </p>

                  {day.workoutName ? (
                    <>
                      <h4 className="mt-1 text-sm font-bold text-foreground">{day.workoutName}</h4>
                      <p className={`mt-0.5 text-[11px] font-semibold ${getMuscleGroupColor(index)}`}>
                        {muscleSummary(day.exercises)}
                      </p>
                      <div className="mt-2 space-y-1">
                        {day.exercises.map((exercise) => (
                          <div key={exercise.name} className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="min-w-0 flex-1 truncate text-foreground-muted">{exercise.name}</span>
                            <span className="shrink-0 font-semibold text-foreground">{exercise.sets}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="mt-1 text-sm font-bold text-foreground-muted">Rest / Recovery</h4>
                      <p className="mt-0.5 text-[11px] leading-4 text-foreground-muted">Open day for recovery.</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-foreground/10 bg-background p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Who This Is For</p>
              <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{buildWhoItsFor(template)}</p>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Expected Benefits</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {template.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground-muted"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-background/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Ready to Train?</p>
            <p className="mt-0.5 text-sm text-foreground-muted">Load this program into your active week.</p>
          </div>
          <button
            type="button"
            onClick={onUse}
            className="shrink-0 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
          >
            Use Plan
          </button>
        </div>
      </div>
    </div>
  );
}
