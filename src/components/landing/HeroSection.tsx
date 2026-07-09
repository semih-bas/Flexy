import Link from 'next/link';
import { ctaButtonGlow } from '@/lib/surfaceStyles';

const heroStats = [
  { value: '7-Day', label: 'Planning' },
  { value: '25+', label: 'Exercises' },
  { value: 'Easy', label: 'Progress Tracking' },
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

const todaySessionExercises = [
  { name: 'Bench Press', sets: '4x6' },
  { name: 'Incline Press', sets: '3x10' },
  { name: 'Cable Fly', sets: '3x12' },
];

const phoneBottomNav = [
  {
    label: 'Plan',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 4h10M7 20h10M8 8h8M8 16h8" strokeLinecap="round" />
        <path d="M10 4v16M14 4v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Track',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Save',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden bg-background">
      {/* Gerçek spor salonu fotoğrafı yok: koyu zemin üzerine turuncu ışıma ile derinlik veriliyor. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/3 -translate-y-1/4 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 translate-x-1/4 rounded-full bg-brand/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:py-24 lg:px-8">
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
            {/* TODO: Faz 3'te auth eklenince buraya gerçek bir auth gate bağlanacak ve girişten
                sonra /dashboard'a yönlendirecek. Landing'den uygulamaya sızıntı olmasın diye
                şimdilik tıklanabilir ama işlevsiz (Login/Create Account ile aynı "coming soon" deseni). */}
            <a
              href="#"
              title="Coming soon"
              className={`rounded-2xl px-6 py-3 text-center text-sm font-bold text-white ${ctaButtonGlow}`}
            >
              Start Planning
            </a>
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

        {/* Telefon, hero'nun sağ yarısının odağı: dikeyde belirgin büyük (hero yüksekliğinin
            ~%80-85'i hissi), oran korunarak. Özellikler ayrıca anlatılmıyor burada — "Why Flexy"
            bölümü bu işi zaten yapıyor, hero sade kalsın diye sadece başlık + telefon. */}
        <div className="relative mx-auto w-full max-w-[360px] py-6 lg:max-w-none lg:py-4">
          <div className="relative z-10 mx-auto w-[300px] sm:w-[360px] lg:w-[420px]">
            <div aria-hidden className="absolute -inset-10 rounded-[3.5rem] bg-brand/15 blur-3xl" />

            {/* CSS ile çizilen telefon çerçevesi: gerçek fotoğraf mockup yok, kalın kasa + notch +
                yan tuşlar + home indicator ile telefon hissi veriliyor, içi mini dashboard önizlemesi. */}
            <div className="relative rounded-[3.25rem] border-[10px] border-foreground/10 bg-[#0b0f16] shadow-2xl shadow-black/50">
              <span aria-hidden className="absolute -left-[11px] top-24 h-9 w-[3px] rounded-full bg-foreground/10" />
              <span aria-hidden className="absolute -left-[11px] top-36 h-14 w-[3px] rounded-full bg-foreground/10" />
              <span aria-hidden className="absolute -right-[11px] top-32 h-16 w-[3px] rounded-full bg-foreground/10" />

              <div
                aria-hidden
                className="absolute left-1/2 top-4 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-foreground/10"
              />

              <div className="overflow-hidden rounded-[2.6rem] bg-surface-raised p-5 pt-11">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground-muted">Hello, Flexy!</p>
                    <h3 className="text-xl font-bold text-foreground">Your Week</h3>
                  </div>
                  <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-sm shadow-brand/40">
                    Active
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1.5">
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

                <div className="mt-4 flex items-center justify-between rounded-xl border border-brand/20 bg-brand/10 px-3.5 py-2.5">
                  <span className="text-xs font-semibold text-foreground-muted">Weekly Streak</span>
                  <span className="text-sm font-bold text-brand">5 day streak</span>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="uppercase tracking-[0.15em] text-foreground-muted">Weekly Progress</span>
                    <span className="text-foreground">68%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
                    <div className="h-full w-[68%] rounded-full bg-brand" />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-background p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Today</p>
                  <h4 className="mt-1.5 text-base font-bold text-foreground">Chest &amp; Triceps</h4>
                  <div className="mt-2.5 space-y-2">
                    {todaySessionExercises.map((exercise) => (
                      <div key={exercise.name} className="flex items-center justify-between text-xs">
                        <span className="text-foreground-muted">{exercise.name}</span>
                        <span className="font-semibold text-foreground">{exercise.sets}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-around border-t border-border pt-4">
                  {phoneBottomNav.map((item, index) => (
                    <div key={item.label} className="flex flex-col items-center gap-1.5">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          index === 0 ? 'bg-brand text-white shadow-sm shadow-brand/40' : 'bg-background text-foreground-muted'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-[10px] font-semibold text-foreground-muted">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                aria-hidden
                className="absolute bottom-2.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-foreground/15"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
