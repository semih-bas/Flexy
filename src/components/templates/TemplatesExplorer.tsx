'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TemplateCategory, WorkoutTemplate } from '@/data/workoutTemplates';
import { usePlan } from '@/components/plan/PlanProvider';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { buildWeekFromTemplate } from '@/lib/applyTemplate';
import TemplateCard from './TemplateCard';
import TemplatePreviewModal from './TemplatePreviewModal';

type CategoryFilter = TemplateCategory | 'All';

// "Use Plan" akışı tek bir state makinesiyle yönetilir: önce seçim (apply mi, favorilere
// kaydetme mi), sonra seçilen yola göre onay/isim formu, en sonda "Saved" geri bildirimi.
type UsePlanStep =
  | { type: 'choice'; template: WorkoutTemplate }
  | { type: 'confirmApply'; template: WorkoutTemplate }
  | { type: 'saveForm'; template: WorkoutTemplate }
  | { type: 'saved'; name: string };

type TemplatesExplorerProps = {
  templates: WorkoutTemplate[];
  categories: TemplateCategory[];
};

export default function TemplatesExplorer({ templates, categories }: TemplatesExplorerProps) {
  const router = useRouter();
  const { applyTemplate, saveFavoritePlan } = usePlan();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [previewingTemplate, setPreviewingTemplate] = useState<WorkoutTemplate | null>(null);
  const [usePlanStep, setUsePlanStep] = useState<UsePlanStep | null>(null);
  const [saveNameDraft, setSaveNameDraft] = useState('');

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return templates;
    return templates.filter((template) => template.categories.includes(selectedCategory));
  }, [templates, selectedCategory]);

  function openUseFlow(template: WorkoutTemplate) {
    setUsePlanStep({ type: 'choice', template });
  }

  function confirmApplyTemplate(template: WorkoutTemplate) {
    applyTemplate(template);
    setUsePlanStep(null);
    router.push('/dashboard');
  }

  function openSaveForm(template: WorkoutTemplate) {
    setSaveNameDraft(template.name);
    setUsePlanStep({ type: 'saveForm', template });
  }

  function confirmSaveToMyPlans(template: WorkoutTemplate) {
    const name = saveNameDraft.trim() || template.name;
    saveFavoritePlan(name, buildWeekFromTemplate(template));
    setUsePlanStep({ type: 'saved', name });
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-[1.6rem] border border-foreground-muted/10 bg-background p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              selectedCategory === 'All'
                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                : 'border border-foreground-muted/15 bg-surface text-foreground-muted hover:border-brand/40 hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand text-white shadow-sm shadow-brand/30'
                    : 'border border-foreground-muted/15 bg-surface text-foreground-muted hover:border-brand/40 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Programs</p>
        <p className="text-sm font-semibold text-foreground-muted">
          {filteredTemplates.length} available
        </p>
      </div>

      {filteredTemplates.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground-muted">No templates found.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={() => setPreviewingTemplate(template)}
              onUse={() => openUseFlow(template)}
            />
          ))}
        </div>
      )}

      {previewingTemplate && (
        <TemplatePreviewModal
          template={previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
          onUse={() => {
            const template = previewingTemplate;
            setPreviewingTemplate(null);
            openUseFlow(template);
          }}
        />
      )}

      {usePlanStep?.type === 'choice' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close backdrop"
            onClick={() => setUsePlanStep(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-foreground/10 bg-surface p-6 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-bold text-foreground">Use &ldquo;{usePlanStep.template.name}&rdquo;</h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Choose how you&apos;d like to use this template.
            </p>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => setUsePlanStep({ type: 'confirmApply', template: usePlanStep.template })}
                className="w-full rounded-xl bg-brand px-4 py-3 text-left transition hover:bg-brand/90"
              >
                <span className="block text-sm font-semibold text-white">Apply as active plan</span>
                <span className="block text-xs text-white/80">Overwrites your current dashboard week.</span>
              </button>
              <button
                type="button"
                onClick={() => openSaveForm(usePlanStep.template)}
                className="w-full rounded-xl border border-border px-4 py-3 text-left transition hover:border-brand/40"
              >
                <span className="block text-sm font-semibold text-foreground">Save to My Plans</span>
                <span className="block text-xs text-foreground-muted">
                  Adds it to your favorites without touching the dashboard.
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setUsePlanStep(null)}
              className="mt-4 w-full rounded-xl px-4 py-2 text-center text-sm font-semibold text-foreground-muted transition hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {usePlanStep?.type === 'confirmApply' && (
        <ConfirmDialog
          title={`Use "${usePlanStep.template.name}"?`}
          description="This will overwrite your current weekly plan on the dashboard. This can't be undone."
          confirmLabel="Use Plan"
          onConfirm={() => confirmApplyTemplate(usePlanStep.template)}
          onCancel={() => setUsePlanStep(null)}
        />
      )}

      {usePlanStep?.type === 'saveForm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close backdrop"
            onClick={() => setUsePlanStep(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-foreground/10 bg-surface p-6 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-bold text-foreground">Save to My Plans</h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Give this plan a name. You can apply it from My Plans whenever you want.
            </p>

            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                Plan name
              </span>
              <input
                autoFocus
                type="text"
                value={saveNameDraft}
                onChange={(event) => setSaveNameDraft(event.target.value)}
                aria-label="Plan name"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand/50"
              />
            </label>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUsePlanStep(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/40 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmSaveToMyPlans(usePlanStep.template)}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {usePlanStep?.type === 'saved' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close backdrop"
            onClick={() => setUsePlanStep(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-foreground/10 bg-surface p-6 text-center shadow-2xl shadow-black/40">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">Saved to My Plans</h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              &ldquo;{usePlanStep.name}&rdquo; is now available in My Plans.
            </p>
            <button
              type="button"
              onClick={() => setUsePlanStep(null)}
              className="mt-5 w-full rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
