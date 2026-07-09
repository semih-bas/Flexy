'use client';

import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { mockWeekPlan, type DayPlan } from '@/data/mockPlan';
import type { WorkoutTemplate } from '@/data/workoutTemplates';
import { buildWeekFromTemplate, WEEKDAYS } from '@/lib/applyTemplate';

export type FavoritePlan = {
  id: string;
  name: string;
  savedAt: string;
  week: DayPlan[];
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// Sunucudan gelen plan gövdesini (bkz. src/lib/planSerializer.ts) frontend'in beklediği şekle
// (id/name/savedAt/week) çevirir — hem aktif plan hem favoriler aynı şekli paylaşıyor.
type ApiPlan = {
  id: string;
  name: string;
  linkedFavoriteId: string | null;
  savedAt: string;
  days: DayPlan[];
};

function toFavoritePlan(apiPlan: ApiPlan): FavoritePlan {
  return { id: apiPlan.id, name: apiPlan.name, savedAt: apiPlan.savedAt, week: apiPlan.days };
}

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
// kullanılır. Provider ayrıca bu state'i /api/plan ve /api/plans üzerinden veritabanına bağlar:
// açılışta fetch eder, sonraki her değişiklikte (tik, sürükleme, save workout, rename) debounce'lı
// olarak geri yazar. Giriş yapılmamışsa (ör. landing sayfası) fetch'ler sessizce 401 döner ve
// mockWeekPlan yerel varsayılan olarak kalır — hiçbir şey kırılmaz.
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<DayPlan[]>(mockWeekPlan);
  const [activePlanName, setActivePlanName] = useState('Weekly Workout Plan');
  const [activeFavoriteId, setActiveFavoriteId] = useState<string | null>(null);
  const [favoritePlans, setFavoritePlans] = useState<FavoritePlan[]>([]);

  // hasLoaded: ilk GET tamamlanana kadar debounce'lı PUT efekti hiç çalışmasın (mock veriyi
  // sunucuya yazıp gerçek veriyi ezmeyelim). skipNextPersist: ilk GET'in kendi state
  // güncellemesi PUT efektini tetiklediğinde, aynı veriyi hemen geri yazmayı atlar.
  const hasLoadedRef = useRef(false);
  const skipNextPersistRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialState() {
      try {
        const [planResponse, favoritesResponse] = await Promise.all([
          fetch('/api/plan'),
          fetch('/api/plans'),
        ]);

        if (!cancelled && planResponse.ok) {
          const { plan: apiPlan } = (await planResponse.json()) as { plan: ApiPlan };
          skipNextPersistRef.current = true;
          setPlan(apiPlan.days);
          setActivePlanName(apiPlan.name);
          setActiveFavoriteId(apiPlan.linkedFavoriteId);
        }

        if (!cancelled && favoritesResponse.ok) {
          const { plans } = (await favoritesResponse.json()) as { plans: ApiPlan[] };
          setFavoritePlans(plans.map(toFavoritePlan));
        }
      } catch {
        // Anonim ziyaretçi (landing) ya da ağ hatası: yerel mock state ile sessizce devam edilir.
      } finally {
        if (!cancelled) hasLoadedRef.current = true;
      }
    }

    loadInitialState();
    return () => {
      cancelled = true;
    };
  }, []);

  // Aktif planın tam durumu (ad + günler + favori bağı) tek parça olarak, kısa bir debounce ile
  // sunucuya yazılır — her tik/sürükleme için ayrı ayrı istek atmak yerine art arda gelen
  // değişiklikleri birleştirir.
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetch('/api/plan', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ name: activePlanName, days: plan, linkedFavoriteId: activeFavoriteId }),
      }).catch(() => {});
    }, 600);

    return () => clearTimeout(timer);
  }, [plan, activePlanName, activeFavoriteId]);

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
      const linkedId = activeFavoriteId;
      setFavoritePlans((prev) =>
        prev.map((favorite) => (favorite.id === linkedId ? { ...favorite, name: trimmed } : favorite)),
      );
      fetch(`/api/plans/${linkedId}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ name: trimmed }),
      }).catch(() => {});
    }
  }

  // Dashboard'daki "Save as favorite" butonu: sunucu tarafı aktif plan zaten bir favoriye
  // bağlıysa doğrudan o favoriyi günceller, değilse aynı adla favori olup olmadığına bakar
  // (bkz. /api/plans POST) — burada sadece isteği atıp yanıtla yerel state'i senkronluyoruz.
  function saveActivePlanAsFavorite(name: string) {
    const trimmedName = name.trim() || 'My Plan';
    fetch('/api/plans', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name: trimmedName }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { plan: ApiPlan } | null) => {
        if (!data) return;
        const favorite = toFavoritePlan(data.plan);
        setFavoritePlans((prev) => {
          const index = prev.findIndex((entry) => entry.id === favorite.id);
          if (index === -1) return [favorite, ...prev];
          return prev.map((entry, i) => (i === index ? favorite : entry));
        });
        setActivePlanName(trimmedName);
        setActiveFavoriteId(favorite.id);
      })
      .catch(() => {});
  }

  // Aynı adla kayıtlı favori varsa üzerine yazar (aynı id korunur); yoksa listenin başına yeni
  // favori eklenir. Bu, Templates > "Save to My Plans" gibi aktif planı etkilemeyen genel bir
  // kaydetme işlemidir — activeFavoriteId'yi değiştirmez.
  function saveFavoritePlan(name: string, week: DayPlan[]) {
    const trimmedName = name.trim() || 'My Plan';
    fetch('/api/plans', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name: trimmedName, days: copyWeek(week) }),
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { plan: ApiPlan } | null) => {
        if (!data) return;
        const favorite = toFavoritePlan(data.plan);
        setFavoritePlans((prev) => {
          const index = prev.findIndex((entry) => entry.id === favorite.id);
          if (index === -1) return [favorite, ...prev];
          return prev.map((entry, i) => (i === index ? favorite : entry));
        });
      })
      .catch(() => {});
  }

  // My Plans / Templates > Apply: favoriyi aktif plana uygular ve bağı kurar.
  function applyFavoritePlan(favoritePlan: FavoritePlan) {
    setPlan(copyWeek(favoritePlan.week));
    setActivePlanName(favoritePlan.name);
    setActiveFavoriteId(favoritePlan.id);
    fetch(`/api/plans/${favoritePlan.id}`, { method: 'POST' }).catch(() => {});
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
    fetch(`/api/plans/${id}`, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ name: trimmed }),
    }).catch(() => {});
  }

  function deleteFavoritePlan(id: string) {
    setFavoritePlans((prev) => prev.filter((favorite) => favorite.id !== id));
    if (activeFavoriteId === id) {
      setActiveFavoriteId(null);
    }
    fetch(`/api/plans/${id}`, { method: 'DELETE' }).catch(() => {});
  }

  // Settings > Danger zone > Clear favorite plans.
  function clearFavoritePlans() {
    const ids = favoritePlans.map((favorite) => favorite.id);
    setFavoritePlans([]);
    setActiveFavoriteId(null);
    ids.forEach((id) => {
      fetch(`/api/plans/${id}`, { method: 'DELETE' }).catch(() => {});
    });
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
