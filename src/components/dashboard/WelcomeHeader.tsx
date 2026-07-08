'use client';

import { useSettings } from '@/components/settings/SettingsProvider';

export default function WelcomeHeader() {
  const { userName } = useSettings();

  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Dashboard</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {userName}</h1>
      <p className="mt-1 text-sm text-foreground-muted">Manage your weekly workout routine.</p>
    </>
  );
}
