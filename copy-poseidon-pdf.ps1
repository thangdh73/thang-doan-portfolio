# Copy Poseidon static model PDF into the site
$src = Join-Path $env:USERPROFILE "Downloads\Poseidon Static Model.pdf"
$dest = Join-Path $PSScriptRoot "assets\projects\poseidon-static-model.pdf"

if (-not (Test-Path -LiteralPath $src)) {
  Write-Host "Source not found:" -ForegroundColor Red
  Write-Host "  $src"
  exit 1
}

$dir = Split-Path -LiteralPath $dest -Parent
if (-not (Test-Path -LiteralPath $dir)) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Copy-Item -LiteralPath $src -Destination $dest -Force
$size = (Get-Item -LiteralPath $dest).Length
Write-Host "Copied to $dest ($([math]::Round($size / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host ""
Write-Host "Then push to Vercel:"
Write-Host "  git add assets/projects/poseidon-static-model.pdf index.html js/project-details.js"
Write-Host "  git commit -m `"Add Poseidon Wafra static model PDF viewer`""
Write-Host "  git push origin main"
