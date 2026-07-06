import type { Exercise } from '@/data/exercises';

type ExerciseCardProps = {
  exercise: Exercise;
};

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b1018]/90 shadow-[0_12px_50px_rgba(0,0,0,0.25)]">
      <div className="flex h-40 items-center justify-center border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02))]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
          {exercise.category.slice(0, 2)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
            {exercise.category}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
            {exercise.level}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold text-white">{exercise.name}</h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <span>{exercise.equipment}</span>
          <span className="text-slate-600">•</span>
          <span>{exercise.type}</span>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
          <span className="truncate">{exercise.primaryMuscles[0]}</span>
          <button type="button" className="ml-2 shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-cyan-400/30 hover:text-white">
            View
          </button>
        </div>
      </div>
    </article>
  );
}
