# Copy depositional map for Geoscience card 4 from Tem.pptx (high-res EMF preferred)
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$destJpg = Join-Path $root "assets\images\showcase-depositional-map.jpg"

$pptx = Join-Path $env:USERPROFILE "Downloads\Tem.pptx"
if (-not (Test-Path $pptx)) {
  Write-Host "Need Tem.pptx in Downloads, or copy your image to:" -ForegroundColor Yellow
  Write-Host "  $destJpg"
  exit 1
}

$zip = Join-Path $env:TEMP "tem-pptx-copy.zip"
$out = Join-Path $env:TEMP "tem-pptx-copy-out"
Copy-Item $pptx $zip -Force
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $out)

$emf = Join-Path $out "ppt\media\image2.emf"
$png = Join-Path $out "ppt\media\image4.png"
$srcPath = if (Test-Path $emf) { $emf } else { $png }

if (-not (Test-Path $srcPath)) { throw "No image2.emf or image4.png in Tem.pptx" }

if ($srcPath.EndsWith(".emf")) {
  $meta = [System.Drawing.Imaging.Metafile]::FromFile($srcPath)
  $w = $meta.Width; $h = $meta.Height
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($meta, 0, 0, $w, $h)
  $g.Dispose(); $meta.Dispose()
  $img = $bmp
} else {
  $img = [System.Drawing.Image]::FromFile($srcPath)
}

$maxW = 1600
$scale = [Math]::Min(1.0, $maxW / $img.Width)
$newW = [int]($img.Width * $scale)
$newH = [int]($img.Height * $scale)
$outBmp = New-Object System.Drawing.Bitmap $newW, $newH
$g2 = [System.Drawing.Graphics]::FromImage($outBmp)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.DrawImage($img, 0, 0, $newW, $newH)
$g2.Dispose(); $img.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$enc = New-Object System.Drawing.Imaging.EncoderParameters(1)
$enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 88L
$outBmp.Save($destJpg, $codec, $enc)
$outBmp.Dispose()
Write-Host "Wrote $destJpg ($((Get-Item $destJpg).Length) bytes) from $(Split-Path $srcPath -Leaf)" -ForegroundColor Green
