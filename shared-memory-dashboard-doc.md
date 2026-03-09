# 🚨 DASHBOARD MASTER DOCUMENTATION 🚨
## READ THIS BEFORE ANY DASHBOARD WORK

**Last Updated:** 2026-03-07
**Fixed By:** Bottom Bitch
**Status:** WORKING ✅

---

## ⚠️ CRITICAL: WHAT "UPDATE THE DASHBOARD" MEANS

When Rusty says:
- "Update the site"
- "Fix the dashboard"
- "Work on the dashboard"
- "Add something to the site"

**THIS IS NOT A SIMPLE TASK.** This involves:
1. **54 HTML pages** in ~/clawd/dashboard/
2. **React animated pages** with complex CSS/JS
3. **Hamburger menu** that must stay in sync across ALL pages
4. **Multiple nav structures** (some pages use id="navLinks", others use class="nav-links")
5. **Automated cron jobs** that can OVERWRITE your changes

---

## 🏗️ ARCHITECTURE

### Location
```
Mac Mini: ~/clawd/dashboard/
Server: Node.js on port 8443 (HTTPS)
URL: https://100.88.105.106:8443
```

### Page Types

**1. Standard Nav Pages (15 pages) - id="navLinks"**
These use the standard hamburger structure:
- index.html, infrastructure.html, agents.html, projects.html
- apis.html, skills.html, tools.html, docs.html
- swarm.html, sessions.html, memory.html, shared-brain.html
- project-vault.html, sidekick-paas.html, infrastructure-new.html

**2. React Animated Pages (24+ pages)**
These have complex animations and may have different nav:
- achievements.html, legion-tracker.html, swarm-monitor.html
- arbitrage-pharma.html, fort-knox.html, terminator.html
- And many more...

**3. Utility/Test Pages (skip these)**
- test.html, test-simple.html, test-api.html, simple.html
- nocache.html, temp.html, diagnostics.html, debug-legion.html
- mobile-status.html

### The Hamburger Menu (28 Links)
```html
<div class="nav-links" id="navLinks">
    <a href="index.html" class="nav-link active">Dashboard</a>
    <a href="infrastructure.html" class="nav-link">Infrastructure</a>
    <a href="agents.html" class="nav-link">Agents</a>
    <a href="projects.html" class="nav-link">Projects</a>
    <a href="apis.html" class="nav-link">APIs</a>
    <a href="skills.html" class="nav-link">Skills</a>
    <a href="tools.html" class="nav-link">Tools</a>
    <a href="achievements.html" class="nav-link">Achievements</a>
    <a href="shared-brain.html" class="nav-link">🧠 Brain</a>
    <a href="swarm-monitor.html" class="nav-link">🐝 Swarm</a>
    <a href="arbitrage-pharma.html" class="nav-link">💊 Pharma</a>
    <a href="terminator.html" class="nav-link">🤖 Terminator</a>
    <a href="project-vault.html" class="nav-link">💰 Vault</a>
    <a href="fort-knox.html" class="nav-link">🏦 Fort Knox</a>
    <a href="legion-tracker.html" class="nav-link">🎖️ Legion</a>
    <a href="legion.html" class="nav-link">⚔️ Legion HQ</a>
    <a href="fraud-detection.html" class="nav-link">🛡️ Fraud</a>
    <a href="n8n-hub.html" class="nav-link">⚡ n8n</a>
    <a href="fiverr.html" class="nav-link">🛒 Fiverr</a>
    <a href="borbott-army.html" class="nav-link">📚 KDP</a>
    <a href="tascosaur.html" class="nav-link">🦖 Tascosaur</a>
    <a href="taskbot.html" class="nav-link">📋 TaskBot</a>
    <a href="teams-translator.html" class="nav-link">🌐 Translator</a>
    <a href="sidekick-paas.html" class="nav-link">🦸 Sidekick</a>
    <a href="memory.html" class="nav-link">🧬 Memory</a>
    <a href="sessions.html" class="nav-link">💬 Sessions</a>
    <a href="a2a-server.html" class="nav-link">🔗 A2A</a>
    <a href="docs.html" class="nav-link">Docs</a>
</div>
```

---

## 🔥 WHAT WENT WRONG (March 2026)

### The Problem
1. **Automated cron jobs** were syncing/overwriting dashboard files
2. **Nav links got reduced** from 28 to fewer links
3. **React pages were disconnected** from hamburger menu
4. **GitHub repo was PUBLIC** - exposing private dashboard code
5. **Backups existed** but in wrong location (~/clawd-versions/ not obvious)

### Root Causes
1. Cron job doing `git pull` or rsync without checking nav structure
2. No validation that nav links were preserved after sync
3. No protection for the hamburger menu content
4. Lack of documentation on dashboard structure

---

## ❌ WHAT NOT TO DO

1. **NEVER let cron jobs overwrite index.html without validation**
2. **NEVER reduce the nav links** - always preserve all 28
3. **NEVER push dashboard to PUBLIC GitHub repo**
4. **NEVER edit just one page's nav** - they must all stay in sync
5. **NEVER trust old backups** - check the nav links count first
6. **NEVER run automated "fixes"** without backing up first

---

## ✅ HOW TO FIX HAMBURGER MENU

### Step 1: Backup First
```bash
ssh tommie@100.88.105.106 'cp ~/clawd/dashboard/index.html ~/clawd/dashboard/index.html.backup.$(date +%Y%m%d_%H%M%S)'
```

### Step 2: Use the Fix Script
Location: `/tmp/fix-nav.py` or `~/clawd/scripts/fix-nav.py`

```bash
# Fix single file
ssh tommie@100.88.105.106 'python3 /tmp/fix-nav.py ~/clawd/dashboard/index.html'

# Fix all standard nav pages
ssh tommie@100.88.105.106 'python3 /tmp/sync-nav-all.py'
```

### Step 3: Verify Fix
```bash
# Should show 28-29 nav-link entries
ssh tommie@100.88.105.106 "grep 'class=.nav-link' ~/clawd/dashboard/index.html | wc -l"

# Check nav content
ssh tommie@100.88.105.106 "sed -n '/navLinks/,/<\\/nav>/p' ~/clawd/dashboard/index.html | head -35"
```

### Step 4: Commit
```bash
ssh tommie@100.88.105.106 "cd ~/clawd/dashboard; git add -A; git commit -m 'Fix hamburger nav'"
```

---

## 📁 BACKUP LOCATIONS

### Version Backups (MAIN BACKUPS)
```
~/clawd-versions/v20260227-*  (Feb 27 - 10 versions)
~/clawd-versions/v20260306-*  (Mar 6 - multiple versions)
~/clawd-versions/v20260307-*  (Mar 7 - multiple versions)
```

### Quick Backups
```
~/clawd/dashboard/index.html.backup.*
~/clawd/dashboard.backup-20260217_172856/  (Feb 17 full backup)
```

### Git History
```bash
cd ~/clawd/dashboard
git log --oneline -20
git checkout <commit-hash> -- index.html  # Restore specific file
```

---

## 🔧 FIX SCRIPTS

### /tmp/fix-nav.py
Fixes nav for a single file - replaces nav-links section with complete 28-link menu.

### /tmp/sync-nav-all.py  
Fixes nav for ALL standard pages (15 pages with id="navLinks").
Sets correct "active" class for each page.

### Scripts Location on Dell
```
C:\Users\tommi\clawd\scripts\fix-nav.py
C:\Users\tommi\clawd\scripts\sync-nav-all.py
```

---

## 🛡️ PROTECTION RULES

### Before Any Dashboard Work
1. Check current nav link count: `grep 'nav-link' index.html | wc -l`
2. Create timestamped backup
3. Work on ONE page first, test it
4. Then sync to other pages
5. Commit to git immediately

### Cron Job Rules
- **NEVER** auto-sync without nav validation
- Add pre-sync check: verify nav has 28+ links
- Add post-sync check: verify nav still has 28+ links
- If check fails, ALERT and ROLLBACK

### GitHub Rules
- Dashboard repo MUST be PRIVATE
- Verify with: `gh repo view tommieseals/clawd-dashboard --json isPrivate`
- If public, fix with: `gh repo edit tommieseals/clawd-dashboard --visibility private --accept-visibility-change-consequences`

---

## 📊 QUICK HEALTH CHECK

Run this to verify dashboard is healthy:
```bash
ssh tommie@100.88.105.106 '
echo "=== Dashboard Health Check ==="
echo "Nav links in index.html: $(grep -c "nav-link" ~/clawd/dashboard/index.html)"
echo "Total HTML pages: $(ls ~/clawd/dashboard/*.html | wc -l)"
echo "Server running: $(lsof -i :8443 | grep -c node || echo "NO")"
echo "Git status:"
cd ~/clawd/dashboard && git status --short | head -5
'
```

Expected output:
- Nav links: 28-30
- Total pages: 50+
- Server: 1+ (running)
- Git: clean or few changes

---

## 🎨 REACT PAGE NOTES

The React animated pages have:
- Complex CSS animations (@keyframes)
- SVG animations
- Gradient backgrounds
- Interactive elements

**Key React pages:**
- shared-brain.html (52KB - flowing SVG brain animation)
- project-vault.html (complex vault animations)
- fort-knox.html (security animations)
- swarm-monitor.html (bee swarm animations)

**DO NOT simplify these pages** - they're meant to be impressive for portfolio/employers.

---

## 📞 EMERGENCY RECOVERY

If hamburger is completely broken:

```bash
# 1. Check latest backup
ls -la ~/clawd-versions/ | tail -5

# 2. Copy nav from known good backup
ssh tommie@100.88.105.106 'cp ~/clawd-versions/v20260307-*/dashboard/index.html ~/clawd/dashboard/index.html'

# 3. Or use fix script
python3 /tmp/fix-nav.py ~/clawd/dashboard/index.html

# 4. Verify
grep -c "nav-link" ~/clawd/dashboard/index.html
# Should be 28+
```

---

## 📝 CHANGE LOG

**2026-03-07:**
- Fixed hamburger menu (28 links restored)
- Made GitHub repo PRIVATE
- Created fix-nav.py and sync-nav-all.py scripts
- Updated 15 standard nav pages
- Documented everything in this file

---

**REMEMBER:** When Rusty mentions "dashboard" - this is PRODUCTION portfolio code. Treat it with respect. Test everything. Keep backups. Don't let automation break it.
