# Simple build script for Sonar Calendar

# Set paths
$scriptPath = $PSScriptRoot
$rootPath = Split-Path -Parent $scriptPath
$distDir = "$rootPath\dist"
$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

# Change to the build directory
Set-Location -Path $scriptPath

# Check if Node.js is installed
if (-not (Test-Path $nodePath)) {
    Write-Error "[ERROR] Node.js not found at $nodePath"
    exit 1
}

# Get Node.js version
$nodeVersion = & $nodePath --version
Write-Host "[OK] Node.js version: $nodeVersion"

# Get npm version
$npmVersion = & $npmPath --version
Write-Host "[OK] npm version: $npmVersion"

# Install dependencies
Write-Host "[INFO] Installing dependencies..."
& $npmPath install
if ($LASTEXITCODE -ne 0) {
    Write-Error "[ERROR] Failed to install dependencies"
    exit 1
}

# Create output directories if they don't exist
$directories = @(
    $distDir,
    "$distDir\full",
    "$distDir\minified"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "[INFO] Created directory: $dir"
    }
}

# Run the build using the full path to Node.js
Write-Host "[INFO] Building project..."
$buildProcess = Start-Process -FilePath $nodePath -ArgumentList "node_modules/rollup/dist/bin/rollup -c" -NoNewWindow -PassThru -Wait

# Move and process CSS files
Write-Host "[INFO] Processing CSS files..."
$cssProcess = Start-Process -FilePath $nodePath -ArgumentList "move-css.js" -NoNewWindow -PassThru -Wait

# Clean up files in root dist directory that should be in subdirectories
$filesToClean = @(
    "sonar-calendar.js",
    "sonar-calendar.js.map",
    "sonar-calendar.esm.js",
    "sonar-calendar.esm.js.map"
)

foreach ($file in $filesToClean) {
    $filePath = Join-Path $distDir $file
    if (Test-Path $filePath) {
        Remove-Item -Path $filePath -Force
        Write-Host "[INFO] Cleaned up: $file"
    }
}

# Check build status
if ($buildProcess.ExitCode -eq 0 -and $cssProcess.ExitCode -eq 0) {
    Write-Host "[SUCCESS] Build completed successfully!"
    Write-Host "[INFO] Output files in: $distDir"
    Get-ChildItem -Path $distDir | Format-Table Name, Length, LastWriteTime
} else {
    Write-Error "[ERROR] Build failed"
    exit 1
}

# Return to the root directory
Set-Location -Path $rootPath
