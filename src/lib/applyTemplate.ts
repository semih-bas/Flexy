import type { DayPlan } from '@/data/mockPlan';
import type { WorkoutTemplate } from '@/data/workoutTemplates';

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Şablonun antrenman günleri haftaya bu sırayla yerleştirilir; kalan günler Rest Day olur.
// Örn. 4 gün/hafta bir şablon Pazartesi/Salı/Perşembe/Cuma'ya oturur, Çarşamba/Cumartesi/Pazar boş kalır.
const TRAINING_DAY_SLOTS: Record<number, string[]> = {
  1: ['Monday'],
  2: ['Monday', 'Thursday'],
  3: ['Monday', 'Wednesday', 'Friday'],
  4: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
  5: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  6: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  7: WEEKDAYS,
};

export function buildWeekFromTemplate(template: WorkoutTemplate): DayPlan[] {
  const slots = TRAINING_DAY_SLOTS[template.daysPerWeek] ?? WEEKDAYS.slice(0, template.days.length);

  return WEEKDAYS.map((day) => {
    const slotIndex = slots.indexOf(day);
    const templateDay = slotIndex === -1 ? undefined : template.days[slotIndex];

    if (!templateDay) {
      return { day, workoutName: null, exercises: [] };
    }

    return {
      day,
      workoutName: templateDay.workoutName,
      exercises: templateDay.exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets,
        muscleGroup: exercise.muscleGroup,
        completed: false,
      })),
    };
  });
}
