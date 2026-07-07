// Madde 5'te gerçek state (localStorage / backend) ile değişecek: şimdilik sabit mock plan verisi.
// "Bugün" hangi gün olduğu burada saklanmaz: türetilebilen veri saklanmaz kuralı gereği,
// gerçek tarihten hesaplanır (bkz. WeeklyPlanBoard.tsx'teki getTodayDayName).
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

export const mockWeekPlan: DayPlan[] = [
  {
    day: "Monday",
    workoutName: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: "4x8-10", completed: true },
      { name: "Incline Dumbbell Press", sets: "3x10-12", completed: true },
      { name: "Cable Fly", sets: "3x12-15", completed: true },
      { name: "Triceps Pushdown", sets: "3x12-15", completed: true },
      { name: "Overhead Triceps Extension", sets: "3x10-12", completed: true },
      { name: "Dips", sets: "3xAMRAP", completed: true },
    ],
  },
  {
    day: "Tuesday",
    workoutName: "Cardio",
    exercises: [
      { name: "Treadmill Run", sets: "20 min", completed: true },
      { name: "Cycling", sets: "15 min", completed: true },
      { name: "Jump Rope", sets: "10 min", completed: true },
    ],
  },
  {
    day: "Wednesday",
    workoutName: null,
    exercises: [],
  },
  {
    day: "Thursday",
    workoutName: "Back & Biceps",
    exercises: [
      { name: "Deadlift", sets: "4x6-8", completed: true },
      { name: "Barbell Row", sets: "4x8-10", completed: true },
      { name: "Lat Pulldown", sets: "3x10-12", completed: true },
      { name: "Barbell Curl", sets: "3x10-12", completed: true },
      { name: "Hammer Curl", sets: "3x12-15", completed: true },
      { name: "Preacher Curl", sets: "3x12-15", completed: true },
    ],
  },
  {
    day: "Friday",
    workoutName: null,
    exercises: [],
  },
  {
    day: "Saturday",
    workoutName: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: "4x8-10", completed: true },
      { name: "Incline Dumbbell Press", sets: "3x10-12", completed: true },
      { name: "Cable Fly", sets: "3x12-15", completed: true },
      { name: "Triceps Pushdown", sets: "3x12-15", completed: true },
      { name: "Overhead Triceps Extension", sets: "3x10-12", completed: true },
      { name: "Dips", sets: "3xAMRAP", completed: true },
      { name: "Chest Press Machine", sets: "3x10-12", completed: false },
    ],
  },
  {
    day: "Sunday",
    workoutName: "Back & Biceps",
    exercises: [
      { name: "Deadlift", sets: "4x6-8", muscleGroup: "Back", completed: true },
      { name: "Barbell Row", sets: "4x8-10", muscleGroup: "Back", completed: true },
      { name: "Lat Pulldown", sets: "3x10-12", muscleGroup: "Back", completed: false },
      { name: "Barbell Curl", sets: "3x10-12", muscleGroup: "Biceps", completed: false },
      { name: "Hammer Curl", sets: "3x12-15", muscleGroup: "Biceps", completed: false },
      { name: "Preacher Curl", sets: "3x12-15", muscleGroup: "Biceps", completed: false },
    ],
  },
];
