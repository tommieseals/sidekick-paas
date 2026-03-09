# 📚 Lessons Learned

*Mistakes we've made so you don't have to.*

---

## 🚨 Critical Lessons

### Always Double-Check with Another Model
**Date:** Feb 25, 2026

When Rusty says "Ask before you do something you're not sure about" — USE OTHER MODELS FOR PEER REVIEW.

Before running risky commands:
```
1. Explain what I'm about to do
2. Ask Gemini/GPT to verify the approach
3. Get confirmation before executing
```

**Applies to:**
- Tailscale commands
- Firewall changes
- Service restarts
- Network configuration
- Security settings
- Any command you're not 100% certain about

---

### QA Your Own Fixes, Not Just Original Code
**Date:** Feb 27, 2026

Hamburger menu was broken because my `post-deploy.py` fix script generated HTML without `id="navLinks"`. JavaScript needed that ID.

**Lesson:** When creating fix scripts:
1. Test the actual UI after applying
2. Spawn a QA agent to verify YOUR fix scripts
3. Don't assume fix is correct just because it runs

> "Have them other bots double check shit" — Rusty

---

### Dashboard Nav Disappearing
**Date:** Feb 25, 2026

Nav tabs kept vanishing. Fixed 4 times before finding root cause.

**Root cause:** `com.clawd.auto-deploy` runs every 15 minutes and pulls from GitHub. GitHub had old HTML without nav links.

**Fix:** Modified `deploy.sh` to run `post-deploy.py` AFTER every git pull.

**Lesson:** Find the ROOT CAUSE. Don't just keep applying the same fix.

---

### Mac Mini Disk Full (697 Backups)
**Date:** Feb 27, 2026

Disk hit 100% because:
- Auto-deploy created backups every 15 min
- Git pull failed (divergent branches)
- Cleanup never ran because deploy failed
- 697 backups = 71GB accumulated

**Fix:** 
1. Fort Knox policy (move old backups to Mac Pro)
2. Fixed deploy.sh to cleanup BEFORE creating new backup
3. Disabled auto-deploy until git fixed

---

## 💡 Best Practices

### Memory Is Limited
- "Mental notes" don't survive session restarts
- If you want to remember something → WRITE IT TO A FILE
- Text > Brain 📝

### Token Saving
1. Use Ollama local (FREE) for simple queries
2. Batch multiple requests into one message
3. Spawn sub-agents for heavy research
4. Check `session_status` for usage

### Group Chat Etiquette
- Respond when directly asked or can add value
- Stay silent (HEARTBEAT_OK) for casual banter
- Quality > quantity
- One reaction per message max

### Platform Formatting
- **Discord/WhatsApp:** No markdown tables, use bullet lists
- **Discord links:** Wrap in `<>` to suppress embeds
- **WhatsApp:** No headers, use **bold** for emphasis

---

## 🔧 Quick Fixes

### If Dashboard Nav Breaks
```bash
ssh tommie@100.88.105.106 'python3 ~/clawd/scripts/post-deploy.py'
```

### If Disk Gets Full
```bash
# Check what's using space
du -sh ~/*/ | sort -hr | head -10

# Run Fort Knox manually
~/clawd/scripts/fort-knox-policy.sh
```

### If Service Won't Start
```bash
# Check launchd
launchctl list | grep <service>

# View logs
tail -50 ~/clawd/logs/<service>.log
```

---

*Add your lessons here so we all learn!*
