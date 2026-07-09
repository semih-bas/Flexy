import { prisma } from "@/lib/prisma";
import type { Plan, PlanDay, PlanExercise } from "@/generated/prisma/client";

export type DayPlanInput = {
  day: string;
  workoutName: string | null;
  exercises: {
    name: string;
    sets: string;
    muscleGroup?: string;
    completed?: boolean;
  }[];
};

type PlanWithDays = Plan & { days: (PlanDay & { exercises: PlanExercise[] })[] };

// DB satırlarını frontend'in DayPlan[] şekline (bkz. src/data/mockPlan.ts) çevirir. sortOrder'a
// göre sıralama burada yapılır: satır ekleme sırası Postgres'te garanti değildir.
export function serializePlan(plan: PlanWithDays) {
  return {
    id: plan.id,
    name: plan.name,
    linkedFavoriteId: plan.linkedFavoriteId,
    savedAt: plan.updatedAt.toISOString(),
    days: [...plan.days]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((day) => ({
        day: day.day,
        workoutName: day.workoutName,
        exercises: [...day.exercises]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            muscleGroup: exercise.muscleGroup ?? undefined,
            completed: exercise.completed,
          })),
      })),
  };
}

// Bir planın günlerini/egzersizlerini tamamen değiştirir: önce mevcut günleri siler (cascade ile
// egzersizleri de gider), sonra verilen günleri yeniden oluşturur. PUT /api/plan (client'tan gelen
// tam plan) ve favori uygulama/kaydetme akışlarının hepsi bunu kullanır.
export async function replacePlanDays(planId: string, days: DayPlanInput[]) {
  await prisma.planDay.deleteMany({ where: { planId } });
  await prisma.plan.update({
    where: { id: planId },
    data: {
      days: {
        create: days.map((day, dayIndex) => ({
          day: day.day,
          workoutName: day.workoutName,
          sortOrder: dayIndex,
          exercises: {
            create: day.exercises.map((exercise, exerciseIndex) => ({
              name: exercise.name,
              sets: exercise.sets,
              muscleGroup: exercise.muscleGroup ?? null,
              completed: exercise.completed ?? false,
              sortOrder: exerciseIndex,
            })),
          },
        })),
      },
    },
  });
}

function isPlanExerciseInput(value: unknown): value is DayPlanInput["exercises"][number] {
  if (!value || typeof value !== "object") return false;
  const exercise = value as Record<string, unknown>;
  return (
    typeof exercise.name === "string" &&
    typeof exercise.sets === "string" &&
    (exercise.muscleGroup === undefined || typeof exercise.muscleGroup === "string") &&
    (exercise.completed === undefined || typeof exercise.completed === "boolean")
  );
}

function isDayPlanInput(value: unknown): value is DayPlanInput {
  if (!value || typeof value !== "object") return false;
  const day = value as Record<string, unknown>;
  return (
    typeof day.day === "string" &&
    (day.workoutName === null || typeof day.workoutName === "string") &&
    Array.isArray(day.exercises) &&
    day.exercises.every(isPlanExerciseInput)
  );
}

// Client'tan gelen "days" gövdesi güvenilmez: DB'ye yazmadan önce şeklini doğrular.
export function isValidDaysPayload(value: unknown): value is DayPlanInput[] {
  return Array.isArray(value) && value.every(isDayPlanInput);
}
