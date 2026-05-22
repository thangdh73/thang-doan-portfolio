# Push Thang Doan portfolio to GitHub (run in PowerShell)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Portfolio folder: $PSScriptRoot" -ForegroundColor Cyan

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI (gh) not found. Install with:" -ForegroundColor Yellow
  Write-Host "  winget install GitHub.cli" -ForegroundColor White
  Write-Host "Then restart PowerShell and run this script again." -ForegroundColor Yellow
  exit 1
}

$auth = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Log in to GitHub first:" -ForegroundColor Yellow
  gh auth login
}

if (git remote get-url origin 2>$null) {
  Write-Host "Remote 'origin' already exists. Pushing..." -ForegroundColor Cyan
  git branch -M main
  git push -u origin main
} else {
  Write-Host "Creating public repo thang-doan-portfolio and pushing..." -ForegroundColor Cyan
  git branch -M main
  gh repo create thang-doan-portfolio --public --source=. --remote=origin --push
}

if ($LASTEXITCODE -eq 0) {
  $url = gh repo view --json url -q .url 2>$null
  if ($url) {
    Write-Host "`nSuccess! Repo URL: $url" -ForegroundColor Green
    Write-Host "Enable GitHub Pages: Settings -> Pages -> main branch / (root)" -ForegroundColor Cyan
  }
} else {
  Write-Host "Push failed. See errors above." -ForegroundColor Red
  exit 1
}
