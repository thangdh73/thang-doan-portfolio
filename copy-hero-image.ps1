# Copy your Lena River Delta (or any hero) image into the site
$dest = Join-Path $PSScriptRoot "assets\images\hero-lena-delta.jpg"
$dir = Split-Path $dest -Parent
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$src = Join-Path $env:USERPROFILE "Downloads"
$candidates = Get-ChildItem -Path $src -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp)$' -and $_.Name -match 'lena|delta|river|hero|satellite' } |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $candidates) {
  Write-Host "Save your hero image, then run:" -ForegroundColor Yellow
  Write-Host "  Copy-Item -LiteralPath `"C:\path\to\your-image.jpg`" -Destination `"$dest`" -Force"
  exit 1
}

Copy-Item -LiteralPath $candidates.FullName -Destination $dest -Force
Write-Host "Copied $($candidates.Name) -> $dest" -ForegroundColor Green
Write-Host "Refresh index.html in the browser."
