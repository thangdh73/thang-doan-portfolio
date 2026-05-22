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
| Certifications | `index.html` — Certifications placeholder |
| Profile photo | Optional — add to hero in `index.html` + `css/layout.css` |

See [PLACEHOLDERS.md](PLACEHOLDERS.md) and [CHECKLIST.md](CHECKLIST.md). Full deploy steps: [DEPLOY.md](DEPLOY.md).

## Deploy (free)

**Easiest guide:** [DEPLOY-FREE.md](DEPLOY-FREE.md) — Netlify Drop (2 min) or GitHub Pages (free forever).

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
├── index.html
├── 404.html
├── start-server.ps1    ← local preview (Windows)
├── netlify.toml
├── vercel.json
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── print.css
├── js/
│   ├── site-config.js  ← edit contact details here
│   └── main.js
├── assets/
│   ├── favicon.svg
│   └── cv.pdf          ← add your CV here
├── CHECKLIST.md
├── DEPLOY.md
└── README.md
```

## License

Personal portfolio content © Thang Doan. Code structure free to modify for your use.
