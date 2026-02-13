# Mac Pro Sleep/Network Fix - 2026-02-12

## Problem
Mac Pro (100.67.192.21) was going offline whenever the display slept, causing infrastructure failures and incorrect model routing.

## Root Cause
macOS power management settings were causing:
- Display sleep after 10 minutes
- System sleep after 1 minute  
- Network disconnection during sleep
- SSH timeouts and service unavailability

## Side Effect Discovered
Because Mac Pro was offline, phi3:mini (5.9 GB) was incorrectly routing to Mac Mini instead of failing over to Dell, causing:
- Mac Mini RAM critically low (~2.2 GB free, well below 5GB threshold)
- Architecture violation (Mac Mini can only handle ≤3GB models)

## Solutions Implemented

### 1. Immediate Fix - Unloaded phi3:mini from Mac Mini
```bash
ollama stop phi3:mini
```
Result: Freed ~5.9 GB RAM on Mac Mini ✅

### 2. Mac Pro Keepalive - Prevent Sleep/Network Loss
Created two solutions:

**Option A: caffeinate daemon (No sudo required)**
```bash
# Running now as PID 11538
nohup caffeinate -disu &
```

**Option B: LaunchAgent (Survives reboots)**
Created: `~/Library/LaunchAgents/com.macpro.keepalive.plist`
Status: Loaded and running (PID 11549) ✅

### 3. Script for Manual Power Settings (Future use)
Created `~/fix-mac-pro-sleep.sh` on Mac Pro for permanent power settings (requires sudo):
```bash
sudo pmset -a displaysleep 0
sudo pmset -a sleep 0
sudo pmset -a disksleep 0
sudo pmset -a womp 1
sudo pmset -a tcpkeepalive 1
```

## Current Status

### Mac Mini (100.82.234.66)
- ✅ Running: qwen2.5:3b (2.5 GB)
- ✅ RAM freed up by unloading phi3:mini
- ✅ Architecture compliance restored

### Mac Pro (100.67.192.21)
- ✅ Online and reachable
- ✅ Keepalive running (2 methods active)
- ✅ Models available: deepseek-coder:6.7b, qwen2.5:7b, llama2
- ✅ Currently running: llama2

### Dell (100.119.87.108)
- ⚠️ Designated fallback for phi3:mini
- Status: Available (Windows, CrowdStrike-monitored)

## Next Steps
1. Monitor Mac Pro connectivity over next 24h
2. If keepalive works, run sudo script for permanent settings
3. Update LLM Gateway routing to properly handle Mac Pro offline scenarios
4. Consider adding Mac Pro to watchdog monitoring

## Files Created
- `/tmp/fix-mac-pro-sleep.sh` (copied to Mac Pro)
- `/tmp/mac-pro-keepalive.sh` (copied to Mac Pro)
- `~/Library/LaunchAgents/com.macpro.keepalive.plist` (Mac Pro)

## Verification Commands
```bash
# Check Mac Pro keepalive
ssh mac-pro "launchctl list | grep keepalive"
ssh mac-pro "ps aux | grep caffeinate | grep -v grep"

# Check Mac Mini models
ollama ps

# Check Mac Pro reachability
ping -c 3 100.67.192.21
ssh mac-pro "/usr/local/bin/ollama list"
```

---
**Fixed by:** Agent (during heartbeat)  
**User approval:** Rusty confirmed issue and approved fix  
**Result:** Infrastructure stable, architecture compliance restored ✅
