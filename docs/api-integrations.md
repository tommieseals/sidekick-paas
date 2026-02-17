# API Integrations Guide

*Last updated: 2026-02-17*

## Ready to Integrate (Free Tiers)

### 1. Hunter.io - Email Lookup
**Status:** ⏳ Needs signup  
**Free:** 25 searches + 500 verifications/month  
**Use for:** Finding recruiter emails, job search outreach

```bash
# Setup
export HUNTER_API_KEY="your_key_here"

# Usage
curl "https://api.hunter.io/v2/domain-search?domain=stripe.com&api_key=$HUNTER_API_KEY"
curl "https://api.hunter.io/v2/email-finder?domain=stripe.com&first_name=John&last_name=Doe&api_key=$HUNTER_API_KEY"
```

**Signup:** https://hunter.io/users/sign_up

---

### 2. Browserless - Headless Browser
**Status:** ⏳ Needs signup  
**Free:** 1,000 units/month (1 unit = 30 seconds)  
**Use for:** Screenshots, PDFs, web scraping

```bash
# Setup
export BROWSERLESS_API_KEY="your_key_here"

# Screenshot
curl -X POST "https://chrome.browserless.io/screenshot?token=$BROWSERLESS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' > screenshot.png
```

**Signup:** https://www.browserless.io/sign-up

---

### 3. Resend - Email Sending
**Status:** ⏳ Needs signup  
**Free:** 100 emails/day (3,000/month)  
**Use for:** Job application confirmations, alerts, digests

```bash
# Setup
export RESEND_API_KEY="your_key_here"

# Send email
curl -X POST "https://api.resend.com/emails" \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "alerts@yourdomain.com",
    "to": ["you@example.com"],
    "subject": "Daily Infrastructure Report",
    "text": "All systems healthy."
  }'
```

**Signup:** https://resend.com/signup

---

### 4. OpenWeatherMap - Weather API
**Status:** ⏳ Needs signup  
**Free:** 1,000 calls/day (VERY generous!)  
**Use for:** Weather alerts, smart scheduling

```bash
# Setup
export OPENWEATHER_API_KEY="your_key_here"

# Current weather
curl "https://api.openweathermap.org/data/2.5/weather?q=Chicago&appid=$OPENWEATHER_API_KEY&units=imperial"

# 5-day forecast
curl "https://api.openweathermap.org/data/2.5/forecast?q=Chicago&appid=$OPENWEATHER_API_KEY&units=imperial"
```

**Signup:** https://openweathermap.org/api

---

### 5. Hugging Face - ML/NLP Models
**Status:** ✅ Can test now (rate-limited)  
**Free:** Unlimited (with rate limits)  
**Use for:** Sentiment analysis, NER, text generation

```bash
# Setup (optional but recommended)
export HUGGINGFACE_API_KEY="your_key_here"

# Sentiment analysis
curl "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english" \
  -H "Authorization: Bearer $HUGGINGFACE_API_KEY" \
  -d '{"inputs": "This job posting looks great!"}'
```

**Signup:** https://huggingface.co/join

---

## Already Configured ✅

| API | Location | Notes |
|-----|----------|-------|
| NVIDIA (Kimi, Llama, Qwen) | Mac Mini gateway | 50 calls/day |
| Telegram Bot | Clawdbot config | @Thats_My_Bottom_Bitch_bot |
| Brave Search | Clawdbot config | Web search |
| Ollama | Mac Mini + Mac Pro | Local, unlimited |

---

## Integration Priority

1. **Hunter.io** + **Emailable** — Job search essentials
2. **Resend** — Email alerts and digests
3. **OpenWeatherMap** — Weather in heartbeat checks
4. **Browserless** — Web automation when needed

---

## Environment Variables

Store API keys in `~/.bashrc` or `~/.zshrc`:

```bash
# API Keys
export HUNTER_API_KEY="xxx"
export BROWSERLESS_API_KEY="xxx"
export RESEND_API_KEY="xxx"
export OPENWEATHER_API_KEY="xxx"
export HUGGINGFACE_API_KEY="xxx"
```

Or create `~/clawd/config/api-keys.env` (git-ignored):

```bash
source ~/clawd/config/api-keys.env
```
