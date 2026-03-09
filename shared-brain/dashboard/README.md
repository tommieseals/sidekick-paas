# Dashboard - Shared Knowledge

**Location:** `shared-brain/dashboard/`
**Purpose:** Everything bots need to know about the Clawd Dashboard

---

## Quick Reference

| Item | Value |
|------|-------|
| **Server IP** | 100.88.105.106 |
| **Port** | 8080 |
| **URL** | http://100.88.105.106:8080/ |
| **Files Location** | `/Users/tommie/clawd/dashboard/` |
| **Server Type** | Python HTTP Server |
| **Persistence** | LaunchAgent |

---

## Files in This Folder

| File | What It's For |
|------|---------------|
| `README.md` | This file - quick reference |
| `SERVER_FIX.md` | How to fix "Not Found" errors |
| `STRUCTURE.md` | Dashboard file structure |
| `PAGES.md` | List of all pages and what they do |
| `TROUBLESHOOTING.md` | Common problems and solutions |

---

## Most Common Issue

**Problem:** Pages return "Not Found"
**Cause:** Server running from wrong directory
**Fix:** See `SERVER_FIX.md`

---

## SSH Access

```bash
ssh tommie@100.88.105.106
cd ~/clawd/dashboard
```

---

## Need Help?

1. Check `TROUBLESHOOTING.md` first
2. Check server is running: `lsof -i :8080`
3. Check LaunchAgent: `launchctl list | grep dashboard`
