"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { DayPlan, PlanExercise } from "@/data/mockPlan";
import { getMuscleGroupColor } from "@/lib/muscleGroupColor";
import { ctaButtonGlow, surfaceGlow, surfaceGlowSoft } from "@/lib/surfaceStyles";
import { usePlan } from "@/components/plan/PlanProvider";
import { useSettings, type WeekStartDay } from "@/components/settings/SettingsProvider";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import WorkoutEditorModal from "./WorkoutEditorModal";
import SortableRow from "./SortableRow";

type DayStatus = "today" | "completed" | "partial" | "missed";
type Temporal = "past" | "today" | "future";

// Gün kartlarında aynı anda gösterilecek en fazla egzersiz sayısı (tek ekrana sığma kuralı).
const MAX_VISIBLE_EXERCISES = 6;

// "Bugün" gerçek tarihten hesaplanır, veride sabit tutulmaz (türetilebilen veri saklanmaz).
function getTodayDayName(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

const statusBadgeStyles: Record<DayStatus, string> = {
  today: "bg-brand text-white shadow-sm shadow-brand/50",
  completed: "border border-success/30 bg-success/20 text-success",
  partial: "border border-warning/30 bg-warning/20 text-warning",
  missed: "border border-danger/30 bg-danger/20 text-danger",
};

const statusBadgeLabel: Record<DayStatus, string> = {
  today: "Today",
  completed: "Completed",
  partial: "Partial",
  missed: "Missed",
};

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

// Aksiyon butonu (Edit/Add Workout) hiçbir zaman fonksiyonel olarak devre dışı bırakılmaz —
// geçmiş günler de düzenlenebilir, gelecek günler de. Renk sadece zamana göre değişen bir ipucu:
// bugün dolgun turuncu, geçmiş soluk turuncu (hover'da tam turuncu), gelecek her zaman normal
// turuncu-outline (workout olsa da olmasa da aynı, asla pasif görünmez).
function getActionButtonClasses(temporal: Temporal) {
  if (temporal === "today") {
    return ctaButtonGlow;
  }
  if (temporal === "past") {
    return "border border-brand/30 text-brand/60 hover:border-brand hover:text-brand";
  }
  return "border border-brand/35 text-brand";
}

// Haftalık grid'in ilk günü Settings > Preferences > "Week starts on" tercihine göre döner;
// alttaki plan state'i her zaman Monday..Sunday sırasıyla saklanır (diğer sayfalar/işlevler bu
// sıraya güvenir), bu sadece dashboard'daki görüntüleme sırasını değiştiren türetilmiş bir görünüm.
function orderByWeekStart(week: DayPlan[], weekStartDay: WeekStartDay): DayPlan[] {
  if (weekStartDay === "Monday") return week;
  const startIndex = week.findIndex((entry) => entry.day === "Sunday");
  if (startIndex === -1) return week;
  return [...week.slice(startIndex), ...week.slice(0, startIndex)];
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

export default function WeeklyPlanBoard() {
  const todayName = getTodayDayName();
  const { plan, setPlan, activePlanName, activeFavoriteId, renameActivePlan, saveActivePlanAsFavorite, favoritePlans } =
    usePlan();
  const { weekStartDay } = useSettings();
  const displayPlan = orderByWeekStart(plan, weekStartDay);
  const [selectedDay, setSelectedDay] = useState(
    () => plan.find((entry) => entry.day === todayName)?.day ?? displayPlan[0].day,
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(activePlanName);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [confirmingOverwrite, setConfirmingOverwrite] = useState(false);

  const todayIndex = displayPlan.findIndex((entry) => entry.day === todayName);
  const selectedPlan = plan.find((entry) => entry.day === selectedDay) ?? plan[0];
  const selectedDisplayIndex = displayPlan.findIndex((entry) => entry.day === selectedPlan.day);
  const selectedTemporal: Temporal =
    selectedPlan.day === todayName ? "today" : selectedDisplayIndex < todayIndex ? "past" : "future";
  // Gelecek günlerin egzersizleri tik atılamaz kilitli görünür: sadece bugün ve geçmiş işaretlenebilir.
  const isSelectedLocked = selectedTemporal === "future";
  const selectedGroups = groupByMuscle(selectedPlan.exercises);
  const selectedCounts = getCounts(selectedPlan);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Sürükleme sadece aynı kas grubu içinde geçerli: gruplar arası taşıma yok sayılır.
  function handlePlanDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPlan((prev) =>
      prev.map((entry) => {
        if (entry.day !== selectedPlan.day) return entry;

        const activeItem = entry.exercises.find((exercise) => exercise.name === active.id);
        const overItem = entry.exercises.find((exercise) => exercise.name === over.id);
        const activeGroup = activeItem?.muscleGroup ?? "General";
        const overGroup = overItem?.muscleGroup ?? "General";
        if (!activeItem || !overItem || activeGroup !== overGroup) return entry;

        const currentGroups = groupByMuscle(entry.exercises);
        const groupIndex = currentGroups.findIndex((group) => group.muscleGroup === activeGroup);
        const items = currentGroups[groupIndex].exercises;
        const oldIndex = items.findIndex((exercise) => exercise.name === active.id);
        const newIndex = items.findIndex((exercise) => exercise.name === over.id);
        currentGroups[groupIndex] = { ...currentGroups[groupIndex], exercises: arrayMove(items, oldIndex, newIndex) };

        return { ...entry, exercises: currentGroups.flatMap((group) => group.exercises) };
      }),
    );
  }

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

  function handleSaveWorkout(day: string, workoutName: string, exercises: PlanExercise[]) {
    setPlan((prev) =>
      prev.map((entry) => (entry.day === day ? { ...entry, workoutName, exercises } : entry)),
    );
    setEditingDay(null);
  }

  function handleDeleteWorkout(day: string) {
    setPlan((prev) =>
      prev.map((entry) => (entry.day === day ? { ...entry, workoutName: null, exercises: [] } : entry)),
    );
    setEditingDay(null);
  }

  function startEditingName() {
    setNameDraft(activePlanName);
    setIsEditingName(true);
  }

  function commitNameEdit() {
    renameActivePlan(nameDraft);
    setIsEditingName(false);
  }

  // Aktif plan zaten bir favoriye bağlıysa doğrudan o favoriyi günceller (aynı ad, aynı favori —
  // sormaya gerek yok). Bağlı değilse aynı adla başka bir favori var mı diye önce sorar (yoksa
  // üzerine yazılacağı için), yoksa doğrudan yeni favori olarak kaydeder ve bağı kurar.
  function handleSaveFavoriteClick() {
    if (activeFavoriteId) {
      saveActivePlanAsFavorite(activePlanName);
      return;
    }

    const exists = favoritePlans.some(
      (favorite) => favorite.name.trim().toLowerCase() === activePlanName.trim().toLowerCase(),
    );
    if (exists) {
      setConfirmingOverwrite(true);
    } else {
      saveActivePlanAsFavorite(activePlanName);
    }
  }

  return (
    <div className="mt-5 grid flex-1 gap-5 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_420px]">
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
                <h2 className="truncate text-xl font-bold">{activePlanName}</h2>
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

          <button
            type="button"
            onClick={handleSaveFavoriteClick}
            aria-label="Save as favorite"
            title="Save as favorite"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground-muted/15 bg-foreground/5 text-foreground-muted transition hover:bg-foreground/10 hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path
                d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:min-h-0 lg:grid-cols-4 lg:grid-rows-2">
          {displayPlan.map((entry, index) => {
            const { total, completed } = getCounts(entry);
            const temporal: Temporal =
              entry.day === todayName ? "today" : index < todayIndex ? "past" : "future";
            const status = getStatus(entry, temporal);
            const isSelected = entry.day === selectedDay;
            const hiddenCount = entry.exercises.length - MAX_VISIBLE_EXERCISES;

            return (
              <div
                key={entry.day}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setSelectedDay(entry.day)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedDay(entry.day);
                  }
                }}
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

                    <div className="mt-1 flex min-h-0 flex-1 flex-col justify-start space-y-0.5 overflow-hidden">
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

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingDay(entry.day);
                      }}
                      aria-label={`Edit workout for ${entry.day}`}
                      className={`mt-1.5 block w-full shrink-0 rounded-lg px-4 py-1.5 text-center text-sm font-semibold leading-tight transition ${getActionButtonClasses(
                        temporal,
                      )}`}
                    >
                      Edit
                    </button>
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

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingDay(entry.day);
                      }}
                      aria-label={`Add workout for ${entry.day}`}
                      className={`mt-1.5 block w-full shrink-0 rounded-lg px-4 py-1.5 text-center text-sm font-semibold leading-tight transition ${getActionButtonClasses(
                        temporal,
                      )}`}
                    >
                      Add Workout
                    </button>
                  </>
                )}
              </div>
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
            {selectedPlan.day === todayName ? "Today" : selectedPlan.day}
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePlanDragEnd}>
            <div className="min-h-0 flex-1 space-y-4 overflow-hidden">
              {selectedGroups.map((group, index) => (
                <div key={group.muscleGroup}>
                  <p
                    className={`border-b border-border/60 pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] ${getMuscleGroupColor(index)}`}
                  >
                    {group.muscleGroup}
                  </p>
                  <SortableContext
                    items={group.exercises.map((exercise) => exercise.name)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="mt-2 space-y-1.5">
                      {group.exercises.map((exercise) => (
                        <SortableRow key={exercise.name} id={exercise.name}>
                          {({ attributes, listeners }) => (
                            <div
                              role={isSelectedLocked ? undefined : "button"}
                              tabIndex={isSelectedLocked ? -1 : 0}
                              aria-pressed={isSelectedLocked ? undefined : exercise.completed}
                              aria-disabled={isSelectedLocked || undefined}
                              onClick={
                                isSelectedLocked
                                  ? undefined
                                  : () => toggleExercise(selectedPlan.day, exercise.name)
                              }
                              onKeyDown={
                                isSelectedLocked
                                  ? undefined
                                  : (event) => {
                                      if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        toggleExercise(selectedPlan.day, exercise.name);
                                      }
                                    }
                              }
                              className={`flex w-full items-center gap-2 rounded-xl bg-surface-raised px-3 py-2 ${surfaceGlowSoft} shadow-md shadow-black/15 ${
                                isSelectedLocked ? "cursor-default opacity-60" : ""
                              }`}
                            >
                              <span
                                {...attributes}
                                {...listeners}
                                onClick={(event) => event.stopPropagation()}
                                className="shrink-0 cursor-grab select-none touch-none text-foreground-muted/40 active:cursor-grabbing"
                                aria-label={`Reorder ${exercise.name}`}
                              >
                                ⠿
                              </span>
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
                            </div>
                          )}
                        </SortableRow>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          </DndContext>
        )}
      </aside>

      {editingDay && (
        <WorkoutEditorModal
          day={plan.find((entry) => entry.day === editingDay) ?? plan[0]}
          onClose={() => setEditingDay(null)}
          onSave={handleSaveWorkout}
          onDelete={handleDeleteWorkout}
        />
      )}

      {confirmingOverwrite && (
        <ConfirmDialog
          title={`Overwrite "${activePlanName}"?`}
          description="A favorite plan with this name already exists. Saving will replace it with your current week."
          confirmLabel="Overwrite"
          onConfirm={() => {
            saveActivePlanAsFavorite(activePlanName);
            setConfirmingOverwrite(false);
          }}
          onCancel={() => setConfirmingOverwrite(false)}
        />
      )}
    </div>
  );
}
