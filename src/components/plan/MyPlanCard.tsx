'use client';

import { useState } from 'react';
import type { FavoritePlan } from './PlanProvider';
import { surfaceGlowSoft } from '@/lib/surfaceStyles';

type MyPlanCardProps = {
  plan: FavoritePlan;
  onPreview: () => void;
  onApply: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
};

export default function MyPlanCard({ plan, onPreview, onApply, onDelete, onRename }: MyPlanCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(plan.name);
  const trainingDays = plan.week.filter((day) => day.workoutName && day.exercises.length > 0);
  const savedDate = new Date(plan.savedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  function startEditingName() {
    setNameDraft(plan.name);
    setIsEditingName(true);
  }

  function commitNameEdit() {
    onRename(nameDraft);
    setIsEditingName(false);
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised ${surfaceGlowSoft}`}>
      <div className="h-1 w-full bg-brand" />

      <div className="flex flex-1 flex-col p-5">
        {isEditingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(event) => setNameDraft(event.target.value)}
            onBlur={commitNameEdit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
            }}
            aria-label="Plan name"
            className="w-full rounded-md border border-brand/40 bg-background px-2 py-0.5 text-xl font-extrabold text-foreground outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={startEditingName}
            aria-label="Edit plan name"
            className="flex items-center gap-1.5 text-left"
          >
            <h3 className="truncate text-xl font-extrabold leading-tight text-foreground">{plan.name}</h3>
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 shrink-0 text-foreground-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

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
