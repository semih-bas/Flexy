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
    <article className="rounded-[1.75rem] border border-foreground-muted/10 bg-surface p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">
          {eyebrow}
        </p>
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
      </div>

      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-foreground-muted">{description}</p>

      <div className="mt-5 rounded-2xl border border-brand/15 bg-brand/10 p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-foreground">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}