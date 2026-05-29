# Deploy Mako PDF viewer (required step)

Your **PDF is already on Vercel** (`/assets/projects/mako-reservoir-modeling-portfolio.pdf`), but the **website code on GitHub was never pushed**. The live site still uses an old `project-details.js` with **no `mako` project** — clicking Mako does nothing useful.

## Fix (run in PowerShell)

```powershell
cd C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio

# 1) Ensure PDF exists locally (re-export if missing)
if (-not (Test-Path "assets\projects\mako-reservoir-modeling-portfolio.pdf")) {
  .\save-mako-as-pdf.ps1
}

# 2) Commit site code + PDF
git add index.html js/project-details.js css/components.css vercel.json package.json scripts/vercel-build.js assets/projects/README.md assets/projects/mako-reservoir-modeling-portfolio.pdf
git status
git commit -m "Wire Mako portfolio PDF viewer in project modal"
git push origin main
```

Wait **1–2 minutes** for Vercel, then:

1. Open https://thang-doan.vercel.app/
2. Hard refresh: **Ctrl+F5**
3. Click **Mako Gas Field — Model Update 2023** (main Projects row)
4. You should see the **PDF slides** at the top of the modal

## Verify

- https://thang-doan.vercel.app/js/project-details.js should contain `mako:` and `presentation:`
- https://thang-doan.vercel.app/assets/projects/mako-reservoir-modeling-portfolio.pdf should open the deck
