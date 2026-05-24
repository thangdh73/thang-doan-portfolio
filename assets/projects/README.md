# Project figures

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
