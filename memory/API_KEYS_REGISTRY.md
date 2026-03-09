# API Keys Registry
**Last Updated:** 2026-03-08 22:52 CDT

## ✅ Active Keys

### OpenRouter ($50 balance)
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active (Paid tier)
- Balance: $50
- Updated: 2026-03-08

### NVIDIA NIM (Kimi, Llama, etc.)
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active
- Models: 187 available (Kimi K2.5, Llama, Qwen, etc.)
- Updated: 2026-03-08

### Google Gemini
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active
- Models: gemini-2.5-flash, gemini-2.5-pro (old model names deprecated)
- Updated: 2026-03-08

### OpenAI
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active
- Models: gpt-4o, gpt-4o-mini, etc.

### Resend (Email)
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active
- Domain: arbitragepharma.com (DNS needs setup)
- Updated: 2026-03-08

### 2Captcha
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active
- Balance: $9.98
- Used by: Legion job automation

### Hunter.io
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active (Free tier)
- Searches: 49/50 remaining (resets Mar 17)
- Verifications: 98/100 remaining

### Perplexity
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ⚠️ Untested

### OpenWeather
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active (Free tier)

### GitHub PAT
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active

### Legion Telegram Bot
```
[REDACTED - See ~/.zshrc on Mac Mini]
```
- Status: ✅ Active
- Bot: Legion notifications

## 📍 Key Locations

| Key | Mac Mini Location |
|-----|-------------------|
| All keys | `~/.zshrc` |
| NVIDIA, OpenRouter | `~/dta/gateway/.env` |

## 🖥️ Network IPs (CORRECT)

| Node | IP | Notes |
|------|-----|-------|
| Mac Mini | 100.88.105.106 | Primary, Ollama 3B models |
| **Mac Pro** | **100.89.67.10** | ⚠️ NOT 100.92.123.115! |
| Dell | 100.119.87.108 | Windows, Clawdbot host |
| Google Cloud | 100.107.231.87 | Linux VM |

## ⚠️ SECURITY NOTE

**NEVER commit actual API keys to this file!**

All actual keys are stored in:
- Mac Mini: `~/.zshrc` (source of truth)
- Mac Mini: `~/dta/gateway/.env` (for LLM gateway)

This file is for tracking STATUS only, not actual key values.
