import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppSidebar from '@/components/layout/AppSidebar';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { prisma } from '@/lib/prisma';
import { toExercise } from '@/lib/exerciseSerializer';
import { surfaceGlow, surfaceGlowSoft } from '@/lib/surfaceStyles';

type ExerciseDetailPageProps = {
  params: Promise<{ id: string }>;
};

// Build sırasında 25 egzersizin tamamı için statik HTML üretilir (SSG): sayfa her istekte
// yeniden render edilmek yerine önceden hazırlanır, bu da açılışı anında ve sunucu yükünü sıfıra
// yakın yapar. id listesi artık DB'den geliyor (build anında sorgulanır).
export async function generateStaticParams() {
  const rows = await prisma.exercise.findMany({ select: { id: true } });
  return rows.map((row) => ({ id: row.id }));
}

// DETAILED MUSCLE INVOLVEMENT kartlarındaki cümleler şimdilik kas adına göre şablondan üretiliyor.
// TODO: İçerik derinleştirme fazında her egzersiz/kas çifti için özel, spesifik metinler yazılacak.
function muscleInvolvementBlurb(muscle: string, role: 'primary' | 'secondary'): string {
  const label = muscle.toLowerCase();
  if (role === 'primary') {
    return `The ${label} acts as the primary driver here, producing most of the force behind the movement.`;
  }
  return `The ${label} works as a supporting muscle, helping stabilize and assist through the movement.`;
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = await params;
  const row = await prisma.exercise.findUnique({ where: { id } });

  if (!row) {
    notFound();
  }

  const exercise = toExercise(row);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AmbientGlow />
      <AppSidebar />

      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
        {/* HERO */}
        <div className={`overflow-hidden rounded-3xl bg-surface ${surfaceGlow}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full shrink-0 bg-background lg:aspect-auto lg:min-h-[24rem]">
              {exercise.image ? (
                <Image
                  src={exercise.image}
                  alt={exercise.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-raised to-background">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-16 w-16 text-brand/30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M5 9v6M3 10v4M19 9v6M21 10v4M7 12h10" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="5" y="7" width="2.4" height="10" rx="1" />
                    <rect x="16.6" y="7" width="2.4" height="10" rx="1" />
                  </svg>
                </div>
              )}

              <Link
                href="/exercises"
                className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/70"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to library
              </Link>

              <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                  {exercise.defaultSets}x{exercise.defaultReps}
                </span>
                <span className="rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                  {exercise.type}
                </span>
              </div>

              <span className="absolute bottom-3 right-3 rounded-full bg-brand/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                {exercise.category}
              </span>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-7 lg:p-9">
              <span className="inline-flex w-fit items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-brand">
                Exercise Guide
              </span>

              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{exercise.name}</h1>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  {exercise.type}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                  {exercise.category}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground-muted">
                  {exercise.level}
                </span>
              </div>

              <p className="text-sm leading-6 text-foreground-muted sm:text-base">{exercise.description}</p>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Equipment</p>
                  <p className="mt-1 text-sm font-bold text-foreground">{exercise.equipment}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">Pattern</p>
                  <p className="mt-1 text-sm font-bold text-foreground">{exercise.pattern}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY / SECONDARY */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className={`rounded-3xl bg-surface p-5 sm:p-6 ${surfaceGlowSoft}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Primary Muscles</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {exercise.primaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground-muted"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl bg-surface p-5 sm:p-6 ${surfaceGlowSoft}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-foreground-muted">Secondary Muscles</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {exercise.secondaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground-muted"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TRAINING PROFILE */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Training Profile</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Main Purpose', value: exercise.purpose },
              { label: 'Training Goal', value: exercise.trainingType },
              { label: 'Movement Pattern', value: exercise.pattern },
              { label: 'Strength Benefit', value: exercise.strengthBenefit },
              { label: 'Hypertrophy Benefit', value: exercise.hypertrophyBenefit },
              { label: 'Level', value: exercise.level },
            ].map((item) => (
              <div key={item.label} className={`rounded-2xl bg-surface p-4 ${surfaceGlowSoft}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-muted">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILED MUSCLE INVOLVEMENT */}
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Detailed Muscle Involvement</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {exercise.primaryMuscles.map((muscle) => (
              <div key={`primary-${muscle}`} className={`rounded-2xl bg-surface p-4 ${surfaceGlowSoft}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">{muscle}</h3>
                  <span className="shrink-0 rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand">
                    Primary Driver
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                  {muscleInvolvementBlurb(muscle, 'primary')}
                </p>
              </div>
            ))}
            {exercise.secondaryMuscles.map((muscle) => (
              <div key={`secondary-${muscle}`} className={`rounded-2xl bg-surface p-4 ${surfaceGlowSoft}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">{muscle}</h3>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-foreground-muted">
                    Support
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                  {muscleInvolvementBlurb(muscle, 'secondary')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK FACT */}
        <div className="mt-5 rounded-3xl border border-brand/25 bg-brand/[0.06] p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
              <circle cx="12" cy="12" r="5" />
            </svg>
            Quick Fact
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground sm:text-base">{exercise.quickFact}</p>
        </div>

        {/* FORM TIPS / COMMON MISTAKES */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className={`rounded-3xl bg-surface p-5 sm:p-6 ${surfaceGlowSoft}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Form Tips</p>
            <ol className="mt-3 space-y-2.5">
              {exercise.tips.map((tip, index) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-6">{tip}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-danger/25 bg-danger/[0.06] p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-danger">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path
                  d="M12 9v4m0 3.5h.01M10.3 3.9 2.6 17.4a1.6 1.6 0 0 0 1.4 2.4h16a1.6 1.6 0 0 0 1.4-2.4L13.7 3.9a1.6 1.6 0 0 0-2.8 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Common Mistakes
            </p>
            <ul className="mt-3 space-y-2">
              {exercise.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex items-start gap-3 text-sm text-foreground-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
