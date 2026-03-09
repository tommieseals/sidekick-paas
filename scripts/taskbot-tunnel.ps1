<#
.SYNOPSIS
    TaskBot Tunnel Manager - Monitors and auto-restarts Cloudflare tunnel for TaskBot
    
.DESCRIPTION
    After yesterday's nightmare with tunnels dying every 30 seconds, this script:
    - Checks if tunnel is running
    - Verifies the site is actually responding
    - Auto-restarts if dead
    - Saves current URL to a known location
    - Optionally sends Telegram alerts
    
.EXAMPLE
    .\taskbot-tunnel.ps1 -Status     # Check current status
    .\taskbot-tunnel.ps1 -Start      # Start tunnel
    .\taskbot-tunnel.ps1 -Monitor    # Monitor and auto-restart (runs continuously)
    .\taskbot-tunnel.ps1 -Url        # Just show current URL
    
.NOTES
    Created: 2026-03-01
    Author: Clawd (daily improvement)
#>

param(
    [switch]$Status,
    [switch]$Start,
    [switch]$Stop,
    [switch]$Monitor,
    [switch]$Url,
    [switch]$Alert,
    [int]$Port = 5173,
    [int]$CheckInterval = 60
)

$ErrorActionPreference = "Continue"
$UrlFile = "$env:USERPROFILE\clawd\taskbot-tunnel-url.txt"
$LogFile = "$env:USERPROFILE\clawd\logs\taskbot-tunnel.log"

# Ensure logs directory exists
$LogDir = Split-Path $LogFile -Parent
if (!(Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $LogFile -Value $logEntry
    
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARN"  { Write-Host $logEntry -ForegroundColor Yellow }
        "OK"    { Write-Host $logEntry -ForegroundColor Green }
        default { Write-Host $logEntry }
    }
}

function Send-TelegramAlert {
    param([string]$Message)
    if (!$Alert) { return }
    
    try {
        $botToken = "8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU"
        $chatId = "939543801"
        $uri = "https://api.telegram.org/bot$botToken/sendMessage"
        $body = @{ chat_id = $chatId; text = $Message; parse_mode = "HTML" }
        Invoke-RestMethod -Uri $uri -Method Post -Body $body -ErrorAction SilentlyContinue | Out-Null
    } catch {
        Write-Log "Failed to send Telegram alert: $_" "WARN"
    }
}

function Get-TunnelProcess {
    Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue
}

function Get-ViteProcess {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        try {
            $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)" -ErrorAction SilentlyContinue).CommandLine
            $cmdLine -match "vite"
        } catch { $false }
    }
}

function Get-CurrentUrl {
    if (Test-Path $UrlFile) {
        Get-Content $UrlFile -ErrorAction SilentlyContinue
    } else {
        $null
    }
}

function Test-TunnelHealth {
    param([string]$TunnelUrl)
    
    if (!$TunnelUrl) { return $false }
    
    try {
        $response = Invoke-WebRequest -Uri $TunnelUrl -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Test-LocalSite {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

function Start-Tunnel {
    Write-Log "Starting Cloudflare tunnel for localhost:$Port..."
    
    # Check if Vite is running
    if (!(Test-LocalSite)) {
        Write-Log "WARNING: Local site not responding on port $Port" "WARN"
        Write-Log "Start Vite first: cd taskbot && npm run dev" "WARN"
    }
    
    # Kill existing tunnel if any
    $existing = Get-TunnelProcess
    if ($existing) {
        Write-Log "Stopping existing tunnel (PID: $($existing.Id))..."
        Stop-Process -Id $existing.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
    
    # Start new tunnel and capture URL
    $job = Start-Job -ScriptBlock {
        param($port)
        cloudflared tunnel --url http://localhost:$port 2>&1
    } -ArgumentList $Port
    
    Write-Log "Tunnel starting, waiting for URL..."
    Start-Sleep -Seconds 5
    
    # Try to capture URL from output
    $output = Receive-Job -Job $job -ErrorAction SilentlyContinue
    $urlMatch = $output | Select-String -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -First 1
    
    if ($urlMatch) {
        $tunnelUrl = $urlMatch.Matches[0].Value
        $tunnelUrl | Set-Content $UrlFile
        Write-Log "Tunnel URL: $tunnelUrl" "OK"
        
        if ($Alert) {
            Send-TelegramAlert "🌐 TaskBot tunnel started: $tunnelUrl"
        }
        
        return $tunnelUrl
    } else {
        Write-Log "Could not capture tunnel URL from output" "WARN"
        return $null
    }
}

function Stop-Tunnel {
    $tunnel = Get-TunnelProcess
    if ($tunnel) {
        Write-Log "Stopping tunnel (PID: $($tunnel.Id))..."
        Stop-Process -Id $tunnel.Id -Force
        Write-Log "Tunnel stopped" "OK"
    } else {
        Write-Log "No tunnel process found"
    }
}

function Show-Status {
    Write-Host "`n=== TaskBot Tunnel Status ===" -ForegroundColor Cyan
    
    # Vite status
    $vite = Get-ViteProcess
    if ($vite) {
        Write-Host "✅ Vite dev server: Running (PID: $($vite.Id))" -ForegroundColor Green
    } else {
        Write-Host "❌ Vite dev server: Not running" -ForegroundColor Red
    }
    
    # Local site check
    if (Test-LocalSite) {
        Write-Host "✅ Local site (localhost:$Port): Responding" -ForegroundColor Green
    } else {
        Write-Host "❌ Local site (localhost:$Port): Not responding" -ForegroundColor Red
    }
    
    # Tunnel status
    $tunnel = Get-TunnelProcess
    if ($tunnel) {
        Write-Host "✅ Cloudflared: Running (PID: $($tunnel.Id))" -ForegroundColor Green
    } else {
        Write-Host "❌ Cloudflared: Not running" -ForegroundColor Red
    }
    
    # URL and health
    $url = Get-CurrentUrl
    if ($url) {
        Write-Host "📌 Saved URL: $url" -ForegroundColor Cyan
        
        if (Test-TunnelHealth $url) {
            Write-Host "✅ Public site: Responding" -ForegroundColor Green
        } else {
            Write-Host "❌ Public site: Not responding (tunnel may have died)" -ForegroundColor Red
        }
    } else {
        Write-Host "📌 No saved URL (tunnel not started yet)" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

function Start-Monitor {
    Write-Log "Starting TaskBot tunnel monitor (checking every ${CheckInterval}s)..."
    Write-Log "Press Ctrl+C to stop"
    
    $failures = 0
    $maxFailures = 3
    
    while ($true) {
        $url = Get-CurrentUrl
        $healthy = $false
        
        # Check if tunnel is healthy
        if ($url) {
            $healthy = Test-TunnelHealth $url
        }
        
        if ($healthy) {
            $failures = 0
            Write-Host "." -NoNewline -ForegroundColor Green
        } else {
            $failures++
            Write-Host "!" -NoNewline -ForegroundColor Red
            
            if ($failures -ge $maxFailures) {
                Write-Host ""
                Write-Log "Tunnel unhealthy for $failures checks, restarting..." "WARN"
                
                if ($Alert) {
                    Send-TelegramAlert "⚠️ TaskBot tunnel died, restarting..."
                }
                
                Start-Tunnel
                $failures = 0
            }
        }
        
        Start-Sleep -Seconds $CheckInterval
    }
}

# Main logic
if ($Status) {
    Show-Status
} elseif ($Start) {
    Start-Tunnel
} elseif ($Stop) {
    Stop-Tunnel
} elseif ($Monitor) {
    Start-Monitor
} elseif ($Url) {
    $url = Get-CurrentUrl
    if ($url) {
        Write-Host $url
    } else {
        Write-Host "No tunnel URL saved. Run with -Start first."
    }
} else {
    # Default: show status
    Show-Status
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\taskbot-tunnel.ps1 -Status   # Show status"
    Write-Host "  .\taskbot-tunnel.ps1 -Start    # Start tunnel"
    Write-Host "  .\taskbot-tunnel.ps1 -Stop     # Stop tunnel"
    Write-Host "  .\taskbot-tunnel.ps1 -Monitor  # Auto-restart on failure"
    Write-Host "  .\taskbot-tunnel.ps1 -Url      # Show current URL"
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Alert            # Send Telegram notifications"
    Write-Host "  -Port 5173        # Custom port (default: 5173)"
    Write-Host "  -CheckInterval 60 # Monitor check frequency in seconds"
}
