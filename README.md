Flexy 🏋️

Plan smarter. Train better.

A full-stack fitness planning application with a weekly workout planner, searchable exercise library, and reusable workout templates — wrapped in a custom dark-theme design system.

Live Demo · Report a Bug

<!-- After the Vercel deploy, replace (#) above with the live URL -->
</div>

📸 Screenshots

Dashboard — your training week at a glance

Show Image

Workout TemplatesSaved PlansShow ImageShow Image

✨ Features


🗓️ Weekly Workout Planner — organize your training week with drag-and-drop reordering, day-by-day status tracking (completed / missed / today) and a live "Today" side panel
📋 Workout Templates — 16 ready-made programs filterable by goal and level (strength, hypertrophy, conditioning, home), each with preview and one-click apply
🗂️ My Plans — save favorite weekly plans and re-apply them to your dashboard anytime, with instant bidirectional name synchronization
📚 Exercise Library — search and filter a full exercise catalog, with dynamic detail pages for every exercise
🔐 Secure Authentication — JWT sessions stored in httpOnly cookies, passwords hashed with bcrypt
⚙️ Personalization — configurable preferences such as week-start day
🌙 Custom Design System — a consistent dark theme powered by Tailwind CSS 4 design tokens


🛠️ Tech Stack

LayerTechnologyFrameworkNext.js 16 (App Router)UIReact 19 · Tailwind CSS 4LanguageTypeScript 5 (strict mode)DatabasePostgreSQL on NeonORMPrismaAuthenticationjose (JWT) · bcryptjs · httpOnly cookiesInteractionsdnd-kit (drag & drop)HostingVercel

🏗️ Architecture


Server/Client separation — data is fetched in React Server Components; interactivity lives in focused client components
Middleware-protected routes — every private route validates the JWT from an httpOnly cookie before rendering
Relational data model — users, plans, workouts and exercises modeled in Prisma with full referential integrity
Context-driven state — a PlanProvider keeps templates and plans in sync across the entire UI
Design tokens — colors, spacing and typography defined once via Tailwind 4 @theme, used everywhere


🚀 Run It Locally


Want to explore the code in action? Flexy runs locally in five steps.



Prerequisites: Node.js 18+ and a PostgreSQL database (Neon has a free tier).

bash# 1. Clone the repository
git clone https://github.com/semih-bas/Flexy.git
cd Flexy

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
#    → fill in DATABASE_URL and JWT_SECRET

# 4. Push the schema to your database
npx prisma generate
npx prisma db push

# 5. Start the dev server
npm run dev

The app will be running at http://localhost:3000.

VariableDescriptionDATABASE_URLPostgreSQL connection stringJWT_SECRETSecret used to sign JWT session tokens

🗺️ Roadmap


 Core planner, exercise library & templates
 JWT authentication & user settings
 Production deployment on Vercel
 Workout history & progress tracking
 Mobile release (iOS / Android) with in-app purchases


👤 Author

Semih Baş — built as a learning-first project: every feature implemented with the goal of understanding why, not just how.

GitHub · LinkedIn
