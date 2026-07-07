'use client';

import { useMemo, useState } from 'react';
import ExerciseCard from './ExerciseCard';
import type { Exercise, ExerciseCategory } from '@/data/exercises';

type CategoryFilter = ExerciseCategory | 'All';

type ExerciseExplorerProps = {
  exercises: Exercise[];
  categories: ExerciseCategory[];
};

export default function ExerciseExplorer({ exercises, categories }: ExerciseExplorerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
      const matchesSearch =
        query === '' ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [exercises, selectedCategory, search]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-[1.6rem] border border-foreground-muted/10 bg-background p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-foreground-muted/15 bg-surface px-4 py-3 text-sm text-foreground-muted">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-foreground-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.2-4.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, muscle group, or equipment"
            aria-label="Search exercises"
            className="w-full bg-transparent text-foreground outline-none placeholder:text-foreground-muted"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              selectedCategory === 'All'
                ? 'bg-brand text-white shadow-sm shadow-brand/30'
                : 'border border-foreground-muted/15 bg-surface text-foreground-muted hover:border-brand/40 hover:text-foreground'
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand text-white shadow-sm shadow-brand/30'
                    : 'border border-foreground-muted/15 bg-surface text-foreground-muted hover:border-brand/40 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-foreground-muted">
        {filteredExercises.length} exercise{filteredExercises.length === 1 ? '' : 's'}
      </p>

      {filteredExercises.length === 0 ? (
        <p className="mt-10 text-center text-sm text-foreground-muted">No exercises found.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </>
  );
}
