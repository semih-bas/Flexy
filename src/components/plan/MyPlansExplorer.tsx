'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlan, type FavoritePlan } from './PlanProvider';
import PlanPreviewModal from './PlanPreviewModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import MyPlanCard from './MyPlanCard';

function formatSavedDate(savedAt: string) {
  return new Date(savedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MyPlansExplorer() {
  const router = useRouter();
  const { favoritePlans, applyFavoritePlan, deleteFavoritePlan } = usePlan();
  const [previewingPlan, setPreviewingPlan] = useState<FavoritePlan | null>(null);
  const [applyingPlan, setApplyingPlan] = useState<FavoritePlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<FavoritePlan | null>(null);

  function confirmApply() {
    if (!applyingPlan) return;
    applyFavoritePlan(applyingPlan);
    setApplyingPlan(null);
    router.push('/dashboard');
  }

  function confirmDelete() {
    if (!deletingPlan) return;
    deleteFavoritePlan(deletingPlan.id);
    setDeletingPlan(null);
  }

  if (favoritePlans.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-dashed border-foreground-muted/15 bg-background px-6 py-16 text-center">
        <p className="text-base font-semibold text-foreground">No saved plans yet</p>
        <p className="max-w-sm text-sm text-foreground-muted">
          Build a weekly plan on the dashboard and save it as a favorite to see it here.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 transition hover:bg-brand/90"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex items-baseline justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Saved Plans</p>
        <p className="text-sm font-semibold text-foreground-muted">{favoritePlans.length} saved</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {favoritePlans.map((plan) => (
          <MyPlanCard
            key={plan.id}
            plan={plan}
            onPreview={() => setPreviewingPlan(plan)}
            onApply={() => setApplyingPlan(plan)}
            onDelete={() => setDeletingPlan(plan)}
          />
        ))}
      </div>

      {previewingPlan && (
        <PlanPreviewModal
          title={previewingPlan.name}
          subtitle={`Saved ${formatSavedDate(previewingPlan.savedAt)}`}
          days={previewingPlan.week}
          onClose={() => setPreviewingPlan(null)}
          onUse={() => {
            setPreviewingPlan(null);
            setApplyingPlan(previewingPlan);
          }}
          useLabel="Apply Plan"
        />
      )}

      {applyingPlan && (
        <ConfirmDialog
          title={`Apply "${applyingPlan.name}"?`}
          description="This will overwrite your current weekly plan on the dashboard. This can't be undone."
          confirmLabel="Apply Plan"
          onConfirm={confirmApply}
          onCancel={() => setApplyingPlan(null)}
        />
      )}

      {deletingPlan && (
        <ConfirmDialog
          title={`Delete "${deletingPlan.name}"?`}
          description="This saved plan will be permanently removed."
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeletingPlan(null)}
        />
      )}
    </>
  );
}
