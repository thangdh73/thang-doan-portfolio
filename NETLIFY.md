# Deploy on Netlify (free)

> Netlify may ask you to upgrade. For free hosting without that, use **[GITHUB-PAGES.md](GITHUB-PAGES.md)** (recommended) or **[HOSTING-ALTERNATIVES.md](HOSTING-ALTERNATIVES.md)**.

## Step 1 — Sign up

1. Go to [https://app.netlify.com/signup](https://app.netlify.com/signup)
2. Sign up with **email** or **GitHub** (free, no credit card)

## Step 2 — Deploy by drag and drop

1. Open **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. On your PC, open this folder in File Explorer:

   `C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio`

3. **Select all files and folders inside** (not the parent folder only):
   - `index.html`, `404.html`, `css`, `js`, `assets`, `netlify.toml`, etc.
4. Drag them into the Netlify Drop zone
5. Wait until the deploy finishes (usually under 1 minute)

## Step 3 — Your live URL

Netlify shows a link like:

`https://amazing-cupcake-abc123.netlify.app`

Click it to view your portfolio.

## Step 4 — Choose a nicer site name (optional)

1. In Netlify: **Site configuration** → **Domain management**
2. **Options** → **Edit site name**
3. Try: `thang-doan` or `thangdoan-portfolio`
4. New URL: `https://thang-doan.netlify.app` (if the name is available)

## Step 5 — Update your site config

Edit `js/site-config.js` on your computer:

```javascript
siteUrl: "https://YOUR-SITE-NAME.netlify.app",
```

Then drag and drop the folder to Netlify Drop **again** to publish the update.

## Step 6 — Add CV later

1. Save your resume as `assets/cv.pdf`
2. Drag and drop the project to Netlify again (or use Git deploy)

## Updating the site later

Each time you change files locally:

1. Save your edits
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) again, **or**
3. In Netlify dashboard: **Deploys** → drag new files onto the deploy area

**Tip:** Connect GitHub later in Netlify for automatic deploys on every `git push`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Page looks unstyled | Ensure you uploaded the `css` and `js` folders, not only `index.html` |
| Download CV fails | Add `assets/cv.pdf` and redeploy |
| Wrong site | Confirm you deployed `thang-doan-portfolio` contents |

## Free plan limits

- 100 GB bandwidth / month
- 300 build minutes / month (static drop uses almost none)

More than enough for a personal portfolio.
