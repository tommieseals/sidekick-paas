# 🏗️ AI Infrastructure Portfolio

**Tommie Seals** | ML Infrastructure & DevOps | Currently Training in Germany 🇩🇪

---

## 🎯 What I Build

Self-healing distributed systems, intelligent model routing, and automation that runs 24/7 without human intervention.

**Philosophy:** *Build it once, automate it forever, never touch it again.*

---

## 🏆 Featured Projects (2026)

### 1. Multi-Node AI Infrastructure
*Distributed LLM system with intelligent routing and auto-recovery*

**Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    DISTRIBUTED AI MESH                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   MAC MINI   │    │   MAC PRO    │    │    DELL      │      │
│  │  Orchestrator│◄──►│   Compute    │◄──►│   Failsafe   │      │
│  │  3 models    │    │   3 models   │    │   1 model    │      │
│  │  4.5GB       │    │   12.3GB     │    │   Backup     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         └───────────────────┴───────────────────┘               │
│                    Tailscale Mesh Network                        │
│                             │                                    │
│                    ┌────────▼────────┐                          │
│                    │   KIMI K2.5     │                          │
│                    │   Cloud Vision  │                          │
│                    │   50 calls/day  │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 🧠 **9 Models** across 4 nodes with intelligent task routing
- ⚡ **185ms** fast path (local phi3:mini)
- 🔄 **Auto-recovery** via 5-minute watchdog
- 💰 **$0/month** operational cost
- 📊 **Live dashboard** with real-time metrics

**Routing Logic:**
| Task Type | Primary Model | Latency |
|-----------|---------------|---------|
| Code/Debug | deepseek-coder:6.7b | ~2s |
| Fast Queries | phi3:mini (local) | 185ms |
| Reasoning | qwen2.5:7b | ~3s |
| Vision | Kimi K2.5 (cloud) | ~1s |
| Embeddings | nomic-embed-text | ~100ms |

---

### 2. Project Legion - 28-Agent Job Automation
*Autonomous job hunting system running 24/7*

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT LEGION                                │
│                    28 AI Agents                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Executive │  │Headhunt  │  │Research  │  │Documents │        │
│  │  (2)     │  │  (3)     │  │  (3)     │  │  (3)     │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └─────────────┴─────────────┴─────────────┘               │
│                           │                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Submission│  │Portfolio │  │Marketing │  │Analytics │        │
│  │  (3)     │  │  (4)     │  │  (4)     │  │  (3)     │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └─────────────┴─────────────┴─────────────┘               │
│                                                                  │
│  Stats: 200+ jobs/hour | 95.8% ATS accuracy | $0/month          │
└─────────────────────────────────────────────────────────────────┘
```

**Pipeline:**
1. **Discovery** - Scans 7 job platforms hourly
2. **Qualification** - Scores 0-100 (hybrid LLM + keywords)
3. **Research** - ATS analysis, company dossiers
4. **Resume Tailoring** - ATS-optimized per job
5. **Submission** - Browser automation (6 platforms)
6. **Interview Prep** - Practice questions, briefs

---

### 3. Self-Healing Bot Infrastructure
*Watchdog system with auto-recovery and alerting*

**Features:**
- ✅ 60-second health checks
- ✅ Telegram alerts with crash logs
- ✅ 10-minute grace period for manual intervention
- ✅ Auto-restart with confirmation
- ✅ LaunchAgent for boot persistence

**Recovery Flow:**
```
Bot Down → Alert Sent → 10min Wait → Auto-Restart → Confirm
```

---

### 4. LLM Gateway v2.0
*Intelligent model routing with cost optimization*

**Routing Strategy:**
```python
def route_query(query, has_image=False):
    if has_image:
        return "kimi_k25"  # Vision specialist
    if is_code_task(query):
        return "qwen_coder_32b"  # Code specialist
    if needs_deep_reasoning(query):
        return "llama_90b"  # Heavy lifting
    if is_simple(query):
        return "ollama_local"  # FREE!
    return "default_model"
```

**Cost Optimization:**
- FREE local models first (Ollama)
- NVIDIA API for specialized tasks (50/day limit)
- Premium models only when necessary

---

### 5. Infrastructure Automation Suite
*15+ scripts for self-maintaining systems*

| Script | Purpose |
|--------|---------|
| `check-all-nodes.sh` | Batched SSH health checks |
| `track-nvidia-usage.sh` | API budget tracking |
| `auto-cleanup.sh` | Disk cleanup when >80% |
| `auto-restart-services.sh` | Service recovery |
| `enhanced-monitor.sh` | Thresholds + JSON output |

**Cron Schedule:**
- **Daily 9 AM** - Full health report via Telegram
- **Sunday 6 AM** - Security audit
- **Every 6 hours** - Memory auto-commit

---

## 🛠️ Tech Stack

**Infrastructure:**
- Tailscale mesh networking
- SSH multiplexing
- LaunchAgents (macOS)
- PowerShell (Windows)

**AI/ML:**
- Ollama (local inference)
- NVIDIA API (Kimi, Llama, Qwen)
- LLM Gateway (custom routing)

**Automation:**
- Bash/Zsh scripting
- Python (PyAutoGUI, requests)
- GitHub Actions
- Cron/Launchd

**Monitoring:**
- Custom watchdog system
- Telegram alerting
- JSON metrics export
- Live dashboards

---

## 📊 By The Numbers

| Metric | Value |
|--------|-------|
| Nodes | 3 local + 1 cloud |
| Models | 9 with intelligent routing |
| Agents | 28 (Project Legion) |
| Scripts | 15+ automation |
| Cron Jobs | 11 running |
| Monthly Cost | $0 |
| Jobs/Hour | 200+ discovered |
| ATS Accuracy | 95.8% |

---

## 🎓 Philosophy

**Build systems, not scripts.** Any task I do twice becomes automated.

**Resilience over perfection.** Build what works, iterate when needed.

**Document like teaching.** Future-me won't remember today.

**Proactive beats Reactive.** Prevent outages, don't just fix them.

---

## 📫 Contact

- **Email:** tommieseals7700@gmail.com
- **LinkedIn:** [tommieseals](https://linkedin.com/in/tommieseals)
- **GitHub:** [tommieseals](https://github.com/tommieseals)

---

*Last updated: February 2026*
