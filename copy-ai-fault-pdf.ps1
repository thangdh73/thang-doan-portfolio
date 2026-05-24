# Copy AI Fault workflow PDF into the portfolio (run once)
$src = "D:\AI_Fault.pdf"
$dest = Join-Path $PSScriptRoot "assets\projects\ai-fault-workflow.pdf"

if (-not (Test-Path -LiteralPath $src)) {
  Write-Host "Source not found: $src" -ForegroundColor Red
  Write-Host "Update `$src in this script if your PDF is elsewhere."
  exit 1
}

$dir = Split-Path -LiteralPath $dest -Parent
if (-not (Test-Path -LiteralPath $dir)) {
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Copy-Item -LiteralPath $src -Destination $dest -Force
$size = (Get-Item -LiteralPath $dest).Length
Write-Host "Copied to $dest ($([math]::Round($size / 1KB, 1)) KB)" -ForegroundColor Green
Write-Host "Next: git add assets/projects/ai-fault-workflow.pdf && git commit && git push"
