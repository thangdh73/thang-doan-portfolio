# Copy Mako reservoir modeling portfolio (PowerPoint) into the site
$src = "C:\Users\thang\Downloads\Reservoir Modeling Portfolio (1).pptx"
$dest = Join-Path $PSScriptRoot "assets\projects\mako-reservoir-modeling-portfolio.pptx"

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
Write-Host "Copied to $dest ($([math]::Round($size / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host ""
Write-Host "Next (exact PowerPoint slides on the website):"
Write-Host "  .\save-mako-as-pdf.ps1"
Write-Host "  git add assets/projects/mako-reservoir-modeling-portfolio.pptx assets/projects/mako-reservoir-modeling-portfolio.pdf"
Write-Host "  git commit -m `"Add Mako portfolio deck for in-page viewer`""
Write-Host "  git push origin main"
