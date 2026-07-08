'use client';

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { mockWeekPlan, type DayPlan } from '@/data/mockPlan';
import type { WorkoutTemplate } from '@/data/workoutTemplates';
import { buildWeekFromTemplate } from '@/lib/applyTemplate';

type PlanContextValue = {
  plan: DayPlan[];
  setPlan: Dispatch<SetStateAction<DayPlan[]>>;
  applyTemplate: (template: WorkoutTemplate) => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

// Context: dashboard ve templates sayfaları aynı haftalık plan state'ini paylaşsın diye kullanılır.
// Context olmadan bu state sadece bulunduğu bileşende yaşardı; templates sayfasında "Use Plan"a
// basıldığında dashboard'un state'ine erişimimiz olmazdı. Provider, state'i ağacın üstünde tutar,
// alttaki her sayfa/bileşen usePlan() ile aynı veriyi okuyup güncelleyebilir.
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<DayPlan[]>(mockWeekPlan);

  function applyTemplate(template: WorkoutTemplate) {
    setPlan(buildWeekFromTemplate(template));
  }

  return (
    <PlanContext.Provider value={{ plan, setPlan, applyTemplate }}>{children}</PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
