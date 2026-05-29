# Copy MMRA frontend build into this portfolio (run from MMRA after npm/vite build)
$ErrorActionPreference = "Stop"
$portfolioRoot = $PSScriptRoot | Split-Path -Parent
$dist = Join-Path $env:MMRA_ROOT "frontend\dist"
if (-not (Test-Path -LiteralPath $dist)) {
  $dist = Read-Host "Path to MMRA frontend\dist folder"
}
$target = Join-Path $portfolioRoot "tools\stochastic-volume"
if (-not (Test-Path -LiteralPath $dist)) { throw "Dist not found: $dist" }
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item -Recurse -Force (Join-Path $dist "*") $target
Write-Host "Copied to $target" -ForegroundColor Green
Write-Host "Next: git add tools/stochastic-volume && git commit && git push"
