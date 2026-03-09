# 🖥️ Machine Roles

*What each machine is for, what lives there, and where shared files go.*

---

## Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   MAC MINI      │     │    MAC PRO      │     │     DELL        │
│  Orchestrator   │────▶│    Compute      │     │   Workstation   │
│  100.88.105.106 │     │  100.92.123.115  │     │ 100.119.87.108  │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                               │
         │              Tailscale Mesh                   │
         └───────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   GOOGLE CLOUD    │
                    │   100.107.231.87  │
                    └───────────────────┘
```

---

## 🍎 Mac Mini (100.88.105.106)

### Role: **ORCHESTRATOR / HUB**

The "brain" of the operation. Always-on, handles scheduling, runs bots, lightweight AI.

### What It's For
| Use Case | Why Here |
|----------|----------|
| Clawdbot (tommie77bot) | Main bot runtime |
| LLM Gateway | Routes AI requests |
| Watchdog system | Monitors all nodes |
| Dashboard server | Web UI at :8080/:8443 |
| Scheduling (cron/launchd) | Automated tasks |
| Redis (Project Legion) | Job queue management |
| Small AI models (≤3GB) | Quick queries, embeddings |

### What Lives Here
```
~/clawd/              # Bot workspace, memory, configs
  ├── dashboard/      # Main dashboard (production)
  ├── memory/         # Context persistence
  ├── docs/           # Infrastructure documentation
  └── scripts/        # Bot-related scripts

~/scripts/            # Admin/automation scripts
~/shared-memory/      # Cross-role JSON files
~/dta/                # Gateway, automation, work processing
~/Library/LaunchAgents/  # Scheduled services
```

### Constraints
- ⚠️ **Max 3GB models only** (16GB RAM, macOS needs headroom)
- ✅ Models allowed: qwen2.5:3b, gemma2:2b, phi3:mini, llama3.2:3b
- ❌ Never run: qwen2.5:7b, llama3.1:8b, or ANY model >3GB

### When to Use
✅ Running bots, scheduling, dashboards, lightweight AI
❌ Heavy model inference, large file processing

---

## 🖥️ Mac Pro (100.92.123.115)

### Role: **COMPUTE NODE**

The "muscle". Heavy AI inference, large models, compute-intensive tasks.

### What It's For
| Use Case | Why Here |
|----------|----------|
| Large AI models (7B+) | 32GB RAM capacity |
| deepseek-coder:6.7b | Code generation |
| qwen2.5:7b | Medium reasoning |
| OpenClaw bot (Pinky) | Compute-side bot |
| Project Legion worker | Heavy processing |

### What Lives Here
```
~/                    # OpenClaw workspace
~/.openclaw/          # OpenClaw config and logs
  ├── openclaw.json   # Bot config
  └── logs/           # Gateway logs
~/Library/LaunchAgents/ai.openclaw.gateway.plist  # Service
```

### Constraints
- ✅ Can run models up to ~12GB
- ⚠️ SSH access: `ssh administrator@100.92.123.115`
- 🛡️ Firewall should be ON (sometimes gets disabled - monitor this)

### When to Use
✅ Code generation, heavy AI inference, model training
❌ Always-on services (Mac Mini handles those)

---

## 💻 Dell / Windows (100.119.87.108)

### Role: **WORKSTATION / COORDINATOR**

Rusty's main work machine. Desktop control, GUI automation, failsafe.

### What It's For
| Use Case | Why Here |
|----------|----------|
| Desktop control (PyAutoGUI) | Windows GUI automation |
| Clawdbot (Bottom Bitch) | Windows-hosted bot |
| GUI app control | ChatGPT, Codex, any Windows app |
| Development | Visual Studio, IDEs |
| Failsafe AI | phi3:mini backup |

### What Lives Here
```
C:\Users\tommi\clawd\     # Bot workspace
  ├── taskbot\            # TaskBot project (primary)
  ├── memory\             # Context persistence
  ├── docs\               # Documentation
  └── scripts\            # Windows scripts

C:\Users\tommi\           # User directory
```

### Constraints
- ⚠️ **CrowdStrike monitored** - It's a WORK computer
- ⚠️ Username is `tommi`, not `rusty`
- ⚠️ SSH: `ssh dell` or `ssh tommi@100.119.87.108`
- ✅ Can use for personal projects, but be discreet about AI workloads

### When to Use
✅ Desktop automation, GUI control, Windows-specific tasks, TaskBot development
❌ Suspicious AI workloads that might flag CrowdStrike

---

## ☁️ Google Cloud (100.107.231.87)

### Role: **RESERVED / OVERFLOW**

Cloud VM for heavy processing that doesn't fit elsewhere.

### What It's For
| Use Case | Why Here |
|----------|----------|
| 7B models | When Mac Pro is busy |
| Transcription (Whisper) | Audio/video processing |
| Scraping | Isolated from main network |
| Experiments | Disposable environment |

### What Lives Here
```
~/shared-memory/      # Synced JSON files
~/dta-transcripts/    # Video transcriptions
~/scripts/            # Cloud-side scripts
~/ai-tools/           # Python venv (Whisper, yt-dlp)
```

### Constraints
- 💰 **Costs ~$103/month** (covered by free credit until ~May 2026)
- ⚠️ External IP exists - be careful what you expose
- ✅ UFW firewall active (Tailscale + SSH only)

### When to Use
✅ Heavy transcription, scraping, experiments, overflow AI
❌ Always-on services (costs money), sensitive data

---

## 📁 Where Shared Files Go

### Cross-Machine Sync Points

| Type | Location | Sync Method |
|------|----------|-------------|
| Bot state | `~/shared-memory/*.json` | Manual or rsync |
| Documentation | `~/clawd/docs/` | Git or manual |
| Project Registry | `memory/PROJECT_REGISTRY.md` | Primary on each machine |
| Scripts (portable) | `~/scripts/` | Manual copy |

### Shared Memory Protocol
Located at `~/shared-memory/` on each machine:
```
shared-memory/
├── bot-status.json       # Bot health/status
├── systems.json          # System metrics
├── network.json          # Network status
├── security.json         # Security findings
└── PROTOCOL.md           # How to use shared memory
```

### When to Use Shared vs Local
| Data Type | Where | Why |
|-----------|-------|-----|
| Bot context/memory | Local `memory/` | Session-specific |
| Infrastructure status | `shared-memory/` | All bots need access |
| Project source code | Primary machine only | Avoid sync conflicts |
| Configs (templates) | Git repo | Version controlled |
| Secrets | Environment vars / 1Password | Never in files |

---

## 🔄 Cross-Machine Commands

### SSH Quick Reference
```bash
# From any machine
ssh mac-mini        # 100.88.105.106
ssh mac-pro         # 100.92.123.115 (user: administrator)
ssh google-cloud    # 100.107.231.87
ssh dell            # 100.119.87.108 (user: tommi)
```

### File Transfer
```bash
# Copy TO Mac Mini
scp file.txt mac-mini:~/destination/

# Copy FROM Mac Pro
scp mac-pro:~/file.txt ./

# Sync directory
rsync -avz ./project/ dell:~/clawd/project/
```

### Remote Commands
```bash
# Check Mac Mini RAM
ssh mac-mini "vm_stat | head -5"

# Check Mac Pro models
ssh mac-pro "ollama ps"

# Check Dell (PowerShell)
ssh dell "powershell -Command 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5'"
```

---

## 📊 Decision Matrix: Which Machine?

| I need to... | Use | Because |
|--------------|-----|---------|
| Run a bot 24/7 | Mac Mini | Always-on orchestrator |
| Generate code with AI | Mac Pro | Has deepseek-coder |
| Control a Windows app | Dell | PyAutoGUI + GUI access |
| Transcribe a video | Google Cloud | Whisper installed |
| Build a dashboard | Mac Mini | Web servers run here |
| Process 100GB of data | Google Cloud | Isolated, disposable |
| Quick AI query | Mac Mini | qwen2.5:3b is fast |
| Train a model | Mac Pro | Most RAM |
| Test sketchy code | Google Cloud | Isolated |
| Deploy production | Mac Mini | Hub for all services |

---

## ⚠️ Don't Forget

1. **Mac Mini is the hub** - Most services start/stop here
2. **Mac Pro is for heavy lifting** - Don't run small tasks there
3. **Dell is CrowdStrike monitored** - Be thoughtful
4. **Google Cloud costs money** - Turn off when not needed
5. **Always check machine before working** - `pwd`, hostname, verify

---

*Know your machines. Use the right tool for the job.*
*Last updated: 2026-02-28*
