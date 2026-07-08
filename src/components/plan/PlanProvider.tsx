'use client';

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { mockWeekPlan, type DayPlan } from '@/data/mockPlan';
import type { WorkoutTemplate } from '@/data/workoutTemplates';
import { buildWeekFromTemplate } from '@/lib/applyTemplate';

// TODO: Faz 3'te backend/veritabanı gelince favoritePlans kalıcı hale gelecek (şimdilik
// sadece hafızada tutulur, sayfa yenilenince kaybolur).
export type FavoritePlan = {
  id: string;
  name: string;
  savedAt: string;
  week: DayPlan[];
};

function copyWeek(week: DayPlan[]): DayPlan[] {
  return week.map((day) => ({ ...day, exercises: day.exercises.map((exercise) => ({ ...exercise })) }));
}

type PlanContextValue = {
  plan: DayPlan[];
  setPlan: Dispatch<SetStateAction<DayPlan[]>>;
  applyTemplate: (template: WorkoutTemplate) => void;
  favoritePlans: FavoritePlan[];
  saveFavoritePlan: (name: string, week: DayPlan[]) => void;
  applyFavoritePlan: (favoritePlan: FavoritePlan) => void;
  deleteFavoritePlan: (id: string) => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

// Context: dashboard ve templates/my-plans sayfaları aynı haftalık plan state'ini paylaşsın diye
// kullanılır. Context olmadan bu state sadece bulunduğu bileşende yaşardı; templates veya
// my-plans sayfasında bir planı uyguladığımızda dashboard'un state'ine erişimimiz olmazdı.
// Provider, state'i ağacın üstünde tutar, alttaki her sayfa/bileşen usePlan() ile aynı veriyi
// okuyup güncelleyebilir.
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<DayPlan[]>(mockWeekPlan);
  const [favoritePlans, setFavoritePlans] = useState<FavoritePlan[]>([]);

  function applyTemplate(template: WorkoutTemplate) {
    setPlan(buildWeekFromTemplate(template));
  }

  // Aynı adla kayıtlı favori varsa üzerine yazar (aynı id korunur); yoksa listenin başına yeni
  // favori eklenir. Aynı ada sahip favori olup olmadığını önceden sorup sormama kararı arayüz
  // tarafında verilir (bkz. WeeklyPlanBoard) — bu fonksiyon her zaman doğrudan kaydeder.
  function saveFavoritePlan(name: string, week: DayPlan[]) {
    const trimmedName = name.trim() || 'My Plan';

    setFavoritePlans((prev) => {
      const existingIndex = prev.findIndex(
        (favorite) => favorite.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      );
      const entry: FavoritePlan = {
        id: existingIndex === -1 ? crypto.randomUUID() : prev[existingIndex].id,
        name: trimmedName,
        savedAt: new Date().toISOString(),
        week: copyWeek(week),
      };

      if (existingIndex === -1) return [entry, ...prev];
      return prev.map((favorite, index) => (index === existingIndex ? entry : favorite));
    });
  }

  function applyFavoritePlan(favoritePlan: FavoritePlan) {
    setPlan(copyWeek(favoritePlan.week));
  }

  function deleteFavoritePlan(id: string) {
    setFavoritePlans((prev) => prev.filter((favorite) => favorite.id !== id));
  }

  return (
    <PlanContext.Provider
      value={{ plan, setPlan, applyTemplate, favoritePlans, saveFavoritePlan, applyFavoritePlan, deleteFavoritePlan }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
