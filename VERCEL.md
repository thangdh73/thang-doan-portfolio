# Deploy on Vercel (you already have an account)

Repo: **https://github.com/thangdh73/thang-doan-portfolio**

This site is static (HTML/CSS/JS). No build step required.

---

## Option A — Import from GitHub (recommended)

1. Log in at **https://vercel.com/dashboard**

2. Click **Add New…** → **Project**

3. **Import** the Git repository `thang-doan-portfolio`  
   (If you do not see it: **Adjust GitHub App Permissions** and allow access to this repo.)

4. **Configure Project:**

   | Setting | Value |
   |---------|--------|
   | Framework Preset | **Other** |
   | Root Directory | `.` (leave default) |
   | Build Command | *(empty — delete any default)* |
   | Output Directory | `.` or leave as root |
   | Install Command | *(empty)* |

5. Click **Deploy**

6. Production URL: **https://thangdh.vercel.app/**

7. **`js/site-config.js`** should include:

   ```javascript
   siteUrl: "https://thangdh.vercel.app/",
   ```

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
| Build fails | Clear **Build Command** and **Install Command**; output = site root |
| 404 on subpages | `vercel.json` is already in the repo for clean URLs |
| Tembakau image missing | File must be `assets/projects/tembakau-cross-sections.JPG` (case-sensitive on Vercel) |
| Old site after push | Wait ~1 min; hard refresh `Ctrl+F5` |

---

## Config in this repo

- **`vercel.json`** — clean URLs, no trailing slash
- **`404.html`** — custom not-found page
