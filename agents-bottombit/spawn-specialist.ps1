# Bottom Bitch Specialist Spawner (Windows/PowerShell version)
# Usage: .\spawn-specialist.ps1 <specialist> <task>
# Example: .\spawn-specialist.ps1 codegen "Create Python script to parse JSON logs"

param(
    [Parameter(Mandatory=$true)]
    [string]$Specialist,
    
    [Parameter(Mandatory=$true)]
    [string]$Task
)

$validSpecialists = @("codegen", "debugger", "devops", "research", "vision", "writer")

if ($Specialist -notin $validSpecialists) {
    Write-Host "Error: Invalid specialist '$Specialist'" -ForegroundColor Red
    Write-Host "Valid options: $($validSpecialists -join ', ')" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Available specialists:"
    Write-Host "  codegen   - Code generation and implementation"
    Write-Host "  debugger  - Bug hunting and fixes"
    Write-Host "  devops    - Infrastructure and deployment"
    Write-Host "  research  - Information gathering and analysis"
    Write-Host "  vision    - Image/screenshot analysis"
    Write-Host "  writer    - Documentation and content creation"
    exit 1
}

# Generate session label
$timestamp = [int][double]::Parse((Get-Date -UFormat %s))
$label = "bottombit-$Specialist-$timestamp"

Write-Host "🚢 Spawning Bottom Bitch specialist: $Specialist" -ForegroundColor Cyan
Write-Host "📋 Task: $Task" -ForegroundColor White
Write-Host "🏷️  Label: $label" -ForegroundColor Gray
Write-Host ""

# Construct spawn task
$spawnTask = @"
You are $Specialist specialist in Bottom Bitch's swarm. Your task: $Task

IMPORTANT:
1. Read ~/clawd/agents-bottombit/$Specialist/SOUL.md first
2. Read ~/clawd/agents-bottombit/$Specialist/AGENTS.md 
3. Complete the assigned task
4. Report results when done
5. You are ephemeral - no heartbeats, no side quests

Your session: agent:bottombit:${Specialist}:${label}
Parent: Bottom Bitch (Dell agent)
Access: Restricted to tool use, NO external messaging
"@

# Try to spawn via SSH to Mac Mini (where Clawdbot runs)
$macMini = "100.88.105.106"
$sshUser = "tommie"

Write-Host "Attempting to spawn via SSH to Mac Mini..." -ForegroundColor Yellow

try {
    # Escape quotes for SSH command
    $escapedTask = $spawnTask -replace '"', '\"'
    
    # SSH to Mac Mini and use sessions_spawn if available
    $sshCmd = "ssh $sshUser@$macMini 'echo Task: $escapedTask'"
    
    Write-Host "Running: $sshCmd" -ForegroundColor Gray
    Invoke-Expression $sshCmd
    
    Write-Host ""
    Write-Host "✅ Spawn request sent via SSH" -ForegroundColor Green
} catch {
    Write-Host "❌ SSH spawn failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual spawn instructions:" -ForegroundColor Yellow
    Write-Host "Send this to Telegram or Clawdbot:" -ForegroundColor White
    Write-Host ""
    Write-Host "/spawn $label"
    Write-Host ""
    Write-Host "Task:"
    Write-Host $spawnTask
}

Write-Host ""
Write-Host "📊 Monitor: http://100.88.105.106:8080/swarm-monitor.html" -ForegroundColor Cyan
Write-Host "🔍 Check status: sessions_list | grep $label" -ForegroundColor Gray

# Alternative: Write spawn request to shared location for pickup
$spawnRequestPath = "\\100.88.105.106\clawd\shared-memory\spawn-requests\$label.json"
$spawnRequest = @{
    label = $label
    specialist = $Specialist
    task = $Task
    parent = "bottom-bitch"
    timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    host = $env:COMPUTERNAME
} | ConvertTo-Json

try {
    New-Item -ItemType Directory -Force -Path (Split-Path $spawnRequestPath) | Out-Null
    $spawnRequest | Out-File -FilePath $spawnRequestPath -Encoding UTF8
    Write-Host ""
    Write-Host "📁 Spawn request saved to: $spawnRequestPath" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not save spawn request file: $($_.Exception.Message)" -ForegroundColor Yellow
}
