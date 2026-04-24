# CHANGELOG.md

```markdown
# Changelog

All notable changes to **Well Management — Well List** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2024-12-01

### Added

#### Functional Requirements

- **FR-01 — Well Table:** Implemented a responsive, horizontally scrollable table displaying all wells with 8 columns: Status, Rig, Well Name, Well ID, Spud Date, Operator, Contractor, and Actions.
- **FR-02 — Seed Data:** Provided 11 seed wells in `src/features/wellList/data/initialWells.js` used on first load when `localStorage` is empty or unavailable.
- **FR-03 — Active Well Display:** Active well is visually distinguished with a green left border (`#22c55e`) and an animated pulse badge. Inactive wells display a red badge.
- **FR-04 — Single-Active-Well Invariant:** Enforced at the data layer — activating any well sets all other wells to inactive. Exactly one well may be active at any time.
- **FR-05 — localStorage Persistence:** All well state (including activation changes) is persisted to `localStorage` under the key `wellsData`. On load, the application reads from storage and falls back to the 11-well seed dataset if storage is absent, invalid JSON, or a non-array value.
- **FR-06 — Real-Time Multi-Column Filtering:** Per-column text filter inputs rendered in a dedicated filter row inside `<thead>`. Filters apply AND logic — all active filters must match simultaneously. Matching is case-insensitive and partial (substring). Filterable columns: Rig, Well Name, Well ID, Operator, Contractor. Changing any filter resets pagination to page 1.
- **FR-07 — Spud Date Sorting:** Spud Date column header supports ascending and descending sort. Sort direction cycles on each click. Wells with missing or invalid spud dates are sorted to the end regardless of direction. Sort icon reflects current direction.
- **FR-08 — Active Well Pinning:** The active well is always pinned to the top of the list after filtering and sorting. Pinning is applied as the final step in the processing pipeline: filter → sort → pin.
- **FR-09 — Activation Modal:** Clicking Activate on an inactive well opens a confirmation modal. If another well is currently active, the modal displays a warning block identifying the well that will be deactivated. If no well is currently active, the modal shows a simple confirmation message. Confirming activation enforces the single-active-well invariant. Cancelling makes no changes.
- **FR-10 — Pagination Footer:** Full pagination control with configurable page sizes (10, 25, 50 rows per page; default 10). Navigation: first page, previous page, numbered pages with ellipsis markers, next page, last page. Entry range counter: "Showing X – Y of Z entries". Changing page size resets to page 1.
- **FR-11 — Empty State Handling:** "No wells match the current filters." message is displayed in the table body when no wells match the active filter combination.
- **FR-12 — Header Actions:** Create Sidetrack Well and Create New Well buttons in the page header. Each displays an alert message indicating navigation intent (placeholder for future routing).
- **FR-13 — Row Actions:** Details, Edit, and Activate buttons per row. Details and Edit display alert messages indicating navigation intent. Activate button is hidden for the currently active well.

#### Dark Theme

- Implemented a custom dark color palette defined in `tailwind.config.js` under `theme.extend.colors`.
- Background tokens: `#1a1a2e` (page), `#16213e` (table rows, modal, pagination), `#0f3460` (table header), `#1e2a45` (active row, modal cards), `#243352` (hover states).
- Border tokens: `#2a3a5c` (primary borders), `#1e2d4a` (row dividers).
- Text tokens: `#e2e8f0` (primary), `#94a3b8` (secondary), `#64748b` (muted/placeholder), `#f1f5f9` (headings), `#7dd3fc` (accent).
- Status tokens: `#22c55e` / `#14532d` (active badge), `#ef4444` / `#7f1d1d` (inactive badge).
- Accent tokens: `#3b82f6` (primary actions, focus rings), `#1d4ed8` (button hover), `#22c55e` (activate focus ring), `#f59e0b` (warning icon), `#ef4444` (danger border/text).
- Button tokens: `#14532d` / `#166534` (activate button), `#7f1d1d` (warning block background).

#### Accessibility (WCAG AA)

- All interactive elements include `focus:outline-none focus:ring-2 focus:ring-accent-blue` focus indicators.
- Activation modal uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby` attributes.
- Sort button includes a dynamic `aria-label` describing the next sort action.
- Pagination navigation uses `aria-label="Pagination navigation"`, per-button `aria-label` attributes, and `aria-current="page"` on the active page button.
- Disabled pagination buttons use `aria-disabled` and `pointer-events-none` to prevent interaction.
- Filter inputs include `aria-label` attributes for screen reader identification.
- Action buttons include `aria-label` attributes referencing the well name or ID.
- Status badge dots are marked `aria-hidden="true"` to avoid redundant announcements.
- SVG icons are marked `aria-hidden="true"` throughout.

#### Architecture

- `useWells` custom hook centralises all state: wells array, filters, sort configuration, pagination, activation workflow, and localStorage persistence.
- Pure utility functions with full unit test coverage:
  - `filterWells` — AND logic, case-insensitive substring matching, mutation safety.
  - `sortWells` — ascending/descending spud date sort, nulls-last, mutation safety.
  - `pinActive` — active well pinning, relative order preservation, mutation safety.
- Component tree: `WellListPage` → `WellTable` → `TableHeaderFilters` + `WellRow` → `ActionCell` + `ActiveBadge`; `Pagination`; `ActivationModal`.
- Shared SVG icon components: `CloseIcon`, `SearchIcon`, `SortIcon`.

#### Deployment

- `vercel.json` configured with a catch-all SPA rewrite rule: all routes redirect to `index.html`, enabling client-side routing and direct URL access without 404 errors.
- Vite build outputs to `dist/` with content-hashed asset filenames for automatic cache busting.
- No environment variables required for the base application.
- `DEPLOYMENT.md` documents full deployment guide: build configuration, CI/CD setup, environment variables, manual QA checklist, and rollback procedures.

#### Testing

- Vitest + `@testing-library/react` test suite covering:
  - `useWells` hook — initialization, filtering, sorting, pagination, activation workflow, localStorage persistence, `reloadWells`, `handleAction`, `activateWell`.
  - `filterWells` utility — all filter fields, AND logic, case-insensitivity, edge cases (null, undefined, non-array input, empty arrays, empty filters).
  - `sortWells` utility — ascending/descending, null/invalid dates sorted last, mutation safety, equal dates, edge cases.
  - `pinActive` utility — active well pinning, order preservation, mutation safety, edge cases (null, undefined, non-array, empty array, single element, already pinned).

---

[1.0.0]: https://github.com/your-org/well-management-well-list/releases/tag/v1.0.0
```