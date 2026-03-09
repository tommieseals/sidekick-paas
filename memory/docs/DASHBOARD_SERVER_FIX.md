# Dashboard Server Fix Guide

**Location:** `memory/docs/DASHBOARD_SERVER_FIX.md`
**Last Updated:** 2026-03-03
**For:** All agents who need to fix dashboard issues

---

## THE PROBLEM

Dashboard pages return "Not Found" even though the files exist.

**Root Cause:** Python HTTP server running from WRONG directory.

---

## THE FIX (Copy-Paste Commands)

### Step 1: Kill Bad Server
```bash
ssh tommie@100.88.105.106 "pkill -f 'python.*http.server.*8080'"
```

### Step 2: Start Server in Correct Directory
```bash
ssh tommie@100.88.105.106 "cd /Users/tommie/clawd/dashboard && python3 -m http.server 8080 > /tmp/dashboard-server.log 2>&1 &"
```

### Step 3: Verify It Works
```bash
ssh tommie@100.88.105.106 "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/index.html"
```
Should return: `200`

---

## MAKE IT PERSISTENT (Survives Reboot)

### Create LaunchAgent:
```bash
ssh tommie@100.88.105.106 'cat > ~/Library/LaunchAgents/com.clawd.dashboard.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.clawd.dashboard</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/python3</string>
        <string>-m</string>
        <string>http.server</string>
        <string>8080</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/tommie/clawd/dashboard</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/dashboard.out</string>
    <key>StandardErrorPath</key>
    <string>/tmp/dashboard.err</string>
</dict>
</plist>
EOF'
```

### Load It:
```bash
ssh tommie@100.88.105.106 "launchctl load ~/Library/LaunchAgents/com.clawd.dashboard.plist"
```

### Verify Running:
```bash
ssh tommie@100.88.105.106 "launchctl list | grep dashboard"
```
Should show: `PID  0  com.clawd.dashboard`

---

## KEY LOCATIONS

| What | Where |
|------|-------|
| Dashboard files | `/Users/tommie/clawd/dashboard/` |
| Server must run FROM | `/Users/tommie/clawd/dashboard/` |
| LaunchAgent | `~/Library/LaunchAgents/com.clawd.dashboard.plist` |
| Server logs | `/tmp/dashboard.out` and `/tmp/dashboard.err` |
| Mac Mini IP | `100.88.105.106` |
| Port | `8080` |

---

## COMMON MISTAKES (DON'T DO THESE)

1. ❌ Running server from `~/clawd/` instead of `~/clawd/dashboard/`
2. ❌ Editing HTML files when problem is server location
3. ❌ Not checking WHERE server is running with `lsof -i :8080`
4. ❌ Forgetting to make it persistent (LaunchAgent)

---

## QUICK DIAGNOSTIC

If pages return "Not Found":

```bash
# 1. Check what's serving port 8080
ssh tommie@100.88.105.106 "lsof -i :8080"

# 2. Check server's working directory
ssh tommie@100.88.105.106 "ps aux | grep http.server"

# 3. Check if file exists
ssh tommie@100.88.105.106 "ls -la /Users/tommie/clawd/dashboard/swarm-monitor.html"
```

---

## TEST URLS

After fix, these should all return 200:
- http://100.88.105.106:8080/index.html
- http://100.88.105.106:8080/swarm-monitor.html
- http://100.88.105.106:8080/infrastructure.html

---

**This doc lives at:** `~/clawd/memory/docs/DASHBOARD_SERVER_FIX.md` (both machines)
