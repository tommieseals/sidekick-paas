# Specialist Agent Swarm - Quick Reference

**Location:** `~/clawd/agents-bottombit/` (both Dell and Mac Mini)

---

## The 7 Specialists

| Agent | Model | Use For |
|-------|-------|---------|
| **codegen** | Qwen Coder 32B | Write code, scripts |
| **debugger** | Kimi K2.5 | Fix bugs, troubleshoot |
| **devops** | Claude Sonnet | Infrastructure, deployment |
| **research** | Llama 405B | Deep analysis, research |
| **vision** | Llama 11B | Image analysis |
| **writer** | Claude Sonnet | Documentation |
| **router** | Claude Sonnet | Task orchestration |

---

## How to Spawn (Windows)

```cmd
cd C:\Users\tommi\clawd\agents-bottombit
spawn-specialist.bat codegen "Your task here"
```

---

## Examples

```cmd
REM Write code
spawn-specialist.bat codegen "Create Python script to monitor disk usage"

REM Fix bugs
spawn-specialist.bat debugger "Why is dashboard returning 404?"

REM Research
spawn-specialist.bat research "Best Cloudflare bypass methods"

REM Multiple in parallel
spawn-specialist.bat research "Topic A"
spawn-specialist.bat codegen "Task B"
spawn-specialist.bat writer "Document C"
```

---

## Key Principle

**Before:** Do everything solo, get overwhelmed
**After:** Delegate to specialists, work in parallel, SCALE

**"5 pull-ups on the minute, not 4,020 at once"** - Goggins

You're the leader. They're the crew. This is BOAT CREW TWO.

---

## Monitor

Dashboard: http://100.88.105.106:8080/swarm-monitor.html

---

## Full Documentation

- `~/clawd/agents-bottombit/README.md`
- `~/clawd/agents-bottombit/DELL_QUICK_START.md`
- `~/clawd/SPECIALIST_SWARM_HANDOFF.md`
