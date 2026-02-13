<# 
.SYNOPSIS
    Query the LLM Gateway from Windows
.DESCRIPTION
    Smart routing to local Ollama models with fallback
.EXAMPLE
    .\ask-llm.ps1 "What is 2+2?"
    .\ask-llm.ps1 -Model "qwen2.5:7b" "Complex question"
    .\ask-llm.ps1 -Fast "Quick question"
#>
param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Prompt,
    
    [Parameter()]
    [string]$Model = "auto",
    
    [Parameter()]
    [switch]$Fast,
    
    [Parameter()]
    [switch]$Code,
    
    [Parameter()]
    [switch]$Verbose
)

# Node configuration
$nodes = @{
    "mac-mini" = @{ url = "http://100.82.234.66:11434"; models = @("qwen2.5:3b", "phi3:mini", "nomic-embed-text") }
    "google-cloud" = @{ url = "http://100.107.231.87:11434"; models = @("qwen2.5:7b", "nomic-embed-text") }
}

# Smart routing
function Get-BestModel {
    param($prompt, $fast, $code)
    
    if ($fast) { return @{ node = "mac-mini"; model = "qwen2.5:3b" } }
    if ($code) { return @{ node = "google-cloud"; model = "qwen2.5:7b" } }
    
    # Check for code keywords
    $codeKeywords = @("code", "function", "script", "python", "javascript", "bash", "debug", "error")
    foreach ($kw in $codeKeywords) {
        if ($prompt -match $kw) {
            return @{ node = "google-cloud"; model = "qwen2.5:7b" }
        }
    }
    
    # Default to fast local
    return @{ node = "mac-mini"; model = "qwen2.5:3b" }
}

# Select model
if ($Model -eq "auto") {
    $selected = Get-BestModel -prompt $Prompt -fast $Fast -code $Code
} else {
    # Find which node has this model
    foreach ($nodeName in $nodes.Keys) {
        if ($nodes[$nodeName].models -contains $Model) {
            $selected = @{ node = $nodeName; model = $Model }
            break
        }
    }
}

if (-not $selected) {
    Write-Error "Model not found: $Model"
    exit 1
}

$nodeConfig = $nodes[$selected.node]
$url = "$($nodeConfig.url)/api/generate"

if ($Verbose) {
    Write-Host "🎯 Routing to: $($selected.node) / $($selected.model)" -ForegroundColor Cyan
}

# Make request
$body = @{
    model = $selected.model
    prompt = $Prompt
    stream = $false
} | ConvertTo-Json

$startTime = Get-Date
try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 60
    $elapsed = ((Get-Date) - $startTime).TotalSeconds
    
    Write-Output $response.response
    
    if ($Verbose) {
        Write-Host "`n---" -ForegroundColor DarkGray
        Write-Host "⏱️ Total: $([math]::Round($elapsed, 2))s | Eval: $([math]::Round($response.eval_duration / 1e9, 2))s" -ForegroundColor DarkGray
    }
} catch {
    Write-Error "Failed to query $($selected.node): $_"
    
    # Try fallback
    if ($selected.node -eq "google-cloud") {
        Write-Host "Trying fallback to mac-mini..." -ForegroundColor Yellow
        $url = "$($nodes['mac-mini'].url)/api/generate"
        $body = @{ model = "qwen2.5:3b"; prompt = $Prompt; stream = $false } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 60
        Write-Output $response.response
    }
}
