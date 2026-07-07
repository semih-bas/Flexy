"use client";

import { useState } from "react";
import type { DayPlan, PlanExercise } from "@/data/mockPlan";

type DayStatus = "today" | "completed" | "partial" | "missed";
type Temporal = "past" | "today" | "future";

// Gün kartlarında aynı anda gösterilecek en fazla egzersiz sayısı (tek ekrana sığma kuralı).
const MAX_VISIBLE_EXERCISES = 5;

const statusBadgeStyles: Record<DayStatus, string> = {
  today: "bg-brand text-white shadow-sm shadow-brand/40",
  completed: "border border-success/25 bg-success/15 text-success",
  partial: "border border-warning/25 bg-warning/15 text-warning",
  missed: "border border-danger/25 bg-danger/15 text-danger",
};

const statusBadgeLabel: Record<DayStatus, string> = {
  today: "Today",
  completed: "Completed",
  partial: "Partial",
  missed: "Missed",
};

// Kas grubu başlıkları bu paletten sırayla renk alır (token'lardan, isim eşlemesi olmadan — herhangi bir
// kas grubu adıyla çalışır).
const muscleGroupPalette = ["text-brand", "text-info", "text-success", "text-warning", "text-danger"];

function getMuscleGroupColor(index: number) {
  return muscleGroupPalette[index % muscleGroupPalette.length];
}

// Tek yerde tanımlı "yumuşak yüzey" dokusu: üstten çok hafif ışıma + hayalet kenarlık + yumuşak gölge.
// Kenarlık rengi kullanım yerinde verilir (seçili/today kartı turuncu vurgu alabildiği için).
const surfaceGlow =
  "border bg-gradient-to-b from-foreground/[0.05] to-transparent shadow-xl shadow-black/30";
const surfaceGlowSoft =
  "border border-foreground/10 bg-gradient-to-b from-foreground/[0.04] to-transparent shadow-lg shadow-black/20";

// completedCount/status veride tutulmaz: exercises'tan hesaplanır (türetilebilen veri saklanmaz).
function getCounts(day: DayPlan) {
  const total = day.exercises.length;
  const completed = day.exercises.filter((exercise) => exercise.completed).length;
  return { total, completed };
}

// Rozet durumu: bugün → Today; geçmiş + tam → Completed; geçmiş + kısmi → Partial;
// geçmiş + hiç yapılmadı → Missed; geçmiş rest day ve gelecek günler → rozet yok (null).
function getStatus(day: DayPlan, temporal: Temporal): DayStatus | null {
  if (temporal === "today") return "today";
  if (temporal === "future") return null;
  if (day.workoutName === null) return null;

  const { total, completed } = getCounts(day);
  if (completed === total) return "completed";
  if (completed === 0) return "missed";
  return "partial";
}

// Aksiyon butonu (Edit/Add Workout) rengi zamana göre değişir; özel işlev kısıtlaması yok, sadece görünüm ipucu.
function getActionButtonClasses(temporal: Temporal, isRestDay: boolean) {
  if (temporal === "today") {
    return "bg-brand text-white shadow-md shadow-brand/25";
  }
  if (temporal === "past") {
    return "border border-border/40 text-foreground-muted/50";
  }
  return isRestDay
    ? "border border-brand/35 text-brand"
    : "border border-border text-foreground-muted";
}

function groupByMuscle(exercises: PlanExercise[]) {
  const groups: { muscleGroup: string; exercises: PlanExercise[] }[] = [];

  for (const exercise of exercises) {
    const key = exercise.muscleGroup ?? "General";
    const existing = groups.find((group) => group.muscleGroup === key);

    if (existing) {
      existing.exercises.push(exercise);
    } else {
      groups.push({ muscleGroup: key, exercises: [exercise] });
    }
  }

  return groups;
}

type WeeklyPlanBoardProps = {
  initialPlan: DayPlan[];
};

export default function WeeklyPlanBoard({ initialPlan }: WeeklyPlanBoardProps) {
  const [plan, setPlan] = useState(initialPlan);
  const [selectedDay, setSelectedDay] = useState(
    () => plan.find((entry) => entry.isToday)?.day ?? plan[0].day,
  );
  const [planName, setPlanName] = useState("Weekly Workout Plan");
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(planName);

  const todayIndex = plan.findIndex((entry) => entry.isToday);
  const selectedPlan = plan.find((entry) => entry.day === selectedDay) ?? plan[0];
  const selectedGroups = groupByMuscle(selectedPlan.exercises);
  const selectedCounts = getCounts(selectedPlan);

  function toggleExercise(day: string, exerciseName: string) {
    setPlan((prev) =>
      prev.map((entry) =>
        entry.day === day
          ? {
              ...entry,
              exercises: entry.exercises.map((exercise) =>
                exercise.name === exerciseName
                  ? { ...exercise, completed: !exercise.completed }
                  : exercise,
              ),
            }
          : entry,
      ),
    );
  }

  function startEditingName() {
    setNameDraft(planName);
    setIsEditingName(true);
  }

  function commitNameEdit() {
    const trimmed = nameDraft.trim();
    setPlanName(trimmed === "" ? "My Plan" : trimmed);
    setIsEditingName(false);
  }

  return (
    <div className="mt-5 grid flex-1 gap-5 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* HAFTALIK PLAN */}
      <section
        className={`order-2 flex min-h-0 flex-col rounded-3xl border-foreground/10 bg-surface p-5 lg:order-1 ${surfaceGlow}`}
      >
        <div className="flex shrink-0 items-baseline justify-between gap-3 border-b border-border pb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
              My plan
            </p>
            {isEditingName ? (
              <input
                autoFocus
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                onBlur={commitNameEdit}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                aria-label="Plan name"
                className="mt-1 w-full rounded-md border border-brand/40 bg-background px-2 py-0.5 text-xl font-bold text-foreground outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={startEditingName}
                aria-label="Edit plan name"
                className="mt-1 flex items-center gap-2 text-left"
              >
                <h2 className="truncate text-xl font-bold">{planName}</h2>
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
          </div>
        </div>

        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-2">
          {plan.map((entry, index) => {
            const { total, completed } = getCounts(entry);
            const temporal: Temporal = entry.isToday
              ? "today"
              : index < todayIndex
                ? "past"
                : "future";
            const status = getStatus(entry, temporal);
            const isSelected = entry.day === selectedDay;
            const hiddenCount = entry.exercises.length - MAX_VISIBLE_EXERCISES;

            return (
              <button
                key={entry.day}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDay(entry.day)}
                className={`flex w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-surface-raised p-3 text-left ${surfaceGlowSoft} ${
                  isSelected
                    ? "border-brand/70 ring-1 ring-brand/30 bg-gradient-to-b from-brand/[0.07] to-transparent shadow-brand/20"
                    : ""
                }`}
              >
                <div className="flex shrink-0 items-center justify-between gap-2 leading-tight">
                  <p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                    {entry.day}
                  </p>
                  {status && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-tight ${statusBadgeStyles[status]}`}
                    >
                      {statusBadgeLabel[status]}
                    </span>
                  )}
                </div>

                {entry.workoutName ? (
                  <>
                    <h3 className="mt-1 truncate text-sm font-bold leading-tight">
                      {entry.workoutName}
                    </h3>
                    <p className="mt-0.5 text-[10px] font-semibold leading-tight text-foreground-muted">
                      {completed}/{total} exercises
                    </p>

                    <div className="mt-1 min-h-0 flex-1 space-y-0.5 overflow-hidden">
                      {entry.exercises.slice(0, MAX_VISIBLE_EXERCISES).map((exercise) => (
                        <div
                          key={exercise.name}
                          className="flex items-center justify-between gap-2 rounded-lg border border-foreground/[0.06] bg-background/50 px-2.5 py-0.5"
                        >
                          <span className="min-w-0 flex-1 truncate text-xs leading-tight">
                            {exercise.name}
                          </span>
                          <span className="shrink-0 rounded-md bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-foreground-muted">
                            {exercise.sets}
                          </span>
                        </div>
                      ))}
                    </div>

                    {hiddenCount > 0 && (
                      <p className="mt-0.5 shrink-0 text-[10px] font-semibold leading-tight text-brand">
                        +{hiddenCount} more exercise{hiddenCount > 1 ? "s" : ""} →
                      </p>
                    )}

                    <span
                      className={`mt-1.5 block w-full shrink-0 rounded-lg px-4 py-1 text-center text-xs font-semibold leading-tight ${getActionButtonClasses(
                        temporal,
                        false,
                      )}`}
                    >
                      Edit
                    </span>
                  </>
                ) : (
                  <>
                    <h3 className="mt-1 text-sm font-bold leading-tight">Rest Day</h3>

                    <div className="mt-1 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-foreground/10 bg-gradient-to-b from-foreground/[0.03] to-transparent p-2">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-foreground-muted shadow-inner shadow-black/20">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <p className="text-[11px] leading-tight text-foreground-muted">
                          No workout planned yet.
                        </p>
                      </div>
                    </div>

                    <span
                      className={`mt-1.5 block w-full shrink-0 rounded-lg px-4 py-1 text-center text-xs font-semibold leading-tight ${getActionButtonClasses(
                        temporal,
                        true,
                      )}`}
                    >
                      Add Workout
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* SEÇİLİ GÜN PANELİ (mobilde en üstte) */}
      <aside
        className={`order-1 flex min-h-0 flex-col rounded-3xl border-foreground/10 bg-surface p-5 lg:order-2 ${surfaceGlow}`}
      >
        <div className="shrink-0 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">
            {selectedPlan.isToday ? "Today" : selectedPlan.day}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{selectedPlan.workoutName ?? "Rest Day"}</h2>
          <p className="mt-0.5 text-sm text-foreground-muted">
            {selectedPlan.workoutName
              ? `${selectedCounts.completed}/${selectedCounts.total} exercises`
              : "No workout planned yet."}
          </p>
        </div>

        <div className="my-4 h-px shrink-0 bg-border" />

        {selectedPlan.workoutName && (
          <div className="min-h-0 flex-1 space-y-4 overflow-hidden">
            {selectedGroups.map((group, index) => (
              <div key={group.muscleGroup}>
                <p
                  className={`border-b border-border/60 pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] ${getMuscleGroupColor(index)}`}
                >
                  {group.muscleGroup}
                </p>
                <div className="mt-2 space-y-1.5">
                  {group.exercises.map((exercise) => (
                    <button
                      key={exercise.name}
                      type="button"
                      aria-pressed={exercise.completed}
                      onClick={() => toggleExercise(selectedPlan.day, exercise.name)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl bg-surface-raised px-3 py-2 ${surfaceGlowSoft} shadow-md shadow-black/15`}
                    >
                      <span
                        className={`flex min-w-0 flex-1 items-center gap-2 text-[13px] ${
                          exercise.completed
                            ? "text-foreground-muted line-through"
                            : "text-foreground"
                        }`}
                      >
                        {exercise.completed ? (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-[18px] w-[18px] shrink-0 rounded-full bg-success p-[3px] text-white shadow-sm shadow-success/40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          >
                            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span className="h-[18px] w-[18px] shrink-0 rounded-full border border-foreground/20" />
                        )}
                        <span className="truncate">{exercise.name}</span>
                      </span>
                      <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 text-[11px] font-semibold text-foreground-muted">
                        {exercise.sets}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
