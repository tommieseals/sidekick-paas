# Shared Knowledge Sync - Dell
$repoPath = "$env:USERPROFILE\clawd"
Set-Location $repoPath

# Log start
$logFile = "$repoPath\sync.log"
"$(Get-Date): Sync started" | Add-Content $logFile

# Pull latest
git pull origin master --rebase 2>&1 | Add-Content $logFile
git pull origin main --rebase 2>&1 | Add-Content $logFile

# Check for local changes
$status = git status --porcelain
if ($status) {
    git add -A
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Auto-sync from Dell (Bottom Bitch) @ $timestamp" 2>&1 | Add-Content $logFile
    git push origin master 2>&1 | Add-Content $logFile
    git push origin main 2>&1 | Add-Content $logFile
}

"$(Get-Date): Sync complete" | Add-Content $logFile
