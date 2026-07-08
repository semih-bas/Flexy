import AppSidebar from '@/components/layout/AppSidebar';
import SettingsPanels from '@/components/settings/SettingsPanels';

export default function SettingsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AppSidebar />

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-brand/20 bg-surface p-5 shadow-lg sm:p-7 lg:p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-brand">
            SETTINGS
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.4rem]">
            Settings
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-foreground-muted sm:text-base">
            Update your profile, adjust preferences, and manage your saved data.
          </p>

          <SettingsPanels />
        </div>
      </section>
    </main>
  );
}
