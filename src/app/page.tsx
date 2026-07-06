import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FeatureCard from "@/components/landing/FeatureCard";
import HeroSection from "@/components/landing/HeroSection";

const featureCards = [
  {
    eyebrow: "Weekly planning",
    title: "Shape your week in minutes",
    description:
      "Build a balanced routine with goals, recovery, and training days that fit your schedule.",
    items: ["4-week view", "Smart weekly flow", "Easy adjustments"],
  },
  {
    eyebrow: "Today’s workout",
    title: "Follow one focused session",
    description:
      "Open today’s plan, see the next move, and stay in rhythm without distractions.",
    items: ["Clear workout order", "Time-based guidance", "Progress tracking"],
  },
  {
    eyebrow: "Exercise guide",
    title: "Learn as you train",
    description:
      "Get quick cues and exercise details so each movement feels simple and confident.",
    items: ["Form tips", "Sets and reps", "Compact guidance"],
  },
  {
    eyebrow: "Templates",
    title: "Start from a strong base",
    description:
      "Use polished templates for strength, mobility, and full-body sessions in seconds.",
    items: ["Ready-made plans", "Fast customization", "Repeat favorite flows"],
  },
];

const steps = [
  {
    title: "Pick your focus",
    text: "Choose strength, mobility, or a balanced week that matches your energy.",
  },
  {
    title: "Follow today’s plan",
    text: "Open your session and move through each step without second-guessing.",
  },
  {
    title: "Stay consistent",
    text: "Review progress and keep momentum going with a calm, repeatable routine.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">
            Product overview
          </p>
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

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-foreground-muted/10 bg-surface p-6 shadow-lg sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand">
                How it works
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
                Less planning. More showing up.
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-foreground-muted">
                Flexy keeps your week structured with a premium feel, so you can focus on training instead of managing logistics.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-foreground-muted/10 bg-background p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                      0{index + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground-muted">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}