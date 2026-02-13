<#
.SYNOPSIS
    Check infrastructure health across all nodes
.DESCRIPTION
    Quick status check of Tommie's AI Empire
.EXAMPLE
    .\infra-status.ps1
    .\infra-status.ps1 -Detailed
#>
param(
    [switch]$Detailed
)

Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          TOMMIE'S AI EMPIRE - STATUS CHECK              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$nodes = @(
    @{ name = "Mac Mini (Orchestrator)"; ip = "100.82.234.66"; ollama = $true },
    @{ name = "Mac Pro (Compute)"; ip = "100.67.192.21"; ollama = $true },
    @{ name = "Google Cloud"; ip = "100.107.231.87"; ollama = $true },
    @{ name = "iPhone"; ip = "100.114.130.38"; ollama = $false }
)

foreach ($node in $nodes) {
    $ping = ping -n 1 -w 1000 $node.ip 2>$null | Select-String "TTL="
    
    if ($ping) {
        $status = "✅ ONLINE"
        $color = "Green"
        
        # Check Ollama if applicable
        if ($node.ollama) {
            try {
                $response = Invoke-RestMethod -Uri "http://$($node.ip):11434/api/tags" -TimeoutSec 3
                $models = $response.models.name -join ", "
                $ollamaStatus = "🟢 Ollama: $models"
            } catch {
                $ollamaStatus = "🔴 Ollama: Not responding"
            }
        } else {
            $ollamaStatus = ""
        }
    } else {
        $status = "❌ OFFLINE"
        $color = "Red"
        $ollamaStatus = ""
    }
    
    Write-Host "$($node.name.PadRight(25)) [$($node.ip)]" -NoNewline
    Write-Host " $status" -ForegroundColor $color
    
    if ($ollamaStatus -and $Detailed) {
        Write-Host "    $ollamaStatus" -ForegroundColor DarkGray
    }
}

Write-Host ""

# Quick model count
if ($Detailed) {
    Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor DarkGray
    Write-Host "Total models available:" -ForegroundColor White
    
    $totalModels = @()
    foreach ($node in $nodes | Where-Object { $_.ollama }) {
        try {
            $response = Invoke-RestMethod -Uri "http://$($node.ip):11434/api/tags" -TimeoutSec 3
            foreach ($m in $response.models) {
                $sizeGB = [math]::Round($m.size / 1GB, 1)
                Write-Host "  • $($m.name) (${sizeGB}GB) on $($node.name.Split(' ')[0])" -ForegroundColor Gray
            }
        } catch {}
    }
}

Write-Host ""
