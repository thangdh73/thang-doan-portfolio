# Copy EAGE 2016 paper PDF into the portfolio (run once)
$src =
  "C:\Users\thang\OneDrive\Documents\2-ThangDH-Doc\EAGE_Dec2016\Best Practices in seismic constraining of 3D reservoir architecture models_notitle.pdf"
$dest = Join-Path $PSScriptRoot "assets\publications\eage-seismic-constraining-2016.pdf"

if (-not (Test-Path -LiteralPath $src)) {
  Write-Host "Source not found:" -ForegroundColor Red
  Write-Host $src
  exit 1
}

$dir = Split-Path -LiteralPath $dest -Parent
if (-not (Test-Path -LiteralPath $dir)) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Copy-Item -LiteralPath $src -Destination $dest -Force
$size = (Get-Item -LiteralPath $dest).Length
Write-Host "Copied to $dest ($([math]::Round($size / 1KB, 1)) KB)" -ForegroundColor Green
Write-Host "Next: git add assets/publications/eage-seismic-constraining-2016.pdf"
Write-Host "      git commit -m `"Add EAGE 2016 publication PDF`""
Write-Host "      git push origin main"
