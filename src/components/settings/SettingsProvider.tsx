'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

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

// TODO: Faz 3'te auth/backend gelince userName gerçek hesaptan gelecek, tercihler kullanıcı
// profiline kalıcı olarak yazılacak. Şimdilik sadece hafızada tutulur (sayfa yenilenince mock
// değerlere döner). weightUnit henüz sadece görsel (TODO). language de sadece görsel/state —
// gerçek i18n ileride ayrı bir iş olarak eklenecek, şu an arayüz metinleri değişmiyor.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('Semih Baş');
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>('Monday');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [language, setLanguage] = useState<Language>('EN');

  return (
    <SettingsContext.Provider
      value={{
        userName,
        setUserName,
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
