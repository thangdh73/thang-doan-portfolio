# Copy depositional map for Geoscience card 4 (from Tem.pptx or a PNG you provide)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$dest = Join-Path $root "assets\images\showcase-depositional-map.png"

$pptx = Join-Path $env:USERPROFILE "Downloads\Tem.pptx"
if (Test-Path $pptx) {
  $zip = Join-Path $env:TEMP "tem-pptx-copy.zip"
  $out = Join-Path $env:TEMP "tem-pptx-copy-out"
  Copy-Item $pptx $zip -Force
  if (Test-Path $out) { Remove-Item $out -Recurse -Force }
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $out)
  $src = Join-Path $out "ppt\media\image4.png"
  if (Test-Path $src) {
    Copy-Item $src $dest -Force
    Write-Host "Wrote $dest from Tem.pptx (image4.png)" -ForegroundColor Green
    exit 0
  }
}

Write-Host "Place your depositional map at:" -ForegroundColor Yellow
Write-Host "  $dest"
Write-Host "Or keep Tem.pptx in Downloads and re-run this script."
