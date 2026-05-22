# Deploy for free (recommended)

Two **100% free** options. No credit card required for basic use.

---

## Option A — Netlify Drop (fastest, ~2 minutes)

Best if you want the site online **today** without using Git.

1. Open **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Sign up free (email or GitHub) if asked.
3. Drag the entire **`thang-doan-portfolio`** folder onto the page.
4. Netlify gives you a URL like `https://random-name-123.netlify.app`.
5. Optional: **Site settings → Domain management → Options → Edit site name** → choose `thang-doan` → URL becomes `https://thang-doan.netlify.app` (if available).
6. Update **`js/site-config.js`**:
   ```javascript
   siteUrl: "https://YOUR-SITE.netlify.app",
   ```
7. Drag the folder onto Netlify Drop again (or connect GitHub for auto-updates).

**Limits (free tier):** 100 GB bandwidth/month — more than enough for a personal portfolio.

---

## Option B — GitHub Pages (free, good for updates)

Best if you use GitHub and want version history.

### 1. Create a GitHub repository

- Go to [github.com/new](https://github.com/new)
- Name: `thang-doan-portfolio` (or any name)
- Public → **Create repository**

### 2. Push your site (PowerShell)

```powershell
cd "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"

git init
git add .
git commit -m "Thang Doan portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thang-doan-portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Enable GitHub Pages

1. Repo → **Settings** → **Pages**
2. **Source:** Deploy from branch
3. **Branch:** `main` → folder **`/ (root)`** → **Save**
4. Wait 1–2 minutes. Site URL:
   `https://YOUR_USERNAME.github.io/thang-doan-portfolio/`

### 4. Update config

In **`js/site-config.js`**:

```javascript
siteUrl: "https://YOUR_USERNAME.github.io/thang-doan-portfolio/",
```

Commit and push again.

---

## Option C — Vercel (free, similar to Netlify)

1. [vercel.com](https://vercel.com) → Sign up free
2. **Add New Project** → Import from GitHub **or** upload folder
3. Framework: **Other**, output: `.` (root), no build command
4. Deploy → copy `.vercel.app` URL into `siteUrl`

---

## After deploy

| Step | Action |
|------|--------|
| Test | Open your live URL on phone and desktop |
| CV | Upload `assets/cv.pdf`, redeploy |
| LinkedIn | Add portfolio URL to your LinkedIn profile |
| `siteUrl` | Set in `js/site-config.js` for social sharing previews |

---

## Recommendation

| Goal | Use |
|------|-----|
| Fastest, no Git | **Netlify Drop** (Option A) |
| Long-term updates via Git | **GitHub Pages** (Option B) |

Both are free and work well for this static site.
