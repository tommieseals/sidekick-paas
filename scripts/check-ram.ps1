<#
.SYNOPSIS
    Check RAM usage and return alert status
.DESCRIPTION
    Returns exit code 1 if RAM > threshold (default 85%)
.EXAMPLE
    .\check-ram.ps1
    .\check-ram.ps1 -Threshold 80
#>
param(
    [int]$Threshold = 85
)

$os = Get-CimInstance Win32_OperatingSystem
$totalGB = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
$freeGB = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
$usedGB = [math]::Round($totalGB - $freeGB, 2)
$pct = [math]::Round(($usedGB / $totalGB) * 100, 0)

$status = @{
    total_gb = $totalGB
    used_gb = $usedGB
    free_gb = $freeGB
    percent = $pct
    threshold = $Threshold
    alert = $pct -gt $Threshold
    timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

# Output as JSON for easy parsing
$status | ConvertTo-Json -Compress

# Exit with code 1 if alert
if ($pct -gt $Threshold) {
    exit 1
}
