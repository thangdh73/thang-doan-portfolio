# Copy geoscience showcase images and build web JPEG for seismic
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$imgDir = Join-Path $root "assets\images"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

$seismicSrc = Join-Path $imgDir "Seismic.png"
$seismicOut = Join-Path $imgDir "showcase-seismic-3d.jpg"
$conceptOut = Join-Path $imgDir "showcase-reservoir-concept.jpg"

$downloads = Join-Path $env:USERPROFILE "Downloads"
$pngs = Get-ChildItem -Path $downloads -Filter "*.png" -File -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending

if ($pngs.Count -ge 2) {
  Copy-Item -LiteralPath $pngs[1].FullName -Destination $seismicSrc -Force
  Copy-Item -LiteralPath $pngs[0].FullName -Destination (Join-Path $imgDir "showcase-reservoir-concept.png") -Force
  Write-Host "Copied from Downloads (2nd-newest -> seismic source, newest -> concept png)"
}

function Export-SeismicJpeg {
  param([string]$Source, [string]$Dest, [int]$MaxWidth = 1920)
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($Source)
  $scale = [Math]::Min(1.0, $MaxWidth / $img.Width)
  $newW = [int]($img.Width * $scale)
  $newH = [int]($img.Height * $scale)
  $bmp = New-Object System.Drawing.Bitmap $newW, $newH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $newW, $newH)
  $g.Dispose()
  $img.Dispose()
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $enc = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 85L
  $bmp.Save($Dest, $codec, $enc)
  $bmp.Dispose()
  Write-Host "Wrote $Dest ($((Get-Item $Dest).Length) bytes)" -ForegroundColor Green
}

if (Test-Path $seismicSrc) {
  Export-SeismicJpeg -Source $seismicSrc -Dest $seismicOut
} else {
  Write-Host "Missing $seismicSrc — copy Seismic.png into assets/images first." -ForegroundColor Yellow
}

$conceptPng = Join-Path $imgDir "showcase-reservoir-concept.png"
if (Test-Path $conceptPng) {
  Copy-Item $conceptPng $conceptOut -Force
  Write-Host "Concept: $conceptOut" -ForegroundColor Green
}
