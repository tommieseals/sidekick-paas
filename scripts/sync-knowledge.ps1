# Auto-sync knowledge between agents (Windows PowerShell)
# Run this every few minutes via Windows Task Scheduler

$WORKSPACE = "$env:USERPROFILE\clawd"
Set-Location $WORKSPACE

# Pull latest from other agent
git pull --rebase --autostash origin main 2>&1 | Out-Null

# Commit any changes to memory or important files
git add -A memory/, MEMORY.md, AGENTS.md, SOUL.md, USER.md, TOOLS.md, IDENTITY.md 2>&1 | Out-Null
git add -A scripts/, skills/ 2>&1 | Out-Null

$status = git status --porcelain
if ($status) {
    $hostname = $env:COMPUTERNAME
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC" -AsUTC
    git commit -m "Auto-sync from $hostname at $timestamp" --no-verify
    git push origin main 2>&1 | Out-Null
    Write-Host "✓ Synced knowledge to shared brain"
} else {
    Write-Host "• No changes to sync"
}
