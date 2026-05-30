# Copy latest geoscience showcase PNGs from Downloads (or set paths below)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$imgDir = Join-Path $root "assets\images"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

$seismic = Join-Path $imgDir "showcase-seismic-3d.png"
$concept = Join-Path $imgDir "showcase-reservoir-concept.png"

$downloads = Join-Path $env:USERPROFILE "Downloads"
$pngs = Get-ChildItem -Path $downloads -Filter "*.png" -File -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending

if ($pngs.Count -ge 2) {
  # First PNG in chat order = concept model; second = seismic (adjust if swapped on site)
  Copy-Item -LiteralPath $pngs[1].FullName -Destination $seismic -Force
  Copy-Item -LiteralPath $pngs[0].FullName -Destination $concept -Force
  Write-Host "Copied from Downloads (newest -> concept, 2nd-newest -> seismic):" -ForegroundColor Green
  Write-Host "  seismic: $($pngs[1].Name)"
  Write-Host "  concept: $($pngs[0].Name)"
} else {
  Write-Host "Need 2 PNG files in Downloads, or run:" -ForegroundColor Yellow
  Write-Host "  Copy-Item `"path\to\seismic.png`" `"$seismic`" -Force"
  Write-Host "  Copy-Item `"path\to\concept.png`" `"$concept`" -Force"
}
