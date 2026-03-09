# 🏴 Project Legion — Job Market Domination

**Status:** ✅ FULLY OPERATIONAL
**Location:** Mac Mini `~/job-hunter-system/`
**Lead:** Bottom Bitch

---

## What It Is

Event-driven job hunting automation system with 8 departments.

---

## Architecture

- **Hub:** Mac Mini (100.88.105.106) - CEO Agent, Redis, Telegram, LLM Router
- **Worker:** Mac Pro (100.101.89.80) - launchd service, auto-starts on boot
- **LLM:** Claude Sonnet (primary) → Ollama llama3.1:8b (fallback)
- **Daily Cycle:** 6:00 AM CT
- **Manual Trigger:** `/report` in Telegram

---

## Event-Driven Pipeline

Jobs cascade automatically:
```
Headhunting → Research → Resume → Submission
     ↓            ↓          ↓          ↓
 (auto)       (auto)     (auto)     (done!)
```

**PipelineWatcher** monitors Redis every 5 seconds.

---

## 8 Departments

| Department | Function | Status |
|------------|----------|--------|
| Headhunting | Job discovery (Indeed, LinkedIn, Dice) | ✅ |
| Research | Company intel & dossiers | ✅ |
| Resume | AI-powered document tailoring | ✅ |
| Submission | ATS automation | ✅ |
| Marketing | LinkedIn content & engagement | ✅ |
| Portfolio | GitHub project showcases | ✅ |
| Analytics | Pipeline metrics & reporting | ✅ |
| Interview Prep | STAR coaching & mock sessions | ✅ |

---

## Job Scrapers

| Platform | Status |
|----------|--------|
| Indeed | ✅ Working |
| LinkedIn | ✅ Working |
| Dice | ✅ Fixed 2026-02-26 |

---

## Commands

```bash
# Hub (Mac Mini)
cd ~/job-hunter-system && source .venv/bin/activate && python hub/main.py

# Check worker (Mac Pro)
ssh administrator@100.101.89.80 "launchctl list | grep legion"
```

---

## Dashboard
http://100.88.105.106:8080/legion.html
