# Team & Coordination Reference
## Last Updated: February 2026

---

## The Bot Chat — Multi-Agent Team

**Group Chat:** "The Bot Chat" (chatId: -1003779327245 / -5052671848)

### Team Members

| Bot | Username | Location | Role |
|-----|----------|----------|------|
| 🍑 **Bottom Bitch** | @Thats_My_Bottom_Bitch_bot | Dell (100.119.87.108) | Coordinator, Windows host |
| 🧠 **Tommie77** | @tommie77bot | Mac Mini (100.88.105.106) | Main orchestrator |
| 🐭 **Pinky** | @Pinkypickles_bot | Mac Pro (100.64.58.30) | Compute node |
| 🥜 **Deez Nutz** | @look_at_deeznutszbot | TBD | Needs setup |

### How We Work
- Read each other's updates in the group
- Share knowledge about infrastructure
- Coordinate on tasks
- Learn from each other's reports
- Don't step on each other's work

---

## AI Admin Roles (4 Scheduled Roles)

### Role Overview

| Role | Schedule | Model | Location | Purpose |
|------|----------|-------|----------|---------|
| Security Admin | 6:00 AM daily | qwen2.5:3b (local) or 7b (cloud) | Mac Mini → Cloud | Threat detection, port scanning, Tailscale security |
| Network Admin | 6:30 AM daily | qwen2.5:3b (local) or 7b (cloud) | Mac Mini → Cloud | Tailscale mesh health, latency monitoring |
| Systems Admin | 7:00 AM daily | qwen2.5:3b (local) or 7b (cloud) | Mac Mini → Cloud | RAM/CPU/disk monitoring, service health |
| DTA | 7:30 AM daily | qwen2.5:7b (cloud) or Claude Opus | Cloud / API | Strategic brain, technology scouting |

### All Role Prompts Include
- Cross-role communication (ALERT/TICKET/INFO)
- RAM awareness (check free RAM before heavy tasks)
- Tailscale-first networking
- Error handling and retry logic (3x retries)
- HARD BOUNDARY on Dell computer
- Hardware: "Mac Mini hub (16GB) + Google Cloud VM (16GB). Dell at 100.119.87.108 is OFF LIMITS."
- Shared memory logging at end of every invocation

---

## Cross-Role Communication Protocol ("Highway Ack" System)

| Message Type | Urgency | Recipient | Example |
|-------------|---------|-----------|---------|
| **ALERT** | Urgent, immediate | Specific role + DTA | Security → Network: "Suspicious port scan" |
| **TICKET** | Non-urgent, for review | DTA only | Systems → DTA: "Disk at 85%" |
| **INFO** | FYI, no action | Shared log | Network → Log: "Latency stable" |

---

## Shared Memory Persistence

**Location:** `~/shared-memory/` on Mac Mini (synced to cloud)

**Files:**
| File | Purpose |
|------|---------|
| security.json | Security admin state |
| network.json | Network admin state |
| systems.json | Systems admin state |
| dta.json | DTA state |
| tickets.json | Open tickets |
| backlog.json | Failed tasks for retry |

**ON EVERY STARTUP/RESET:** Read your role's shared-memory JSON file FIRST to rebuild context.

---

## Automation Schedule (PERMANENT)

### Daily

| Time | Task | Model |
|------|------|-------|
| 6:00 AM | Security admin analysis | Kimi thinking=true |
| 6:05 AM | Overnight logs summary | - |
| 6:30 AM | Network admin check | Local/Cloud |
| 7:00 AM | Systems admin monitoring | Local/Cloud |
| 7:30 AM | DTA strategic analysis | Cloud/API |
| 9 AM-5 PM | CR processing (every 2h) | Perplexity |
| 9 AM-5 PM | Code reviews (3x) | deepseek |
| 6:00 PM | Evening metrics analysis | Kimi |
| 6:15 PM | Tomorrow's planning | - |

### Weekly (Sunday)

| Time | Task |
|------|------|
| 8:00 AM | Infrastructure review |
| 9:00 AM | Security posture |
| 10:00 AM | Week ahead planning |
| 11:00 AM | Automation improvements |
| 12:00 PM | Routing optimization |

### Work Processing (Drop-folder Automation)
- CRs: `~/dta/work-automation/change-requests/inbox/` → Perplexity
- Code: `~/dta/work-automation/code-reviews/inbox/` → deepseek

### Control
- Script: `~/dta/automation/automation-control.sh`
- Logs: `~/dta/automation/logs/`
- Reports: `~/dta/automation/reports/`

**Value:** 15-20 hours/week automated. Never ask permission to run scheduled tasks.

---

## Bot Team Coordination Protocol (NEW - 2026-06-18)

### Shared Status Infrastructure
**Location:** `~/shared-memory/bot-status.json` on each node

Each bot maintains a local status file with:
- Bot registry (name, host, capabilities)
- Heartbeat timestamps (5-minute intervals)
- Status: `online` | `stale` | `offline` | `unknown`

**Protocol Documentation:** `~/shared-memory/PROTOCOL.md`

### Current Connectivity Status

| From → To | Method | Status |
|-----------|--------|--------|
| Dell → Mac Mini | SSH | ❌ Key not trusted (needs setup) |
| Dell → Mac Pro | SSH | ❌ Key not trusted (needs setup) |
| Dell → Macs | Tailscale | ✅ Active, direct connection |
| All Bots | Telegram Group | ✅ Working |

### SSH Key Setup Required
Dell's public key needs to be added to both Macs' `~/.ssh/authorized_keys`:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC... (see Dell ~/.ssh/id_rsa.pub)
```

### Communication Hierarchy
1. **Telegram Group** (primary) - All bots can read/write
2. **SSH** (secondary) - Direct node access when keys set up
3. **Shared Memory Sync** - rsync status files between nodes

### Alert Escalation
| Level | Action |
|-------|--------|
| INFO | Log only |
| WARN | Log + Telegram Group |
| ALERT | Log + Group + DM Tommie |
| CRITICAL | All channels + immediate escalation |

---

## Project Legion — 28-Agent Job System

**Dashboard:** http://100.88.105.106:8080/legion-tracker.html

### Current Status (Updated: Feb 17, 2026 09:15 AM CST)

⚠️ **REDIS DOWN** - Job persistence blocked!

| Component | Status |
|-----------|--------|
| Legion Scheduler | ✅ Running (PID 97550) |
| IT Monitoring | ✅ Running (PID 25632, every 15 min) |
| Auto Report | ✅ Running (PID 61894) |
| Redis | 🔴 DOWN (since at least 6:45 AM) |
| Database | ⚠️ Empty (0 jobs, 0 applications) |
| Easy Apply Filter | ✅ Tested working |
| Email Parser | ✅ Tested working |
| Chrome Extension | ✅ Ready to install |

**Action Needed:** Start Redis: `brew services start redis`

### Target Stats (when operational)
- 200+ jobs discovered per hour (USAJOBS API primary)
- 65% qualification rate (130+ qualified/hour)
- 95.8% ATS keyword matching accuracy
- 10 applications/day max (rate-limited for quality)
- Cost: $0/month (Ollama local + free tiers)

### Architecture
```
Mac Mini (Hub) ←─Redis─→ Mac Pro (Worker)
CEO + Scheduler          All 8 Departments
Telegram Bot             28 Agents
Ollama (3B)              Ollama (4 models, 7B)
```

### The 8 Departments (28 Agents)

| Dept | Agents | Function |
|------|--------|----------|
| Executive | 2 | CEO orchestration, Compliance Officer |
| Headhunting | 3 | Job Scanner (7 platforms), Job Qualifier |
| Research | 3 | ATS Researcher, Company Researcher |
| Documents | 3 | Resume Tailor, Form Specialist |
| Submission | 3 | Application Submitter (6 ATS handlers) |
| Portfolio | 4 | GitHub Manager, Dashboard Developer |
| Marketing | 4 | LinkedIn Content, Network Builder |
| Analytics | 3 | Metrics Analyst, Report Generator |
| Interview | 3 | Practice Interviewer, Research Compiler |

### Complete Pipeline
1. **Discovery:** Scans 7 job platforms hourly
2. **Qualification:** Scores 0-100 (hybrid LLM + keywords)
3. **Research:** ATS analysis, company dossiers, salary data
4. **Resume Tailoring:** ATS-optimized DOCX/PDF for each job
5. **Approval:** Telegram notification for manual review
6. **Submission:** Browser automation (6 platforms)
7. **Interview Prep:** Practice questions, company briefs

---

## Tommie's Preferences & Context

### Work
- Employer: Kuraray America Inc
- Work computer: Dell i9/64GB with CrowdStrike and Intune (OFF LIMITS for personal use)
- Work tools: PowerShell scripting, Intune package deployment, "KAI " naming conventions

### Home Infrastructure Philosophy
- **Local-first:** Minimize cloud dependencies where possible
- **Automation-first:** Reduce manual oversight
- **Cost-conscious:** Free/cheap solutions preferred
- **Security-aware:** Tailscale-only access, no open home ports

### Communication
- Primary channel: Telegram bot (Moltbot)
- Preferences: Detailed PowerShell scripts with prerequisite handling, comprehensive solutions over incremental fixes

### Ongoing Projects
- Gmail cleanup (129K+ messages)
- YouTube video analysis pipeline
- Multi-node AI orchestration
- InnoBot for digital transformation scouting

---

## Playbook Document History

| Document | Version | Location | Purpose |
|----------|---------|----------|---------|
| AI Infrastructure Playbook | v2.0 | ~/clawd/projects/ai-infrastructure/playbook-v2.0.txt | Master architecture, DTA role, cloud failover |
| Playbook Supplement | v2.1 | ~/clawd/projects/ai-infrastructure/playbook-v2.1-supplement.txt | Cross-role comms, RAM guards, Tailscale hardening |
| Architecture Correction | v2.2 | ~/clawd/projects/ai-infrastructure/ARCHITECTURE_v2.2_UPDATE.md | Dell removal, GCP cloud worker, 2-node topology |
