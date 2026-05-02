# Copilot Instructions

## Build, lint, and test commands

- `npm run dev` - start the Next.js dev server with Turbopack.
- `npm run build` - create a production build. In this repo, `next build` also performs linting and type validation.
- `npm start` - run the production server after building.
- `npm run lint` - run the Next.js ESLint checks.
- There is currently no automated test setup in the repository: `package.json` has no `test` script, and there are no `*.test.*` or `*.spec.*` files. That means there is no full-suite or single-test command yet.

## High-level architecture

- This is a Next.js 15 App Router app with a single main route under `app/`. `app/layout.tsx` sets metadata, loads fonts and global styles, and mounts Vercel Speed Insights.
- `app/page.tsx` is the top-level client component for the whole UI. It wraps the page in `NextUIProvider`, applies the dark-mode class toggle, and renders the two main surfaces side by side: the calendar and the bill summary/form.
- Shared calculator state and business logic live in `app/components/BillContext.tsx`. `BillProvider` owns the selected date range, weekday and weekend rates, skipped-day counts, service charge, currency metadata, and the derived weekday/weekend totals used to compute the final bill.
- `app/components/NextUICalendar.tsx` is only responsible for choosing the start and end dates. It reads and updates `startDate` and `endDate` from the shared context using NextUI calendar date types.
- `app/components/Bill.tsx` is the editable pricing surface and the output summary. It reads from the same context and updates rates, skipped counts, and service charge directly, so the displayed bill always reflects shared provider state.
- Styling is Tailwind-first with NextUI components layered on top. Tailwind is configured with `darkMode: "selector"` and custom small-screen breakpoints in `tailwind.config.ts`.
- Despite README wording about persistence, this codebase currently has no backend, API route, database, or browser storage layer. The calculator is fully client-side and recalculates from in-memory state.
- Deployment is Vercel-oriented: the app includes `@vercel/speed-insights`, and the live custom domain in the README is currently responding with Vercel headers. There is no committed `vercel.json` or `.vercel/` project metadata in the repo, so deployment wiring appears to live outside version control.

## Key conventions

- Prefer extending `BillContext` when adding new bill inputs or derived outputs. The calendar and bill panel both depend on the shared provider, so parallel local state is likely to drift.
- Keep dates in NextUI calendar types (`DateValue`, `CalendarDate`) while they move through UI state. Only convert to native `Date` objects inside calculation logic where needed.
- Treat the bill total as derived state. The current pattern is to recompute totals from weekday/weekend counts, rates, and service charge rather than store a separate mutable total.
- Theme switching is done by toggling a `dark` class in `app/page.tsx`, not through `next-themes`, even though that package is installed.
- Use the `@/*` TypeScript path alias from `tsconfig.json` when cross-folder imports become awkward.
- Trust `package.json` over the README for workflow commands. The README still mentions `npm test`, but there is no test script configured in the actual project.
