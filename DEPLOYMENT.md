# DEPLOYMENT.md

```markdown
# Deployment Guide

This document covers everything required to deploy **Well Management — Well List** to production on Vercel, including build configuration, CI/CD setup, environment variables, QA checklist, and rollback procedures.

---

## Platform

**Vercel** — static hosting with automatic SPA rewrite support.

The application is a fully static single-page application (SPA). No server-side rendering, no API routes, and no backend are required. The compiled output is a set of static HTML, CSS, and JavaScript files served directly from Vercel's CDN.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Vercel CLI (optional) | ≥ 32 |
| Git | any recent version |

---

## Build Configuration

### Build command

```bash
npm run build
```

Vite compiles the application and writes the output to the `dist/` directory.

### Output directory

```
dist/
```

### Install command

```bash
npm install
```

### Node.js version

Set the Node.js version to **18.x** or higher in the Vercel project settings under **Settings → General → Node.js Version**.

---

## Vercel Configuration

The repository includes a `vercel.json` file at the project root that configures the SPA catch-all rewrite rule:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

This rule ensures that all routes — including deep links and browser refreshes — are handled by `index.html`, allowing React's client-side router to take over. Without this rule, navigating directly to any path other than `/` would return a 404 from Vercel's CDN.

No additional Vercel configuration is required.

---

## Environment Variables

**No environment variables are required** for the base application.

All application state is managed in-memory and persisted to `localStorage`. There is no backend API, no authentication service, and no external data source.

If you extend the application with a backend API in the future:

- Prefix all client-side environment variables with `VITE_`
- Access them in code via `import.meta.env.VITE_*`
- Add them in the Vercel dashboard under **Settings → Environment Variables**
- Never use `process.env` — Vite does not expose it to the browser bundle

Example (future use only):

```
VITE_API_BASE_URL=https://api.example.com
```

---

## CI/CD — Automatic Deployment via Vercel

### Initial setup

1. Push the repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Open the [Vercel dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import the repository from your Git provider.
4. Vercel auto-detects the Vite framework. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

### Automatic deployments

| Event | Deployment type |
|---|---|
| Push to `main` | Production deployment |
| Push to any other branch | Preview deployment (unique URL) |
| Pull request opened | Preview deployment (linked in PR) |

Every push to `main` triggers a full production build and deployment automatically. No manual steps are required after the initial setup.

### Preview deployments

Every branch and pull request receives a unique preview URL (e.g., `https://well-management-well-list-git-feature-xyz.vercel.app`). Use preview deployments to validate changes before merging to `main`.

---

## Manual Deployment via Vercel CLI

If you need to deploy manually without a Git push:

### Install the Vercel CLI

```bash
npm install -g vercel
```

### Authenticate

```bash
vercel login
```

### Deploy to preview

```bash
vercel
```

### Deploy to production

```bash
vercel --prod
```

Run these commands from the project root. Vercel will use the `vercel.json` configuration automatically.

---

## Local Production Build Verification

Before pushing to production, verify the build locally:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The preview server starts at `http://localhost:4173`. Verify that:

- The application loads correctly at `/`
- The well table renders with all 11 seed wells
- Filters, sorting, and pagination work as expected
- The activation modal opens and confirms correctly
- `localStorage` persistence works across page refreshes
- No console errors appear in the browser developer tools

---

## Manual QA Checklist

Run through this checklist after every production deployment.

### Page load

- [ ] Application loads at the production URL without errors
- [ ] Page title reads **Well Management**
- [ ] Well List heading and subtitle are visible
- [ ] All 11 seed wells are displayed on first load (or persisted state from `localStorage`)
- [ ] No JavaScript errors in the browser console

### Well table

- [ ] Table renders with all 8 columns: Status, Rig, Well Name, Well ID, Spud Date, Operator, Contractor, Actions
- [ ] Active well displays a green left border and an animated green **Active** badge
- [ ] Inactive wells display a red **Inactive** badge
- [ ] Active well is pinned to the top of the list

### Filtering

- [ ] Typing in the **Rig** filter narrows the table rows correctly
- [ ] Typing in the **Well Name** filter narrows the table rows correctly
- [ ] Typing in the **Well ID** filter narrows the table rows correctly
- [ ] Typing in the **Operator** filter narrows the table rows correctly
- [ ] Typing in the **Contractor** filter narrows the table rows correctly
- [ ] Multiple filters combine with AND logic
- [ ] Filtering is case-insensitive
- [ ] Clearing a filter restores the full result set
- [ ] Applying a filter resets pagination to page 1
- [ ] "No wells match the current filters." message appears when no results match

### Sorting

- [ ] Clicking **Spud Date** column header sorts ascending (earliest first)
- [ ] Clicking **Spud Date** column header again sorts descending (latest first)
- [ ] Sort icon reflects the current direction
- [ ] Wells with missing spud dates appear at the end regardless of sort direction

### Pagination

- [ ] Entry counter shows correct range (e.g., "Showing 1 – 10 of 11 entries")
- [ ] Page 2 shows the remaining well(s)
- [ ] First, Previous, Next, and Last navigation buttons work correctly
- [ ] Disabled navigation buttons are visually dimmed and non-interactive
- [ ] Changing page size to 25 shows all 11 wells on one page
- [ ] Changing page size resets to page 1

### Activation modal

- [ ] Clicking **Activate** on an inactive well opens the confirmation modal
- [ ] Modal displays the name and ID of the well to be activated
- [ ] If another well is currently active, a warning block identifies it
- [ ] Clicking **Cancel** closes the modal without changing any well status
- [ ] Clicking **Activate Well** sets the target well to active and all others to inactive
- [ ] After activation, the newly active well is pinned to the top of the table
- [ ] The **Activate** button is not shown for the currently active well

### Persistence

- [ ] Activating a well and refreshing the page preserves the active well status
- [ ] Applied filters are not persisted across refreshes (by design — only well data is persisted)

### Header actions

- [ ] **Create Sidetrack Well** button displays an alert with the expected message
- [ ] **Create New Well** button displays an alert with the expected message

---

## Rollback Procedure

### Rollback via Vercel dashboard (recommended)

1. Open the [Vercel dashboard](https://vercel.com) and navigate to the project.
2. Click the **Deployments** tab.
3. Locate the last known-good deployment.
4. Click the **⋯** menu next to that deployment.
5. Select **Promote to Production**.

The previous deployment is instantly promoted to production. No rebuild is required.

### Rollback via Git revert

If the issue is in the source code and you want to revert the commit:

```bash
# Identify the commit to revert
git log --oneline

# Revert the offending commit
git revert <commit-hash>

# Push to main — triggers an automatic production deployment
git push origin main
```

### Rollback via Vercel CLI

```bash
# List recent deployments
vercel ls

# Promote a specific deployment URL to production
vercel promote <deployment-url> --scope <team-or-username>
```

---

## Build Artifacts

The `dist/` directory is generated at build time and is excluded from version control via `.gitignore`. It contains:

```
dist/
├── index.html          # Entry point — served for all routes via vercel.json rewrite
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript (React + application code)
│   └── index-[hash].css # Compiled Tailwind CSS
└── favicon.svg         # Application favicon
```

Asset filenames include a content hash for cache busting. Vercel sets long-lived cache headers on hashed assets automatically.

---

## Troubleshooting

### Blank page after deployment

**Cause:** The `dist/` output directory is incorrect or the build failed silently.

**Fix:** Check the Vercel build logs. Confirm the output directory is set to `dist` in the Vercel project settings.

### 404 on page refresh or direct URL access

**Cause:** The SPA rewrite rule in `vercel.json` is missing or malformed.

**Fix:** Verify that `vercel.json` at the project root contains:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Redeploy after correcting the file.

### Well data not persisting

**Cause:** The browser's `localStorage` is unavailable (private/incognito mode, storage quota exceeded, or browser policy).

**Fix:** This is expected behavior in private browsing mode. The application falls back to the 11-well seed dataset on every load when `localStorage` is unavailable. No deployment change is required.

### Styles missing or broken

**Cause:** Tailwind CSS purge configuration is not picking up all class names, or the PostCSS build step failed.

**Fix:** Verify that `tailwind.config.js` includes the correct `content` glob:

```js
content: [
  './index.html',
  './src/**/*.{js,jsx}',
]
```

Run `npm run build` locally and inspect the compiled CSS in `dist/assets/` to confirm Tailwind classes are present.

### Build fails with dependency errors

**Fix:**

```bash
# Remove node_modules and lock file, then reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Related Documentation

- [README.md](./README.md) — Project overview, setup instructions, and feature documentation
- [Vercel Documentation](https://vercel.com/docs) — Platform reference
- [Vite Build Guide](https://vitejs.dev/guide/build.html) — Build configuration reference
```