# LOTIflow Agent Installer
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       LOTIflow Agent Installer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check for Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Error "❌ Python is not installed or not in PATH. Please install Python 3.8+ and try again."
    exit 1
}

# 2. Server Configuration
# Updated example to reflect HTTPS default and new port
$ServerUrl = Read-Host "Enter LOTIflow Server URL (e.g., https://192.168.1.5:8443)"
if ([string]::IsNullOrWhiteSpace($ServerUrl)) {
    Write-Error "❌ Server URL is required."
    exit 1
}

# Remove trailing slash if present
if ($ServerUrl.EndsWith("/")) {
    $ServerUrl = $ServerUrl.Substring(0, $ServerUrl.Length - 1)
}

# Ensure HTTPS if not specified (optional logic, but good for UX)
if (-not $ServerUrl.StartsWith("http")) {
    $ServerUrl = "https://$ServerUrl"
}

# Configure PowerShell to trust self-signed certs for this session
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}


# Create Settings File
$Settings = @{
    server_url = $ServerUrl
}
$SettingsJson = $Settings | ConvertTo-Json
$SettingsJson | Out-File -FilePath "agent_settings.json" -Encoding utf8
Write-Host "✅ Configuration saved to agent_settings.json" -ForegroundColor Green

# 3. Install Dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    pip install -r requirements.txt
    Write-Host "✅ Dependencies installed." -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to install dependencies. Check your internet connection."
    exit 1
}

# 4. Run Agent
Write-Host "🚀 Starting Agent..." -ForegroundColor Cyan
try {
    # Run in background or new window? For now, run in current window to see output
    python agent_core.py
} catch {
    Write-Error "❌ Failed to start agent."
}
