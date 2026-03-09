# 🏗️ Infrastructure Reference

*Network topology and node capabilities.*

---

## Nodes

### Mac Mini (100.88.105.106)
- **User:** tommie
- **Role:** Gateway, services hub
- **SSH:** `ssh tommie@100.88.105.106`
- **Services:**
  - Ollama (qwen2.5:3b) — FREE local AI
  - Clawdbot Gateway
  - Dashboard server (port 8080)
  - Legion Hub
  - LLM Gateway

### Mac Pro (100.101.89.80)
- **User:** administrator
- **Role:** Heavy compute, Fort Knox storage
- **SSH:** `ssh administrator@100.101.89.80`
- **Services:**
  - Fort Knox (`~/fort-knox/`)
  - Shared Brain (`~/shared-brain/`)
  - Legion Worker
  - Ollama (heavier models)

### Dell (100.119.87.108)
- **User:** tommi
- **Role:** Primary workspace, Windows
- **Services:**
  - Clawdbot (Bottom Bitch)
  - Project Vault
  - Desktop automation (PyAutoGUI)
- **Note:** CrowdStrike monitored

---

## Dashboard

**URL:** http://100.88.105.106:8080/

| Page | What It Shows |
|------|---------------|
| `/` | Main dashboard |
| `/infrastructure.html` | Node status |
| `/projects.html` | All projects |
| `/project-vault.html` | Trading system |
| `/legion.html` | Job hunting |
| `/fort-knox.html` | Backup status |
| `/swarm-monitor.html` | Agent swarm |
| `/arbitrage-pharma.html` | Pharma project |

---

## Shared Paths

| Resource | Location |
|----------|----------|
| **Fort Knox** | Mac Pro `~/fort-knox/` |
| **Shared Brain** | Mac Pro `~/shared-brain/` |
| **Dashboard** | Mac Mini `~/clawd/dashboard/` |
| **Scripts** | Mac Mini `~/clawd/scripts/` |
| **Legion** | Mac Mini `~/job-hunter-system/` |

---

## SSH Shortcuts

Add to `~/.ssh/config`:
```
Host mac-mini
    HostName 100.88.105.106
    User tommie
    
Host mac-pro
    HostName 100.101.89.80
    User administrator
    
Host dell
    HostName 100.119.87.108
    User tommi
```

---

## Launchd Services (Mac Mini)

| Service | What It Does |
|---------|--------------|
| `com.clawdbot.gateway` | Clawdbot main process |
| `com.clawd.fort-knox` | Backup policy (3 AM) |
| `com.clawd.backup.daily` | Daily backups (2 AM) |
| `com.legion.worker` | Legion job processor |
| `com.ollama.server` | Local AI |

---

*Update this when infrastructure changes.*
