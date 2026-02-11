# TOOLS.md - Your Personal Tool Reference

---

## 🤖 LLM GATEWAY v2.0 (UPDATED: 2026-02-11)

**Location:** `~/dta/gateway/`

### Available Models (5 total):

1. **🏠 Ollama Local (qwen2.5:3b)**
   - FREE, runs on Mac Mini
   - Best for: Fast simple queries
   - Speed: ⚡⚡⚡ Very fast
   - Cost: $0

2. **🧠 Kimi K2.5**
   - Multimodal (vision + text) + thinking mode
   - Best for: Screenshot debugging, reasoning
   - Speed: ⚡⚡ Fast
   - Usage: Part of 50 daily NVIDIA calls

3. **🦙💪 Llama 90B Vision**
   - HUGE (90 billion parameters!)
   - Best for: Long documents, complex forms, deep analysis
   - Speed: ⚡ Medium
   - Usage: Part of 50 daily NVIDIA calls

4. **🦙⚡ Llama 11B Vision**
   - Fast multimodal
   - Best for: Quick image analysis
   - Speed: ⚡⚡ Fast
   - Usage: Part of 50 daily NVIDIA calls

5. **💻 Qwen Coder 32B**
   - CODE SPECIALIST
   - Best for: Python, JavaScript, bash, debugging
   - Speed: ⚡⚡ Fast
   - Usage: Part of 50 daily NVIDIA calls

### Telegram Commands:

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

### Direct CLI Usage:

```bash
# Quick commands:
~/dta/gateway/ask "your question"
~/dta/gateway/think-deep "complex problem"
~/dta/gateway/analyze-screenshot "image-url"
~/dta/gateway/llm-usage

# Force specific model:
python3 ~/dta/gateway/llm-gateway.py --force qwen_coder "write code"
python3 ~/dta/gateway/llm-gateway.py --force llama_90b --image "url" "analyze"
```

### Smart Routing Logic:

- Code keywords → Qwen Coder
- Complex/long docs → Llama 90B
- Screenshots with errors → Kimi + thinking
- Fast vision → Llama 11B
- Simple queries → Ollama (free!)

---

## 🔐 SSH QUICK REFERENCE

**Optimized aliases** (via `~/.ssh/config`):
```bash
ssh mac-mini      # 100.82.234.66 (local)
ssh google-cloud  # 100.107.231.87 (GCP VM)
ssh dell          # 100.119.87.108 (Windows)
```

**Features enabled:**
- Connection multiplexing (ControlMaster) - reuses connections for 10 min
- Keep-alive (ServerAliveInterval 60s) - prevents timeouts
- Compression - faster transfers
- Persistent keys - auto-added to agent

---

## 📋 CHANGE REQUEST AUTOMATION

**Location:** `~/dta/work-automation/change-requests/`

### Commands:
```bash
# Process CR from clipboard:
pbpaste | ~/dta/gateway/process-cr

# From file:
~/dta/gateway/process-cr --file email.txt
```

### Now uses optimal models:
- Long CRs → Llama 90B (huge context)
- Extraction → Kimi (reasoning)
- Technical CRs → Qwen Coder (code analysis)

---

## 🏗️ SYSTEM ARCHITECTURE

### Mac Mini (100.82.234.66)
- Main host
- Ollama running (qwen2.5:3b) **⚡ OPTIMIZED**
- **Model stays in memory permanently** (OLLAMA_KEEP_ALIVE=-1)
- **~2x faster responses** (0.47s vs 0.95s)
- Max model size: 3GB
- FREE local AI
- Auto-starts via launchd: `~/Library/LaunchAgents/com.ollama.server.plist`
- Check status: `ollama ps` (should show "Forever" in UNTIL column)

### Google Cloud (100.107.231.87)
- Reserved for 7B models
- Not currently in use

### Dell (100.119.87.108)
- Windows workstation
- Username: `tommi` (not rusty!)
- SSH: `ssh dell` (optimized config)
- Ollama: phi3:mini (3.8B) @ ~10 tok/s
- ⚠️ CrowdStrike-monitored - use responsibly
- Admin agent can use for model inference

---

## ⚙️ OLLAMA MANAGEMENT

### Status & Performance
```bash
# Check what's loaded:
ollama ps
# Should show: "Forever" in UNTIL column (model stays in memory)

# List available models:
ollama list

# Restart service:
launchctl unload ~/Library/LaunchAgents/com.ollama.server.plist
launchctl load ~/Library/LaunchAgents/com.ollama.server.plist

# View logs:
tail -f /tmp/ollama.out
tail -f /tmp/ollama.err
```

### Performance Stats
- **Cold start:** 0.95s (model loading from disk)
- **Warm start:** 0.47s (model already in memory)
- **Speedup:** ~2x faster with KEEP_ALIVE=-1
- **Memory:** 2.4GB GPU (persistent)

### Configuration
- Service: `~/Library/LaunchAgents/com.ollama.server.plist`
- Auto-starts on login
- Keeps models in memory indefinitely
- Full details: `ollama-optimization-report.md`

---

## 📝 NOTES & TASKS

### Apple Notes (memo CLI):
```bash
memo new "note text"
memo list
memo search "query"
```

### Things 3:
```bash
things add "task description"
things show today
```

### Apple Reminders:
```bash
remindctl list
remindctl add "reminder" --date tomorrow
```

---

## 💬 COMMUNICATION

### iMessage (imsg):
```bash
imsg send "contact" "message"
imsg list
```

### Telegram:
- Direct bot access via @YourBot
- Commands: /ask, /code, /vision, /analyze, etc.

---

## 🔐 SECURITY NOTES

### 1Password:
- CLI available: `op`
- Integration with gateway

### Peekaboo (Mac UI Automation):
- Accessibility permissions granted
- Can control Mac apps via chat

---

## 🎨 MEDIA TOOLS

### Summarize:
```bash
# YouTube videos:
summarize "https://youtube.com/watch?v=..."

# PDFs:
summarize file.pdf

# Audio:
summarize audio.mp3
```

### Video Frames:
```bash
# Extract frame at specific time:
video-frames extract video.mp4 --time 1:30

# Extract multiple frames:
video-frames extract video.mp4 --count 10
```

---

## 🏠 HOME AUTOMATION (If Configured)

### Hue Lights:
```bash
hue on
hue off
hue scene "Movie Time"
```

### Sonos:
```bash
sonos play
sonos volume 50
```

---

## 🎯 QUICK REFERENCE

### Most Used Commands:
```bash
# AI queries:
~/dta/gateway/ask "question"
/code "write function"
/usage

# Tasks:
things add "task"

# Notes:
memo new "note"

# Weather:
weather Chicago

# Summarize:
summarize "youtube-url"
```

### Model Selection Tips:
- **Code task?** → Use `/code` or it auto-detects
- **Long document?** → Use `/analyze` 
- **Quick image?** → Use `/vision`
- **Screenshot debug?** → Use `/screenshot`
- **Complex reasoning?** → Use `/think`

---

## 📊 USAGE TRACKING

Check what you're using:
```bash
~/dta/gateway/llm-usage
```

Daily limits:
- NVIDIA models: 50 calls total
- Ollama local: Unlimited (free!)

---

This is your personal command reference. Update it as you discover new workflows!
