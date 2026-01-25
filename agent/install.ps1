# User "Add System" Script
$ServerIP = "192.168.1.100"
$DownloadUrl = "http://$ServerIP/agent_core.exe"
$InstallPath = "C:\Program Files\MyCustomMonitor"

# 1. Create Folder
New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null

# 2. Download your Agent
Write-Host "Downloading Monitoring Agent..."
Invoke-WebRequest -Uri $DownloadUrl -OutFile "$InstallPath\agent_core.exe"

# 3. Create a Background Service (So it starts automatically on boot)
Write-Host "Installing Service..."
New-Service -Name "MyMonitorAgent" `
    -BinaryPathName "$InstallPath\agent_core.exe" `
    -Description "Internal System Monitoring Agent" `
    -StartupType Automatic

# 4. Start the Agent
Start-Service "MyMonitorAgent"
Write-Host "✅ System Added! Check your dashboard."
