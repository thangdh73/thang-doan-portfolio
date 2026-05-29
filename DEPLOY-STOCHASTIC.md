# Stochastic volume calculation — go live

The UI is in `tools/stochastic-volume/`. The calculation API runs on **Render free tier** (`https://stochastic-vol-api.onrender.com`). The UI calls the API directly (`VITE_API_ORIGIN`) so long Monte Carlo runs are not limited by Vercel serverless timeouts.

Vercel also proxies `/tools/stochastic-volume/health` using `STOCHASTIC_API_URL`.

## API (Render — free)

Deploy once (no credit card on free tier) — **owner only**:

Render Dashboard → **New** → **Blueprint** → connect `thangdh73/stochastic-vol-api` → Apply `render.yaml`.

Do not use unauthorized copies; see [LICENSE](https://github.com/thangdh73/stochastic-vol-api/blob/main/LICENSE).
- Health: https://stochastic-vol-api.onrender.com/health → `"status":"ok"`
- Free tier **spins down after ~15 min idle**; first request after sleep is slow (30–60 s) — OK for a portfolio demo
- Saved projects in the API SQLite DB are **ephemeral** (reset on spin-down/redeploy). Use **Export project file** (`.mmra.json`) for persistence.

After deploy, run from MMRA repo:

```powershell
.\deploy\switch-to-render.ps1
```

## Vercel environment variable

| Name | Value |
|------|--------|
| `STOCHASTIC_API_URL` | `https://stochastic-vol-api.onrender.com` |

(`switch-to-render.ps1` sets this automatically.)

## Rebuild UI manually

```powershell
cd "D:\1-Projects\8-Python code\MMRA_New_UI"
$env:PORTFOLIO_ROOT = "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"
$env:VITE_API_ORIGIN = "https://stochastic-vol-api.onrender.com"
$env:VITE_API_BASE = ""
.\deploy\build-personal-site.ps1
Copy-Item -Recurse -Force "frontend\dist\*" "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio\tools\stochastic-volume\"
```

## Stop Fly.io (avoid charges)

If you used Fly.io earlier:

```powershell
flyctl apps destroy stochastic-vol-api --yes
```

## Enable login (Render environment)

Generate secrets locally:

```powershell
cd "D:\1-Projects\8-Python code\MMRA_New_UI"
$env:PORTFOLIO_ROOT = "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"
.\deploy\setup-auth-env.ps1
```

In **Render** → **stochastic-vol-api** → **Environment**, add:

| Variable | Example |
|----------|---------|
| `MMRA_JWT_SECRET` | long random string (from script) |
| `MMRA_AUTH_USERS` | `you@email.com:YourPassword` |

Multiple users: `user1@a.com:pass1,user2@b.com:pass2`

Redeploy the API after saving. The UI shows a login page when `auth_enabled` is true.

Local dev without login: leave `MMRA_AUTH_USERS` unset.

## Verify

- https://thang-doan.vercel.app/tools/stochastic-volume/
- https://thang-doan.vercel.app/tools/stochastic-volume/health
- Run simulation (wait for cold start if API was idle)
