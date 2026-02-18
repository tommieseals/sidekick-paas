# Token-Saving Guide - Tommie's AI Infrastructure
## Core Philosophy: Use the cheapest model that can do the job

---

## 1. Model Selection Matrix

| Task Type | Best Model | Cost | When to Use |
|-----------|------------|------|-------------|
| Simple queries | Ollama (qwen2.5:3b) | **$0 FREE** | Basic questions, quick lookups |
| Code tasks | Qwen Coder 32B | NVIDIA API | Python, JavaScript, bash |
| Quick images | Llama 11B Vision | NVIDIA API | Fast screenshots |
| Deep analysis | Llama 90B Vision | NVIDIA API | Long docs, complex forms |
| Screenshot debugging | Kimi K2.5 | NVIDIA API | Error analysis + thinking |
| Complex conversations | Claude Sonnet 4 | $$$ EXPENSIVE | When you need the best |

**Key Rule:** Use Ollama local (FREE) first, only escalate to Claude if needed.

---

## 2. Sub-Agent Strategy

Sub-agents run in isolated sessions with their own token budgets:

```python
sessions_spawn(
    task="Research AI job market 2026",
    model="local",      # or "gemini" for cheap cloud
    cleanup="delete"    # auto-cleanup when done
)
```

### When to Spawn Sub-Agents:
- ✅ Long research tasks
- ✅ Background jobs (video processing, batch operations)
- ✅ Parallel processing
- ✅ Tasks requiring different/cheaper models

### Cost Comparison:
| Method | Cost |
|--------|------|
| Main agent (Claude) does research | 💰💰💰 High (~50k Claude tokens) |
| Sub-agent (Gemini) | 💰 Lower (~50k Gemini tokens) |
| Sub-agent (Ollama local) | 🆓 **FREE** (~50k local tokens) |

---

## 3. Batch Operations

### ❌ Inefficient (burns tokens):
```
"Check email" → Response
"Check calendar" → Response  
"Check weather" → Response
```
= 3 separate API calls, 3x the tokens

### ✅ Efficient (one request):
```
"Morning briefing: check email for urgent items, 
calendar for today's events, and weather forecast"
```
= 1 API call, much fewer tokens

---

## 4. Heartbeat for Periodic Checks

Instead of repeatedly asking, let heartbeat handle:
- System health checks
- Email monitoring
- Calendar reminders
- Background maintenance

**Runs automatically without burning conversation tokens.**

Edit `HEARTBEAT.md` to add periodic tasks.

---

## 5. LLM Gateway Commands

### Telegram Commands:
```
/ask "question"        → Auto-routes to best model
/code "task"           → Forces Qwen Coder
/vision "url"          → Forces Llama 11B
/analyze "url"         → Forces Llama 90B
/screenshot "url"      → Forces Kimi
/think "problem"       → Deep reasoning mode
/usage                 → Check daily API usage
```

### CLI Commands (Mac Mini):
```bash
~/dta/gateway/ask "question"
~/dta/gateway/think-deep "problem"
~/dta/gateway/llm-usage
```

### ⚠️ NVIDIA API Limits:
**50 calls/day total** (shared across all NVIDIA models: Kimi, Llama, Qwen)

---

## 6. Token Budget Guidelines

| Usage Level | Tokens/Day |
|-------------|------------|
| Conservative | ~100k |
| Moderate | ~200k |
| Heavy | 300k+ |

**Session limit:** 1M tokens (200k per session recommended)

---

## 7. Best Practices

### ✅ DO:
- Use Ollama local for simple queries (FREE)
- Spawn sub-agents for research/heavy work
- Batch multiple requests into one message
- Let heartbeat handle routine monitoring
- Use LLM Gateway for non-Claude tasks
- Write scripts for repeated operations
- Check token usage periodically (`session_status`)

### ❌ DON'T:
- Don't use Claude for simple lookups
- Don't make separate requests when you can batch
- Don't keep asking the same thing repeatedly
- Don't spawn sub-agents for quick tasks (overhead)
- Don't forget NVIDIA API limits (50/day)

---

## 8. When to Use Claude vs Cheaper Models

### Use Claude Sonnet/Opus for:
- Important decisions
- Complex problem-solving
- Creative work
- Sensitive communications
- When sub-agents have failed

### Use Cheaper Models for:
- Information retrieval
- Summarization
- Simple transformations
- Background research
- Routine monitoring

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                  TOKEN-SAVING CHEAT SHEET               │
├─────────────────────────────────────────────────────────┤
│  🆓 FREE: Ollama local (qwen2.5:3b)                     │
│  💰 CHEAP: NVIDIA API (50 calls/day)                    │
│  💰💰💰 EXPENSIVE: Claude Sonnet/Opus                   │
├─────────────────────────────────────────────────────────┤
│  BATCH requests → fewer API calls                       │
│  SPAWN sub-agents → offload to cheaper models           │
│  HEARTBEAT → automatic periodic checks                  │
│  LLM GATEWAY → route to optimal model                   │
└─────────────────────────────────────────────────────────┘
```

---

## Dashboard & Monitoring

- **Full docs:** http://100.88.105.106:8080/docs.html
- **Check usage:** `session_status` or `/usage`
- **NVIDIA remaining:** `~/dta/gateway/llm-usage`

---

*Last updated: February 16, 2026*
