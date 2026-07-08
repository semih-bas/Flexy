'use client';

import { useState, type ReactNode } from 'react';
import { useSettings, type Language, type WeekStartDay, type WeightUnit } from './SettingsProvider';
import { usePlan } from '@/components/plan/PlanProvider';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { surfaceGlowSoft } from '@/lib/surfaceStyles';

type SegmentedOption<T extends string> = { value: T; label: string };

// Preferences kartındaki iki seçenekli anahtarlar (week start, weight unit) aynı deseni
// paylaşıyor: kopyalamak yerine tek yerden üretiliyor.
function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-xl border border-border bg-background p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl bg-surface-raised p-5 ${surfaceGlowSoft}`}>
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-foreground-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function SettingsPanels() {
  const {
    userName,
    setUserName,
    weekStartDay,
    setWeekStartDay,
    weightUnit,
    setWeightUnit,
    language,
    setLanguage,
  } = useSettings();
  const { resetPlan, clearFavoritePlans } = usePlan();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);

  return (
    <div className="mt-8 space-y-5">
      <SettingsCard title="Profile" description="This name appears in your dashboard welcome message.">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">
            Name
          </span>
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            aria-label="Your name"
            className="w-full max-w-sm rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand/50"
          />
        </label>
      </SettingsCard>

      <SettingsCard title="Preferences">
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">
              Week starts on
            </p>
            <div className="mt-2">
              <SegmentedToggle<WeekStartDay>
                value={weekStartDay}
                onChange={setWeekStartDay}
                ariaLabel="Week start day"
                options={[
                  { value: 'Monday', label: 'Monday' },
                  { value: 'Sunday', label: 'Sunday' },
                ]}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">
              Weight unit
            </p>
            <div className="mt-2">
              <SegmentedToggle<WeightUnit>
                value={weightUnit}
                onChange={setWeightUnit}
                ariaLabel="Weight unit"
                options={[
                  { value: 'kg', label: 'kg' },
                  { value: 'lb', label: 'lb' },
                ]}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground-muted">
              Language
            </p>
            <div className="mt-2">
              <SegmentedToggle<Language>
                value={language}
                onChange={setLanguage}
                ariaLabel="Language"
                options={[
                  { value: 'EN', label: 'EN' },
                  { value: 'TR', label: 'TR' },
                ]}
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Danger zone" description="These actions can't be undone.">
        <div className="space-y-3">
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Reset weekly plan</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Clears every day on your dashboard back to rest days.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="shrink-0 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20"
            >
              Reset plan
            </button>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Clear favorite plans</p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                Removes every saved plan from My Plans.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmingClear(true)}
              className="shrink-0 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger/20"
            >
              Clear favorites
            </button>
          </div>
        </div>
      </SettingsCard>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset weekly plan?"
          description="Every day on your dashboard will be cleared back to a rest day. This can't be undone."
          confirmLabel="Reset plan"
          danger
          onConfirm={() => {
            resetPlan();
            setConfirmingReset(false);
          }}
          onCancel={() => setConfirmingReset(false)}
        />
      )}

      {confirmingClear && (
        <ConfirmDialog
          title="Clear favorite plans?"
          description="All saved plans in My Plans will be permanently removed. This can't be undone."
          confirmLabel="Clear favorites"
          danger
          onConfirm={() => {
            clearFavoritePlans();
            setConfirmingClear(false);
          }}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  );
}
