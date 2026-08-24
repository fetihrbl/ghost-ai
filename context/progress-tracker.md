# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 01: Design System

## Current Goal

- Install and configure shadcn/ui, add the design system primitives (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea), install lucide-react, and wire the dark theme tokens from `context/ui-context.md` into `globals.css`.

## Completed

- Feature 01: Design System (`context/feature-specs/01-design-system.md`) — shadcn/ui installed and configured (`components.json`, `lib/utils.ts`); Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea added under `components/ui/`; `lucide-react` installed; dark-only theme tokens from `context/ui-context.md` wired into `app/globals.css` via `@theme inline`, mapped onto shadcn's semantic tokens (`background`, `foreground`, `card`, `primary`, etc.) so the unmodified `components/ui/*` files render correctly; `dark` class forced on `<html>` in `app/layout.tsx` since there is no light mode. Verified via `tsc --noEmit` and `next build` (temporary route exercising all 7 components + `cn()`, then removed).

## In Progress

- None yet.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- This project's `shadcn` CLI (v4.19.0) generates components on `@base-ui/react` primitives with the `base-nova` style, not the classic Radix-based `new-york`/`default` style from most shadcn documentation and training data. Generated files use `data-slot`, `data-open`/`data-closed`, and a `render` prop (not `asChild`) for composition. Future `shadcn add` calls will follow this same convention automatically — do not hand-write Radix-based patterns.
- shadcn's semantic color tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `destructive`, `border`, `input`, `ring`) are defined in `app/globals.css` as aliases onto the brand tokens in `context/ui-context.md` (`--bg-base`, `--text-primary`, `--accent-primary`, etc.), so unmodified `components/ui/*` files render in the correct dark theme. App-level code should keep using the brand utility names (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `bg-ai`, `text-ai-text`, `bg-state-error`, etc.) rather than the shadcn semantic names, to stay aligned with `ui-context.md`.
- Theme is forced dark via a `dark` class on `<html>` in `app/layout.tsx` (no toggle, no light variant) since the product has no light mode.

## Session Notes

- Add context needed to resume work in the next session.
