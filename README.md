<div align="center">

# Next + tRPC + Drizzle + Supabase Starter

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-398ccb?logo=trpc)](https://trpc.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-0e4d2a)](https://orm.drizzle.team/)
[![Supabase](https://img.shields.io/badge/Supabase-Client-3fcf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38b2ac?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Modern, type‑safe app starter built with Next.js (App Router), tRPC v11, Drizzle ORM, and Supabase.

</div>

---

### Features

- **Next.js 15** (App Router)
- **tRPC v11** for end-to-end typesafety
- **Drizzle ORM** with postgres.js
- **Supabase** client (browser/server/edge)
- **Tailwind CSS 4**
- **Strict TypeScript**

### Requirements

- Node.js 18.17+ (20+ recommended)
- A PostgreSQL instance (local or managed)

### Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

Next.js automatically loads `.env`. Provide at least:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
NODE_ENV=development
```

Tip: keep a sanitized `.env.example` (no secrets) in version control.

### Scripts

```bash
# App
npm run dev            # Development
npm run build          # Production build
npm run start          # Serve production
npm run preview        # Build + start

# Quality
npm run lint           # ESLint
npm run lint:fix       # ESLint (fix)
npm run typecheck      # TypeScript
npm run format:check   # Prettier (check)
npm run format:write   # Prettier (write)

# Database (Drizzle)
npm run db:generate    # Generate SQL from schema
npm run db:migrate     # Run migrations
npm run db:push        # Apply changes directly (dev)
npm run db:studio      # Open Drizzle Studio
```

### Database (Drizzle)

- Schema: `src/server/db/schema.ts`
- Connection: `src/server/db/index.ts` (uses `process.env.DATABASE_URL`)
- CLI config: `drizzle.config.ts` (loads `dotenv` automatically)

Typical workflow: edit schema → `db:generate` → `db:migrate` (or `db:push` for dev).

### Supabase

- Browser client: `src/lib/supabase/client.ts`
- Server/Edge: `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### tRPC

- Root router: `src/server/api/root.ts`
- Routers: `src/server/api/routers/*`
- Handler: `src/app/api/trpc/[trpc]/route.ts`
- React Query client: `src/trpc/react.tsx`

### Project Structure (partial)

```
src/
  app/
    api/trpc/[trpc]/route.ts
  server/
    api/
    db/
  lib/supabase/
  trpc/
```

### Deployment

- Vercel recommended. Configure all variables from `.env` in project settings.
- Ensure Supabase CORS/policies fit your needs.

### Troubleshooting

- 500 runtime: verify `DATABASE_URL` and network access to PostgreSQL.
- 401 Supabase: check `NEXT_PUBLIC_SUPABASE_*` and your project configuration.
- Types: `npm run typecheck`
- Migrations: run `db:generate` and `db:migrate` after editing `schema.ts`.

— Built with Next.js, tRPC, Drizzle, and Supabase.
