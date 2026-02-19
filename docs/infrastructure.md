# Infrastructure Reference
## Last Updated: February 2026

---

## Network Topology (Tailscale Mesh)

### Active Nodes

| Node | Hardware | Tailscale IP | Role | RAM | Disk |
|------|----------|--------------|------|-----|------|
| **Mac Mini** | M-chip | 100.88.105.106 | Primary orchestrator, bot runtime, scheduling, lightweight AI | 16GB | 228GB |
| **Mac Pro** | - | 100.101.89.80 | Compute node, heavy model inference | 32GB | 466GB |
| **Dell** | i9/64GB | 100.119.87.108 | Windows, Clawdbot host, failsafe coordinator | 16GB | - |
| **Google Cloud** | e2-standard-4 | 100.107.231.87 | Reserved for 7B models, transcription, scraping | 16GB | 50GB |

### Other Tailscale Devices
| Device | Tailscale IP | Notes |
|--------|-------------|-------|
| iPhone 15 Pro Max | 100.114.130.38 | Telegram access, remote monitoring |

---

## Node Details

### Mac Mini (100.88.105.106) — "HUB"
**Role:** Primary orchestrator

**Services Running:**
- Clawdbot (Telegram bot)
- LLM Gateway v2.0
- Watchdog system
- Dashboard (http://100.88.105.106:8080)
- Ollama (qwen2.5:3b, nomic-embed-text)
- Redis (Project Legion)

**Constraints:**
- ⚠️ **Max model size: 3GB** (16GB RAM - macOS uses 4-5GB, services use 1-2GB)
- Allowed models: qwen2.5:3b, gemma2:2b, phi3:mini, llama3.2:3b
- NEVER: qwen2.5:7b, llama3.1:8b, mistral:7b, or ANY model >3GB

**Key Directories:**
| Path | Purpose |
|------|---------|
| ~/clawd/ | Bot workspace, memory, documentation |
| ~/scripts/ | Admin scripts, automation |
| ~/shared-memory/ | Cross-role JSON persistence |
| ~/dta/gateway/ | LLM Gateway v2.0 |
| ~/dta/automation/ | Scheduled automation |

**LaunchAgents:**
| Plist | Schedule | Script |
|-------|----------|--------|
| com.tommie.admin-security | 6:00 AM daily | admin-security.sh |
| com.tommie.admin-network | 6:30 AM daily | admin-network.sh |
| com.tommie.admin-systems | 7:00 AM daily | admin-systems.sh |
| com.tommie.admin-dta | 7:30 AM daily | admin-dta.sh |
| com.ollama.server | On login | Ollama server |

---

### Mac Pro (100.101.89.80) — "COMPUTE"
**Role:** Heavy model inference

**SSH Access:** `ssh administrator@100.101.89.80`

**Services Running:**
- OpenClaw (not Clawdbot)
- Ollama (deepseek-coder:6.7b, qwen2.5:7b, llama2)
- Redis worker (Project Legion)

**Model Capacity:** 12.3GB loaded (32GB RAM available)

**Key Files:**
| Path | Purpose |
|------|---------|
| ~/Library/LaunchAgents/ai.openclaw.gateway.plist | OpenClaw service |
| ~/.openclaw/openclaw.json | OpenClaw config |
| ~/.openclaw/logs/ | Gateway logs |

---

### Dell (100.119.87.108) — "FAILSAFE"
**Role:** Windows coordinator, Clawdbot host

**Username:** `tommi` (not rusty!)

**SSH:** `ssh dell` (via ~/.ssh/config)

**Services:**
- Clawdbot (Bottom Bitch bot)
- Ollama (phi3:mini @ ~10 tok/s)

**⚠️ IMPORTANT:** See [security.md](security.md) for CrowdStrike restrictions

---

### Google Cloud VM (100.107.231.87) — "CLOUD"
**Role:** Reserved for 7B models, heavy processing

**Provider:** Google Cloud Platform (GCP)
- Instance: instance-20260208-050027
- Zone: us-central1-c
- OS: Debian GNU/Linux 12 (bookworm)
- External IP: 34.70.44.216 (GCP console SSH only)

**Cost:** ~$103/month ($300 free credit, expires ~May 2026)

**Software:**
- Ollama (qwen2.5:7b, nomic-embed-text)
- Whisper (transcription)
- yt-dlp
- UFW firewall (Tailscale + SSH only)

**Key Directories:**
| Path | Purpose |
|------|---------|
| ~/shared-memory/ | Synced JSON files |
| ~/dta-transcripts/ | Video transcriptions |
| ~/scripts/ | Cloud-side scripts |
| ~/logs/ | Execution logs |
| ~/ai-tools/ | Python venv (Whisper, yt-dlp) |

---

## Scripts Inventory

### Mac Mini Scripts
| File | Purpose | Notes |
|------|---------|-------|
| ~/scripts/get_free_ram.sh | RAM check + routing | Routes to cloud, never Dell |
| ~/scripts/admin-security.sh | Security admin daily scan | 6:00 AM |
| ~/scripts/admin-network.sh | Network admin daily check | 6:30 AM |
| ~/scripts/admin-systems.sh | Systems admin monitoring | 7:00 AM |
| ~/scripts/admin-dta.sh | DTA strategic analysis | 7:30 AM |
| ~/scripts/transcribe-video.sh | YouTube → Whisper pipeline | |
| ~/scripts/summarize-for-dta.sh | AI summarization with fallback | |
| ~/scripts/inference-fallback.sh | 3-tier fallback logic | Source in scripts |

### Automation System
| Path | Purpose |
|------|---------|
| ~/dta/automation/automation-control.sh | Main control script |
| ~/dta/automation/logs/ | Automation logs |
| ~/dta/automation/reports/ | Generated reports |
| ~/dta/work-automation/change-requests/inbox/ | CR drop-folder |
| ~/dta/work-automation/code-reviews/inbox/ | Code review drop-folder |

---

## Monitoring Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| RAM | > 80% | > 85% |
| Disk | > 80% | > 90% |
| Load | > 4.0 | > 8.0 |

### Monitoring Commands

**Mac (via SSH):**
```bash
vm_stat | head -5      # RAM
df -h /                # Disk
uptime                 # Load
ollama ps              # Loaded models
```

**Dell (PowerShell):**
```powershell
Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory
```

---

## SSH Configuration

**Optimized aliases** (via `~/.ssh/config`):
```bash
ssh mac-mini      # 100.88.105.106
ssh mac-pro       # 100.101.89.80 (user: administrator)
ssh google-cloud  # 100.107.231.87
ssh dell          # 100.119.87.108 (user: tommi)
```

**Features enabled:**
- Connection multiplexing (ControlMaster) - reuses connections for 10 min
- Keep-alive (ServerAliveInterval 60s) - prevents timeouts
- Compression - faster transfers
- Persistent keys - auto-added to agent

---

## Dashboard

**URL:** http://100.88.105.106:8080

**Features:**
- Live job feed (Project Legion) - 30-second refresh
- One-click approval for applications
- Real-time pipeline stats
- Infrastructure status
- Agent monitoring

---

## Watchdog System

**Location:** Mac Mini

**Monitors:**
- Mac Pro & Dell every 5 minutes
- SSH auto-recovery for Mac Pro
- Telegram alerts after 3 consecutive failures
- Dell ping skipped (Windows firewall blocks ICMP)

---

## Long-Term Cloud Plan

**Current:** GCP e2-standard-4 (~$103/month, covered by free credit until May 2026)

**Target:** Oracle Cloud Always Free
- ARM: 4 OCPU, 24GB RAM — FREE FOREVER
- If obtained, migrate from GCP to Oracle
- GCP becomes backup or gets shut down
