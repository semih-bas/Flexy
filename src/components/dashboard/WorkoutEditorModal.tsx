"use client";

import { useMemo, useState } from "react";
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
import { exercises, exerciseCategories, type Exercise, type ExerciseCategory } from "@/data/exercises";
import { getMuscleGroupColor } from "@/lib/muscleGroupColor";
import { ctaButtonGlow } from "@/lib/surfaceStyles";
import SortableRow from "./SortableRow";

// Modal içinde düzenlenen egzersiz: sets/reps ayrı alanlar (kullanıcı arayüzü gereği),
// kaydederken PlanExercise.sets ("4x8-10" gibi) formatına birleştirilir.
type SessionExercise = {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  completed: boolean;
};

// PlanExercise.sets içindeki birleşik string'i ("4x8-10", "3xAMRAP", "20 min") sets/reps'e ayırır.
function parseSetsString(value: string): { sets: number; reps: string } {
  const match = value.match(/^(\d+)\s*x\s*(.+)$/i);
  if (match) {
    return { sets: Number(match[1]), reps: match[2] };
  }
  return { sets: 1, reps: value };
}

function formatSetsString(sets: number, reps: string): string {
  return `${sets}x${reps}`;
}

function groupSessionByMuscle(list: SessionExercise[]) {
  const groups: { muscleGroup: string; exercises: SessionExercise[] }[] = [];

  for (const exercise of list) {
    const existing = groups.find((group) => group.muscleGroup === exercise.muscleGroup);
    if (existing) {
      existing.exercises.push(exercise);
    } else {
      groups.push({ muscleGroup: exercise.muscleGroup, exercises: [exercise] });
    }
  }

  return groups;
}

// Workout adı seçilen kas gruplarından türetilir: "Chest & Triceps" gibi.
function buildWorkoutName(list: SessionExercise[]): string {
  const seenGroups: string[] = [];
  for (const exercise of list) {
    if (!seenGroups.includes(exercise.muscleGroup)) {
      seenGroups.push(exercise.muscleGroup);
    }
  }

  if (seenGroups.length === 0) return "";
  if (seenGroups.length === 1) return seenGroups[0];
  if (seenGroups.length === 2) return `${seenGroups[0]} & ${seenGroups[1]}`;
  return `${seenGroups.slice(0, -1).join(", ")} & ${seenGroups[seenGroups.length - 1]}`;
}

type WorkoutEditorModalProps = {
  day: DayPlan;
  onClose: () => void;
  onSave: (day: string, workoutName: string, exercises: PlanExercise[]) => void;
  onDelete: (day: string) => void;
};

export default function WorkoutEditorModal({ day, onClose, onSave, onDelete }: WorkoutEditorModalProps) {
  const isEditMode = day.workoutName !== null;

  // Edit modunda sol paneldeki kas grubu seçimleri, günün mevcut egzersizlerindeki muscleGroup
  // değerlerinden türetilir (böylece kayıtlı bir workout açılınca ilgili gruplar zaten seçili gelir).
  const [selectedCategories, setSelectedCategories] = useState<ExerciseCategory[]>(() => {
    const groups = new Set<ExerciseCategory>();
    for (const exercise of day.exercises) {
      if (exercise.muscleGroup && (exerciseCategories as string[]).includes(exercise.muscleGroup)) {
        groups.add(exercise.muscleGroup as ExerciseCategory);
      }
    }
    return Array.from(groups);
  });
  const [search, setSearch] = useState("");
  const [session, setSession] = useState<SessionExercise[]>(() =>
    day.exercises.map((exercise) => {
      const { sets, reps } = parseSetsString(exercise.sets);
      return {
        name: exercise.name,
        muscleGroup: exercise.muscleGroup ?? "General",
        sets,
        reps,
        completed: exercise.completed,
      };
    }),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function toggleCategory(category: ExerciseCategory) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((entry) => entry !== category) : [...prev, category],
    );
  }

  // Seçili tüm kas gruplarının egzersizleri, sağdaki Your Session gibi grup başlıkları altında listelenir.
  const browseGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    return exerciseCategories
      .filter((category) => selectedCategories.includes(category))
      .map((category) => ({
        category,
        items: exercises.filter(
          (exercise) =>
            exercise.category === category &&
            (query === "" || exercise.name.toLowerCase().includes(query)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [selectedCategories, search]);

  const isInSession = (name: string) => session.some((exercise) => exercise.name === name);

  function addExercise(exercise: Exercise) {
    if (isInSession(exercise.name)) return;
    setSession((prev) => [
      ...prev,
      {
        name: exercise.name,
        muscleGroup: exercise.category,
        sets: exercise.defaultSets,
        reps: exercise.defaultReps,
        completed: false,
      },
    ]);
  }

  function removeExercise(name: string) {
    setSession((prev) => prev.filter((exercise) => exercise.name !== name));
  }

  function updateExercise(name: string, patch: Partial<Pick<SessionExercise, "sets" | "reps">>) {
    setSession((prev) =>
      prev.map((exercise) => (exercise.name === name ? { ...exercise, ...patch } : exercise)),
    );
  }

  const groups = groupSessionByMuscle(session);
  const canSave = session.length > 0;

  // Sürükleme sadece aynı kas grubu içinde geçerli: gruplar arası taşıma yok sayılır.
  function handleSessionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = session.find((exercise) => exercise.name === active.id);
    const overItem = session.find((exercise) => exercise.name === over.id);
    if (!activeItem || !overItem || activeItem.muscleGroup !== overItem.muscleGroup) return;

    const currentGroups = groupSessionByMuscle(session);
    const groupIndex = currentGroups.findIndex((group) => group.muscleGroup === activeItem.muscleGroup);
    const items = currentGroups[groupIndex].exercises;
    const oldIndex = items.findIndex((exercise) => exercise.name === active.id);
    const newIndex = items.findIndex((exercise) => exercise.name === over.id);
    currentGroups[groupIndex] = { ...currentGroups[groupIndex], exercises: arrayMove(items, oldIndex, newIndex) };

    setSession(currentGroups.flatMap((group) => group.exercises));
  }

  function handleSave() {
    if (!canSave) return;
    const planExercises: PlanExercise[] = session.map((exercise) => ({
      name: exercise.name,
      sets: formatSetsString(exercise.sets, exercise.reps),
      muscleGroup: exercise.muscleGroup,
      completed: exercise.completed,
    }));
    onSave(day.day, buildWorkoutName(session), planExercises);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-2xl shadow-black/40">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">
            {isEditMode ? `Edit Workout: ${day.day}` : `Add Workout: ${day.day}`}
          </h2>
          <div className="flex items-center gap-2">
            {isEditMode && (
              <button
                type="button"
                onClick={() => onDelete(day.day)}
                className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/20"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className={`rounded-xl px-4 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${ctaButtonGlow}`}
            >
              Save Workout
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground-muted/15 bg-foreground/5 text-foreground transition hover:bg-foreground/10"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="themed-scrollbar grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
          {/* SOL SÜTUN — Choose Exercises */}
          <div className="themed-scrollbar flex min-h-0 flex-col border-b border-border p-5 md:overflow-y-auto md:border-b-0 md:border-r">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Choose Exercises</p>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {exerciseCategories.map((category) => {
                const isActive = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => toggleCategory(category)}
                    className={`rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                      isActive
                        ? "bg-brand text-white shadow-md shadow-brand/25"
                        : "border border-border text-foreground-muted hover:border-brand/40 hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search exercises..."
              aria-label="Search exercises"
              className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-brand/50"
            />

            <div className="themed-scrollbar mt-3 min-h-0 flex-1 space-y-4 md:overflow-y-auto">
              {selectedCategories.length === 0 ? (
                <p className="mt-6 text-center text-sm text-foreground-muted">
                  Select a muscle group to browse exercises.
                </p>
              ) : browseGroups.length === 0 ? (
                <p className="mt-6 text-center text-sm text-foreground-muted">No exercises found.</p>
              ) : (
                browseGroups.map((group, index) => (
                  <div key={group.category}>
                    <p
                      className={`border-b border-border/60 pb-1.5 text-[11px] font-bold uppercase tracking-[0.25em] ${getMuscleGroupColor(index)}`}
                    >
                      {group.category}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {group.items.map((exercise) => {
                        const added = isInSession(exercise.name);
                        return (
                          <div
                            key={exercise.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-foreground/[0.06] bg-surface-raised px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{exercise.name}</p>
                              <p className="mt-0.5 text-[11px] text-foreground-muted">
                                {exercise.category} · {exercise.defaultSets}x{exercise.defaultReps}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addExercise(exercise)}
                              disabled={added}
                              aria-label={added ? `${exercise.name} already added` : `Add ${exercise.name}`}
                              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                                added
                                  ? "bg-success/20 text-success"
                                  : "bg-brand text-white shadow-sm shadow-brand/30 hover:bg-brand/90"
                              }`}
                            >
                              {added ? (
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SAĞ SÜTUN — Your Session */}
          <div className="themed-scrollbar flex min-h-0 flex-col items-stretch justify-start p-5 md:overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Your Session</p>

            {session.length === 0 ? (
              <p className="mt-6 text-center text-sm text-foreground-muted">No exercises selected yet.</p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSessionDragEnd}>
                <div className="mt-3 flex min-h-0 flex-1 flex-col items-stretch justify-start space-y-4">
                  {groups.map((group, index) => (
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
                                <div className="flex items-center gap-2 rounded-xl border border-foreground/[0.06] bg-surface-raised px-2 py-2">
                                  <span
                                    {...attributes}
                                    {...listeners}
                                    className="shrink-0 cursor-grab select-none touch-none text-foreground-muted/40 active:cursor-grabbing"
                                    aria-label={`Reorder ${exercise.name}`}
                                  >
                                    ⠿
                                  </span>
                                  <span className="min-w-0 flex-1 truncate text-sm">{exercise.name}</span>
                                  <label className="flex shrink-0 items-center gap-1">
                                    <span className="text-[10px] font-semibold text-foreground-muted">Sets</span>
                                    <input
                                      type="number"
                                      min={1}
                                      value={exercise.sets}
                                      onChange={(event) =>
                                        updateExercise(exercise.name, {
                                          sets: Math.max(1, Number(event.target.value) || 1),
                                        })
                                      }
                                      aria-label={`${exercise.name} sets`}
                                      className="w-12 rounded-lg border border-border bg-background px-1.5 py-1 text-center text-xs text-foreground outline-none focus:border-brand/50"
                                    />
                                  </label>
                                  <label className="flex shrink-0 items-center gap-1">
                                    <span className="text-[10px] font-semibold text-foreground-muted">Reps</span>
                                    <input
                                      type="text"
                                      value={exercise.reps}
                                      onChange={(event) => updateExercise(exercise.name, { reps: event.target.value })}
                                      aria-label={`${exercise.name} reps`}
                                      className="w-16 rounded-lg border border-border bg-background px-1.5 py-1 text-center text-xs text-foreground outline-none focus:border-brand/50"
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => removeExercise(exercise.name)}
                                    aria-label={`Remove ${exercise.name}`}
                                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-foreground-muted transition hover:bg-danger/10 hover:text-danger"
                                  >
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                                    </svg>
                                  </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
