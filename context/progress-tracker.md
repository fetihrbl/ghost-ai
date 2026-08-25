# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 02: Editor Chrome

## Current Goal

- Build the base chrome shared by every editor screen: the top navbar and the floating left project sidebar, plus a reusable dialog styling pattern for future dialogs.

## Completed

- Feature 01: Design System (`context/feature-specs/01-design-system.md`) — shadcn/ui installed and configured (`components.json`, `lib/utils.ts`); Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea added under `components/ui/`; `lucide-react` installed; dark-only theme tokens from `context/ui-context.md` wired into `app/globals.css` via `@theme inline`, mapped onto shadcn's semantic tokens (`background`, `foreground`, `card`, `primary`, etc.) so the unmodified `components/ui/*` files render correctly; `dark` class forced on `<html>` in `app/layout.tsx` since there is no light mode. Verified via `tsc --noEmit` and `next build` (temporary route exercising all 7 components + `cn()`, then removed).
- Feature 02: Editor Chrome (`context/feature-specs/02-editor-chrome.md`) — `components/editor/editor-navbar.tsx`: `h-14` navbar with left/center/right sections, left section holds a sidebar toggle `Button` swapping `PanelLeftOpen`/`PanelLeftClose` based on an `isSidebarOpen` prop, dark `bg-surface` with `border-b border-surface-border`, controlled via `isSidebarOpen`/`onToggleSidebar` props (state owned by the parent that composes it). `components/editor/project-sidebar.tsx`: `fixed` overlay positioned below the navbar (`top-14`) so it floats above the canvas without affecting layout flow, slides in via `-translate-x-full` → `translate-x-0` on `isOpen`, header with "Projects" title + close button, shadcn `Tabs` (My Projects / Shared) both with empty placeholder text, full-width `New Project` button with `Plus` icon in the footer; accepts `isOpen`/`onClose` props. `components/editor/editor-dialog.tsx`: reusable dialog pattern — `EditorDialogContent` and `EditorDialogFooter` wrap the unmodified `components/ui/dialog.tsx` primitives with brand tokens (`rounded-3xl`, `bg-surface`, `border-surface-border`) per the `ui-context.md` modal spec, re-exporting `Dialog`/`DialogTrigger`/`DialogClose`/`DialogHeader`/`DialogTitle`/`DialogDescription` unchanged; no concrete dialog instances were built, per spec. `components/editor/editor-shell.tsx`: client component composing `EditorNavbar` + `ProjectSidebar` around a `children` slot for the future canvas, owning the `isSidebarOpen` state itself (`useState`). Mounted at the root route (`app/page.tsx` now renders `EditorShell` with a placeholder "canvas area" `children`), replacing the default create-next-app boilerplate. Verified via `tsc --noEmit`, `eslint`, and `next build`, plus Playwright-driven checks against both temporary preview routes and the live root route (toggle behavior, canvas position unaffected, tab switching, dialog open state, sidebar open/close, screenshots) — temporary routes removed after verification.

## In Progress

- None yet.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- `EditorShell` is currently mounted at `/` (root route) as a placeholder, since no project/editor URL structure exists yet (auth and project routing haven't been built). Once project routing lands (e.g. `/projects/[projectId]`), the real editor page should move there and `app/page.tsx` should go back to being a landing/redirect page instead of the editor itself.
- `app/layout.tsx` still has the default create-next-app `<title>`/`<meta description>` — not updated, since branding/metadata wasn't in scope for this change.

## Architecture Decisions

- This project's `shadcn` CLI (v4.19.0) generates components on `@base-ui/react` primitives with the `base-nova` style, not the classic Radix-based `new-york`/`default` style from most shadcn documentation and training data. Generated files use `data-slot`, `data-open`/`data-closed`, and a `render` prop (not `asChild`) for composition. Future `shadcn add` calls will follow this same convention automatically — do not hand-write Radix-based patterns.
- shadcn's semantic color tokens (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `destructive`, `border`, `input`, `ring`) are defined in `app/globals.css` as aliases onto the brand tokens in `context/ui-context.md` (`--bg-base`, `--text-primary`, `--accent-primary`, etc.), so unmodified `components/ui/*` files render in the correct dark theme. App-level code should keep using the brand utility names (`bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `bg-ai`, `text-ai-text`, `bg-state-error`, etc.) rather than the shadcn semantic names, to stay aligned with `ui-context.md`.
- Theme is forced dark via a `dark` class on `<html>` in `app/layout.tsx` (no toggle, no light variant) since the product has no light mode.
- `EditorNavbar` and `ProjectSidebar` (`context/feature-specs/02-editor-chrome.md`) are stateless/controlled: they take `isSidebarOpen`/`isOpen` plus callback props rather than owning state themselves, since the spec describes reusable chrome shells, not a page. `ProjectSidebar` is `fixed`, positioned `top-14` (below the navbar) so it floats as an overlay without pushing canvas content, per the "floating sidebar overlay" layout pattern in `ui-context.md`. `components/editor/editor-shell.tsx` is the component that owns the toggle state and composes the two — kept separate from `EditorNavbar`/`ProjectSidebar` so those stay easy to test and reuse independently of how their state is managed.
- `components/editor/editor-dialog.tsx` implements the "Dialog Pattern" from the spec as styled wrappers (`EditorDialogContent`, `EditorDialogFooter`) around the unmodified `components/ui/dialog.tsx` primitives, rather than a new dialog component — this keeps `components/ui/*` untouched per the protected-foundation-components rule while giving future features brand-token styling (`rounded-3xl`, `bg-surface`) to compose actual dialogs from.

## Session Notes

- Add context needed to resume work in the next session.
