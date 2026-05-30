# Rebuild transparent PNG overlays from showcase JPEGs (black background -> alpha)
$ErrorActionPreference = "Stop"
$imgDir = Join-Path $PSScriptRoot "assets\images"

function Export-TransparentOverlay {
  param([string]$InputPath, [string]$OutputPath, [int]$MaxWidth = 720, [int]$BlackThreshold = 45)
  if (-not (Test-Path $InputPath)) { throw "Missing $InputPath" }
  Add-Type -AssemblyName System.Drawing
  $src = [System.Drawing.Image]::FromFile($InputPath)
  $scale = [Math]::Min(1.0, $MaxWidth / $src.Width)
  $w = [Math]::Max(1, [int]($src.Width * $scale))
  $h = [Math]::Max(1, [int]($src.Height * $scale))
  $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose(); $src.Dispose()
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $c = $bmp.GetPixel($x, $y)
      $lum = ($c.R + $c.G + $c.B) / 3
      if ($c.R -le $BlackThreshold -and $c.G -le $BlackThreshold -and $c.B -le $BlackThreshold) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      } elseif ($lum -lt 70) {
        $alpha = [int]([Math]::Min(255, 255 * ($lum / 70)))
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
      }
    }
  }
  $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Wrote $OutputPath"
}

Export-TransparentOverlay `
  (Join-Path $imgDir "showcase-seismic-3d.jpg") `
  (Join-Path $imgDir "overlay-seismic-transparent.png")
Export-TransparentOverlay `
  (Join-Path $imgDir "showcase-reservoir-concept.jpg") `
  (Join-Path $imgDir "overlay-geological-transparent.png")
