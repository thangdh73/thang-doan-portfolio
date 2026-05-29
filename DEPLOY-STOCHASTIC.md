# Stochastic volume calculation — go live

The UI is in `tools/stochastic-volume/`. The calculation API runs on **Render** (free). Vercel proxies API calls using `STOCHASTIC_API_URL`.

## One-time: deploy the API on Render

1. Push the **MMRA_New_UI** repo to GitHub (if not already).
2. Go to [render.com](https://render.com) → **New** → **Blueprint**.
3. Connect the MMRA repo — Render reads `render.yaml` at the repo root.
4. After deploy, copy the service URL, e.g. `https://stochastic-vol-api.onrender.com` (no trailing slash).
5. Test: `https://YOUR-SERVICE.onrender.com/health` → `"status":"ok"`.

## Vercel environment variable

In **Vercel** → project **thang-doan-portfolio** → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `STOCHASTIC_API_URL` | `https://stochastic-vol-api.onrender.com` |

Apply to **Production**, then **Redeploy** the latest deployment.

## Push portfolio changes

```powershell
cd d:\1-Projects\thang-doan-portfolio
git add tools/stochastic-volume vercel.json api tools/data-lab.html css/data-lab.css index.html DEPLOY-STOCHASTIC.md
git commit -m "Add stochastic volume calculation app"
git push
```

## Verify

- https://thang-doan.vercel.app/tools/stochastic-volume/
- https://thang-doan.vercel.app/tools/stochastic-volume/health
- https://thang-doan.vercel.app/tools/data-lab?mode=volume (link to full app)
- Run simulation in the app (needs API awake on Render free tier)

## Rebuild UI (after code changes in MMRA_New_UI)

```powershell
cd "d:\1-Projects\8-Python code\MMRA_New_UI"
.\deploy\build-personal-site.ps1
Copy-Item -Recurse -Force "frontend\dist\*" "d:\1-Projects\thang-doan-portfolio\tools\stochastic-volume\"
```

Then commit and push the portfolio repo again.
