# Deez Nuts Bot Fix - 2026-02-08 17:25 CST

## Problem
@look_at_deeznutszbot was broken with repeating robots.txt errors:
```
Error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"This URL is disallowed by the website's robots.txt file."},"request_id":"req_011CXwTpXyEdqyrffHG9ZcwP"}
```

## Root Causes
1. **Robots.txt Error:** Bot was trying to fetch URLs blocked by robots.txt, causing API errors
2. **Identity Confusion:** Bot thought it was @tommie77bot instead of Deez Nuts

## Fix Applied

### 1. Killed and cleared cache
```bash
pkill -9 "memU bot"
rm -rf "/Users/tommie/Library/Application Support/memu-bot/Session Storage"
rm -rf "/Users/tommie/Library/Application Support/memu-bot/GPUCache"
rm -rf "/Users/tommie/Library/Application Support/memu-bot/Code Cache"
```

### 2. Created IDENTITY.md
Created `/Users/tommie/Library/Application Support/memu-bot/IDENTITY.md` with:
- Name: Deez Nuts
- Username: @look_at_deeznutszbot
- Role: Coordinator/learner

### 3. Updated system prompt
Added to `settings.json`:
- Clear identity statement (You are Deez Nuts, NOT tommie77bot)
- Robots.txt error handling instructions
- No auto-fetching of URLs
- Graceful degradation when sites block AI

### 4. Restarted bot
Bot is now running with fresh state and proper configuration.

## Result
✅ Bot restarted with cleared cache
✅ Identity file created
✅ System prompt configured with robots.txt handling
✅ Bot should now handle blocked URLs gracefully
✅ Bot knows it's Deez Nuts, not Tommie

## Testing
Sent test message to group chat asking bot to respond.
