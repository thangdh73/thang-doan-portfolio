# Stochastic volume calculation — go live

The UI is in `tools/stochastic-volume/`. The calculation API runs on **Fly.io** (production: `https://stochastic-vol-api.fly.dev`). The UI calls the API directly (`VITE_API_ORIGIN`) so long Monte Carlo runs are not limited by Vercel serverless timeouts.

Vercel also proxies `/tools/stochastic-volume/health` using `STOCHASTIC_API_URL` (optional health check).

## API (Fly.io)

- Live URL: **https://stochastic-vol-api.fly.dev**
- Health: https://stochastic-vol-api.fly.dev/health → `"status":"ok"`
- Source repo: https://github.com/thangdh73/stochastic-vol-api
- Redeploy from MMRA root: `flyctl deploy --remote-only`

Alternative: deploy with Render using `render.yaml` (see MMRA repo).

## Vercel environment variable

In **Vercel** → project **thang-doan** → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `STOCHASTIC_API_URL` | `https://stochastic-vol-api.fly.dev` |

Apply to **Production**, then **Redeploy**.

## Rebuild UI (after code changes in MMRA_New_UI)

```powershell
cd "d:\1-Projects\8-Python code\MMRA_New_UI"
$env:VITE_API_ORIGIN = "https://stochastic-vol-api.fly.dev"
$env:VITE_API_BASE = ""
.\deploy\build-personal-site.ps1
Copy-Item -Recurse -Force "frontend\dist\*" "d:\1-Projects\thang-doan-portfolio\tools\stochastic-volume\"
```

Then commit and push the portfolio repo.

## Verify

- https://thang-doan.vercel.app/tools/stochastic-volume/
- https://thang-doan.vercel.app/tools/stochastic-volume/health
- https://thang-doan.vercel.app/tools/data-lab?mode=volume
- Run simulation in the app (Fly free tier may cold-start ~5–10 s when idle)
