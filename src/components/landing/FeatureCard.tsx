type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

export default function FeatureCard({
  eyebrow,
  title,
  description,
  items,
}: FeatureCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-[#0b1018] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
          {eyebrow}
        </p>
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
      </div>

      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>

      <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-zinc-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}