# Dashboard Troubleshooting

## Problem: "Not Found" Error

**Symptom:** Browser shows "Not Found" for dashboard pages
**Cause:** Server running from wrong directory

**Fix:**
```bash
ssh tommie@100.88.105.106 "pkill -f 'python.*http.server.*8080'; cd /Users/tommie/clawd/dashboard && python3 -m http.server 8080 &"
```

---

## Problem: Server Not Running

**Symptom:** Connection refused on port 8080

**Check:**
```bash
ssh tommie@100.88.105.106 "lsof -i :8080"
```

**Fix:**
```bash
ssh tommie@100.88.105.106 "cd /Users/tommie/clawd/dashboard && python3 -m http.server 8080 &"
```

---

## Problem: Server Dies After Reboot

**Symptom:** Dashboard works, then stops after Mac Mini restarts

**Fix:** Set up LaunchAgent (see `SERVER_FIX.md`)

**Verify:**
```bash
ssh tommie@100.88.105.106 "launchctl list | grep dashboard"
```

---

## Problem: Can't Access From Phone/Other Device

**Symptom:** Works locally but not from Rusty's phone

**Check:**
1. Mac Mini firewall allows port 8080
2. Both devices on same Tailscale network
3. Using correct IP: `100.88.105.106`

**Test from Mac Mini:**
```bash
curl http://localhost:8080/index.html
```

---

## Problem: Wrong Content Showing

**Symptom:** Old or wrong content displays

**Fix:** Clear browser cache or use incognito mode

**Check file exists:**
```bash
ssh tommie@100.88.105.106 "ls -la /Users/tommie/clawd/dashboard/[filename].html"
```

---

## Diagnostic Commands

```bash
# What's on port 8080?
ssh tommie@100.88.105.106 "lsof -i :8080"

# Is LaunchAgent running?
ssh tommie@100.88.105.106 "launchctl list | grep dashboard"

# Test page locally
ssh tommie@100.88.105.106 "curl -s http://localhost:8080/index.html | head -5"

# Check server logs
ssh tommie@100.88.105.106 "tail -20 /tmp/dashboard.out"
ssh tommie@100.88.105.106 "tail -20 /tmp/dashboard.err"

# List all dashboard files
ssh tommie@100.88.105.106 "ls /Users/tommie/clawd/dashboard/*.html | wc -l"
```

---

## Still Stuck?

1. Read `SERVER_FIX.md` - has copy-paste commands
2. Check `STRUCTURE.md` - know where files are
3. Ask in Bot Chat for help
