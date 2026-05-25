# Thang Doan — Personal Portfolio

A static, responsive portfolio website for **Thang Doan**, Senior Geologist / Geological Modeler. Built with semantic HTML, CSS, and vanilla JavaScript.

**Status:** Ready to deploy. See [TASK-COMPLETE.md](TASK-COMPLETE.md) for a summary of what is done vs optional.

## Quick start

**Windows (recommended):**

```powershell
.\start-server.ps1
```

Opens `http://127.0.0.1:8765/` by default. Use `.\start-server.ps1 -Port 8080` for another port.

Or open `index.html` directly in your browser.

```bash
# Python
python -m http.server 8080
```

## Customize before publishing

**Easiest:** edit [`js/site-config.js`](js/site-config.js) once (email, phone, location, LinkedIn).

| Item | Where to edit |
|------|----------------|
| Email, phone, location, LinkedIn | `js/site-config.js` |
| CV PDF | Add `assets/cv.pdf` |
| Graduation year | `index.html` — Education card |
| Certifications | `index.html` — Education section (10 courses) |
| Profile photo | Optional — add to hero in `index.html` + `css/layout.css` |

See [PLACEHOLDERS.md](PLACEHOLDERS.md) and [CHECKLIST.md](CHECKLIST.md). Full deploy steps: [DEPLOY.md](DEPLOY.md).

## Deploy (free)

**Vercel:** [VERCEL.md](VERCEL.md) — import from GitHub (good if you already use Vercel).

**GitHub Pages:** [GITHUB-PAGES.md](GITHUB-PAGES.md) — free, no upgrade prompts.

**Others:** [HOSTING-ALTERNATIVES.md](HOSTING-ALTERNATIVES.md)

### GitHub Pages

1. Push this folder to a GitHub repository.
2. Settings → Pages → Source: **Deploy from branch** → `main` → `/ (root)`.
3. Site URL: `https://<username>.github.io/<repo>/`

### Netlify

Drag and drop the folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect the repo. No build command.

### Vercel

Import the repo; framework preset: **Other**; output directory: `.` (root).

## File structure

```
thang-doan-portfolio/
├── index.html              # Portfolio (all CV sections)
├── tools/data-lab.html     # CSV/Excel analytics lab
├── 404.html
├── start-server.ps1
├── netlify.toml
├── vercel.json
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── data-lab.css
│   └── print.css
├── js/
│   ├── site-config.js    ← contact, career years
│   ├── main.js
│   └── data-lab.js
├── assets/
│   ├── favicon.svg
│   ├── cv.pdf            ← add your CV here
│   └── technical/        # sample CSV + chart images
├── CHECKLIST.md
├── DEPLOY-FREE.md
└── README.md
```

## License

Personal portfolio content © Thang Doan. Code structure free to modify for your use.
