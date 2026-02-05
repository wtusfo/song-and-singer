# AGENTS.md

## Project overview
- `song-and-singer` is a Next.js app (Next `16.1.6`, React `19.2.3`) with Supabase auth/database.
- Users can log in and create song lyric translations.
- Admins review and publish lyrics.
- Unauthenticated users can view published lyrics.
- Backend logic is implemented via Next.js API routes.

## Stack
- Framework: Next.js (`next dev`, `next build`, `next start`)
- UI: React, TanStack React Form, TanStack React Table, SWR
- Auth/DB: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Styling: Tailwind CSS (v4)
- Tooling: TypeScript, ESLint (`eslint-config-next`)

## Commands
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Notes for agents
- Keep unauthenticated read-only access to published lyrics.
- Enforce admin-only review/publish capabilities.
- Use Supabase session-aware utilities for auth in server/API routes.