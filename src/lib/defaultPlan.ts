import { mockWeekPlan } from "@/data/mockPlan";

// Yeni kayıt olan kullanıcının aktif planı bu örnek haftayla başlar (eski mockPlan.ts verisi) —
// tamamen boş bir haftadansa, uygulamanın nasıl kullanılacağını gösteren dolu bir örnek daha iyi
// bir ilk deneyim. mockPlan.ts kendisi artık sadece bu varsayılanın kaynağı olarak kullanılıyor.
export function buildDefaultPlanDays() {
  return mockWeekPlan.map((day, dayIndex) => ({
    day: day.day,
    workoutName: day.workoutName,
    sortOrder: dayIndex,
    exercises: {
      create: day.exercises.map((exercise, exerciseIndex) => ({
        name: exercise.name,
        sets: exercise.sets,
        muscleGroup: exercise.muscleGroup ?? null,
        completed: exercise.completed,
        sortOrder: exerciseIndex,
      })),
    },
  }));
}
