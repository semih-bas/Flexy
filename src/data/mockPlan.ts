// Haftalık plan verisi artık backend'den geliyor (bkz. src/lib/planSerializer.ts). Bu dosya
// sadece PlanProvider ve dashboard bileşenlerinin paylaştığı ortak tipleri barındırıyor.
export type PlanExercise = {
  name: string;
  sets: string;
  muscleGroup?: string;
  completed: boolean;
};

export type DayPlan = {
  day: string;
  workoutName: string | null;
  exercises: PlanExercise[];
};
