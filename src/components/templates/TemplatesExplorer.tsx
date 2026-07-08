'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TemplateCategory, WorkoutTemplate } from '@/data/workoutTemplates';
import { usePlan } from '@/components/plan/PlanProvider';
import TemplateCard from './TemplateCard';
import TemplatePreviewModal from './TemplatePreviewModal';

type CategoryFilter = TemplateCategory | 'All';

type TemplatesExplorerProps = {
  templates: WorkoutTemplate[];
  categories: TemplateCategory[];
};

export default function TemplatesExplorer({ templates, categories }: TemplatesExplorerProps) {
  const router = useRouter();
  const { applyTemplate } = usePlan();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [previewingTemplate, setPreviewingTemplate] = useState<WorkoutTemplate | null>(null);
  const [confirmingTemplate, setConfirmingTemplate] = useState<WorkoutTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return templates;
    return templates.filter((template) => template.categories.includes(selectedCategory));
  }, [templates, selectedCategory]);

  function handleUsePlan(template: WorkoutTemplate) {
    setPreviewingTemplate(null);
    setConfirmingTemplate(template);
  }

  function confirmUsePlan() {
    if (!confirmingTemplate) return;
    applyTemplate(confirmingTemplate);
    setConfirmingTemplate(null);
    router.push('/dashboard');
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
              onUse={() => setConfirmingTemplate(template)}
            />
          ))}
        </div>
      )}

      {previewingTemplate && (
        <TemplatePreviewModal
          template={previewingTemplate}
          onClose={() => setPreviewingTemplate(null)}
          onUse={() => handleUsePlan(previewingTemplate)}
        />
      )}

      {confirmingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation backdrop"
            onClick={() => setConfirmingTemplate(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-3xl border border-foreground/10 bg-surface p-6 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-bold text-foreground">Use &ldquo;{confirmingTemplate.name}&rdquo;?</h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              This will overwrite your current weekly plan on the dashboard. This can&apos;t be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingTemplate(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground-muted transition hover:border-brand/40 hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmUsePlan}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
              >
                Use Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
