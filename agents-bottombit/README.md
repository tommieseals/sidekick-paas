# Bottom Bitch Swarm - Specialist Agent Directory

**Owner:** Bottom Bitch (Dell Agent - 100.119.87.108)  
**Purpose:** Dedicated swarm of specialist agents  
**Status:** ✅ PRODUCTION READY

---

## Quick Start

### Spawn a Specialist

**From Windows (Dell):**
```cmd
spawn-specialist.bat codegen "Your task here"
```

**From Unix/Mac:**
```bash
./spawn-specialist.sh codegen "Your task here"
```

**Cross-platform (Python):**
```bash
python spawn-specialist.py codegen "Your task here"
```

---

## Available Specialists

| Specialist | Purpose | Example |
|------------|---------|---------|
| **codegen** | Code generation | `codegen "Write Python JSON parser"` |
| **debugger** | Bug fixing | `debugger "Fix API 500 errors"` |
| **devops** | Infrastructure | `devops "Deploy TaskBot to Docker"` |
| **research** | Information gathering | `research "Best OAuth2 libraries"` |
| **vision** | Image analysis | `vision "Analyze error screenshot"` |
| **writer** | Documentation | `writer "Create user guide"` |
| **router** | Task planning | `router "Plan multi-step deployment"` |

---

## Directory Structure

```
agents-bottombit/
├── README.md                    # This file
├── spawn-specialist.sh          # Unix/Mac spawner
├── spawn-specialist.ps1         # PowerShell spawner
├── spawn-specialist.bat         # Windows batch spawner
├── spawn-specialist.py          # Python cross-platform spawner
├── test-spawn.sh                # System test script
├── codegen/
│   ├── SOUL.md                  # Identity and boundaries
│   ├── AGENTS.md                # Workspace rules
│   └── TOOLS.md                 # Available tools
├── debugger/
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── TOOLS.md
├── devops/
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── TOOLS.md
├── research/
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── TOOLS.md
├── vision/
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── TOOLS.md
├── writer/
│   ├── SOUL.md
│   ├── AGENTS.md
│   └── TOOLS.md
└── router/
    ├── SOUL.md
    ├── AGENTS.md
    └── TOOLS.md
```

---

## How It Works

1. **Spawn:** Run spawn script with specialist type and task
2. **Session Created:** Agent spawned with session ID `agent:bottombit:<specialist>:<timestamp>`
3. **Execution:** Specialist reads SOUL.md, completes task
4. **Report Back:** Results delivered to spawning session
5. **Cleanup:** Specialist session terminates (ephemeral)

---

## Monitoring

**Dashboard:**
```
http://100.88.105.106:8080/swarm-monitor.html
```

**CLI:**
```bash
sessions_list | grep bottombit
```

**Logs:**
```bash
tail -f ~/.clawdbot/logs/agent-bottombit-*.log
```

**Shared Memory:**
```bash
cat ~/clawd/shared-memory/bottombit-swarm-status.json | jq
```

---

## Testing

Run the test suite to verify everything works:

```bash
cd ~/clawd/agents-bottombit
./test-spawn.sh
```

This will:
- ✅ Check directory structure
- ✅ Verify config files
- ✅ Test spawn scripts
- ✅ Create test spawn request
- ✅ Verify shared memory integration

---

## Documentation

**Full documentation:** `~/clawd/BOTTOM_BITCH_SWARM.md`

**Quick reference:**
```bash
cat ~/clawd/BOTTOM_BITCH_SWARM.md | grep -A 5 "Quick Reference"
```

**Specialist details:**
```bash
cat codegen/SOUL.md    # CodeGen identity
cat debugger/SOUL.md   # Debugger identity
# etc.
```

---

## Access & Security

**Specialists CAN:**
- Read/write files in workspace
- Execute commands
- Use web_search and web_fetch
- Access LLM Gateway
- SSH to other nodes

**Specialists CANNOT:**
- Send Telegram/email messages
- Make production deployments (without approval)
- Create persistent services (cron, LaunchAgents)
- Access production secrets directly

**Session Namespace:**
All sessions use `agent:bottombit:<specialist>:<timestamp>` to prevent conflicts with main swarm.

---

## Examples

### Example 1: Generate Code
```bash
./spawn-specialist.sh codegen "Create Python script to parse Apache logs and extract 404 errors"
```

### Example 2: Debug Issue
```bash
./spawn-specialist.sh debugger "TaskBot API returns 500 on /api/workflows. Logs at ~/taskbot/logs/error.log"
```

### Example 3: Research Task
```bash
./spawn-specialist.sh research "Find the best Python libraries for real-time fraud detection in 2026"
```

### Example 4: Complex Planning
```bash
./spawn-specialist.sh router "Plan: Add Stripe payment integration to TaskBot with usage-based billing"
```

---

## Troubleshooting

### Spawn fails from Windows
- Check SSH connectivity: `ssh tommie@100.88.105.106 "echo test"`
- Use manual spawn via Telegram (instructions in output)
- Check spawn request file was created in `~/clawd/shared-memory/spawn-requests/`

### Specialist not responding
- Check session status: `sessions_list | grep bottombit`
- View logs: `tail -f ~/.clawdbot/logs/agent-bottombit-*.log`
- Monitor dashboard: http://100.88.105.106:8080/swarm-monitor.html

### Too many concurrent specialists
- Limit to 3-5 concurrent (API/token limits)
- Check active count: `sessions_list | grep "agent:bottombit" | wc -l`
- Wait for some to complete before spawning more

---

## Support

**Questions?**
1. Read `~/clawd/BOTTOM_BITCH_SWARM.md` (comprehensive guide)
2. Check specialist SOUL.md files for details
3. Ask main agent for guidance
4. Review logs for errors

**Report Issues:**
- File: `~/clawd/agents-bottombit/ISSUES.md`
- Include: Session ID, task, error message, logs

---

## Version

**Version:** 1.0  
**Created:** 2026-03-03  
**Status:** Production Ready  
**Last Updated:** 2026-03-03

---

**Remember:** You're the leader, not the solo worker. When you see big work, spawn specialists immediately. That's BOAT CREW TWO.
