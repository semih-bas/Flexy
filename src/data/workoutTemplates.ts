import { exercises } from './exercises';

export type TemplateLevel =
  | 'Beginner'
  | 'Beginner to Intermediate'
  | 'Intermediate'
  | 'Advanced';

// Filtre haplarında kullanılan kategori etiketleri. "All" ayrıca UI'da eklenir.
export type TemplateCategory =
  | 'Beginner'
  | 'Intermediate'
  | 'Strength'
  | 'Hypertrophy'
  | 'Home'
  | 'Conditioning';

export type TemplateExercise = {
  name: string;
  sets: string;
  muscleGroup: string;
};

export type TemplateDay = {
  day: string;
  workoutName: string;
  exercises: TemplateExercise[];
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  level: TemplateLevel;
  categories: TemplateCategory[];
  highlight: string;
  description: string;
  daysPerWeek: number;
  features: string[];
  days: TemplateDay[];
};

export const templateCategories: TemplateCategory[] = [
  'Beginner',
  'Intermediate',
  'Strength',
  'Hypertrophy',
  'Home',
  'Conditioning',
];

// muscleGroup, egzersiz adından exercises.ts'teki kategoriye bakarak türetilir: aynı bilgiyi
// iki yerde elle tekrar yazmamak için (türetilebilen veri saklanmaz kuralı).
function muscleGroupOf(name: string): string {
  return exercises.find((exercise) => exercise.name === name)?.category ?? 'General';
}

function ex(name: string, sets: string): TemplateExercise {
  return { name, sets, muscleGroup: muscleGroupOf(name) };
}

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'full-body-foundations',
    name: 'Full Body Foundations',
    level: 'Beginner',
    categories: ['Beginner'],
    highlight: 'GREAT STARTING POINT',
    description:
      'A beginner-friendly full body plan that builds a base of strength across all major muscle groups with plenty of recovery between sessions.',
    daysPerWeek: 3,
    features: ['Full body every session', 'Beginner friendly load'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Full Body A',
        exercises: [
          ex('Back Squat', '3x8-10'),
          ex('Barbell Bench Press', '3x8-10'),
          ex('Bent Over Row', '3x8-10'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Full Body B',
        exercises: [
          ex('Romanian Deadlift', '3x8-10'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Dead Bug', '3x10-12 per side'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Full Body C',
        exercises: [
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Seated Cable Row', '3x10-12'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
    ],
  },
  {
    id: 'upper-lower-split',
    name: 'Upper Lower Split',
    level: 'Intermediate',
    categories: ['Intermediate'],
    highlight: 'BALANCED MUSCLE AND STRENGTH DEVELOPMENT',
    description:
      'A balanced four-day split that alternates upper and lower body sessions for productive volume and reliable recovery.',
    daysPerWeek: 4,
    features: ['Great weekly frequency', 'Clear recovery between sessions'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Upper A',
        exercises: [
          ex('Barbell Bench Press', '4x8-10'),
          ex('Bent Over Row', '4x8-10'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Barbell Curl', '3x10-12'),
          ex('Rope Pushdown', '3x12-15'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Lower A',
        exercises: [
          ex('Back Squat', '4x6-8'),
          ex('Romanian Deadlift', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Upper B',
        exercises: [
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Dumbbell Lateral Raise', '3x12-15'),
          ex('Hammer Curl', '3x12-15'),
          ex('Skull Crusher', '3x10-12'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Lower B',
        exercises: [
          ex('Romanian Deadlift', '4x8-10'),
          ex('Back Squat', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
    ],
  },
  {
    id: 'hypertrophy-push-pull-legs',
    name: 'Hypertrophy Push Pull Legs',
    level: 'Intermediate',
    categories: ['Intermediate', 'Hypertrophy'],
    highlight: 'BEST FOR MUSCLE GROWTH',
    description:
      'A classic high-frequency push, pull, legs plan built around repeatable volume, balanced movement patterns, and focused muscle-group work.',
    daysPerWeek: 6,
    features: ['High weekly training frequency', 'Focused volume for each muscle group'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Push A',
        exercises: [
          ex('Barbell Bench Press', '4x8-10'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Dumbbell Lateral Raise', '3x12-15'),
          ex('Rope Pushdown', '3x12-15'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Pull A',
        exercises: [
          ex('Bent Over Row', '4x8-10'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Seated Cable Row', '3x10-12'),
          ex('Barbell Curl', '3x10-12'),
          ex('Hammer Curl', '3x12-15'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Legs A',
        exercises: [
          ex('Back Squat', '4x6-8'),
          ex('Romanian Deadlift', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Push B',
        exercises: [
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Barbell Bench Press', '3x8-10'),
          ex('Front Raise', '3x12-15'),
          ex('Skull Crusher', '3x10-12'),
        ],
      },
      {
        day: 'Day 5',
        workoutName: 'Pull B',
        exercises: [
          ex('Seated Cable Row', '3x10-12'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Bent Over Row', '3x8-10'),
          ex('Preacher Curl', '3x10-12'),
        ],
      },
      {
        day: 'Day 6',
        workoutName: 'Legs B',
        exercises: [
          ex('Romanian Deadlift', '4x8-10'),
          ex('Back Squat', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
    ],
  },
  {
    id: 'strength-foundation',
    name: 'Strength Foundation',
    level: 'Intermediate',
    categories: ['Intermediate', 'Strength'],
    highlight: 'STRENGTH FOCUSED',
    description:
      'A strength-focused program built around heavy compounds, controlled accessories, and enough volume to reinforce good technique.',
    daysPerWeek: 4,
    features: ['Emphasizes progressive overload', 'Improves compound lift skill'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Squat Day',
        exercises: [
          ex('Back Squat', '5x5'),
          ex('Romanian Deadlift', '3x6-8'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Plank', '3x45 sec'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Bench Day',
        exercises: [
          ex('Barbell Bench Press', '5x5'),
          ex('Incline Dumbbell Press', '3x8-10'),
          ex('Standing Overhead Press', '3x6-8'),
          ex('Rope Pushdown', '3x10-12'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Deadlift Day',
        exercises: [
          ex('Romanian Deadlift', '5x5'),
          ex('Bent Over Row', '4x6-8'),
          ex('Lat Pulldown', '3x8-10'),
          ex('Hollow Hold', '3x30 sec'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Press Day',
        exercises: [
          ex('Standing Overhead Press', '5x5'),
          ex('Barbell Bench Press', '3x8-10'),
          ex('Seated Cable Row', '3x8-10'),
          ex('Barbell Curl', '3x8-10'),
        ],
      },
    ],
  },
  {
    id: 'fat-loss-conditioning',
    name: 'Fat Loss Conditioning',
    level: 'Beginner to Intermediate',
    categories: ['Conditioning'],
    highlight: 'CONDITIONING FOCUSED',
    description:
      'A conditioning-forward plan that combines full body resistance training with cardio days to support fat loss and preserve strength while dieting.',
    daysPerWeek: 4,
    features: ['Higher weekly activity', 'Maintains strength while dieting'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Full Body Strength A',
        exercises: [
          ex('Back Squat', '3x8-10'),
          ex('Barbell Bench Press', '3x8-10'),
          ex('Bent Over Row', '3x8-10'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Conditioning A',
        exercises: [
          ex('Jump Rope', '1x10 min'),
          ex('Rowing Machine', '1x15 min'),
          ex('Battle Rope Slams', '4x30 sec'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Full Body Strength B',
        exercises: [
          ex('Romanian Deadlift', '3x8-10'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Dead Bug', '3x10-12 per side'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Conditioning B',
        exercises: [
          ex('Battle Rope Slams', '4x30 sec'),
          ex('Jump Rope', '1x10 min'),
          ex('Mobility Flow', '1x10 min'),
        ],
      },
    ],
  },
  {
    id: 'balanced-fitness-plan',
    name: 'Balanced Fitness Plan',
    level: 'Beginner to Intermediate',
    categories: ['Beginner', 'Intermediate'],
    highlight: 'BALANCED CHOICE',
    description:
      'A well-rounded plan that mixes strength, mobility, and light conditioning for steady, sustainable progress without overloading your week.',
    daysPerWeek: 4,
    features: ['Mixes strength and mobility', 'Sustainable weekly load'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Upper Strength',
        exercises: [
          ex('Barbell Bench Press', '3x8-10'),
          ex('Bent Over Row', '3x8-10'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Hammer Curl', '3x12-15'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Lower Strength',
        exercises: [
          ex('Back Squat', '3x8-10'),
          ex('Romanian Deadlift', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Mobility & Core',
        exercises: [
          ex('Mobility Flow', '1x10 min'),
          ex('Dead Bug', '3x10-12 per side'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Full Body Conditioning',
        exercises: [
          ex('Jump Rope', '1x10 min'),
          ex('Rowing Machine', '1x15 min'),
          ex('Battle Rope Slams', '4x30 sec'),
        ],
      },
    ],
  },
  {
    id: 'hypertrophy-upper-lower',
    name: 'Hypertrophy Upper Lower',
    level: 'Intermediate',
    categories: ['Intermediate', 'Hypertrophy'],
    highlight: 'BEST FOR MUSCLE GROWTH',
    description:
      'A hypertrophy-oriented upper/lower split that emphasizes controlled volume and isolation work to maximize muscle growth stimulus.',
    daysPerWeek: 4,
    features: ['High per-muscle volume', 'Isolation-focused accessories'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Upper A',
        exercises: [
          ex('Barbell Bench Press', '4x8-10'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Bent Over Row', '3x8-10'),
          ex('Dumbbell Lateral Raise', '3x12-15'),
          ex('Barbell Curl', '3x10-12'),
          ex('Rope Pushdown', '3x12-15'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Lower A',
        exercises: [
          ex('Back Squat', '4x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Romanian Deadlift', '3x8-10'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Upper B',
        exercises: [
          ex('Seated Cable Row', '3x10-12'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Front Raise', '3x12-15'),
          ex('Hammer Curl', '3x12-15'),
          ex('Skull Crusher', '3x10-12'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Lower B',
        exercises: [
          ex('Romanian Deadlift', '4x8-10'),
          ex('Back Squat', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Dead Bug', '3x10-12 per side'),
        ],
      },
    ],
  },
  {
    id: 'classic-bodybuilding-split',
    name: 'Classic Bodybuilding Split',
    level: 'Intermediate',
    categories: ['Intermediate', 'Hypertrophy'],
    highlight: 'BEST FOR MUSCLE GROWTH',
    description:
      'A traditional bro-split that dedicates a full session to each major muscle group for focused volume and a classic bodybuilding feel.',
    daysPerWeek: 5,
    features: ['One muscle group per session', 'High exercise variety'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Chest',
        exercises: [
          ex('Barbell Bench Press', '4x8-10'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Push Up', '3x12-15'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Back',
        exercises: [
          ex('Lat Pulldown', '4x10-12'),
          ex('Bent Over Row', '4x8-10'),
          ex('Seated Cable Row', '3x10-12'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Shoulders',
        exercises: [
          ex('Standing Overhead Press', '4x8-10'),
          ex('Dumbbell Lateral Raise', '3x12-15'),
          ex('Front Raise', '3x12-15'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Arms',
        exercises: [
          ex('Barbell Curl', '3x10-12'),
          ex('Hammer Curl', '3x12-15'),
          ex('Preacher Curl', '3x10-12'),
          ex('Skull Crusher', '3x10-12'),
          ex('Rope Pushdown', '3x12-15'),
        ],
      },
      {
        day: 'Day 5',
        workoutName: 'Legs',
        exercises: [
          ex('Back Squat', '4x8-10'),
          ex('Romanian Deadlift', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
        ],
      },
    ],
  },
  {
    id: 'powerbuilding',
    name: 'Powerbuilding',
    level: 'Intermediate',
    categories: ['Intermediate', 'Strength', 'Hypertrophy'],
    highlight: 'BEST FOR MUSCLE GROWTH',
    description:
      'Combines heavy compound strength work with bodybuilding-style accessory volume for a plan that builds both size and raw strength.',
    daysPerWeek: 4,
    features: ['Heavy compounds plus accessories', 'Strength and size in one plan'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Squat + Legs',
        exercises: [
          ex('Back Squat', '5x5'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Romanian Deadlift', '3x8-10'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Bench + Push',
        exercises: [
          ex('Barbell Bench Press', '5x5'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Rope Pushdown', '3x12-15'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Deadlift + Pull',
        exercises: [
          ex('Romanian Deadlift', '5x5'),
          ex('Bent Over Row', '4x8-10'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Barbell Curl', '3x10-12'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Overhead + Arms',
        exercises: [
          ex('Standing Overhead Press', '5x5'),
          ex('Seated Cable Row', '3x10-12'),
          ex('Hammer Curl', '3x10-12'),
          ex('Skull Crusher', '3x10-12'),
        ],
      },
    ],
  },
  {
    id: 'home-bodyweight-basics',
    name: 'Home Bodyweight Basics',
    level: 'Beginner',
    categories: ['Beginner', 'Home'],
    highlight: 'NO EQUIPMENT NEEDED',
    description:
      'A no-equipment plan built entirely from bodyweight movements, perfect for training at home without a gym.',
    daysPerWeek: 3,
    features: ['Zero equipment required', 'Great for small spaces'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Full Body A',
        exercises: [
          ex('Push Up', '3x12-15'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Full Body B',
        exercises: [
          ex('Triceps Dip', '3xAMRAP'),
          ex('Dead Bug', '3x10-12 per side'),
          ex('Mobility Flow', '1x10 min'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Full Body C',
        exercises: [
          ex('Push Up', '3x12-15'),
          ex('Hollow Hold', '3x20-30 sec'),
          ex('Walking Lunge', '3x10-12 per leg'),
        ],
      },
    ],
  },
  {
    id: 'home-hiit-burner',
    name: 'Home HIIT Burner',
    level: 'Beginner to Intermediate',
    categories: ['Home', 'Conditioning'],
    highlight: 'CONDITIONING FOCUSED',
    description:
      'A high-energy home conditioning plan that mixes short cardio bursts with bodyweight strength work to keep sessions fast and effective.',
    daysPerWeek: 4,
    features: ['Short, intense sessions', 'Minimal equipment required'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Burner A',
        exercises: [
          ex('Jump Rope', '1x10 min'),
          ex('Push Up', '3x12-15'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Burner B',
        exercises: [
          ex('Battle Rope Slams', '4x30 sec'),
          ex('Walking Lunge', '3x10-12 per leg'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Recovery Flow',
        exercises: [
          ex('Mobility Flow', '1x10 min'),
          ex('Dead Bug', '3x10-12 per side'),
          ex('Push Up', '3x12-15'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Burner C',
        exercises: [
          ex('Jump Rope', '1x10 min'),
          ex('Hollow Hold', '3x20-30 sec'),
          ex('Triceps Dip', '3xAMRAP'),
        ],
      },
    ],
  },
  {
    id: 'advanced-powerlifting-prep',
    name: 'Advanced Powerlifting Prep',
    level: 'Advanced',
    categories: ['Strength'],
    highlight: 'MAXIMAL STRENGTH FOCUS',
    description:
      'An advanced strength cycle centered on the big compound lifts with heavy top sets and targeted accessory work to push maximal strength.',
    daysPerWeek: 4,
    features: ['Heavy top sets', 'Built for experienced lifters'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Squat',
        exercises: [
          ex('Back Squat', '5x3'),
          ex('Romanian Deadlift', '3x6-8'),
          ex('Walking Lunge', '3x10-12 per leg'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Bench',
        exercises: [
          ex('Barbell Bench Press', '5x3'),
          ex('Incline Dumbbell Press', '3x8-10'),
          ex('Rope Pushdown', '3x10-12'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Deadlift',
        exercises: [
          ex('Romanian Deadlift', '5x3'),
          ex('Bent Over Row', '4x6-8'),
          ex('Plank', '3x45 sec'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Press',
        exercises: [
          ex('Standing Overhead Press', '5x3'),
          ex('Seated Cable Row', '3x8-10'),
          ex('Barbell Curl', '3x8-10'),
        ],
      },
    ],
  },
  {
    id: 'core-conditioning-circuit',
    name: 'Core & Conditioning Circuit',
    level: 'Beginner',
    categories: ['Beginner', 'Conditioning', 'Home'],
    highlight: 'BUILD A RESILIENT CORE',
    description:
      'A light, approachable plan that pairs core stability work with easy conditioning to build a resilient midsection and steady endurance.',
    daysPerWeek: 3,
    features: ['Joint friendly movements', 'Great for active recovery weeks'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Core & Cardio A',
        exercises: [
          ex('Plank', '3x30-45 sec'),
          ex('Dead Bug', '3x10-12 per side'),
          ex('Jump Rope', '1x10 min'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Core & Cardio B',
        exercises: [
          ex('Hollow Hold', '3x20-30 sec'),
          ex('Mobility Flow', '1x10 min'),
          ex('Rowing Machine', '1x15 min'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Core & Cardio C',
        exercises: [
          ex('Plank', '3x30-45 sec'),
          ex('Dead Bug', '3x10-12 per side'),
          ex('Battle Rope Slams', '3x30 sec'),
        ],
      },
    ],
  },
  {
    id: 'full-body-strength-3x',
    name: 'Full Body Strength 3x',
    level: 'Beginner',
    categories: ['Beginner', 'Strength'],
    highlight: 'SIMPLE, EFFECTIVE STRENGTH BUILDING',
    description:
      'A simple three-day full body strength plan built around the core compound lifts, ideal for building a strength base without a busy schedule.',
    daysPerWeek: 3,
    features: ['Only three sessions a week', 'Focused on the big compound lifts'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Full Body A',
        exercises: [
          ex('Back Squat', '4x6-8'),
          ex('Barbell Bench Press', '4x8-10'),
          ex('Bent Over Row', '4x8-10'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Full Body B',
        exercises: [
          ex('Romanian Deadlift', '4x8-10'),
          ex('Standing Overhead Press', '4x8-10'),
          ex('Lat Pulldown', '3x10-12'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Full Body C',
        exercises: [
          ex('Back Squat', '4x6-8'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Seated Cable Row', '3x10-12'),
        ],
      },
    ],
  },
  {
    id: 'advanced-push-pull-legs',
    name: 'Advanced Push Pull Legs',
    level: 'Advanced',
    categories: ['Hypertrophy'],
    highlight: 'BEST FOR MUSCLE GROWTH',
    description:
      'A high-volume push, pull, legs cycle for experienced lifters looking to maximize weekly training frequency and muscle growth.',
    daysPerWeek: 6,
    features: ['High weekly volume', 'For experienced trainees'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Push A',
        exercises: [
          ex('Barbell Bench Press', '4x6-8'),
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Standing Overhead Press', '3x8-10'),
          ex('Dumbbell Lateral Raise', '3x12-15'),
          ex('Skull Crusher', '3x10-12'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Pull A',
        exercises: [
          ex('Bent Over Row', '4x6-8'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Seated Cable Row', '3x10-12'),
          ex('Barbell Curl', '3x10-12'),
          ex('Preacher Curl', '3x10-12'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Legs A',
        exercises: [
          ex('Back Squat', '4x6-8'),
          ex('Romanian Deadlift', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
      {
        day: 'Day 4',
        workoutName: 'Push B',
        exercises: [
          ex('Incline Dumbbell Press', '4x8-10'),
          ex('Barbell Bench Press', '3x8-10'),
          ex('Front Raise', '3x12-15'),
          ex('Rope Pushdown', '3x12-15'),
        ],
      },
      {
        day: 'Day 5',
        workoutName: 'Pull B',
        exercises: [
          ex('Seated Cable Row', '4x8-10'),
          ex('Lat Pulldown', '3x10-12'),
          ex('Hammer Curl', '3x12-15'),
        ],
      },
      {
        day: 'Day 6',
        workoutName: 'Legs B',
        exercises: [
          ex('Romanian Deadlift', '4x8-10'),
          ex('Back Squat', '3x8-10'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Plank', '3x45 sec'),
        ],
      },
    ],
  },
  {
    id: 'beginner-gym-orientation',
    name: 'Beginner Gym Orientation',
    level: 'Beginner',
    categories: ['Beginner'],
    highlight: 'PERFECT FIRST PROGRAM',
    description:
      'A gentle introduction to gym training that teaches the fundamental movement patterns with manageable volume and plenty of recovery.',
    daysPerWeek: 3,
    features: ['Teaches core movement patterns', 'Low weekly volume to start'],
    days: [
      {
        day: 'Day 1',
        workoutName: 'Orientation A',
        exercises: [
          ex('Push Up', '3x12-15'),
          ex('Back Squat', '3x8-10'),
          ex('Plank', '3x30-45 sec'),
        ],
      },
      {
        day: 'Day 2',
        workoutName: 'Orientation B',
        exercises: [
          ex('Lat Pulldown', '3x10-12'),
          ex('Walking Lunge', '3x10-12 per leg'),
          ex('Dead Bug', '3x10-12 per side'),
        ],
      },
      {
        day: 'Day 3',
        workoutName: 'Orientation C',
        exercises: [
          ex('Incline Dumbbell Press', '3x10-12'),
          ex('Seated Cable Row', '3x10-12'),
          ex('Hollow Hold', '3x20-30 sec'),
        ],
      },
    ],
  },
];
