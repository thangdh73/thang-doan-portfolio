# Export Mako portfolio PPTX to PDF + PNG slides (requires Microsoft PowerPoint on Windows)
$ErrorActionPreference = "Stop"
$src = "C:\Users\thang\Downloads\Reservoir Modeling Portfolio (1).pptx"
if (-not (Test-Path -LiteralPath $src)) {
  $alt = Join-Path $PSScriptRoot "assets\projects\mako-reservoir-modeling-portfolio.pptx"
  if (Test-Path -LiteralPath $alt) { $src = $alt }
  else { throw "PPTX not found. Copy Reservoir Modeling Portfolio (1).pptx to Downloads or run copy-mako-portfolio.ps1 first." }
}

$outDir = Join-Path $PSScriptRoot "assets\projects\mako-slides"
$pdfOut = Join-Path $PSScriptRoot "assets\projects\mako-reservoir-modeling-portfolio.pdf"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$ppSaveAsPDF = 32
$ppSaveAsPNG = 17
$ppLayoutBlank = 12

$ppt = $null
$pres = $null
try {
  $ppt = New-Object -ComObject PowerPoint.Application
  $ppt.Visible = 1
  $pres = $ppt.Presentations.Open($src, $true, $true, $false)
  $count = $pres.Slides.Count
  Write-Host "Slides: $count"

  $pres.SaveAs($pdfOut, $ppSaveAsPDF)
  Write-Host "PDF: $pdfOut"

  for ($i = 1; $i -le $count; $i++) {
    $name = "slide-{0:D2}.png" -f $i
    $path = Join-Path $outDir $name
    $pres.Slides.Item($i).Export($path, "PNG", 1280, 720)
    Write-Host "PNG: $path"
  }
}
finally {
  if ($pres) { $pres.Close() | Out-Null }
  if ($ppt) { $ppt.Quit() | Out-Null }
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
}

Write-Host "Done. Commit PDF + mako-slides/*.png and push to Vercel." -ForegroundColor Green
