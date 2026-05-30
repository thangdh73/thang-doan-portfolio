# Copy Fault Seal SK417 PDF into the portfolio for the project detail modal
$ErrorActionPreference = "Stop"
$src = Join-Path $env:USERPROFILE "Downloads\Fault Seal Sk417.pdf"
$dest = Join-Path $PSScriptRoot "assets\projects\fault-seal-sk417.pdf"
if (-not (Test-Path $src)) {
  Write-Host "Place PDF at: $src" -ForegroundColor Yellow
  exit 1
}
Copy-Item -LiteralPath $src -Destination $dest -Force
Write-Host "Copied to $dest" -ForegroundColor Green
