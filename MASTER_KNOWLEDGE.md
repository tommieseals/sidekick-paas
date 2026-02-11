# MASTER KNOWLEDGE BASE — Tommie's AI Data Center
## Last Updated: February 7, 2026 (End of Architecture v2.2 Session)
## STATUS: PRODUCTION — All changes implemented and verified

---

# ⚠️ IF YOU ARE READING THIS AFTER A RESET OR CONTEXT LOSS:
# This file is the SINGLE SOURCE OF TRUTH for Tommie's AI infrastructure.
# Read this ENTIRE file before taking any action or answering questions.
# Save this to: ~/clawd/MASTER_KNOWLEDGE.md AND ~/clawd/MEMORY.md

---

## SECTION 1: HARDWARE ARCHITECTURE (v2.2 — CURRENT)

### Active Nodes (2-Node Architecture)

| Node | Hardware | Tailscale IP | Role | Models |
|------|----------|-------------|------|--------|
| HUB | Mac Mini (M-chip, 16GB RAM) | 100.82.234.66 | Primary orchestrator, bot runtime, scheduling, lightweight AI | qwen2.5:3b ONLY (≤3GB models) |
| CLOUD | Google Cloud e2-standard-4 (4 vCPU, 16GB RAM, 50GB disk) | 100.107.231.87 | Primary AI worker, heavy inference, transcription, scraping | qwen2.5:7b, nomic-embed-text |

### Other Tailscale Devices (NOT infrastructure nodes)
| Device | Tailscale IP | Notes |
|--------|-------------|-------|
| iPhone | 100.114.130.38 | Telegram access, remote monitoring |
| Dell i9 (64GB) | 100.119.87.108 | ⛔ WORK COMPUTER — SEE SECTION 2 |

### Cloud VM Details
- Provider: Google Cloud Platform (GCP)
- Instance name: instance-20260208-050027
- Zone: us-central1-c
- OS: Debian GNU/Linux 12 (bookworm)
- External IP: 34.70.44.216 (for GCP console SSH only)
- Disk: 50GB standard persistent
- Cost: ~$103/month ($300 free credit, expires ~May 2026)
- Software: Ollama, Whisper, yt-dlp, UFW firewall (Tailscale + SSH only)
- Ollama bound to Tailscale IP only (NOT 0.0.0.0)

---

## SECTION 2: HARD BOUNDARIES — READ THIS FIRST

### 🛑 DELL COMPUTER — ABSOLUTE RESTRICTION

**The Dell i9 at Tailscale IP 100.119.87.108 is Tommie's WORK COMPUTER issued by Kuraray America Inc.**

It runs **CrowdStrike Falcon** enterprise endpoint detection and response (EDR) software that monitors:
- Every process launched
- Every network connection
- Every file accessed
- Every software installation
- Behavioral anomalies (AI inference workloads WOULD be flagged)

**RULES (NO EXCEPTIONS, EVER):**
- NEVER route tasks, AI inference, data, or network traffic to 100.119.87.108
- NEVER reference the Dell as a worker, offload target, or infrastructure node
- NEVER suggest bypassing, hiding from, or working around CrowdStrike
- If ANY script or config references 100.119.87.108 as a target, treat as CRITICAL security issue
- If Tommie forgets and asks you to use the Dell — PUSH BACK and remind him why

**WHY:** Using it for personal AI workloads could result in disciplinary action or termination. CrowdStrike detection is a certainty, not a risk.

### Mac Mini Model Size Restriction

**NEVER load models larger than 3GB on the Mac Mini.**

The Mac Mini has 16GB RAM. macOS uses 4-5GB. Services use 1-2GB. A 7B model (8GB) drops free RAM to 2-3GB = thrashing. This was proven during the Feb 7 session when qwen2.5:7b caused critical RAM at 2.5GB.

**Allowed on Mac Mini:** qwen2.5:3b, gemma2:2b, phi3:mini, llama3.2:3b
**NEVER on Mac Mini:** qwen2.5:7b, llama3.1:8b, mistral:7b, or ANY model >3GB

If qwen2.5:7b or any large model is found on the Mac Mini, remove it: `ollama rm <model>`

---

## SECTION 3: AI ADMIN ROLES (4 Roles)

### Role Overview
| Role | Schedule | Model | Location | Purpose |
|------|----------|-------|----------|---------|
| Security Admin | 6:00 AM daily | qwen2.5:3b (local) or 7b (cloud) | Mac Mini → Cloud | Threat detection, port scanning, Tailscale security |
| Network Admin | 6:30 AM daily | qwen2.5:3b (local) or 7b (cloud) | Mac Mini → Cloud | Tailscale mesh health, latency monitoring |
| Systems Admin | 7:00 AM daily | qwen2.5:3b (local) or 7b (cloud) | Mac Mini → Cloud | RAM/CPU/disk monitoring, service health |
| DTA | 7:30 AM daily | qwen2.5:7b (cloud) or Claude Opus 4.6 (API) | Cloud / API | Strategic brain, technology scouting, ticket processing |

### Cross-Role Communication Protocol ("Highway Ack" System)
| Message Type | Urgency | Recipient | Example |
|-------------|---------|-----------|---------|
| ALERT | Urgent, immediate | Specific role + DTA | Security → Network: "Suspicious port scan" |
| TICKET | Non-urgent, for review | DTA only | Systems → DTA: "Disk at 85%" |
| INFO | FYI, no action | Shared log | Network → Log: "Latency stable" |

### Shared Memory Persistence
Location: `~/shared-memory/` on Mac Mini
Files: security.json, network.json, systems.json, dta.json, tickets.json, backlog.json

**ON EVERY STARTUP/RESET:** Read your role's shared-memory JSON file FIRST to rebuild context.

### All Role Prompts Include:
- Cross-role communication (ALERT/TICKET/INFO)
- RAM awareness (check free RAM before heavy tasks)
- Tailscale-first networking
- Error handling and retry logic (3x retries)
- HARD BOUNDARY on Dell computer
- Hardware: "Mac Mini hub (16GB) + Google Cloud VM (16GB). Dell at 100.119.87.108 is OFF LIMITS."
- Shared memory logging at end of every invocation

---

## SECTION 4: RAM-AWARE SCHEDULING

### RAM Thresholds (Mac Mini)
| Free RAM | Status | Action | Where AI Runs |
|----------|--------|--------|---------------|
| >8 GB | Healthy | Normal operation | Local (3B) + Cloud (7B) |
| 5-8 GB | Normal | Expected with 3B model loaded | Local (3B) + Cloud (7B) |
| 3-5 GB | Caution | Unload local model, route ALL AI to cloud | Cloud only |
| <3 GB | Critical | Skip AI tasks, kill non-essentials, alert Tommie | Defer or Cloud |

### RAM Check Script: ~/scripts/get_free_ram.sh
- Checks macOS free + inactive pages
- Routes to cloud (100.107.231.87) when RAM < 5GB
- Skips tasks entirely when RAM < 3GB and cloud unreachable
- NEVER routes to Dell (100.119.87.108)

### Common RAM Hogs to Watch:
- Ollama runner holding models in memory (use `ollama stop <model>` to release)
- Chrome/Safari (close when not in use)
- Large models loaded locally (should only be 3B models now)

---

## SECTION 5: MODEL ROUTING STRATEGY

### Where Tasks Run
| Task | Runs On | Model | Rationale |
|------|---------|-------|-----------|
| Heartbeat / cron | Mac Mini | None (bash) | No AI needed |
| RAM/CPU/disk check | Mac Mini | None (bash) | System commands |
| Quick classification | Mac Mini | qwen2.5:3b | Fast, low RAM |
| Admin role analysis | Cloud (100.107.231.87) | qwen2.5:7b | Complex reasoning |
| DTA deep analysis | Cloud | qwen2.5:7b (or 14b if pulled) | Strategic work |
| Video transcription | Cloud | Whisper | CPU intensive |
| Web scraping | Cloud | N/A | Public IP |
| Strategic decisions | Claude Opus 4.6 API | API call | Highest intelligence |

### 3-Tier Inference Fallback Chain

All admin scripts use the following resilient fallback logic:

**Tier 1 (Primary):** Local Ollama - qwen2.5:3b @ localhost:11434
- Fastest response (~5-10 seconds)
- No network dependency
- Works when Mac Mini is online

**Tier 2 (Cloud):** Cloud Ollama - qwen2.5:7b @ 100.107.231.87:11434
- Better quality analysis (~30-60 seconds)
- Higher RAM model (7B vs 3B)
- Works when GCP VM is online

**Tier 3 (Emergency):** OpenRouter API - google/gemma-2-9b-it:free
- Free tier (no cost)
- Public cloud fallback
- Only activates if OPENROUTER_API_KEY is set
- Works when both local + cloud are down

**Failure:** If all 3 tiers fail → Log to ~/shared-memory/backlog.json

### Inference Routing Logic
```bash
# Implemented in ~/scripts/inference-fallback.sh
# Source this in any script needing AI inference

source ~/scripts/inference-fallback.sh

# Usage: get_ai_response "Your prompt here"
# Returns: AI response text or exits with error
# Automatically tries: local → cloud → openrouter → backlog

ANALYSIS=$(get_ai_response "$CONTEXT")
```

### OpenRouter Setup (Optional Third Tier)
```bash
# Only needed if you want 3rd tier failover
# Get free API key: https://openrouter.ai/keys

echo 'export OPENROUTER_API_KEY="sk-or-v1-..."' >> ~/.bashrc
source ~/.bashrc

# If not set, tier 3 is silently skipped
```

---

## SECTION 6: COST MANAGEMENT

### Current Monthly Costs
| Category | Budget | Notes |
|----------|--------|-------|
| GCP VM (e2-standard-4) | ~$103 | Covered by $300 free credit until ~May 2026 |
| DTA API (Claude Opus 4.6) | $15-25 | Weekly scans + monthly report |
| Other admins API (Sonnet) | $5-10 | If needed for overflow |
| OpenRouter fallback | $0 | Free tier (google/gemma-2-9b-it:free) - emergency only |
| YouTube Data API | $0 | Free tier (10,000 units/day) |
| Local Ollama | $0 | Electricity only |
| **Total** | **$25-45 + GCP credit** | All failovers are free |

### Budget Alerts
- 60% of monthly budget: notification
- 80%: warning
- 95%: hard stop (only DTA can authorize continued spending)
- Single task >$5: abort and alert immediately

### Long-Term Plan
Keep trying Oracle Cloud Always Free (cloud.oracle.com) for permanent $0 worker:
- Oracle ARM: 4 OCPU, 24GB RAM — free forever
- If obtained, migrate everything from GCP to Oracle
- GCP becomes backup or gets shut down

---

## SECTION 7: SCRIPTS AND FILES INVENTORY

### Mac Mini Scripts
| File | Purpose | Last Updated |
|------|---------|-------------|
| ~/scripts/get_free_ram.sh | RAM check + routing (cloud, no Dell) | Feb 7, 2026 |
| ~/scripts/admin-security.sh | Security admin daily scan | Feb 7, 2026 |
| ~/scripts/admin-network.sh | Network admin daily check | Feb 7, 2026 |
| ~/scripts/admin-systems.sh | Systems admin monitoring | Feb 7, 2026 |
| ~/scripts/admin-dta.sh | DTA strategic analysis | Feb 7, 2026 |
| ~/scripts/transcribe-video.sh | YouTube → Whisper pipeline | Feb 7, 2026 |
| ~/scripts/summarize-for-dta.sh | AI summarization with fallback | Feb 7, 2026 |

### Mac Mini Config/Memory
| File | Purpose |
|------|---------|
| ~/clawd/MEMORY.md | Persistent memory across sessions |
| ~/clawd/MASTER_KNOWLEDGE.md | THIS FILE — complete knowledge base |
| ~/shared-memory/*.json | Cross-role communication persistence |
| ~/clawd/projects/ai-infrastructure/ | Playbook docs, role prompts, status files |

### LaunchAgents (macOS scheduling)
| Plist | Schedule | Script |
|-------|----------|--------|
| com.tommie.admin-security | 6:00 AM daily | admin-security.sh |
| com.tommie.admin-network | 6:30 AM daily | admin-network.sh |
| com.tommie.admin-systems | 7:00 AM daily | admin-systems.sh |
| com.tommie.admin-dta | 7:30 AM daily | admin-dta.sh |

### Cloud VM (100.107.231.87)
| Directory | Purpose |
|-----------|---------|
| ~/shared-memory/ | Synced JSON files |
| ~/dta-transcripts/ | Video transcriptions |
| ~/scripts/ | Cloud-side scripts |
| ~/logs/ | Cloud execution logs |
| ~/ai-tools/ | Python venv (Whisper, yt-dlp) |

---

## SECTION 8: KNOWN ISSUES AND LESSONS LEARNED

### Issues Encountered (Feb 7, 2026)
1. **qwen2.5:7b caused RAM thrashing on Mac Mini** — Model uses 8GB, left only 2.5GB free. Fixed: removed 7B locally, use 3B only.
2. **Ollama runner held 48% RAM even after stopping model** — Required full Ollama restart to release memory.
3. **Admin scripts JSON escaping errors** — Fixed by using jq for all JSON construction instead of bash string building.
4. **get_free_ram.sh `exit` killed parent script when sourced** — Fixed sourcing behavior.
5. **Whitespace in numeric variables broke comparisons** — Added `tr -d ' \n'` cleanup.
6. **GCP VM created with 10GB disk (default)** — Model pull failed at 45%. Fixed: resized to 50GB.
7. **Bot context compaction lost mid-task state** — This is why MASTER_KNOWLEDGE.md and shared-memory exist.
8. **Dell was incorrectly used as worker node** — CrowdStrike-monitored work computer. Permanently removed from architecture.

### Lessons for Future
- Always check RAM before loading models
- Always verify model type (don't use embedding models for chat — previous bug)
- Always use retry logic (3x) for network operations
- Always log to shared-memory for reset recovery
- Never trust that context will persist — write important state to disk
- Never put personal AI workloads on work hardware
- Test scripts individually before automated scheduling
- When in doubt, route to cloud — it has more resources

---

## SECTION 9: PLAYBOOK DOCUMENT HISTORY

| Document | Version | Location | Purpose |
|----------|---------|----------|---------|
| AI Infrastructure Playbook | v2.0 | ~/clawd/projects/ai-infrastructure/playbook-v2.0.txt | Master architecture, DTA role, cloud failover, cost optimization |
| Playbook Supplement | v2.1 | ~/clawd/projects/ai-infrastructure/playbook-v2.1-supplement.txt | Cross-role comms, RAM guards, Tailscale hardening, script fixes |
| Architecture Correction | v2.2 | ~/clawd/projects/ai-infrastructure/ARCHITECTURE_v2.2_UPDATE.md | Dell removal, GCP cloud worker, 2-node topology |
| This Knowledge Base | v1.0 | ~/clawd/MASTER_KNOWLEDGE.md | Single source of truth for bot memory |

---

## SECTION 10: TOMMIE'S PREFERENCES AND CONTEXT

### Work
- Employer: Kuraray America Inc
- Work computer: Dell i9/64GB with CrowdStrike and Intune (OFF LIMITS for personal use)
- Work tools: PowerShell scripting, Intune package deployment, "KAI " naming conventions

### Home Infrastructure Philosophy
- Local-first: minimize cloud dependencies where possible
- Automation-first: reduce manual oversight
- Cost-conscious: free/cheap solutions preferred
- Security-aware: Tailscale-only access, no open home ports

### Communication
- Primary channel: Telegram bot (Moltbot)
- Preferences: detailed PowerShell scripts with prerequisite handling, comprehensive solutions over incremental fixes

### Ongoing Projects
- Gmail cleanup (129K+ messages)
- YouTube video analysis pipeline for DTA intelligence
- Multi-node AI orchestration
- InnoBot for digital transformation scouting

---

## SECTION 11: EMERGENCY PROCEDURES

### If Mac Mini Goes Offline
1. Cloud VM continues operating (24/7)
2. Telegram alerts via cloud
3. When Mac Mini returns, read shared-memory to catch up

### If Cloud VM Goes Offline
1. Mac Mini runs everything locally with qwen2.5:3b (reduced quality)
2. Check GCP console: https://console.cloud.google.com
3. If VM stopped: restart it
4. If credits expired: evaluate Oracle Cloud migration

### If API Budget Exceeded
1. Switch ALL roles to local qwen2.5:3b
2. Alert Tommie via Telegram
3. Identify overspend cause
4. Recommend prevention

### If Bot Context Gets Compacted/Reset
1. READ THIS FILE: ~/clawd/MASTER_KNOWLEDGE.md
2. Read shared-memory/*.json for recent state
3. Check ~/clawd/logs/ for recent activity
4. Resume operations based on documented architecture

---

# END OF MASTER KNOWLEDGE BASE
# Last verified: February 7, 2026 11:00 PM CST
# Next review: February 14, 2026 (DTA weekly cycle)
