# Free hosting alternatives (no Netlify upgrade)

This site is **static HTML/CSS/JS** — no server, no database. Several hosts stay free for a personal portfolio.

| Host | Cost | Best for | Auto-deploy from GitHub |
|------|------|----------|-------------------------|
| **GitHub Pages** | Free | You already use GitHub | Yes (`git push`) |
| **Cloudflare Pages** | Free | Fast CDN, generous limits | Yes |
| **Vercel** | Free hobby tier | Easy import, custom domain | Yes |
| Netlify | Free tier shrinking | — | Often asks to upgrade now |

**Recommendation:** Use **GitHub Pages** first → [GITHUB-PAGES.md](GITHUB-PAGES.md)

---

## 1. GitHub Pages (recommended)

- **URL:** `https://thangdh73.github.io/thang-doan-portfolio/`
- **Steps:** [GITHUB-PAGES.md](GITHUB-PAGES.md)
- **Limits:** Fine for personal portfolios (bandwidth is generous on public repos)

---

## 2. Cloudflare Pages

1. Sign up at **https://dash.cloudflare.com** (free)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select repo **`thang-doan-portfolio`**
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
5. **Save and Deploy**
6. URL looks like `https://thang-doan-portfolio.pages.dev`
7. Set `siteUrl` in `js/site-config.js` to that URL

No credit card for the free plan.

---

## 3. Vercel

1. **https://vercel.com** → Sign up (GitHub login)
2. **Add New Project** → Import **`thang-doan-portfolio`**
3. Framework: **Other**
4. Build command: *(empty)*  
   Output directory: **`.`**
5. Deploy → URL like `https://thang-doan.vercel.app` (project name = `thang-doan`)
6. This repo already includes **`vercel.json`** for clean URLs

Hobby plan is free for personal sites; check current limits on vercel.com/pricing.

---

## 4. What to avoid paying for

You do **not** need:

- Netlify Pro (unless you hit strict bandwidth limits)
- A VPS or WordPress host
- A “website builder” subscription

---

## After you pick a host

1. Set **`siteUrl`** in `js/site-config.js` to your live URL (trailing `/` is fine)
2. Add the URL to **LinkedIn** → Contact info → Website
3. Test **Data Lab:** `https://YOUR-HOST/tools/data-lab.html`
4. Test **Tembakau project** card → image loads

---

## Leaving Netlify

You can delete the Netlify site in **Site settings → Delete site**. Your GitHub repo is the source of truth; Pages or another host replaces it.
