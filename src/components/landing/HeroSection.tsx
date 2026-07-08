import Link from 'next/link';
import { surfaceGlow } from '@/lib/surfaceStyles';

const heroStats = [
  { value: '7-Day', label: 'Planning' },
  { value: '25+', label: 'Exercises' },
  { value: 'Easy', label: 'Progress Tracking' },
];

const heroFeatures = [
  {
    title: 'Personalized Plans',
    description: 'Build a weekly routine around your goals.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8a1 1 0 0 1 1 1v15l-5-3-5 3V5a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Track Your Progress',
    description: 'See completed work and weekly momentum.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Save Favorites',
    description: 'Keep your best routines ready to reuse.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Save Time',
    description: 'Plan faster before the week gets busy.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const miniWeek: { day: string; status: 'completed' | 'today' | 'upcoming' }[] = [
  { day: 'Mo', status: 'completed' },
  { day: 'Tu', status: 'completed' },
  { day: 'We', status: 'upcoming' },
  { day: 'Th', status: 'today' },
  { day: 'Fr', status: 'upcoming' },
  { day: 'Sa', status: 'upcoming' },
  { day: 'Su', status: 'upcoming' },
];

const miniDayStyles = {
  completed: 'bg-success/15 text-success border border-success/25',
  today: 'bg-brand text-white shadow-sm shadow-brand/40',
  upcoming: 'border border-border text-foreground-muted',
};

export default function HeroSection() {
  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden bg-background">
      {/* Gerçek spor salonu fotoğrafı yok: koyu zemin üzerine turuncu ışıma ile derinlik veriliyor. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/3 -translate-y-1/4 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 translate-x-1/4 rounded-full bg-brand/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-24 lg:px-8">
        <div>
          <p className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
            Premium weekly workout planning
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Plan Your
            <br />
            <span className="text-brand">Workout</span>
            <br />
            <span className="text-brand">Week</span>
            <br />
            With Flexy
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-foreground-muted">
            Create weekly workout plans, organize exercises by muscle group, save favorite
            exercises, and track your progress in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-brand px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand/90"
            >
              Start Planning
            </Link>
            <Link
              href="#preview"
              className="rounded-2xl border border-foreground-muted/20 px-6 py-3 text-center text-sm font-bold text-foreground transition hover:border-brand/40"
            >
              View Product
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-foreground-muted/10 bg-surface px-3 py-4"
              >
                <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-semibold leading-tight text-foreground-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="order-2 flex flex-row gap-4 overflow-x-auto lg:order-1 lg:w-52 lg:shrink-0 lg:flex-col lg:gap-5 lg:overflow-visible">
            {heroFeatures.map((feature) => (
              <div key={feature.title} className="flex min-w-[15rem] items-start gap-3 lg:min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{feature.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-foreground-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 lg:flex-1">
            <div className="relative mx-auto max-w-sm">
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-brand/15 blur-3xl" />

              <div
                className={`relative -rotate-2 rounded-3xl bg-surface-raised p-6 shadow-2xl shadow-black/40 ${surfaceGlow}`}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">This Week</p>

                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {miniWeek.map((entry) => (
                    <div key={entry.day} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-foreground-muted">{entry.day}</span>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${miniDayStyles[entry.status]}`}
                      >
                        {entry.status === 'completed' ? '✓' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="uppercase tracking-[0.2em] text-foreground-muted">Weekly Progress</span>
                    <span className="text-foreground">68%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
                    <div className="h-full w-[68%] rounded-full bg-brand" />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-background p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Today</p>
                  <h3 className="mt-1 text-base font-bold text-foreground">Chest &amp; Triceps</h3>
                  <p className="mt-1 text-xs text-foreground-muted">
                    Bench Press · Incline Press · Cable Fly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
