'use client';

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { mockWeekPlan, type DayPlan } from '@/data/mockPlan';
import type { WorkoutTemplate } from '@/data/workoutTemplates';
import { buildWeekFromTemplate, WEEKDAYS } from '@/lib/applyTemplate';

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
  resetPlan: () => void;
  activePlanName: string;
  // Aktif plan bir favoriden geldiyse veya favoriye kaydedildiyse o favorinin id'sini tutar;
  // bağ yoksa null (aktif plan ve favoriler birbirinden bağımsız çalışır).
  activeFavoriteId: string | null;
  renameActivePlan: (name: string) => void;
  saveActivePlanAsFavorite: (name: string) => void;
  favoritePlans: FavoritePlan[];
  saveFavoritePlan: (name: string, week: DayPlan[]) => void;
  applyFavoritePlan: (favoritePlan: FavoritePlan) => void;
  renameFavoritePlan: (id: string, name: string) => void;
  deleteFavoritePlan: (id: string) => void;
  clearFavoritePlans: () => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

// Context: dashboard ve templates/my-plans sayfaları aynı haftalık plan state'ini paylaşsın diye
// kullanılır. Context olmadan bu state sadece bulunduğu bileşende yaşardı; templates veya
// my-plans sayfasında bir planı uyguladığımızda dashboard'un state'ine erişimimiz olmazdı.
// Provider, state'i ağacın üstünde tutar, alttaki her sayfa/bileşen usePlan() ile aynı veriyi
// okuyup güncelleyebilir.
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<DayPlan[]>(mockWeekPlan);
  const [activePlanName, setActivePlanName] = useState('Weekly Workout Plan');
  const [activeFavoriteId, setActiveFavoriteId] = useState<string | null>(null);
  const [favoritePlans, setFavoritePlans] = useState<FavoritePlan[]>([]);

  // Bir şablon uygulamak aktif planı favori bağından koparır: artık hiçbir kayıtlı favorinin
  // birebir kopyası değil, bağımsız bir plan.
  function applyTemplate(template: WorkoutTemplate) {
    setPlan(buildWeekFromTemplate(template));
    setActiveFavoriteId(null);
  }

  // Settings > Danger zone > Reset weekly plan: haftayı tamamen boş (rest day) hale getirir.
  function resetPlan() {
    setPlan(WEEKDAYS.map((day) => ({ day, workoutName: null, exercises: [] })));
    setActiveFavoriteId(null);
  }

  // Dashboard'daki plan adı düzenlendiğinde çağrılır. Aktif plan bir favoriye bağlıysa o
  // favorinin adı da aynı anda güncellenir (tek yönlü değil, iki yönlü senkron).
  function renameActivePlan(name: string) {
    const trimmed = name.trim() || 'My Plan';
    setActivePlanName(trimmed);
    if (activeFavoriteId) {
      setFavoritePlans((prev) =>
        prev.map((favorite) => (favorite.id === activeFavoriteId ? { ...favorite, name: trimmed } : favorite)),
      );
    }
  }

  // Dashboard'daki "Save as favorite" butonu: aktif plan zaten bir favoriye bağlıysa doğrudan o
  // favoriyi günceller (id üzerinden); bağlı değilse aynı adla favori olup olmadığına bakmak
  // arayüzün işi (bkz. WeeklyPlanBoard) — burada verilen ad neyse ona göre yeni favori oluşturur
  // veya üzerine yazar ve bağı kurar.
  function saveActivePlanAsFavorite(name: string) {
    const trimmedName = name.trim() || 'My Plan';
    const targetIndex = activeFavoriteId
      ? favoritePlans.findIndex((favorite) => favorite.id === activeFavoriteId)
      : favoritePlans.findIndex((favorite) => favorite.name.trim().toLowerCase() === trimmedName.toLowerCase());
    const id = targetIndex === -1 ? crypto.randomUUID() : favoritePlans[targetIndex].id;
    const entry: FavoritePlan = { id, name: trimmedName, savedAt: new Date().toISOString(), week: copyWeek(plan) };

    setFavoritePlans((prev) => {
      const index = prev.findIndex((favorite) => favorite.id === id);
      if (index === -1) return [entry, ...prev];
      return prev.map((favorite, i) => (i === index ? entry : favorite));
    });
    setActivePlanName(trimmedName);
    setActiveFavoriteId(id);
  }

  // Aynı adla kayıtlı favori varsa üzerine yazar (aynı id korunur); yoksa listenin başına yeni
  // favori eklenir. Bu, Templates > "Save to My Plans" gibi aktif planı etkilemeyen genel bir
  // kaydetme işlemidir — activeFavoriteId'yi değiştirmez.
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

  // My Plans / Templates > Apply: favoriyi aktif plana uygular ve bağı kurar.
  function applyFavoritePlan(favoritePlan: FavoritePlan) {
    setPlan(copyWeek(favoritePlan.week));
    setActivePlanName(favoritePlan.name);
    setActiveFavoriteId(favoritePlan.id);
  }

  // My Plans kartındaki kalem ikonu: favori adını değiştirir; bu favori şu an aktif plana
  // bağlıysa aktif plan adı da senkron kalsın diye güncellenir.
  function renameFavoritePlan(id: string, name: string) {
    const trimmed = name.trim() || 'My Plan';
    setFavoritePlans((prev) =>
      prev.map((favorite) => (favorite.id === id ? { ...favorite, name: trimmed } : favorite)),
    );
    if (activeFavoriteId === id) {
      setActivePlanName(trimmed);
    }
  }

  function deleteFavoritePlan(id: string) {
    setFavoritePlans((prev) => prev.filter((favorite) => favorite.id !== id));
    if (activeFavoriteId === id) {
      setActiveFavoriteId(null);
    }
  }

  // Settings > Danger zone > Clear favorite plans.
  function clearFavoritePlans() {
    setFavoritePlans([]);
    setActiveFavoriteId(null);
  }

  return (
    <PlanContext.Provider
      value={{
        plan,
        setPlan,
        applyTemplate,
        resetPlan,
        activePlanName,
        activeFavoriteId,
        renameActivePlan,
        saveActivePlanAsFavorite,
        favoritePlans,
        saveFavoritePlan,
        applyFavoritePlan,
        renameFavoritePlan,
        deleteFavoritePlan,
        clearFavoritePlans,
      }}
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
