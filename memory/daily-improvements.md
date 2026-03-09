# Daily Improvements Log

Track all daily improvements to avoid repeating and show progress over time.

---

## 2026-03-07 (Saturday) - Tailscale Network Monitor

**What I built:** `scripts/tailscale-monitor.ps1` - Multi-node Tailscale health monitor with incident tracking

**Why it helps:** After the Feb 17 networking disaster, we need visibility into Tailscale health across ALL nodes. This script:
- Checks all 4 nodes (Dell, Mac-Mini, Mac-Pro, Google-Cloud) in one command
- Tests TCP connectivity, SSH access, AND Tailscale status for each
- Tracks node status changes over time
- Logs incidents (down/recovered) automatically to `memory/tailscale-state.json`
- Can run in continuous Watch mode for real-time monitoring
- Optional Telegram alerts when critical nodes go down/recover

**Files changed:**
- `C:\Users\tommi\clawd\scripts\tailscale-monitor.ps1` (new - 10KB)
- `C:\Users\tommi\clawd\memory\tailscale-state.json` (auto-created state file)

**Try it:**
```powershell
.\scripts\tailscale-monitor.ps1              # One-time check
.\scripts\tailscale-monitor.ps1 -Watch       # Continuous monitoring (5 min intervals)
.\scripts\tailscale-monitor.ps1 -Watch -Interval 60   # Check every minute
.\scripts\tailscale-monitor.ps1 -Alert       # Enable Telegram alerts
.\scripts\tailscale-monitor.ps1 -Quiet       # Only show problems
```

**Sample output:**
```
[TAILSCALE NETWORK MONITOR]
   2026-03-07 09:03:30

[OK] Local Tailscale: 100.119.87.108 (DESKTOP-165KUF5)

[OK] Mac-Mini (100.88.105.106) [CRITICAL]
   Role: Local AI / Ollama
   Latency: N/A | SSH: OK | Tailscale: UP

[OK] Mac-Pro (100.92.123.115)
   Role: Heavy AI Workloads
   Latency: N/A | SSH: OK | Tailscale: UP

[OK] Dell (100.119.87.108) [CRITICAL]
   Role: Windows Workstation
   Latency: N/A | SSH: OK | Tailscale: UP

----------------------------------------
SUMMARY: 4/4 nodes online
```

**Impact:** No more networking blindspots. One command shows the health of the entire Tailscale mesh. Can integrate with heartbeat for automatic monitoring. Never get caught off guard by a dead node again.

---

## 2026-03-06 (Friday) - Weekly Progress Report Generator

**What I built:** `scripts/weekly-progress-report.ps1` - Automated progress compilation

**Why it helps:** No more wondering "what did I accomplish this week?" One command shows:
- All daily improvements with dates
- Git commits across all projects (clawd, TaskBot, TerminatorBot)
- Memory files updated
- Scripts created/modified
- Infrastructure status (all 3 nodes)
- Summary stats table
- Improvement streak tracking

**Files changed:**
- `C:\Users\tommi\clawd\scripts\weekly-progress-report.ps1` (new - 9.8KB)

**Try it:**
```powershell
.\scripts\weekly-progress-report.ps1              # Full report
.\scripts\weekly-progress-report.ps1 -Days 14     # Last 2 weeks
.\scripts\weekly-progress-report.ps1 -Output "report.md"  # Save to file
.\scripts\weekly-progress-report.ps1 -Telegram    # Show summary for Telegram
```

**Sample output:**
```
## Summary
| Metric | Count |
|--------|-------|
| Daily Improvements | 4 |
| Git Commits | 0 |
| Memory Files Updated | 10 |
| Scripts Modified | 10 |
```

**Impact:** Perfect for Monday mornings or end-of-week reviews. Shows tangible progress at a glance - exactly the "money on the table" visibility that matters.

---

## 2026-03-04 (Wednesday) - GitHub Portfolio Scanner

**What I built:** `scripts/github-portfolio-scanner.ps1` - Automated project readiness checker

**Why it helps:** HEARTBEAT.md says to check GitHub portfolio 3x daily. This scanner automates the hard part:
- Scans all local projects and scores them (0-100)
- Detects secrets/API keys that would be dangerous to push
- Warns about personal data (emails, IPs, phone numbers)
- Checks for README, .gitignore, LICENSE
- Identifies language/framework automatically
- Has a `-PrepareFor` flag that generates a full checklist for a specific project

**Files changed:**
- `C:\Users\tommi\clawd\scripts\github-portfolio-scanner.ps1` (new - 13.5KB)

**Try it:**
```powershell
.\scripts\github-portfolio-scanner.ps1              # Scan all projects
.\scripts\github-portfolio-scanner.ps1 -Detailed    # Show all notes
.\scripts\github-portfolio-scanner.ps1 -PrepareFor "TerminatorBot"  # Get checklist for one project
```

**Sample output:**
```
Found 12 potential projects:
[READY] TerminatorBot - Score: 70/100 (Python, 5646 files)
[SECRETS] scripts - Score: 45/100 (15 secrets found!)
[NO README] taskbot - Score: 20/100

SUMMARY:
[READY] Ready to push: 9 projects
[WORK] Needs README/cleanup: 2 projects
[FIX] Has secrets (fix first!): 4 projects
```

**Impact:** No more manually checking each project. One command shows exactly what's ready for GitHub and what needs work. Directly supports job search (portfolio = credibility).

---

## 2026-03-03 (Tuesday) - Memory Consolidator

**What I built:** `scripts/memory-consolidator.ps1` - Automated daily log distillation

**Why it helps:** AGENTS.md says to periodically consolidate old daily logs into MEMORY.md learnings. This script automates that! It:
- Finds memory files older than N days (default: 7)
- Extracts key content: topics, issues, fixes, learnings, decisions
- Uses smart pattern matching to identify important sections
- Generates a consolidated summary
- Appends to MEMORY.md with proper formatting
- Optionally archives processed files

**Files changed:**
- `C:\Users\tommi\clawd\scripts\memory-consolidator.ps1` (new - 7.5KB)

**Try it:**
```powershell
.\scripts\memory-consolidator.ps1              # Process files > 7 days old
.\scripts\memory-consolidator.ps1 -Days 14     # Process files > 14 days old
.\scripts\memory-consolidator.ps1 -Preview     # Preview without saving
.\scripts\memory-consolidator.ps1 -Archive     # Archive processed files after
```

**Sample output:**
```
[FILE] Processing: 2026-02-07.md
   [OK] Extracted 10 insights:
      **Topics:** System Diagnostic, Admin Roles Audit, AI Infrastructure Playbook...
      **Learned:** system was restored from January 29 backup
      **Fixed/Solved:** PATH issue, admin scripts...
```

**Impact:** No more manual review of old daily files. The consolidator extracts what matters and adds it to long-term memory automatically.

---

## 2026-03-02 (Monday) - Morning Dashboard

**What I built:** `scripts/morning-dashboard.ps1` - Complete system status at a glance

**Why it helps:** Instead of running multiple commands to check infrastructure, one command shows:
- All 3 nodes (Dell/Mac Mini/Mac Pro) with RAM and disk usage
- NVIDIA API budget remaining (50/day)
- TaskBot tunnel status + URL if running
- Mac Mini Ollama health check
- Last 3 days of activity summaries
- Daily improvement streak tracking

**Files changed:**
- `C:\Users\tommi\clawd\scripts\morning-dashboard.ps1` (new)
- Fixed to use SSH instead of ping (Mac firewalls block ping)

**Try it:**
```powershell
.\scripts\morning-dashboard.ps1        # Full dashboard (with SSH details)
.\scripts\morning-dashboard.ps1 -Quick # Fast mode (no SSH, just ping)
```

**Bonus finding:** Dell RAM at 90%! Dashboard caught this immediately.

---

## 2026-03-01 (Sunday) - TaskBot Tunnel Manager

**What I built:** `scripts/taskbot-tunnel.ps1` - Cloudflare tunnel health monitor with auto-restart

**Why it helps:** After yesterday's nightmare where Cloudflare tunnels kept dying every 30 seconds, this script:
- Checks tunnel health with one command
- Auto-restarts when the tunnel dies
- Saves the current URL to a known location
- Sends Telegram alerts when something breaks/recovers
- Monitors Vite dev server AND tunnel status together

**Files changed:**
- `C:\Users\tommi\clawd\scripts\taskbot-tunnel.ps1` (new)
- `C:\Users\tommi\clawd\memory\daily-improvements.md` (new - this file)

**Try it:**
```powershell
.\scripts\taskbot-tunnel.ps1           # Check status
.\scripts\taskbot-tunnel.ps1 -Start    # Start tunnel
.\scripts\taskbot-tunnel.ps1 -Monitor  # Auto-restart on failure
.\scripts\taskbot-tunnel.ps1 -Url      # Show current URL
```

**Problem it solves:** Yesterday Rusty spent hours fighting dying tunnels. Now one command can monitor and auto-restart them.

---

## Template for future entries

```markdown
## YYYY-MM-DD (Day) - Title

**What I built:** Brief description

**Why it helps:** Problem it solves

**Files changed:**
- file1
- file2

**Try it:** How to use
```
