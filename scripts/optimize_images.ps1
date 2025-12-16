# Load System.Drawing
Add-Type -AssemblyName System.Drawing

$inputDir = Join-Path $PSScriptRoot "..\assets\images"
$outputDir = $inputDir

if (-not (Test-Path $inputDir)) {
    Write-Error "Directory not found: $inputDir"
    exit 1
}

$files = Get-ChildItem -Path $inputDir -Filter "*.jpg"

Write-Host "Found $($files.Count) images to process."

# Encoder for JPEG quality
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]75) # 75% Quality

foreach ($file in $files) {
    if ($file.Name.Contains("-optimized") -or $file.Name.Contains("-mobile")) {
        continue
    }

    $name = $file.BaseName
    $inputPath = $file.FullName
    $desktopOutput = Join-Path $outputDir "$name-optimized.jpg"
    $mobileOutput = Join-Path $outputDir "$name-mobile.jpg"

    try {
        $image = [System.Drawing.Image]::FromFile($inputPath)

        # 1. Desktop (Max 1920)
        if (-not (Test-Path $desktopOutput)) {
            $newWidth = 1920
            
            if ($image.Width -gt $newWidth) {
                $newHeight = [int]($image.Height * ($newWidth / $image.Width))
                $resized = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $graphic = [System.Drawing.Graphics]::FromImage($resized)
                $graphic.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphic.DrawImage($image, 0, 0, $newWidth, $newHeight)
                $resized.Save($desktopOutput, $codec, $encoderParams)
                $graphic.Dispose()
                $resized.Dispose()
                Write-Host "Processed Desktop: $name.jpg -> $name-optimized.jpg"
            }
            else {
                # Just compress if smaller
                $image.Save($desktopOutput, $codec, $encoderParams)
                Write-Host "Processed Desktop (Compressed only): $name.jpg -> $name-optimized.jpg"
            }
        }

        # 2. Mobile (Max 800)
        if (-not (Test-Path $mobileOutput)) {
            $newWidth = 800
            if ($image.Width -gt $newWidth) {
                $newHeight = [int]($image.Height * ($newWidth / $image.Width))
                $resizedMobile = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $graphicMobile = [System.Drawing.Graphics]::FromImage($resizedMobile)
                $graphicMobile.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphicMobile.DrawImage($image, 0, 0, $newWidth, $newHeight)
                $resizedMobile.Save($mobileOutput, $codec, $encoderParams)
                $graphicMobile.Dispose()
                $resizedMobile.Dispose()
                Write-Host "Processed Mobile: $name.jpg -> $name-mobile.jpg"
            }
        }
        
        $image.Dispose()

    }
    catch {
        Write-Error "Error processing $name : $_"
    }
}
