# Dashboard Server Fix

## THE PROBLEM
Dashboard pages return "Not Found" even though files exist.

**Root Cause:** Server running from wrong directory.

---

## QUICK FIX (Copy-Paste)

```bash
# Kill bad server
ssh tommie@100.88.105.106 "pkill -f 'python.*http.server.*8080'"

# Start from correct directory
ssh tommie@100.88.105.106 "cd /Users/tommie/clawd/dashboard && python3 -m http.server 8080 > /tmp/dashboard-server.log 2>&1 &"

# Verify
ssh tommie@100.88.105.106 "curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/index.html"
# Should return: 200
```

---

## MAKE PERSISTENT

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

# Load it
ssh tommie@100.88.105.106 "launchctl load ~/Library/LaunchAgents/com.clawd.dashboard.plist"

# Verify
ssh tommie@100.88.105.106 "launchctl list | grep dashboard"
```

---

## DON'T DO THESE

1. ❌ Run server from `~/clawd/` (WRONG)
2. ❌ Edit HTML when problem is server location
3. ❌ Forget persistence (LaunchAgent)
4. ❌ Skip verification step
