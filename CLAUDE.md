# thang-doan-portfolio

Static personal portfolio for Thang Doan (Senior Geologist / Geological Modeler). Plain HTML/CSS/vanilla JS — no framework, no build step for the site itself. Deployed on Vercel.

Live: https://thang-doan.vercel.app/

## Canonical working copy

Use **this folder** (`D:\1-Projects\8-Python code\8-thang-doan-portfolio`) going forward. There is an older working copy at `C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio` (same git remote, was the Cursor-managed copy) — treat it as retired. A few docs in this repo (`SYNC-FOLDERS.md`, `DEPLOY-STOCHASTIC.md`) still reference that old Cursor path in example commands; mentally substitute this folder's path when following them, or update those docs if you're touching them anyway.

Remote: `https://github.com/thangdh73/thang-doan-portfolio.git`, branch `main`. Vercel auto-deploys on push to `main` — pushing here is a live-site change, not just a repo update.

## Structure

- `index.html` — the whole portfolio (all CV sections: hero, about, skills, experience, projects, education, achievements, contact). No templating; edit sections directly in the HTML.
- `css/` — `variables.css`, `base.css`, `layout.css`, `components.css`, `data-lab.css`, `print.css`.
- `js/site-config.js` — single source for contact info (email, phone, location, LinkedIn) and career-start years used for auto-computed "years of experience" text. Edit this, not scattered dates in `index.html`.
- `js/main.js`, `js/project-details.js` — page behavior.
- `assets/` — images, `cv.pdf`, `projects/`, `technical/`, `publications/` (PDFs served with explicit `Content-Type: application/pdf` header in `vercel.json`).
- `tools/data-lab.html` + `js/data-lab.js` — lightweight in-browser CSV/Excel analytics + deterministic STOIIP calculator (`?mode=volume`).
- `tools/stochastic-volume/` — **generated output, not hand-edited**. This is the built frontend of a separate app (Monte Carlo volumetrics — see "Related repo" below), copied in wholesale. Never edit files under here directly; rebuild the source project and re-copy.
- `api/` — Vercel serverless functions:
  - `pp.py` — Python function serving a full-text search + MCP endpoint over a petrophysical reference library (`data/pp_index.db`, SQLite FTS5, 78 docs). Auth via `PP_API_KEY`. Don't regenerate `pp_index.db` casually — it's a checked-in 24MB index.
  - `stochastic/[...path].js`, `stochastic-health.js` — proxy requests through to the externally-hosted Monte Carlo API (see below); not the calculation engine itself.
- `data/pp_index.db` — SQLite index backing `api/pp.py`. Large binary, treat as generated data.

## Local dev

```powershell
.\start-server.ps1        # python -m http.server on :8765
```

or just open `index.html` directly in a browser. No build/watch step needed for site edits — it's static.

## Related repo: the embedded Monte Carlo app

`tools/stochastic-volume/` is the built output of a **separate** project (probabilistic subsurface volumetrics / Monte Carlo engine). Source lives in a sibling folder under `D:\1-Projects\8-Python code\` (the active one has a `-4-Claude` suffix; older deploy docs here reference `MMRA_New_UI` without that suffix — check which folder actually exists before running the rebuild commands in `DEPLOY-STOCHASTIC.md`).

To update the embedded tool after changing the source app:
1. Build the frontend in the source project (`frontend/dist/`).
2. Copy `frontend/dist/*` → `tools/stochastic-volume/` here (see `scripts/copy-stochastic-build.ps1` for the expected env vars, though the path defaults there are stale — pass paths explicitly).
3. Commit and push here — this is what actually deploys the update.

The calculation API itself is **not** hosted on Vercel — it runs separately on Render free tier (`https://stochastic-vol-api.onrender.com`, see `DEPLOY-STOCHASTIC.md`). Vercel just proxies `/tools/stochastic-volume/api/*` and `/health` to it (`vercel.json` rewrites, `STOCHASTIC_API_URL` env var). Free tier spins down after ~15 min idle — first request after idle is slow (30-60s), which is expected, not a bug.

## Deploy / secrets

- `vercel.json`: `outputDirectory: "."`, no build step (`scripts/vercel-build.js` is a no-op) except for the proxied API rewrites/headers/function config.
- `.env.local` is gitignored (`.env*` in `.gitignore`) — only contains a Vercel CLI OIDC token, no app secrets to worry about here. Real secrets (`PP_API_KEY`, stochastic API auth) live in Vercel/Render project env vars, not in this repo.
- Numerous top-level `DEPLOY*.md` / `*.md` files are historical/alternative deploy notes (Netlify, GitHub Pages, Railway, Fly.io). `DEPLOY-STOCHASTIC.md` is the current source of truth for the Monte Carlo tool; the others may be stale — verify before following.
