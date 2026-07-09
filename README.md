# Flexy

**Flexy** is a weekly workout planner that lets you build, organize, and track your training week — day by day, exercise by exercise. Plan your split, reorder exercises with drag & drop, follow your progress with automatically computed status badges, and start faster with ready-made workout templates.

> 🔗 **Live demo:** _coming soon_

This is a complete rewrite of the original vanilla JavaScript prototype, rebuilt from the ground up with a modern, type-safe, full-stack architecture.

## Features

- **Weekly plan builder** — organize workouts across the week with a clean, single-screen dashboard
- **Drag & drop reordering** — rearrange exercises inside a workout with [dnd-kit](https://dndkit.com/)
- **Smart status badges** — Completed / Partial / Missed / Today, always computed from data, never stored
- **Exercise library** — 25+ exercises with photos, search, and muscle-group filtering
- **Workout templates** — apply a ready-made split to your plan in one click
- **Multiple plans** — create, rename, and switch between training plans
- **Authentication** — secure register/login with JWT sessions in HTTP-only cookies
- **Dark navy theme** — custom design system built on Tailwind CSS 4 design tokens

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4