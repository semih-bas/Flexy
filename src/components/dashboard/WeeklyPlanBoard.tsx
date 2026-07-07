"use client";

import { useState } from "react";
import type { DayPlan, PlanExercise } from "@/data/mockPlan";

type DayStatus = "completed" | "partial" | "today" | "empty";

// Gün kartlarında aynı anda gösterilecek en fazla egzersiz sayısı (tek ekrana sığma kuralı).
const MAX_VISIBLE_EXERCISES = 5;

const statusBadgeStyles: Record<Exclude<DayStatus, "empty">, string> = {
  completed: "border border-success/25 bg-success/15 text-success",
  partial: "border border-border bg-surface-raised text-foreground-muted",
  today: "bg-brand text-white shadow-sm shadow-brand/40",
};

const statusBadgeLabel: Record<Exclude<DayStatus, "empty">, string> = {
  completed: "Completed",
  partial: "Partial",
  today: "Today",
};

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

function getStatus(day: DayPlan): DayStatus {
  if (day.isToday) return "today";
  if (day.workoutName === null) return "empty";

  const { total, completed } = getCounts(day);
  return completed === total ? "completed" : "partial";
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

  return (
    <div className="mt-5 grid flex-1 gap-5 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* HAFTALIK PLAN */}
      <section
        className={`order-2 flex min-h-0 flex-col rounded-3xl border-foreground/10 bg-surface p-5 lg:order-1 ${surfaceGlow}`}
      >
        <div className="flex shrink-0 items-baseline justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
              My plan
            </p>
            <h2 className="mt-1 text-xl font-bold">Weekly Workout Plan</h2>
          </div>
        </div>

        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-2">
          {plan.map((entry) => {
            const { total, completed } = getCounts(entry);
            const status = getStatus(entry);
            const isSelected = entry.day === selectedDay;
            const hiddenCount = entry.exercises.length - MAX_VISIBLE_EXERCISES;

            return (
              <button
                key={entry.day}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDay(entry.day)}
                className={`flex w-full min-h-0 flex-col overflow-hidden rounded-2xl bg-surface-raised p-3.5 text-left ${surfaceGlowSoft} ${
                  isSelected
                    ? "border-brand/70 ring-1 ring-brand/30 bg-gradient-to-b from-brand/[0.07] to-transparent shadow-brand/20"
                    : ""
                }`}
              >
                <div className="flex shrink-0 items-center justify-between gap-2">
                  <p className="truncate text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                    {entry.day}
                  </p>
                  {status !== "empty" && (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusBadgeStyles[status]}`}
                    >
                      {statusBadgeLabel[status]}
                    </span>
                  )}
                </div>

                {entry.workoutName ? (
                  <>
                    <h3 className="mt-1.5 truncate text-base font-bold">{entry.workoutName}</h3>
                    <p className="mt-0.5 text-[11px] font-semibold text-foreground-muted">
                      {completed}/{total} exercises
                    </p>

                    <div className="mt-1.5 min-h-0 flex-1 space-y-1 overflow-hidden">
                      {entry.exercises.slice(0, MAX_VISIBLE_EXERCISES).map((exercise) => (
                        <div
                          key={exercise.name}
                          className="flex items-center justify-between gap-2 rounded-lg border border-foreground/[0.06] bg-background/50 px-2.5 py-1"
                        >
                          <span className="min-w-0 flex-1 truncate text-[13px]">
                            {exercise.name}
                          </span>
                          <span className="shrink-0 rounded-md bg-background/60 px-2 py-0.5 text-[11px] font-semibold text-foreground-muted">
                            {exercise.sets}
                          </span>
                        </div>
                      ))}
                    </div>

                    {hiddenCount > 0 && (
                      <p className="mt-1 shrink-0 text-[11px] font-semibold text-brand">
                        +{hiddenCount} more exercise{hiddenCount > 1 ? "s" : ""} →
                      </p>
                    )}

                    <span
                      className={`mt-2.5 block w-full shrink-0 rounded-lg px-4 py-1.5 text-center text-[13px] font-semibold ${
                        entry.isToday
                          ? "bg-brand text-white shadow-md shadow-brand/25"
                          : "border border-border text-foreground-muted"
                      }`}
                    >
                      Edit
                    </span>
                  </>
                ) : (
                  <>
                    <h3 className="mt-1.5 text-base font-bold">Rest Day</h3>

                    <div className="mt-1.5 flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-foreground/10 bg-gradient-to-b from-foreground/[0.03] to-transparent p-3">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground-muted shadow-inner shadow-black/20">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
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
                        <p className="text-xs text-foreground-muted">No workout planned yet.</p>
                      </div>
                    </div>

                    <span className="mt-2.5 block w-full shrink-0 rounded-lg border border-brand/35 px-4 py-1.5 text-center text-[13px] font-semibold text-brand">
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
            {selectedGroups.map((group) => (
              <div key={group.muscleGroup}>
                <p className="border-b border-border/60 pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
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
