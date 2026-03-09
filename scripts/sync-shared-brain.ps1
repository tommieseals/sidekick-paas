# Sync local shared-brain to/from Mac Pro (with git)
# Usage: sync-shared-brain.ps1 [push|pull|status]

param(
    [Parameter(Position=0)]
    [ValidateSet("push", "pull", "status")]
    [string]$Action = "pull"
)

$LocalPath = "C:\Users\tommi\clawd\shared-brain"
$RemoteHost = "administrator@100.92.123.115"
$RemotePath = "~/shared-brain"

function Log($msg) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $msg"
}

switch ($Action) {
    "push" {
        Log "Pushing local changes to Mac Pro..."
        
        # Copy files
        scp -r "$LocalPath\*" "${RemoteHost}:$RemotePath/"
        
        # Commit on remote
        ssh $RemoteHost "cd $RemotePath && git add -A && git commit -m 'Update from Dell - $(Get-Date -Format 'yyyy-MM-dd HH:mm')' 2>/dev/null || echo 'No changes to commit'"
        
        Log "Done! Changes pushed and committed."
    }
    "pull" {
        Log "Pulling latest from Mac Pro..."
        
        # Ensure local directory exists
        if (!(Test-Path $LocalPath)) {
            New-Item -ItemType Directory -Path $LocalPath -Force
        }
        
        # Pull files
        scp -r "${RemoteHost}:${RemotePath}/*" "$LocalPath/"
        
        Log "Done! Local copy updated."
    }
    "status" {
        Log "Checking shared-brain status..."
        
        # Show latest commit
        ssh $RemoteHost "cd $RemotePath && git log -3 --format='%h %s (%cr by %an)'"
        
        # Show changed files
        ssh $RemoteHost "cd $RemotePath && git status -s"
    }
}
