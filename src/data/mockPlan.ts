// Madde 5'te gerçek state (localStorage / backend) ile değişecek: şimdilik sabit mock plan verisi.
export type PlanExercise = {
  name: string;
  sets: string;
  muscleGroup?: string;
  completed: boolean;
};

export type DayPlan = {
  day: string;
  workoutName: string | null;
  isToday: boolean;
  exercises: PlanExercise[];
};

export const mockWeekPlan: DayPlan[] = [
  {
    day: "Monday",
    workoutName: "Chest & Triceps",
    isToday: false,
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
    isToday: false,
    exercises: [
      { name: "Treadmill Run", sets: "20 min", completed: true },
      { name: "Cycling", sets: "15 min", completed: true },
      { name: "Jump Rope", sets: "10 min", completed: true },
    ],
  },
  {
    day: "Wednesday",
    workoutName: null,
    isToday: false,
    exercises: [],
  },
  {
    day: "Thursday",
    workoutName: "Back & Biceps",
    isToday: false,
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
    isToday: false,
    exercises: [],
  },
  {
    day: "Saturday",
    workoutName: "Chest & Triceps",
    isToday: false,
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
    isToday: true,
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
