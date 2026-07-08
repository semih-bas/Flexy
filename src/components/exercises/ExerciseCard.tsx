import Image from 'next/image';
import Link from 'next/link';
import type { Exercise } from '@/data/exercises';
import { surfaceGlowSoft } from '@/lib/surfaceStyles';

type ExerciseCardProps = {
  exercise: Exercise;
};

// Kartın tamamı ve View "butonu" aynı Link'i paylaşır: iç içe interaktif eleman (link içinde
// button) olmaması için View görsel olarak buton ama gerçekte span'dir.
export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-raised transition hover:border-brand/30 ${surfaceGlowSoft}`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 bg-background">
        {exercise.image ? (
          <Image
            src={exercise.image}
            alt={exercise.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-raised to-background">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 text-brand/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M5 9v6M3 10v4M19 9v6M21 10v4M7 12h10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="5" y="7" width="2.4" height="10" rx="1" />
              <rect x="16.6" y="7" width="2.4" height="10" rx="1" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="inline-flex w-fit items-center rounded-full bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
          {exercise.category}
        </span>

        <h3 className="text-base font-bold leading-tight text-foreground">{exercise.name}</h3>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs font-semibold text-foreground-muted">
          <span>{exercise.type}</span>
          <span>
            {exercise.defaultSets}x{exercise.defaultReps}
          </span>
        </div>

        <span className="block w-full rounded-xl border border-border py-2 text-center text-sm font-semibold text-foreground-muted transition group-hover:border-brand/60 group-hover:text-brand">
          View
        </span>
      </div>
    </Link>
  );
}
