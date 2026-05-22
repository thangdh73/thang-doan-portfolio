# Local preview server for Thang Doan portfolio
param(
  [int]$Port = 8765
)

$Root = $PSScriptRoot
Set-Location $Root

if (-not (Test-Path "index.html")) {
  Write-Error "index.html not found in $Root"
  exit 1
}

Write-Host "Serving portfolio at http://127.0.0.1:$Port/" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray

if (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server $Port
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
  py -m http.server $Port
} else {
  Write-Error "Python not found. Install Python or open index.html in your browser."
  exit 1
}
