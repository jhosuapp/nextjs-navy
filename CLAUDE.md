# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (also runs prisma generate)
npm run build      # Production build
npm run lint       # ESLint check
npm run doctor     # React component health check (react-doctor)
npm start          # Start production server

npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma db pull     # Sync schema from the external database
npx prisma studio      # Open Prisma GUI
```

## CI Pipeline (required to pass before merging PRs)

Every push triggers `.github/workflows/ci.yml`, which runs sequentially:
1. `npm run lint`
2. `npm audit --audit-level=high`
3. `npm run build`

All three must pass. PRs to `main` are blocked if any step fails.

## Architecture

This is a **Next.js Pages Router** project (not App Router). The `/pages` directory handles routing only — no business logic lives there. The real code lives under `/src`.

### Feature model (`src/features/`)

Each feature is self-contained:

```
src/features/<feature>/
  actions/       # async functions that call navyApi (axios, client-side)
  components/    # React components scoped to this feature
  hooks/         # useQuery wrappers + controller hook
  interfaces/    # TypeScript types for this feature
  views/         # The top-level JSX rendered by the page
  helpers/       # Pure utility functions
```

**Controller pattern**: each feature exposes a `use[Feature]Controller` hook that composes the React Query hook, Zustand stores, and i18n into a single object returned to the view. Views are thin — they only call the controller and render.

### Shared resources (`src/shared/`)

- `api/navy.api.ts` — Axios instance with `baseURL: '/api'`; all client→API calls use this
- `motion/` — Reusable Framer Motion variant factories (`fadeInMotion`, `fadeUpMotion`, `zoomInMotion`, `flowerMotion`). Always use these instead of writing inline variants
- `stores/` — Zustand stores (cursor, lenis, loader, menu, modal, modalities, search, skin, switch)
- `layouts/` — Header, Footer, PageTransition wrappers
- `components/` — Shared UI primitives (Button, Container, CardWrapper, Spinner, etc.)
- `interfaces/globals.ts` — Shared types including `ITranslations` and `PartialMotionVariants`
- `constants/` — `paths`, `routes`, `information` (tier point values)

### API routes (`pages/api/`)

Routes query the external database via Prisma and expose data to the client. Every handler must:
- Check `req.method` and return 405 for unsupported methods
- Be wrapped with `withRateLimit` from `@/config/lib/rateLimit` (40 req/min per IP)
- Use `getCache`/`setCache` from `@/config/lib/cache` for expensive queries (stored in `api_cache` table)

### Prisma (`src/config/lib/prisma.ts`)

Singleton pattern using `globalThis` to prevent multiple connections in dev. Import from `@/config/lib/prisma`, never instantiate `PrismaClient` directly.

### Internationalisation

`next-i18next` with locales `es` (default), `en`, `pt`. Use the `useTranslation` hook inside controller hooks. The `t` function is typed as `ITranslations` from `@/shared/interfaces/globals`.

## Key Conventions

### Styles
Use CSS Modules (`*.module.css`) with Tailwind `@apply` — never write raw CSS properties. Class names use camelCase BEM: `.cardBan__item`, `.cardBan__status__active`.

```css
/* correct */
.cardBan__item {
    @apply flex justify-between mb-3 pb-3;
}
```

Tailwind utility classes may be used directly in JSX for one-off overrides, but recurring patterns belong in a `.module.css` file.

### TypeScript
Strict mode is enabled (`"strict": true`). Never use `any`. Use explicit return types on exported functions and components (`JSX.Element`, `Promise<T>`). Path alias `@/*` maps to `src/*`.

### Data fetching (React Query)
Query hooks follow this pattern — always set `staleTime: Infinity` and `refetchOnWindowFocus: false` for static/slow-changing data:

```ts
const useXxxQuery = () => useQuery({
    queryKey: ['xxx'],
    queryFn: getXxxAction,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
});
```

### Animations (Framer Motion)
Use the shared motion factories from `@/shared/motion/`. Spread the result onto `<motion.*>` elements:

```tsx
<motion.div {...fadeInMotion(0.3, 0)}>...</motion.div>
```

`AnimatePresence` is already configured globally in `_app.tsx`. Use `layout` prop on list items for smooth reorder animations.

### Components
Wrap reusable leaf components with `memo()` and set `displayName`. Export named (not default). Keep components pure — side-effects belong in hooks.

### SSG vs SSR vs Client-side fetching

Before reaching for a React Query hook, reason through which rendering strategy eliminates the round-trip entirely.

| Signal | Strategy |
|---|---|
| Data is the same for every user and changes rarely (partners list, static copy) | **SSG** — `getStaticProps`, zero client requests |
| Data changes but is still per-page and not user-specific (tierlist, bans) | **SSR** — `getServerSideProps`, fetched once on the server |
| Data is user-specific, interactive, or must update without a full page reload | **Client-side** — React Query hook |

**Decision checklist before adding a `useQuery` hook:**

1. Does the data depend on the authenticated user or a runtime interaction? If no → consider SSG/SSR.
2. Does the data need to update while the user is on the page (polling, real-time)? If no → SSR is enough.
3. Is the data the same regardless of who visits the page? If yes → SSG.

API routes in `pages/api/` exist to serve client-side React Query calls. When data is fetched via `getServerSideProps` or `getStaticProps`, call Prisma directly — skip the HTTP hop through the API route entirely.

```ts
// pages/bans/index.tsx — if bans were SSR
export const getServerSideProps = async () => {
    const punishments = await prisma.punishments.findMany({ orderBy: { applied: 'desc' } });
    return { props: { punishments } };
};
```

Use `getCache`/`setCache` from `@/config/lib/cache` inside `getServerSideProps` to avoid hitting the database on every request for data that changes infrequently.

### Zustand stores
Import the store and select only the slice you need to avoid unnecessary re-renders:
```ts
const value = useSearchStore(state => state.value);
```
