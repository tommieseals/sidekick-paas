# Bottom Bitch Swarm - Dell/Windows Quick Start

**For:** Bottom Bitch (Dell Agent - 100.119.87.108)  
**Location:** `C:\Users\tommi\clawd\agents-bottombit\`  
**Status:** ✅ READY TO USE

---

## 🚀 Quick Start from Dell

### Method 1: Batch File (Easiest)

Open Command Prompt and run:

```cmd
cd C:\Users\tommi\clawd\agents-bottombit
spawn-specialist.bat codegen "Create Python script to parse JSON"
```

### Method 2: PowerShell (More Features)

Open PowerShell and run:

```powershell
cd C:\Users\tommi\clawd\agents-bottombit
.\spawn-specialist.ps1 -Specialist codegen -Task "Create Python script to parse JSON"
```

### Method 3: Python (Most Reliable)

If Python is installed:

```cmd
python spawn-specialist.py codegen "Create Python script to parse JSON"
```

---

## 🎯 Available Specialists

| Command | Purpose |
|---------|---------|
| `codegen` | Write code for you |
| `debugger` | Fix broken code |
| `devops` | Deploy and automate |
| `research` | Find information |
| `vision` | Analyze screenshots |
| `writer` | Create documentation |
| `router` | Plan complex tasks |

---

## 📝 Real Examples

### Generate Trading Bot Code
```cmd
spawn-specialist.bat codegen "Create Python arbitrage scanner for prediction markets"
```

### Debug API Error
```cmd
spawn-specialist.bat debugger "TaskBot API returns 500 on POST. Logs at C:\Users\tommi\clawd\taskbot\logs\error.log"
```

### Research Best Practices
```cmd
spawn-specialist.bat research "What are the best fraud detection features for fintech 2026?"
```

### Deploy Application
```cmd
spawn-specialist.bat devops "Deploy TerminatorBot to run 24/7 with monitoring"
```

### Analyze Error Screenshot
```cmd
spawn-specialist.bat vision "Analyze error screenshot at C:\Users\tommi\Desktop\error.png"
```

### Write Documentation
```cmd
spawn-specialist.bat writer "Create README for TaskBot project"
```

### Plan Complex Project
```cmd
spawn-specialist.bat router "Plan: Add Stripe billing and user dashboard to TaskBot"
```

---

## 📊 Monitoring Your Swarm

### Check Dashboard
Open browser to:
```
http://100.88.105.106:8080/swarm-monitor.html
```

### Check via SSH
From PowerShell:
```powershell
ssh tommie@100.88.105.106 "sessions_list | grep bottombit"
```

### View Status File
```powershell
cat \\100.88.105.106\clawd\shared-memory\bottombit-swarm-status.json
```

---

## 🔧 Troubleshooting

### "Script not found" error

Make sure you're in the right directory:
```cmd
cd C:\Users\tommi\clawd\agents-bottombit
dir
```

You should see:
- spawn-specialist.bat
- spawn-specialist.ps1
- spawn-specialist.py

### "SSH failed" warning

The script will create a spawn request file automatically. The main agent will pick it up and spawn the specialist for you.

Just wait a minute and check the dashboard.

### "Execution Policy" error (PowerShell)

Run this first:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass -Force
```

Then try again.

### Python not found

Either:
1. Install Python from python.org
2. Use batch file instead: `spawn-specialist.bat`
3. Manually spawn via Telegram (see below)

---

## 🎯 Manual Spawn (If Scripts Fail)

If automatic spawning doesn't work, you can manually spawn via Telegram:

1. Copy the task details from script output
2. Send to Telegram:
   ```
   /spawn bottombit-codegen-1234567890
   
   You are codegen specialist in Bottom Bitch's swarm. Your task: [YOUR TASK]
   
   IMPORTANT:
   1. Read ~/clawd/agents-bottombit/codegen/SOUL.md first
   2. Read ~/clawd/agents-bottombit/codegen/AGENTS.md 
   3. Complete the assigned task
   4. Report results when done
   
   Your session: agent:bottombit:codegen:1234567890
   Parent: Bottom Bitch (Dell agent)
   ```

---

## 💡 Pro Tips

### 1. Be Specific in Tasks
**Bad:** "Help with code"  
**Good:** "Create Python script to parse Apache logs and extract all 404 errors to CSV"

### 2. Include File Paths
**Bad:** "Fix the error"  
**Good:** "Fix error in logs at C:\Users\tommi\clawd\taskbot\logs\error.log"

### 3. Set Boundaries
**Bad:** "Deploy to production"  
**Good:** "Deploy to staging environment for testing first"

### 4. Batch Similar Work
Instead of spawning 5 times:
- "Add function X"
- "Add function Y"
- "Add function Z"

Spawn once:
- "Add functions X, Y, and Z with proper error handling and tests"

### 5. Use Router for Big Tasks
Before diving into complex work:
```cmd
spawn-specialist.bat router "Plan: [describe entire project]"
```

Router will recommend which specialists to spawn and in what order.

---

## 🔐 What Your Specialists Can't Do

**They CANNOT:**
- ❌ Send Telegram messages
- ❌ Send emails
- ❌ Make purchases
- ❌ Deploy to production without approval
- ❌ Create permanent scheduled tasks
- ❌ Access production secrets

**They're focused workers, not decision-makers. You're the boss.**

---

## 📚 Full Documentation

For complete details, read:
```
C:\Users\tommi\clawd\BOTTOM_BITCH_SWARM.md
```

Or from Unix systems:
```bash
cat ~/clawd/BOTTOM_BITCH_SWARM.md
```

---

## 🎉 You're Ready!

Your swarm is set up and ready to use. Just run:

```cmd
cd C:\Users\tommi\clawd\agents-bottombit
spawn-specialist.bat <specialist> "your task"
```

**Remember BOAT CREW TWO:** When you see big work, spawn specialists immediately. You're the leader, not the solo worker.

---

**Version:** 1.0  
**Created:** 2026-03-03  
**Status:** Production Ready
