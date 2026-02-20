# 🔥 FULL CODE SETUP GUIDE
## For Sharing with Other Bots/Agents
## Created: February 19, 2026

---

## What is FULL CODE?

FULL CODE is a dual-agent code generation pipeline:
1. **ChatGPT Codex** generates complex code
2. **Claude Code** proof-checks for bugs/security
3. **Implement** the reviewed, production-ready code

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🔥 FULL CODE PIPELINE 🔥                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   CODEX      │    │ CLAUDE CODE  │    │  IMPLEMENT   │      │
│  │              │    │              │    │              │      │
│  │ gpt-5.2-codex│───▶│  Proof Check │───▶│ Final Code   │      │
│  │              │    │  Bug Hunt    │    │ Deploy       │      │
│  │ Generate     │    │  Security    │    │ Test         │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│    Raw Code            Reviewed Code      Production Code       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### On Windows (Dell)
- Python 3.12+
- Node.js / npm
- OpenAI API key (sk-proj-...)

### Required Packages
```bash
# Desktop control
pip install pyautogui pillow pyscreeze pyperclip

# Codex CLI
npm install -g @openai/codex

# Claude Code (should already be installed)
# Check with: claude --version
```

---

## Setup Instructions

### Step 1: Set OpenAI API Key
```powershell
# PowerShell - set permanently
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-proj-YOUR-KEY-HERE", "User")
$env:OPENAI_API_KEY = "sk-proj-YOUR-KEY-HERE"
```

### Step 2: Configure Codex CLI
```bash
# Run codex for first-time setup
codex

# Select option 3: "Provide your own API key"
# It will auto-detect OPENAI_API_KEY from environment
# Press Enter to save

# Trust the directory when prompted
# Select option 1: "Set up default sandbox"
```

### Step 3: Verify Setup
```bash
# Test Codex
codex "Write a hello world function in Python"

# Test Claude Code
claude "Review this code: print('hello')"
```

---

## Usage

### Announcing FULL CODE
When starting a complex task, announce:
```
🔥 FULL CODE ACTIVATED 🔥
Task: [description of the complex task]
Pipeline: Codex → Claude Code → Implement
```

### CLI Method (Preferred)
```bash
# Step 1: Generate with Codex
codex "Build a REST API with JWT authentication"

# Step 2: Copy the generated code, then:
claude "Review this code for bugs, security issues, and improvements: [paste code]"

# Step 3: Implement the reviewed code
```

### GUI Method (PyAutoGUI)
```python
import pyautogui
import pyperclip
import time

# Open PowerShell
pyautogui.hotkey('win', 'r')
time.sleep(0.3)
pyperclip.copy('powershell')
pyautogui.hotkey('ctrl', 'v')
pyautogui.press('enter')
time.sleep(2)

# Run Codex
pyperclip.copy('codex "your task here"')
pyautogui.hotkey('ctrl', 'v')
pyautogui.press('enter')
```

---

## When to Use FULL CODE

### ✅ USE for:
- Complex algorithms
- Full features/modules
- Security-sensitive code
- Production deployments
- APIs and integrations
- Database schemas
- Authentication systems

### ❌ DON'T USE for:
- Simple scripts
- Quick one-liners
- Typo fixes
- Config changes

---

## Current Setup (Dell - 100.119.87.108)

| Component | Version | Location |
|-----------|---------|----------|
| Codex CLI | v0.104.0 | Global npm |
| Model | gpt-5.2-codex | OpenAI API |
| Claude Code | v2.1.22 | C:\Users\tommi\.local\bin\ |
| PyAutoGUI | v0.9.54 | Python packages |
| API Key | sk-proj-... | User env variable |

---

## Example Session

```
🔥 FULL CODE ACTIVATED 🔥
Task: Build a sliding window rate limiter
Pipeline: Codex → Claude Code → Implement

[Codex generates:]
class RateLimiter:
    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._timestamps = deque()
    
    def check_rate_limit(self) -> bool:
        now = time()
        self._evict_old(now)
        if len(self._timestamps) < self.max_requests:
            self._timestamps.append(now)
            return True
        return False
    
    def get_remaining(self) -> int:
        now = time()
        self._evict_old(now)
        return max(0, self.max_requests - len(self._timestamps))

[Claude Code reviews:]
✓ Logic is correct
✓ Thread-safety note: add lock for concurrent access
✓ Consider adding reset() method
⚠️ Import missing: from collections import deque

[Final implementation includes all fixes]
```

---

## Troubleshooting

### Codex won't start
- Check OPENAI_API_KEY is set: `echo $env:OPENAI_API_KEY`
- Verify npm install: `npm list -g @openai/codex`

### PyAutoGUI not typing
- Use clipboard method: `pyperclip.copy(text)` then `pyautogui.hotkey('ctrl', 'v')`
- Some web apps block direct keyboard input

### Claude Code not found
- Check path: `C:\Users\tommi\.local\bin\claude.exe`
- Add to PATH if needed

---

## Contact

Created by: Rusty's AI Assistant
Date: February 19, 2026
Location: Dell (100.119.87.108)

This setup can be replicated on other machines with the same prerequisites.
