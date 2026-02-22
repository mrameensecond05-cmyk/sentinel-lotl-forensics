# LOTIflow Agent Installer
$ErrorActionPreference = "Stop"

function Pause-AndExit {
    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host "Press any key to exit..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       LOTIflow Agent Installer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

try {
    # 0. Check Execution Policy
    $policy = Get-ExecutionPolicy
    if ($policy -eq "Restricted") {
        Write-Host "⚠️ Warning: PowerShell Execution Policy is set to 'Restricted'." -ForegroundColor Yellow
        Write-Host "You may need to run: 'Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass' to run scripts." -ForegroundColor Gray
    }

    # 1. Check for Python
    try {
        $pythonVersion = python --version 2>&1
        Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Python is not installed or not in PATH." -ForegroundColor Red
        Write-Host "Please install Python 3.8+ from python.org and ensure 'Add Python to PATH' is checked." -ForegroundColor Yellow
        Pause-AndExit
    }

    # 2. Server Configuration
    Write-Host "`n--- Server Configuration ---" -ForegroundColor Yellow
    $ServerUrl = Read-Host "Enter LOTIflow Server URL (e.g., http://192.168.1.5:5001)"
    if ([string]::IsNullOrWhiteSpace($ServerUrl)) {
        Write-Host "❌ Server URL is required." -ForegroundColor Red
        Pause-AndExit
    }

    # Remove trailing slash if present
    if ($ServerUrl.EndsWith("/")) {
        $ServerUrl = $ServerUrl.Substring(0, $ServerUrl.Length - 1)
    }

    # Ensure http if not specified
    if (-not $ServerUrl.StartsWith("http")) {
        $ServerUrl = "http://$ServerUrl"
    }

    # Connectivity Check
    Write-Host "🔍 Testing connection to $ServerUrl..." -ForegroundColor Yellow
    try {
        $uri = New-Object System.Uri($ServerUrl)
        $hostName = $uri.Host
        $port = $uri.Port
        if ($port -eq -1) { $port = 80 }

        Write-Host "Checking port $port on $hostName..." -ForegroundColor Gray
        $connectionTest = Test-NetConnection -ComputerName $hostName -Port $port -InformationLevel Quiet
        if (-not $connectionTest) {
            Write-Host "❌ Cannot reach the server on port $port." -ForegroundColor Red
            Write-Host "Please ensure the server is running and the IP/Port is correct." -ForegroundColor Yellow
            Write-Host "Also check if your Firewall or Antivirus is blocking the connection." -ForegroundColor Gray
            Pause-AndExit
        }
        Write-Host "✅ Connection successful!" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Connectivity check skipped or failed: $($_.Exception.Message)" -ForegroundColor Gray
    }

    # Create Settings File
    $Settings = @{
        server_url = $ServerUrl
    }
    $SettingsJson = $Settings | ConvertTo-Json
    $SettingsJson | Out-File -FilePath "agent_settings.json" -Encoding utf8
    Write-Host "✅ Configuration saved to agent_settings.json" -ForegroundColor Green

    # 3. Install Dependencies
    Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
    try {
        python -m pip install -r requirements.txt
        Write-Host "✅ Dependencies installed." -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
        Pause-AndExit
    }

    # 4. Run Agent
    Write-Host "`n🚀 Starting Agent..." -ForegroundColor Cyan
    try {
        python agent_core.py
    }
    catch {
        Write-Host "❌ Failed to start agent." -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "`n❌ An unexpected error occurred: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Pause-AndExit
}
