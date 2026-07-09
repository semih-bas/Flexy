import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeatureCard from "@/components/landing/FeatureCard";
import HeroSection from "@/components/landing/HeroSection";
import ExercisePreviewCard from "@/components/landing/ExercisePreviewCard";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { exercises } from "@/data/exercises";
import { surfaceGlow } from "@/lib/surfaceStyles";

const featureCards = [
  {
    eyebrow: "Weekly planning",
    title: "Shape your week in minutes",
    description:
      "Build a balanced routine with goals, recovery, and training days that fit your schedule.",
    items: ["7-day view", "Smart weekly flow", "Easy adjustments"],
  },
  {
    eyebrow: "Today's workout",
    title: "Follow one focused session",
    description:
      "Open today's plan, see the next move, and stay in rhythm without distractions.",
    items: ["Clear workout order", "Set and rep tracking", "Progress at a glance"],
  },
  {
    eyebrow: "Exercise guide",
    title: "Learn as you train",
    description:
      "Get quick cues and exercise details so each movement feels simple and confident.",
    items: ["Form tips", "Sets and reps", "Compact guidance"],
  },
  {
    eyebrow: "Templates & favorites",
    title: "Start from a strong base",
    description:
      "Use ready-made templates for strength, hypertrophy, and conditioning, or save your own favorite weeks.",
    items: ["Ready-made programs", "Fast customization", "Repeat favorite weeks"],
  },
];

// Preview bölümü canlı state kullanmaz (ziyaretçi giriş yapmadan önce görür): temsili sabit veri.
const previewWeek = [
  { day: "Monday", workout: "Chest & Triceps", count: "6/6" },
  { day: "Tuesday", workout: "Cardio", count: "3/3" },
  { day: "Wednesday", workout: null, count: null },
  { day: "Thursday", workout: "Back & Biceps", count: "2/6" },
];

const previewSession = [
  { name: "Bench Press", sets: "4x8-10", done: true },
  { name: "Incline Dumbbell Press", sets: "3x10-12", done: true },
  { name: "Cable Fly", sets: "3x12-15", done: false },
  { name: "Triceps Pushdown", sets: "3x12-15", done: false },
];

const previewExerciseIds = ["bench-press", "lat-pulldown", "overhead-press", "squat"];
const previewExercises = exercises.filter((exercise) => previewExerciseIds.includes(exercise.id));

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <AmbientGlow />
      <Navbar />
      <HeroSection />

      <section id="why-flexy" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">Why Flexy</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            Built for simple weekly planning and daily momentum.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section id="preview" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">Preview</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            A calm, focused look at your training week.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className={`rounded-[1.75rem] bg-surface p-6 ${surfaceGlow}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">
              Your Week at a Glance
            </p>

            <div className="mt-4 space-y-2">
              {previewWeek.map((entry) => (
                <div
                  key={entry.day}
                  className="flex items-center justify-between rounded-2xl border border-foreground/[0.06] bg-surface-raised px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground-muted">
                      {entry.day}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                      {entry.workout ?? "Rest Day"}
                    </p>
                  </div>
                  {entry.count && (
                    <span className="shrink-0 rounded-md bg-background px-2 py-1 text-[11px] font-semibold text-foreground-muted">
                      {entry.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[1.75rem] bg-surface p-6 ${surfaceGlow}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Today&apos;s Session</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">Chest &amp; Triceps</h3>

            <div className="mt-4 space-y-1.5">
              {previewSession.map((exercise) => (
                <div
                  key={exercise.name}
                  className="flex items-center gap-2 rounded-xl bg-surface-raised px-3 py-2.5"
                >
                  {exercise.done ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[18px] shrink-0 rounded-full bg-success p-[3px] text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    >
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="h-[18px] w-[18px] shrink-0 rounded-full border border-foreground/20" />
                  )}
                  <span
                    className={`min-w-0 flex-1 truncate text-sm ${exercise.done ? "text-foreground-muted line-through" : "text-foreground"}`}
                  >
                    {exercise.name}
                  </span>
                  <span className="shrink-0 rounded-md bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground-muted">
                    {exercise.sets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="exercises" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">Exercises</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
            A growing exercise library.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewExercises.map((exercise) => (
            <ExercisePreviewCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
