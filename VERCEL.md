# Deploy on Vercel (you already have an account)

Repo: **https://github.com/thangdh73/thang-doan-portfolio**

This site is static (HTML/CSS/JS). A minimal **`package.json`** runs `npm run build` on Vercel (no real compile — see `scripts/vercel-build.js`).

**Seeing `404 DEPLOYMENT_NOT_FOUND`?** → [VERCEL-FIX-404.md](VERCEL-FIX-404.md)

---

## Option A — Import from GitHub (recommended)

1. Log in at **https://vercel.com/dashboard**

2. Click **Add New…** → **Project**

3. **Import** the Git repository `thang-doan-portfolio`  
   (If you do not see it: **Adjust GitHub App Permissions** and allow access to this repo.)

4. **Configure Project** — expand **Build and Output Settings**:

   | Setting | What to do |
   |---------|------------|
   | Framework Preset | **Other** |
   | Root Directory | `./` |
   | **Build Command** | Turn **Override** ON → delete all text (field must be **empty**) |
   | **Output Directory** | Turn **Override** ON → type **`.`** only (not `public`) |
   | **Install Command** | Turn **Override** ON → delete all text (field must be **empty**) |

   Do **not** leave `npm run build` or `npm install` — this repo has no `package.json`.

5. Click **Deploy**

### Fix “npm run build” / missing package.json (existing project)

If a deploy already failed:

1. Vercel dashboard → project **thang-doan-portfolio** (or **thangdh**)
2. **Settings** → **General** → **Build & Development Settings**
3. **Framework Preset:** Other
4. **Build Command:** Override **ON** → leave **blank**
5. **Output Directory:** Override **ON** → **`.`**
6. **Install Command:** Override **ON** → leave **blank**
7. **Save**
8. **Deployments** → latest failed deploy → **⋯** → **Redeploy**

This repo’s **`vercel.json`** also sets empty build/install commands so Git deploys stay correct after you push.

6. Production URL: **https://thang-doan.vercel.app/**  
   (Set project name to `thang-doan` in Vercel — see **Change URL** below.)

7. **`js/site-config.js`** should include:

   ```javascript
   siteUrl: "https://thang-doan.vercel.app/",
   ```

### Change URL to `thang-doan.vercel.app`

Default Vercel address is **`{project-name}.vercel.app`**.

1. Dashboard → your project → **Settings** → **General**
2. **Project Name** → change to **`thang-doan`** → **Save**
3. **Settings** → **Domains** — you should see **`thang-doan.vercel.app`**
4. Old URLs (`thang-doan-portfolio.vercel.app`, `thangdh.vercel.app`) may redirect or stop working
5. **Deployments** → **Redeploy** production if the new domain does not work immediately

8. Commit and push — Vercel redeploys automatically:

   ```powershell
   git add js/site-config.js
   git commit -m "Set siteUrl for Vercel"
   git push origin main
   ```

---

## Option B — Deploy from your PC (CLI)

```powershell
cd "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"
npx vercel login
npx vercel
```

Follow prompts (link to your Vercel account, confirm project name).

Production deploy:

```powershell
npx vercel --prod
```

Copy the production URL into `siteUrl` in `js/site-config.js` and push to GitHub if the project is connected.

---

## After deploy — quick tests

| URL | Should work |
|-----|-------------|
| `/` | Home page |
| `/tools/data-lab.html` | Data Analysis Lab |
| `/#projects` | Projects — click **Tembakau IPC** for project image |

---

## Custom domain (optional)

Vercel dashboard → your project → **Settings** → **Domains** → add e.g. `thangdoan.com` and follow DNS instructions.

---

## Auto-deploy

With GitHub connected, every **`git push`** to **`main`** triggers a new deployment. No Netlify needed.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails / `npm run build` / no package.json | Settings → Build: **override** Build & Install to **empty**, Output **`.`** → Redeploy |
| 404 on subpages | `vercel.json` is already in the repo for clean URLs |
| Tembakau image missing | File must be `assets/projects/tembakau-cross-sections.JPG` (case-sensitive on Vercel) |
| Old site after push | Wait ~1 min; hard refresh `Ctrl+F5` |

---

## Config in this repo

- **`vercel.json`** — clean URLs, no trailing slash
- **`404.html`** — custom not-found page
