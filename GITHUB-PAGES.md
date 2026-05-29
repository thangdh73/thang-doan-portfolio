# Deploy on GitHub Pages (free, no upgrade prompts)

Your code is already on GitHub: **https://github.com/thangdh73/thang-doan-portfolio**

GitHub Pages is **free for public repos**, with no credit card. Every `git push` to `main` updates the site in 1–2 minutes.

---

## One-time setup (about 3 minutes)

1. Open **https://github.com/thangdh73/thang-doan-portfolio/settings/pages**

2. Under **Build and deployment** → **Source**, choose:
   - **Deploy from a branch**

3. Under **Branch**:
   - Branch: **`main`**
   - Folder: **`/ (root)`**
   - Click **Save**

4. Wait 1–2 minutes. Refresh the Pages settings page until you see:
   - **Your site is live at** `https://thangdh73.github.io/thang-doan-portfolio/`

5. Open that URL in your browser and test (Projects, Data Lab, Tembakau modal).

---

## Update site config (recommended)

In **`js/site-config.js`**, set:

```javascript
siteUrl: "https://thangdh73.github.io/thang-doan-portfolio/",
```

Then commit and push:

```powershell
cd "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"
git add js/site-config.js
git commit -m "Set siteUrl for GitHub Pages"
git push origin main
```

---

## How updates work after this

```powershell
# Edit files locally, then:
git add .
git commit -m "Describe your change"
git push origin main
```

GitHub Pages rebuilds automatically. No Netlify, no drag-and-drop.

---

## Optional: shorter URL

If you want `https://thangdh73.github.io/` (no folder name):

1. Create a **new** repo named exactly **`thangdh73.github.io`**
2. Copy this portfolio into it (or move the repo)
3. Enable Pages on that repo the same way

For most people, `thangdh73.github.io/thang-doan-portfolio/` is enough.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| 404 on Pages settings | Repo must be **Public** (Settings → General → Danger zone → Change visibility) |
| Site shows old content | Hard refresh `Ctrl+F5` or wait 2 minutes after push |
| Image missing (Tembakau) | Filename must match code: `tembakau-cross-sections.JPG` in `assets/projects/` |
| Data Lab broken | Use full URL with path: `.../tools/data-lab.html` |

---

## Other free hosts

See **[HOSTING-ALTERNATIVES.md](HOSTING-ALTERNATIVES.md)** for Vercel and Cloudflare Pages.
