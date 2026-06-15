---
name: project-stack-and-patterns
description: Tech stack, security library inventory, and recurring codebase patterns for nextjs-navy
metadata:
  type: project
---

Stack: Next.js 16.2.6 (Pages Router), React 19, TypeScript, Prisma 6 (MySQL), TanStack Query, Zustand, Tailwind CSS.

No dedicated security libraries: no helmet, no cors package, no csrf protection library, no joi/zod/yup input validation.

Security libraries in use:
- Rate limiting: custom in-memory Map at `src/config/lib/rateLimit.ts` (withRateLimit HOF, 40 req/min per IP, no Retry-After header)
- Cache: DB-backed via `src/config/lib/cache.ts` using `prisma.api_cache` table
- No authentication middleware anywhere — all API routes are public

All API routes are under `pages/api/` (Pages Router). No app router API routes.

Recurring patterns:
- `$queryRaw` template literals used extensively — parameters are parameterized (safe), EXCEPT the `tierFilter.replace('t','')` LIKE pattern in filter-by-modalitie.ts (line 88/120) which passes user input into a template interpolation that Prisma parameterizes, but contains a logic vulnerability (strips 't' from arbitrary input).
- `Prisma.join(userIds)` at overall-upd.ts line 293 — userIds are DB-derived, not user-supplied directly, but the source user_id values come from `COALESCE(uuid, CONCAT('nick_', nick))` which is DB data.
- Dual rate-limit implementation: `withRateLimit` HOF + a local in-file Map in filter-by-modalitie.ts (double rate limiting on that endpoint, inconsistent).

**Why:** First audit pass, 2026-05-12. Record for future regression checks.
**How to apply:** Use this to detect regressions in future audits.
