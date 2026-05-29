# Deploy for free

Netlify’s free tier has become limited (upgrade prompts). For this portfolio, use one of these instead.

---

## Using Vercel (if you have an account)

**Guide:** [VERCEL.md](VERCEL.md) — import `thang-doan-portfolio` from GitHub, empty build command, deploy.

---

## GitHub Pages (no Vercel account needed)

**Guide:** [GITHUB-PAGES.md](GITHUB-PAGES.md)

**Live URL (after you enable Pages):**

`https://thangdh73.github.io/thang-doan-portfolio/`

**Enable once:** Repo → **Settings** → **Pages** → Branch **`main`**, folder **`/ (root)`** → Save.

**Updates:** `git push origin main`

---

## Other free options

| Host | Guide |
|------|--------|
| Cloudflare Pages | [HOSTING-ALTERNATIVES.md](HOSTING-ALTERNATIVES.md) §2 |
| Vercel | [HOSTING-ALTERNATIVES.md](HOSTING-ALTERNATIVES.md) §3 |

Full comparison: **[HOSTING-ALTERNATIVES.md](HOSTING-ALTERNATIVES.md)**

---

## After deploy

1. Set **`siteUrl`** in `js/site-config.js` to your live URL
2. Commit and push
3. Test on phone and desktop
4. Add URL to LinkedIn

---

## Local preview

```powershell
.\start-server.ps1
```

Open `http://127.0.0.1:8765/`

---

## Netlify (optional)

Only if you already have a working Netlify site and accept their current limits. See [NETLIFY.md](NETLIFY.md). Not recommended as the primary host anymore.
