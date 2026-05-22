# Deployment guide

## 1. Finish personal details

Edit [`js/site-config.js`](js/site-config.js):

```javascript
email: "you@company.com",
phone: "+84 ...",
location: "City, Country",
linkedin: "https://www.linkedin.com/in/your-handle",
siteUrl: "https://your-site.netlify.app",  // after first deploy
```

Add **`assets/cv.pdf`**.

## 2. Test locally

```powershell
.\start-server.ps1
```

Open `http://127.0.0.1:8765/`

## 3. GitHub Pages

```powershell
git init
git add .
git commit -m "Add Thang Doan portfolio"
git remote add origin https://github.com/YOUR_USER/thang-doan-portfolio.git
git push -u origin main
```

GitHub → **Settings** → **Pages** → Branch: `main`, folder: `/ (root)`.

Live URL: `https://YOUR_USER.github.io/thang-doan-portfolio/`

Update `siteUrl` in `site-config.js` and push again.

## 4. Netlify (fastest)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `thang-doan-portfolio` folder
3. Copy the `.netlify.app` URL into `siteUrl`

Or connect your GitHub repo — no build command, publish directory: `.`

## 5. Vercel

Import repo → Framework: **Other** → Output: `.` → Deploy.
