'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type WeekStartDay = 'Monday' | 'Sunday';
export type WeightUnit = 'kg' | 'lb';

type SettingsContextValue = {
  userName: string;
  setUserName: (name: string) => void;
  weekStartDay: WeekStartDay;
  setWeekStartDay: (day: WeekStartDay) => void;
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

// TODO: Faz 3'te auth/backend gelince userName gerçek hesaptan gelecek, weekStartDay ve
// weightUnit kullanıcı profiline kalıcı olarak yazılacak. Şimdilik sadece hafızada tutulur
// (sayfa yenilenince mock değerlere döner) ve dashboard sıralaması/gösterimi weekStartDay ile
// weightUnit'e henüz bağlı değil — bu context sadece tercihleri saklar.
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('Semih Baş');
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>('Monday');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  return (
    <SettingsContext.Provider
      value={{ userName, setUserName, weekStartDay, setWeekStartDay, weightUnit, setWeightUnit }}
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
