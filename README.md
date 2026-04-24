# Well Management — Well List

A production-ready well management dashboard built with **React 18**, **Vite**, and **Tailwind CSS**. It provides a filterable, sortable, paginated table of rig wells with a modal-driven activation workflow and localStorage persistence.

---

## Overview & Business Context

Oil and gas operations require a clear, real-time view of all rig wells and their operational status. This application gives operations teams a single interface to:

- View all wells across rigs in a structured table
- Filter wells by rig, well name, well ID, operator, and contractor
- Sort wells by spud date (ascending or descending)
- Activate a well through a confirmation modal that enforces the **single-active-well invariant** — only one well may be active at any time
- Navigate large well lists with a full-featured pagination control
- Persist all state changes across page refreshes via `localStorage`

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Language | JavaScript ES2022 (JSX) |
| Testing | Vitest + @testing-library/react |
| Linting | ESLint 8 (react, react-hooks plugins) |
| Deployment | Vercel |

---

## Folder Structure

```
well-management-well-list/
├── index.html                          # Vite HTML entry point
├── vite.config.js                      # Vite + Vitest configuration
├── tailwind.config.js                  # Tailwind theme (custom color palette)
├── postcss.config.js                   # PostCSS (Tailwind + Autoprefixer)
├── .eslintrc.cjs                       # ESLint rules (react, react-hooks)
├── vercel.json                         # Vercel SPA rewrite rules
├── package.json                        # Dependencies and npm scripts
│
└── src/
    ├── main.jsx                        # ReactDOM root mount
    ├── App.jsx                         # Root component — renders WellListPage
    ├── index.css                       # Tailwind base/components/utilities import
    │
    ├── features/
    │   └── wellList/
    │       ├── WellListPage.jsx        # Page-level component — layout, header, wires hooks to UI
    │       │
    │       ├── components/
    │       │   ├── WellTable.jsx       # Table shell — columns, sort header, delegates rows
    │       │   ├── WellRow.jsx         # Single table row — status badge, cell data, action cell
    │       │   ├── ActionCell.jsx      # Details / Edit / Activate buttons per row
    │       │   ├── ActiveBadge.jsx     # Animated green "Active" pill badge
    │       │   ├── TableHeaderFilters.jsx  # Filter input row rendered inside <thead>
    │       │   ├── Pagination.jsx      # Full pagination control (page nav + page size selector)
    │       │   └── ActivationModal.jsx # Confirmation modal for well activation
    │       │
    │       ├── hooks/
    │       │   ├── useWells.js         # Central state hook — wells, filters, sort, pagination, activation
    │       │   └── useWells.test.js    # Unit tests for useWells hook
    │       │
    │       ├── data/
    │       │   └── initialWells.js     # Seed data — 11 wells used when localStorage is empty
    │       │
    │       └── utils/
    │           ├── filterWells.js      # Pure filter utility (AND logic, case-insensitive)
    │           ├── filterWells.test.js # Unit tests for filterWells
    │           ├── sortWells.js        # Pure sort utility (spud date asc/desc, nulls last)
    │           ├── sortWells.test.js   # Unit tests for sortWells
    │           ├── pinActive.js        # Pure utility — pins active well to index 0
    │           └── pinActive.test.js   # Unit tests for pinActive
    │
    └── shared/
        └── icons/
            ├── CloseIcon.jsx           # SVG close (×) icon
            ├── SearchIcon.jsx          # SVG magnifying glass icon
            └── SortIcon.jsx            # SVG sort chevron icon (asc / desc / neutral)
```

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Vite starts a local dev server at `http://localhost:5173` with HMR enabled.

### Build for production

```bash
npm run build
```

Output is written to `dist/`. The build is fully static — no server required.

### Preview production build locally

```bash
npm run preview
```

Serves the `dist/` folder at `http://localhost:4173`.

### Run tests

```bash
npm run test
```

Runs all `*.test.js` files with Vitest in jsdom environment. Tests cover:

- `useWells` hook — initialization, filtering, sorting, pagination, activation workflow, localStorage persistence
- `filterWells` utility — all filter fields, AND logic, case-insensitivity, edge cases
- `sortWells` utility — ascending/descending, null/invalid dates, mutation safety
- `pinActive` utility — active well pinning, order preservation, mutation safety

### Lint

```bash
npm run lint
```

---

## Key Features

### Well Table

- Displays all wells in a responsive, horizontally scrollable table
- Columns: Status, Rig, Well Name, Well ID, Spud Date, Operator, Contractor, Actions
- Active well is visually distinguished with a green left border and an animated pulse badge
- Inactive wells display a red "Inactive" badge

### Filtering

- Per-column text filters rendered in a dedicated filter row inside `<thead>`
- Filters apply **AND logic** — all active filters must match simultaneously
- Matching is **case-insensitive** and **partial** (substring match)
- Filterable columns: Rig, Well Name, Well ID, Operator, Contractor
- Changing any filter resets pagination to page 1

### Sorting

- Spud Date column supports ascending and descending sort
- Sort direction cycles on each click: ascending → descending → ascending
- Wells with missing or invalid spud dates are sorted to the end regardless of direction
- Sort icon reflects current direction (up chevron, down chevron, or neutral)

### Active Well Pinning

- The active well is always pinned to the top of the list after filtering and sorting
- Pinning is applied as the final step in the processing pipeline: filter → sort → pin

### Activation Modal

- Clicking **Activate** on an inactive well opens a confirmation modal
- If another well is currently active, the modal displays a warning identifying the well that will be deactivated
- If no well is currently active, the modal shows a simple confirmation message
- Confirming activation enforces the **single-active-well invariant**: exactly one well is active at all times
- Cancelling the modal makes no changes

### Pagination

- Configurable page sizes: 10, 25, 50 rows per page (default: 10)
- Navigation: first page, previous page, numbered pages, next page, last page
- Ellipsis markers appear for large page counts
- Entry range counter: "Showing X – Y of Z entries"
- Changing page size resets to page 1

### Persistence

- All well state (including activation changes) is persisted to `localStorage` under the key `wellsData`
- On load, the app reads from `localStorage`; if absent or invalid, it falls back to the 11-well seed dataset
- A `reloadWells` function is available to re-hydrate state from storage on demand

---

## Color Palette Reference

All colors are defined in `tailwind.config.js` under `theme.extend.colors`.

### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| `background-primary` | `#1a1a2e` | Page background |
| `background-secondary` | `#16213e` | Table rows, modal panels, pagination bar |
| `background-tertiary` | `#0f3460` | Table header row |
| `background-card` | `#1e2a45` | Active well row, modal info cards |
| `background-hover` | `#243352` | Row and button hover state |

### Borders

| Token | Hex | Usage |
|---|---|---|
| `border-primary` | `#2a3a5c` | Table borders, modal borders, input borders |
| `border-secondary` | `#1e2d4a` | Table row dividers |

### Text

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#e2e8f0` | Primary content text |
| `text-secondary` | `#94a3b8` | Secondary / supporting text |
| `text-muted` | `#64748b` | Placeholder text, disabled states |
| `text-heading` | `#f1f5f9` | Page and modal headings |
| `text-accent` | `#7dd3fc` | Highlighted accent text |

### Status

| Token | Hex | Usage |
|---|---|---|
| `status-active` | `#22c55e` | Active badge text and dot |
| `status-active-bg` | `#14532d` | Active badge background |
| `status-inactive` | `#ef4444` | Inactive badge text and dot |
| `status-inactive-bg` | `#7f1d1d` | Inactive badge background |

### Accents

| Token | Hex | Usage |
|---|---|---|
| `accent-blue` | `#3b82f6` | Primary action buttons, focus rings, active page |
| `accent-blue-dark` | `#1d4ed8` | Primary button hover |
| `accent-green` | `#22c55e` | Activate button focus ring |
| `accent-yellow` | `#f59e0b` | Warning icon in activation modal |
| `accent-red` | `#ef4444` | Danger warning block border and text |

### Buttons

| Token | Hex | Usage |
|---|---|---|
| `button-success` | `#14532d` | Activate button background |
| `button-success-hover` | `#166534` | Activate button hover background |
| `button-danger` | `#7f1d1d` | Warning block background in modal |

---

## Deployment

This project is configured for **Vercel** deployment.

`vercel.json` contains a catch-all rewrite rule that redirects all routes to `index.html`, enabling client-side routing:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Deploy steps

1. Push the repository to GitHub (or GitLab / Bitbucket)
2. Import the project in the [Vercel dashboard](https://vercel.com/new)
3. Vercel auto-detects Vite — no additional configuration required
4. Every push to `main` triggers an automatic production deployment

### Environment variables

No environment variables are required for the base application. If extending with a backend API, prefix all variables with `VITE_` and access them via `import.meta.env.VITE_*`.

---

## License

Private