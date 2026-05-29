# Export Mako portfolio PPTX to PDF (requires Microsoft PowerPoint on Windows)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$src = Join-Path $root "assets\projects\mako-reservoir-modeling-portfolio.pptx"
$downloads = Join-Path $env:USERPROFILE "Downloads\Reservoir Modeling Portfolio (1).pptx"

if (-not (Test-Path -LiteralPath $src)) {
  if (Test-Path -LiteralPath $downloads) {
    & (Join-Path $root "copy-mako-portfolio.ps1")
  } else {
    Write-Host "Missing PPTX. Put your file at:" -ForegroundColor Red
    Write-Host "  $downloads"
    Write-Host "Then run: .\copy-mako-portfolio.ps1"
    exit 1
  }
}

$pdfOut = Join-Path $root "assets\projects\mako-reservoir-modeling-portfolio.pdf"
$ppSaveAsPDF = 32

$ppt = $null
$pres = $null
try {
  $ppt = New-Object -ComObject PowerPoint.Application
  $ppt.Visible = 1
  $pres = $ppt.Presentations.Open($src, $true, $true, $false)
  $pres.SaveAs($pdfOut, $ppSaveAsPDF)
  $size = (Get-Item -LiteralPath $pdfOut).Length
  Write-Host "PDF saved: $pdfOut ($([math]::Round($size / 1MB, 2)) MB)" -ForegroundColor Green
  Write-Host ""
  Write-Host "Upload to the website:"
  Write-Host "  git add assets/projects/mako-reservoir-modeling-portfolio.pdf"
  Write-Host "  git commit -m `"Add Mako portfolio PDF for in-page slides`""
  Write-Host "  git push origin main"
}
finally {
  if ($pres) { $pres.Close() | Out-Null }
  if ($ppt) { $ppt.Quit() | Out-Null }
}
