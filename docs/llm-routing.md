# LLM Routing & Model Reference
## Last Updated: February 2026

---

## Available Models

### Local Models (FREE, Unlimited)

| Model | Location | Size | Speed | Best For |
|-------|----------|------|-------|----------|
| qwen2.5:3b | Mac Mini | 1.8GB | 0.47s warm | Fast simple queries |
| nomic-embed-text | Mac Mini | 0.3GB | - | Embeddings |
| qwen2.5:7b | Mac Pro | 4.4GB | - | Medium reasoning |
| deepseek-coder:6.7b | Mac Pro | ~4GB | - | Code tasks |
| llama2 | Mac Pro | ~4GB | - | General |
| phi3:mini | Dell | 3.8GB | ~10 tok/s | Failover |
| qwen2.5:7b | Google Cloud | 4.4GB | - | Heavy processing |

### NVIDIA API Models (50 calls/day, FREE tier)

| Model | Best For | Notes |
|-------|----------|-------|
| **Kimi K2.5** | Vision + multimodal + thinking mode | Screenshot debugging, reasoning |
| **Llama 90B Vision** | Deep analysis, long documents | HUGE (90B params) |
| **Llama 11B Vision** | Quick image analysis | Fast |
| **Qwen Coder 32B** | Python, JS, bash, debugging | Code specialist |

### Cloud APIs (Pay-per-use)

| API | Use Case | Cost |
|-----|----------|------|
| Perplexity (sonar) | Research, citations | ~$0.005/call |
| OpenRouter Free | General 70B+ tasks | $0 |
| OpenRouter Paid | Premium fallback | Pay-per-use |
| Claude Opus | Complex reasoning | $$$ |

---

## Smart Routing Logic

### Primary Routing Table

| Task Type | Primary Model | Fallback |
|-----------|---------------|----------|
| **Code/Debug/Scripts** | Qwen Coder 32B (NVIDIA) | deepseek-coder → qwen2.5:7b → Kimi |
| **Screenshots/Images** | Kimi K2.5 | Llama 90B Vision |
| **Deep Reasoning** | Kimi K2.5 (thinking=true) | Llama 90B |
| **Routine Queries** | qwen2.5:7b (Mac Pro) | qwen2.5:3b (Mac Mini) |
| **Document Extraction** | Kimi K2.5 | qwen2.5:7b |
| **Fast/Simple** | qwen2.5:3b (local) | (free, unlimited) |
| **Embeddings** | nomic-embed-text | - |
| **Transcription** | Whisper (Cloud) | - |
| **Strategic Decisions** | Claude Opus | - |

### Quality-First Strategy

```
Perplexity → Kimi → Code → OpenRouter Free → Local → Paid
```

---

## 3-Tier Inference Fallback Chain

All admin scripts use this resilient fallback logic:

### Tier 1: Local Ollama
- Model: qwen2.5:3b @ localhost:11434
- Speed: ~5-10 seconds
- Cost: $0
- Works when: Mac Mini is online

### Tier 2: Cloud Ollama
- Model: qwen2.5:7b @ 100.107.231.87:11434
- Speed: ~30-60 seconds
- Cost: $0
- Works when: GCP VM is online

### Tier 3: OpenRouter API
- Model: google/gemma-2-9b-it:free
- Cost: $0 (free tier)
- Works when: Both local + cloud are down
- Requires: OPENROUTER_API_KEY env var

### Failure
- If all 3 tiers fail → Log to ~/shared-memory/backlog.json

### Using the Fallback Logic
```bash
# Source in any script needing AI inference
source ~/scripts/inference-fallback.sh

# Usage
ANALYSIS=$(get_ai_response "$CONTEXT")
# Automatically tries: local → cloud → openrouter → backlog
```

---

## RAM-Aware Scheduling

### Mac Mini RAM Thresholds

| Free RAM | Status | Action | AI Location |
|----------|--------|--------|-------------|
| >8 GB | Healthy | Normal operation | Local (3B) + Cloud (7B) |
| 5-8 GB | Normal | Expected with 3B loaded | Local (3B) + Cloud (7B) |
| 3-5 GB | Caution | Unload local model, route ALL to cloud | Cloud only |
| <3 GB | Critical | Skip AI tasks, kill non-essentials, alert | Defer or Cloud |

### RAM Check Script
**Location:** ~/scripts/get_free_ram.sh

- Checks macOS free + inactive pages
- Routes to cloud (100.107.231.87) when RAM < 5GB
- Skips tasks entirely when RAM < 3GB and cloud unreachable
- NEVER routes to Dell (100.119.87.108)

### Common RAM Hogs
- Ollama runner holding models (use `ollama stop <model>`)
- Chrome/Safari (close when not in use)
- Large models loaded locally (should only be ≤3GB)

---

## LLM Gateway v2.0

### Telegram Commands

```
/ask <question>            - Smart routing (auto-picks best model)
/code <task>               - Force Qwen Coder (code specialist)
/vision <url> [question]   - Force Llama 11B (fast vision)
/analyze <url> [question]  - Force Llama 90B (deep analysis)
/screenshot <url> [q]      - Force Kimi (screenshot debugging)
/kimi <question>           - Force Kimi K2.5
/think <question>          - Deep reasoning mode
/usage                     - Check daily stats
/help                      - Show all commands
```

### CLI Usage

```bash
# Quick commands
~/dta/gateway/ask "your question"
~/dta/gateway/think-deep "complex problem"
~/dta/gateway/analyze-screenshot "image-url"
~/dta/gateway/llm-usage

# Force specific model
python3 ~/dta/gateway/llm-gateway.py --force qwen_coder "write code"
python3 ~/dta/gateway/llm-gateway.py --force llama_90b --image "url" "analyze"
```

---

## Cost Management

### Monthly Budget

| Category | Budget | Notes |
|----------|--------|-------|
| GCP VM | ~$103 | Covered by $300 free credit until ~May 2026 |
| DTA API (Claude Opus) | $15-25 | Weekly scans + monthly report |
| Other admins API | $5-10 | If needed for overflow |
| OpenRouter fallback | $0 | Free tier (emergency only) |
| YouTube Data API | $0 | Free tier (10,000 units/day) |
| Local Ollama | $0 | Electricity only |
| Perplexity | ~$0.60 | ~$0.005/call |
| **Total** | **$25-45 + GCP credit** | |

### Budget Alerts

| Threshold | Action |
|-----------|--------|
| 60% | Notification |
| 80% | Warning |
| 95% | Hard stop (only DTA can authorize) |
| Single task >$5 | Abort and alert immediately |

### Token-Saving Practices

**Cost Hierarchy:**
1. 🆓 **FREE:** Ollama local — Always try first
2. 💰 **CHEAP:** NVIDIA API (50/day) — For code/vision/analysis
3. 💰💰💰 **EXPENSIVE:** Claude Opus — Only when necessary

**Key Behaviors:**
- ✅ Batch multiple requests into one message
- ✅ Spawn sub-agents for heavy research (cheaper models)
- ✅ Let heartbeat handle routine monitoring
- ✅ Use LLM Gateway for specialized tasks
- ✅ Check `/usage` or `session_status` for usage
- ❌ Don't use Claude for simple lookups
- ❌ Don't make separate requests when batching works
- ❌ Don't forget NVIDIA API limits (50/day)

---

## Ollama Management

### Status & Performance
```bash
# Check loaded models
ollama ps
# Should show "Forever" in UNTIL column (model stays in memory)

# List available models
ollama list

# Restart service (Mac)
launchctl unload ~/Library/LaunchAgents/com.ollama.server.plist
launchctl load ~/Library/LaunchAgents/com.ollama.server.plist

# View logs
tail -f /tmp/ollama.out
tail -f /tmp/ollama.err
```

### Performance Stats (Mac Mini)
- Cold start: 0.95s (model loading from disk)
- Warm start: 0.47s (model already in memory)
- Speedup: ~2x faster with OLLAMA_KEEP_ALIVE=-1
- Memory: 2.4GB GPU (persistent)

### Configuration
- Service: ~/Library/LaunchAgents/com.ollama.server.plist
- Auto-starts on login
- OLLAMA_KEEP_ALIVE=-1 keeps models in memory indefinitely

---

## OpenRouter Setup (Optional Third Tier)

```bash
# Get free API key: https://openrouter.ai/keys
echo 'export OPENROUTER_API_KEY="sk-or-v1-..."' >> ~/.bashrc
source ~/.bashrc

# If not set, tier 3 is silently skipped
```

---

## Model Selection Quick Guide

| I need to... | Use this |
|--------------|----------|
| Simple question | Ollama (qwen2.5:3b) FREE |
| Write code | `/code` or Qwen Coder 32B |
| Analyze long document | `/analyze` or Llama 90B |
| Quick image analysis | `/vision` or Llama 11B |
| Debug screenshot | `/screenshot` or Kimi K2.5 |
| Complex reasoning | `/think` or Kimi thinking mode |
| Strategic decision | Claude Opus (expensive!) |

---

## Known Issues & Lessons

| Issue | Resolution |
|-------|------------|
| qwen2.5:7b caused RAM thrashing on Mac Mini | Removed 7B locally, use 3B only |
| Ollama runner held 48% RAM after stopping | Full Ollama restart to release |
| Embedding model used for chat | Verify model type before use |
| API budget exceeded | Switch all roles to local qwen2.5:3b |
