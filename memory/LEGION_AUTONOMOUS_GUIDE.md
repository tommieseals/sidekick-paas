# 🎯 Project Legion - Autonomous Agent Guide

**Last Updated:** 2026-03-02 11:21 CST  
**Status:** ✅ PRODUCTION - FULLY OPERATIONAL

---

## What Is This?

Project Legion automatically applies to jobs on Indeed using Safari + AppleScript on Mac Mini. It beat Indeed's bot detection after weeks of work.

**The breakthrough:** AppleScript + Safari + JavaScript injection is undetectable because Safari is a real browser and AppleScript is OS-native.

---

## How to Run Legion

### Quick Start (SSH to Mac Mini)
```bash
ssh tommie@100.88.105.106
cd ~/project-legion-rusty-fix/Project-Legion
python3 -u legion_runner_v2.py 10 0
```

### Parameters
```
python3 legion_runner_v2.py [count] [category]
```
- `count` — Number of applications to attempt (default: 10)
- `category` — Job search category index 0-9 (default: 0, rotates by hour)

### Job Categories (10 total)
| Index | Search | Location |
|-------|--------|----------|
| 0 | IT support | Houston, TX |
| 1 | help desk | Houston, TX |
| 2 | systems administrator | Houston, TX |
| 3 | network administrator | Houston, TX |
| 4 | technical support | Houston, TX |
| 5 | desktop support | Houston, TX |
| 6 | IT technician | Houston, TX |
| 7 | IT support | Remote |
| 8 | help desk | Remote |
| 9 | technical support specialist | Texas |

**Pro tip:** Use `$(($(date +%H) % 10))` to rotate categories by hour.

---

## What to Expect

### Output
```
🐝 LEGION RUNNER v2 - Processing 10 applications
============================================================
📍 Search: IT support in Houston, TX
🔍 Loading job search...
📋 Found ~8 Easy Apply jobs on page

[1/10] Applying to job...
  ✅ [SUBMITTED] Desktop Support Technician @ Entegee
...
```

### Status Meanings
- ✅ **SUBMITTED** — Application confirmed submitted
- ⏭️ **SKIPPED** — Already applied to this job
- ❓ **UNKNOWN** — Couldn't verify (may have submitted)
- ⏱️ **TIMEOUT** — Script took too long

### Success Rate
- Expect 60-80% SUBMITTED
- Some SKIPPED (already applied)
- Few UNKNOWN (verification issue, usually still submitted)

---

## Troubleshooting

### No jobs found
```bash
# Check Safari is on Indeed with jobs
python3 /tmp/check_safari.py
```

### Safari not responding
```bash
# Restart Safari
killall Safari
sleep 2
open -a Safari
open "https://www.indeed.com"
```

### Script hangs
- Timeout after 120 seconds per application
- If stuck, kill and restart:
```bash
pkill -f legion_runner
python3 -u legion_runner_v2.py 10 0
```

---

## Files

| File | Purpose |
|------|---------|
| `legion_runner_v2.py` | Main runner (USE THIS) |
| `safari_apply.py` | Core apply logic |
| `applications.log` | Application history |
| `profile_config.json` | User profile (address, salary, etc.) |

---

## Cron Schedule

Legion runs automatically every hour via Clawdbot cron:
- **Job name:** `legion-hourly`
- **Schedule:** `0 * * * *` (top of every hour)
- **Action:** Runs `legion_runner_v2.py 10 $HOUR`

---

## For Cron/Sub-Agents

When running Legion as a cron job or sub-agent:

```bash
# Get hour for category rotation
HOUR=$(date +%H)

# Run with category rotation
ssh tommie@100.88.105.106 "cd ~/project-legion-rusty-fix/Project-Legion && python3 -u legion_runner_v2.py 10 $HOUR"
```

### Report Format
```
📊 LEGION HOURLY COMPLETE
Category: [job search used]
Applications: X submitted, Y skipped, Z unknown
Next run: top of next hour
```

---

## Important Notes

1. **Safari must be logged into Indeed** — The session cookies are what make this work
2. **Don't run multiple instances** — One at a time only
3. **Mac Mini only** — This only works on Mac Mini (100.88.105.106) because Safari + AppleScript
4. **Rate limit yourself** — 10 apps/hour is safe, don't spam

---

*This guide is for autonomous agents. Human: see memory/2026-03-02.md for the full story.*
