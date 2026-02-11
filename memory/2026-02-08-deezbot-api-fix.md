# Deez Nuts Bot API Credits Fix - 2026-02-08 22:54 CST

## Problem
memU Bot (@look_at_deeznutszbot) was getting Anthropic API credit errors:
```
Error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."},"request_id":"req_011CXwu2QXFoiEi8MBW6syVi"}
```

## Root Cause
- memU Bot was using Claude API key: `sk-ant-***REDACTED***`
- That API key ran out of credits
- Bot couldn't make API calls

## Solution Applied

### Switched to OpenAI API
Updated `/Users/tommie/Library/Application Support/memu-bot/config/settings.json`:
- **Provider:** `custom` (OpenAI compatible)
- **API Key:** Using same OpenAI key as Clawdbot (has credits)
- **Base URL:** `https://api.openai.com/v1`
- **Model:** `gpt-4o-mini` (faster and cheaper than Claude Opus)

### Configuration Changes
```json
{
  "llmProvider": "custom",
  "customApiKey": "***REDACTED***",
  "customBaseUrl": "https://api.openai.com/v1",
  "customModel": "gpt-4o-mini"
}
```

### Restarted Bot
- Killed memU Bot process
- Reopened app
- Bot now running with OpenAI backend

## Result
✅ Bot restarted successfully  
✅ Using OpenAI GPT-4o-mini  
✅ Same API key as Clawdbot (has credits)  
✅ Test message sent to group chat

## Notes
- **Cost:** GPT-4o-mini is ~10x cheaper than Claude Opus
- **Quality:** Still very good for coordination tasks
- **Alternative:** If OpenAI credits run low, can switch to local Ollama (qwen2.5:3b)

## Future Fix Options
1. Add credits to original Claude API key
2. Use local Ollama (free but slower)
3. Keep using OpenAI (current solution)
