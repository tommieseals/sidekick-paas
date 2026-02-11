# Unified Workspace Sync Script - Clawd
$repoPath = "$env:USERPROFILE\clawd"
Set-Location $repoPath

# Pull latest
git pull origin master --rebase 2>$null
git pull origin main --rebase 2>$null

# Check for local changes
$status = git status --porcelain
if ($status) {
    git add -A
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $hostname = $env:COMPUTERNAME
    git commit -m "Auto-sync from $hostname (Bottom Bitch) @ $timestamp"
    git push origin master 2>$null
    git push origin main 2>$null
}

Write-Host "Sync complete: $(Get-Date)"
