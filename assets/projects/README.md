# Project figures

## POSEIDON — Wafra Field static model (PDO)

| File | Description |
|------|-------------|
| `poseidon-static-model.pdf` | 9-slide POSEIDON / Three60 static model build & update study |

Copy from Downloads:

```powershell
.\copy-poseidon-pdf.ps1
git add assets/projects/poseidon-static-model.pdf index.html js/project-details.js
git commit -m "Add Poseidon Wafra static model PDF viewer"
git push origin main
```

---

## Conrad Mako Gas Field (portfolio deck)

| File | Description |
|------|-------------|
| `mako-reservoir-modeling-portfolio.pptx` | Source deck (7 slides) — optional; used as Office viewer fallback on Vercel |
| `mako-reservoir-modeling-portfolio.pdf` | **Required for exact slides** in the project modal (export from PowerPoint) |

### One-time setup (Windows + PowerPoint)

```powershell
.\copy-mako-portfolio.ps1
.\save-mako-as-pdf.ps1
git add assets/projects/mako-reservoir-modeling-portfolio.pdf assets/projects/mako-reservoir-modeling-portfolio.pptx
git commit -m "Add Mako portfolio PDF for in-page slides"
git push origin main
```

Or double-click **`save-mako-as-pdf.bat`** after the PPTX is copied.

The Mako modal embeds the **PDF** (pixel-perfect export). If the PDF is missing on the server, it falls back to Microsoft’s **Office online viewer** for the `.pptx` (also exact PowerPoint layout, needs the PPTX pushed to Vercel).

---

## PTTEP — Fault seal SK-417 / SK-438

| File | Used in modal |
|------|----------------|
| `fault-seal-sk417.pdf` | Full fault seal study deck (from `Downloads\Fault Seal Sk417.pdf`) |

```powershell
.\copy-fault-seal-pdf.ps1
git add assets/projects/fault-seal-sk417.pdf index.html js/project-details.js
git commit -m "Add PTTEP fault seal project detail modal with PDF"
git push origin main
```

---

## Tembakau IPC

| File | Used in modal |
|------|----------------|
| `tembakau-cross-sections.JPG` | Seismic model QC panel |

## AI Fault Interpretation

| File | Used in modal |
|------|----------------|
| `ai-fault-workflow.svg` | Workflow overview diagram |
| `ai-fault-workflow.pdf` | Full workflow (from `D:\AI_Fault.pdf`) |

### Add the PDF (required for embedded viewer)

Copy your file once:

```powershell
Copy-Item -LiteralPath "D:\AI_Fault.pdf" -Destination "assets\projects\ai-fault-workflow.pdf"
```

Then commit and push so Vercel serves the PDF:

```powershell
git add assets/projects/ai-fault-workflow.pdf
git commit -m "Add AI fault workflow PDF for project detail"
git push origin main
```

If the PDF is missing, the modal still shows the SVG diagram and workflow steps; use the **Open workflow PDF** link after you add the file.
