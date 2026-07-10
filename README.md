# Flexy

**Flexy** is a weekly workout planner that lets you build, organize, and track your training week — day by day, exercise by exercise. Plan your split, reorder exercises with drag & drop, follow your progress with automatically computed status badges, and start faster with ready-made workout templates.

> 🔗 **Live demo:** [flexy-tau.vercel.app](https://flexy-tau.vercel.app)

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
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) (`@theme` design tokens) |
| Database | [PostgreSQL](https://www.postgresql.org/) on [Neon](https://neon.tech/) |
| ORM | [Prisma 7](https://www.prisma.io/) |
| Auth | JWT ([jose](https://github.com/panva/jose)) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js), HTTP-only cookies |
| Drag & Drop | [dnd-kit](https://dndkit.com/) |

## Architecture

```
src/
├── app/            # App Router pages + REST-style API routes
│   ├── api/        #   /auth (register, login, logout, me), /plan, /plans
│   ├── dashboard/  #   weekly plan view
│   ├── exercises/  #   exercise library + detail pages
│   └── templates/  #   workout template gallery
├── components/     # Feature-scoped React components (dashboard, plan, auth, ui, ...)
├── lib/            # Auth, sessions, Prisma client, serializers, domain helpers
└── data/           # Seed data: exercise library & workout templates
prisma/             # Schema (User, Plan, PlanDay, PlanExercise, Exercise, Template*) + seed
```

Key principles:

- **Derived data is never stored.** Completion counts, status badges, and "today" highlighting are always computed from the source data at render time.
- **Thin API routes, reusable domain logic.** Route handlers validate and delegate to `lib/` (serializers, session handling, template application).
- **Sessions via signed JWTs** stored in HTTP-only cookies — no client-side token handling.

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (a free [Neon](https://neon.tech/) instance works great)

### Setup

1. **Clone and install:**

   ```bash
   git clone https://github.com/semih-bas/flexy.git
   cd flexy
   npm install
   ```

2. **Configure environment.** Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   AUTH_SECRET="a-long-random-secret-for-signing-jwts"
   ```

3. **Push the schema and seed the database:**

   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. **Run the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## License

This project was built as a personal learning p