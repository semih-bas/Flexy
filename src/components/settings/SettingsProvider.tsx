'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export type WeekStartDay = 'Monday' | 'Sunday';
export type WeightUnit = 'kg' | 'lb';
export type Language = 'EN' | 'TR';

type SettingsContextValue = {
  userName: string;
  setUserName: (name: string) => void;
  weekStartDay: WeekStartDay;
  setWeekStartDay: (day: WeekStartDay) => void;
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  language: Language;
  setLanguage: (language: Language) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

// TODO: weightUnit henüz sadece görsel. language de sadece görsel/state — gerçek i18n ileride
// ayrı bir iş olarak eklenecek, şu an arayüz metinleri değişmiyor.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState('');
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>('Monday');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [language, setLanguage] = useState<Language>('EN');

  // hasLoaded: ilk GET tamamlanana kadar debounce'lı PATCH efekti çalışmasın. skipNextPersist:
  // ilk GET'in kendi state güncellemesi bu efekti tetiklediğinde aynı adı hemen geri yazmayı
  // atlar (bkz. PlanProvider'daki aynı desen).
  const hasLoadedRef = useRef(false);
  const skipNextPersistRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user: { name: string } } | null) => {
        if (cancelled || !data) return;
        skipNextPersistRef.current = true;
        setUserNameState(data.user.name);
      })
      .catch(() => {
        // Anonim ziyaretçi (landing) ya da ağ hatası: isim boş kalır, WelcomeHeader vb. bunu
        // görmez çünkü bu sayfalar zaten girişli kullanıcıya özel.
      })
      .finally(() => {
        if (!cancelled) hasLoadedRef.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName }),
      }).catch(() => {});
    }, 600);

    return () => clearTimeout(timer);
  }, [userName]);

  return (
    <SettingsContext.Provider
      value={{
        userName,
        setUserName: setUserNameState,
        weekStartDay,
        setWeekStartDay,
        weightUnit,
        setWeightUnit,
        language,
        setLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
