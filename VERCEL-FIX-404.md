# Fix Vercel `404 DEPLOYMENT_NOT_FOUND`

**URL:** https://thang-doan.vercel.app/

This error means **no successful deployment** is attached to that address (build failed or never finished).

---

## Step 1 — Fix build settings (dashboard)

1. **https://vercel.com/dashboard** → open project **thangdh** (or **thang-doan-portfolio**)
2. **Settings** → **General** → **Build & Development Settings**
3. Set:

| Setting | Value |
|---------|--------|
| Framework Preset | **Other** |
| Build Command | **Override ON** → `npm run build` |
| Output Directory | **Override ON** → `.` |
| Install Command | **Override ON** → `npm install` (or leave default) |

4. **Save**

The repo now includes **`package.json`** so `npm run build` succeeds (it only logs a message; your HTML stays in the root folder).

---

## Step 2 — Push the fix to GitHub

```powershell
cd "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"
git add package.json scripts/vercel-build.js vercel.json VERCEL-FIX-404.md
git commit -m "Fix Vercel deploy: add package.json and static build script"
git push origin main
```

Vercel will start a **new deployment** automatically.

---

## Step 3 — Wait for green “Ready”

1. Project → **Deployments**
2. Open the latest deployment
3. Status must be **Ready** (not Error or Canceled)
4. Open **https://thang-doan.vercel.app/** again (hard refresh: `Ctrl+F5`)

---

## Step 4 — If it still fails

1. **Deployments** → failed deploy → read the **Build Logs**
2. Common fixes:
   - **Output Directory** must be `.` not `public`
   - **Root Directory** must be `./` (repo root)
3. **Redeploy:** ⋯ menu → **Redeploy** → check **Use existing Build Cache** OFF

---

## Step 5 — Domain

**Settings** → **Domains** → confirm `thang-doan.vercel.app` is listed and points to **Production**.

---

## Still broken?

Create a **new** deployment manually:

**Deployments** → **Create Deployment** → branch **`main`** → **Deploy**

Or delete the project and re-import from GitHub with the settings in [VERCEL.md](VERCEL.md).
