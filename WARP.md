# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Start (prod server): `npm start`
- Lint: `npm run lint`
- Type-check: `npx tsc -p tsconfig.json --noEmit`

Prisma (PostgreSQL):
- Generate client: `npx prisma generate`
- Create & apply a migration: `npx prisma migrate dev --name <migration_name>`
- Open Prisma Studio: `npx prisma studio`
- Seed database: `npx prisma db seed` (configured via `prisma.config.ts`)

Tests:
- No JavaScript test runner is configured. There are ad‑hoc Playwright (Python) scripts in `testsprite_tests/` that expect the dev server running on `http://localhost:3000`.
- Run a single test (example):
  - Install once: `pip install playwright && python -m playwright install`
  - Execute: `python testsprite_tests/TC001_Create_Lead_with_Valid_Data.py`
  - These scripts contain hard‑coded credentials/URLs; update locally as needed and never commit secrets.

## High‑level architecture

- Framework: Next.js 15 (App Router, TypeScript, React 19). TailwindCSS + Radix UI components.
- Routing:
  - `app/(website)/*`: public marketing/content pages.
  - `app/dashboard/*`: authenticated product surface with role‑specific pages (student/parent/teacher/admin).
  - API routes under `app/api/*` for server functionality (e.g., `grade`, `section`, `uploadthing`, `webhooks/clerk`, `inngest`).
- AuthN/AuthZ: Clerk via `middleware.ts` and `@clerk/nextjs/server`.
  - `middleware.ts` maps public routes, redirects users without an org to `/select-organization`, and enforces role islands for protected routes.
  - `lib/auth.ts` resolves the current user’s role in the active organization.
- Data layer: Prisma with PostgreSQL
  - Schema: `prisma/schema.prisma`; migrations in `prisma/migrations/`.
  - Generated client and types in `generated/prisma/*` (output configured in the Prisma generator block).
  - Seeding: `prisma/seed.ts` with `prisma.config.ts` wiring.
- Background jobs & scheduling: Inngest
  - Functions defined in `app/api/inngest/functions.ts` and served via `app/api/inngest/route.ts`.
  - Cron tasks handle fee status automation, payment status updates, exam status transitions, and notice status updates; event‑driven handlers for scheduled reminders.
- File uploads & storage: UploadThing (`app/api/uploadthing/*`, `lib/uploadthing.ts`).
- Caching/queues: Upstash Redis client in `lib/redis.ts`.
- Email/Notifications: Resend and Knock clients referenced in `lib/*` and components for notification feeds.

## Repository landmarks

- Runtime configuration: `next.config.ts`
- Request middleware & route protection: `middleware.ts`
- App Router entry/layout: `app/layout.tsx`
- Public site: `app/(website)/*`
- Authenticated app: `app/dashboard/*`
- API routes: `app/api/*`
- Database: `prisma/schema.prisma`, `prisma/migrations/*`, `prisma/seed.ts`
- Generated Prisma client & types: `generated/prisma/*`
- Shared libraries (DB, auth, domain logic): `lib/*`
- UI components: `components/*`
- Static assets: `public/*`

## Notes from existing docs

- `tasks/README.md` includes standard Next.js instructions to start the dev server (`npm run dev`) and access the app at `http://localhost:3000` with hot reload.
