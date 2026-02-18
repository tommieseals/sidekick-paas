# TOOLS.md - Your Personal Tool Reference

---

## 💰 TOKEN-SAVING PRIORITY (READ FIRST!)

**Always use the cheapest model that can do the job:**

1. **FREE**: Ollama local (qwen2.5:3b) → Use for simple queries
2. **CHEAP**: NVIDIA API (50 calls/day) → Use for code/vision/analysis
3. **EXPENSIVE**: Claude Opus → Only when you NEED the best

**Key behaviors:**
- Batch multiple requests into one message
- Spawn sub-agents for heavy research (uses cheaper models)
- Let heartbeat handle routine monitoring
- Check `session_status` for usage

**Full guide:** `~/clawd/docs/TOKEN_SAVING_GUIDE.md`

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
ssh mac-mini      # 100.88.105.106 (local)
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

### Mac Mini (100.88.105.106)
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

---

## 📧 EMAIL & CONTACT TOOLS (NEW - 2026-02-11)

### Hunter.io - Email Lookup ⭐ Job Search Essential
**Status:** ⏳ Ready to integrate (needs signup)  
**Free Tier:** 25 searches + 500 verifications/month

```bash
# Find emails at a company
~/dta/hunter domain stripe.com

# Find specific person's email
~/dta/hunter find stripe.com John Doe

# Verify email address
~/dta/hunter verify john@stripe.com

# Check remaining quota
~/dta/hunter quota
```

**Use Cases:**
- Find recruiter emails at target companies
- Build contact list for job search
- Verify emails before cold outreach

**Docs:** `~/clawd/api-keys/HUNTER_IO.md`

---

### Emailable - Email Validation
**Status:** ⏳ Ready to integrate (needs signup)  
**Free Tier:** 250 credits on signup (never expire!)

```bash
# Verify email validity
~/dta/emailable test@example.com
```

**Perfect complement to Hunter.io:**
1. Find email with Hunter.io
2. Verify with Emailable
3. Send cold outreach

**Docs:** `~/clawd/api-keys/EMAILABLE.md`

---

## 🌐 BROWSER AUTOMATION (NEW)

### Browserless - Headless Browser
**Status:** ⏳ Ready to integrate (needs signup)  
**Free Tier:** 1,000 units/month (1 unit = 30 seconds)

```bash
# Capture screenshot
~/dta/browserless screenshot https://example.com output.png

# Generate PDF
~/dta/browserless pdf https://example.com output.pdf

# Scrape data
~/dta/browserless scrape https://example.com ".selector"
```

**Use Cases:**
- LinkedIn job scraping (use responsibly!)
- Screenshot job boards
- Automated job applications
- Extract contact info from websites
- Monitor job posting changes

**⚠️ Important:** Respect LinkedIn ToS and robots.txt

**Docs:** `~/clawd/api-keys/BROWSERLESS.md`

---

## 📨 EMAIL SENDING (NEW)

### Resend - Transactional Email
**Status:** ⏳ Ready to integrate (needs signup)  
**Free Tier:** 100 emails/day (3,000/month)

```bash
# Send email
~/dta/send-email recipient@example.com "Subject" "Body text"

# Job application confirmation
~/dta/send-email rusty@example.com \
  "Applied: Senior Developer @ Stripe" \
  "Application submitted successfully. Follow up in 1 week."
```

**Use Cases:**
- Job application confirmations
- Weekly job search digest
- Interview reminders
- Follow-up automation
- Error notifications

**Docs:** `~/clawd/api-keys/RESEND.md`

---

## 🌤️ ENHANCED WEATHER (NEW)

### OpenWeatherMap - Professional Weather API
**Status:** ⏳ Ready to integrate (needs signup)  
**Free Tier:** 1,000 calls/day (30,000/month!) - VERY GENEROUS

```bash
# Detailed weather with alerts
~/dta/weather Chicago

# Or update existing weather command to use OpenWeatherMap
weather chicago
```

**Major upgrade over wttr.in:**
- Weather alerts (winter storms, etc.)
- 8-day daily forecast
- 48-hour hourly forecast
- Minutely forecast (next 60 minutes)
- Air quality data
- Historical weather (47 years back!)

**Use Cases:**
- Smart scheduling based on weather
- Weather alerts in heartbeat checks
- Hourly precision: "Will it rain in 2 hours?"
- Air quality monitoring

**Docs:** `~/clawd/api-keys/OPENWEATHERMAP.md`

---

## 🤖 SPECIALIZED NLP TOOLS (NEW)

### Hugging Face - ML Models & Inference
**Status:** ⏳ Ready to integrate (needs signup)  
**Free Tier:** Unlimited (rate-limited but generous)

```bash
# Sentiment analysis
~/dta/hf sentiment "This job posting looks great!"

# Named Entity Recognition (extract skills, companies, locations)
~/dta/hf ner "Looking for Senior Python Developer with AWS, Docker, Kubernetes in Chicago"

# Text generation
~/dta/hf generate "Once upon a time"

# Image generation (Stable Diffusion)
~/dta/hf image "A professional headshot" output.png
```

**Job Search Use Cases:**
- **Extract skills** from job descriptions (NER)
- **Analyze sentiment** of cover letters
- **Parse job postings** for requirements
- **Categorize jobs** by type
- **Analyze company reviews** sentiment

**Example Job Description Analysis:**
```bash
~/dta/hf ner "Senior Python Developer needed. Must have AWS, Docker, Kubernetes. Located in Chicago."
```

Output:
```json
[
  {"entity": "JOB_TITLE", "word": "Senior Python Developer"},
  {"entity": "SKILL", "word": "AWS"},
  {"entity": "SKILL", "word": "Docker"},
  {"entity": "SKILL", "word": "Kubernetes"},
  {"entity": "LOCATION", "word": "Chicago"}
]
```

**Docs:** `~/clawd/api-keys/HUGGINGFACE.md`

---

## 📱 SMS NOTIFICATIONS (NEW - LIMITED)

### Textbelt - SMS API
**Status:** ✅ Can test now (no signup!)  
**Free Tier:** 1 SMS per day

```bash
# Test SMS (no signup required!)
curl -X POST https://textbelt.com/text \
  --data-urlencode phone='YOUR_PHONE' \
  --data-urlencode message='Test from Clawd' \
  -d key=textbelt
```

**Use Cases:**
- Critical system alerts
- Emergency notifications
- When Telegram is down

**Cost:** $0.02/text after free daily limit ($10 = 500 texts)

**Verdict:** Test 1 free SMS now, decide later if paid tier needed. Telegram is better for most notifications.

**Docs:** `~/clawd/api-keys/TEXTBELT.md`

---

## 📊 API INTEGRATION STATUS

### Ready to Integrate ✅
1. **Hunter.io** - Email lookup (25/month)
2. **Emailable** - Email verification (250 total)
3. **Browserless** - Headless browser (1k units/month)
4. **OpenWeatherMap** - Weather API (1k/day!)
5. **Resend** - Transactional email (100/day)
6. **Hugging Face** - NLP tools (unlimited*)

### Can Test Now ✅
7. **Textbelt** - 1 free SMS/day (no signup)
8. **Hugging Face** - Works without auth for testing

### Needs Research ⏳
9. **Replicate** - Free credits amount unclear
10. **AIMLAPI** - Only 10/hour (very limited, skip for now)

### Total Value
**~$50-100/month in free API access** for job search automation!

**Full Report:** `~/clawd/API_INTEGRATION_REPORT.md`  
**All Docs:** `~/clawd/api-keys/*.md` (9 detailed guides)

---

## 🎯 RECOMMENDED INTEGRATION ORDER

**Week 1: Job Search Essentials**
1. Hunter.io - Find recruiter emails
2. Emailable - Verify emails
3. Browserless - LinkedIn automation

**Week 2: Communication**
4. Resend - Email automation
5. OpenWeatherMap - Weather upgrade

**Week 3: Advanced Features**
6. Hugging Face - NLP tools

**Expected Impact:** 15-20 hours saved per week on job search tasks!

