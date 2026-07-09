import type { TemplateCategory, TemplateLevel, WorkoutTemplate } from "@/data/workoutTemplates";
import type { Template, TemplateDay, TemplateExercise } from "@/generated/prisma/client";

type TemplateWithDays = Template & { days: (TemplateDay & { exercises: TemplateExercise[] })[] };

// Prisma'daki ilişkisel satırları (Template -> TemplateDay -> TemplateExercise) frontend'in
// WorkoutTemplate şekline (bkz. src/data/workoutTemplates.ts) çevirir. sortOrder'a göre sıralama
// burada yapılır: satır ekleme sırası Postgres'te garanti değildir.
export function toWorkoutTemplate(row: TemplateWithDays): WorkoutTemplate {
  return {
    id: row.id,
    name: row.name,
    level: row.level as TemplateLevel,
    categories: row.categories as TemplateCategory[],
    highlight: row.highlight,
    description: row.description,
    daysPerWeek: row.daysPerWeek,
    features: row.features,
    days: [...row.days]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((day) => ({
        day: day.day,
        workoutName: day.workoutName,
        exercises: [...day.exercises]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            // Şablon egzersizlerinin muscleGroup'u seed.ts'te her zaman türetilip yazılır (bkz.
            // workoutTemplates.ts'teki ex() helper'ı); DB kolonunun nullable olması sadece
            // esneklik için, boş string pratikte hiç oluşmaz.
            muscleGroup: exercise.muscleGroup ?? '',
          })),
      })),
  };
}
