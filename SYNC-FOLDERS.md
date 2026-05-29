# One local folder (recommended)

Use **only** this path for the portfolio and stochastic app:

```
C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio
```

GitHub: https://github.com/thangdh73/thang-doan-portfolio

You can stop using `D:\1-Projects\thang-doan-portfolio` after you sync once (see below).

## Stochastic UI build (MMRA → portfolio)

```powershell
cd "D:\1-Projects\8-Python code\MMRA_New_UI"
# build per DEPLOY-STOCHASTIC.md, then:

$portfolio = "C:\Users\thang\.cursor\projects\empty-window\thang-doan-portfolio"
Copy-Item -Recurse -Force "frontend\dist\*" "$portfolio\tools\stochastic-volume\"

cd $portfolio
git pull origin main
git add tools/stochastic-volume
git commit -m "Update stochastic volume UI"
git push origin main
```

## If you used D:\ before

1. In **C:\** folder: `git pull origin main` (already same commit if you pushed from D:\).
2. Copy anything you still need from D:\ (e.g. uncommitted files) into **C:\** once.
3. Optional: rename `D:\1-Projects\thang-doan-portfolio` to `thang-doan-portfolio-old` so you don’t edit the wrong copy.

## Rule

One folder → `git pull` → edit → `git push`. No copying whole folders in Explorer.
