# 🛠️ Shared Tools Reference

*Tools available across all nodes. Add your discoveries here.*

---

## 🌐 MCP Browser Control

**What:** Full browser automation via Chrome extension relay
**Where:** Any node with Clawdbot

```
browser snapshot profile=chrome     # Read current page
browser navigate profile=chrome targetUrl="https://..."
browser act profile=chrome         # Click, type, etc.
browser screenshot profile=chrome  # Capture page
```

**Setup:** Chrome extension "Clawdbot Browser Relay" must be installed. Click toolbar icon on tab to attach.

---

## 🤖 LLM Gateway v2.0

**Location:** Mac Mini `~/dta/gateway/`

### Available Models
| Model | Use Case | Cost |
|-------|----------|------|
| Ollama (qwen2.5:3b) | Simple queries | FREE |
| Kimi K2.5 | Vision + thinking | NVIDIA API |
| Llama 90B | Deep analysis | NVIDIA API |
| Qwen Coder 32B | Code specialist | NVIDIA API |

### Telegram Commands
```
/ask <question>      # Smart routing
/code <task>         # Force Qwen Coder
/vision <url>        # Force Llama 11B
/analyze <url>       # Force Llama 90B
/usage               # Check daily stats
```

---

## 🖥️ Desktop Control (Dell)

**Library:** PyAutoGUI + Pillow

```python
import pyautogui

# Screenshot
pyautogui.screenshot().save('screen.png')

# Click/Type
pyautogui.click(x, y)
pyautogui.typewrite('text')
pyautogui.hotkey('ctrl', 'c')
```

---

## 🔥 FULL CODE Pipeline

For complex code: Codex → Claude Code → Implement

```bash
codex "Build a REST API with auth"  # Generate
claude "Review this code: [code]"    # Proof check
# Then implement the reviewed code
```

---

## 📧 Email (Resend API)

**API Key:** `re_f5Ti1v1h_LDrsTxKoRJEUTqk72wgw4j9V`

```python
import resend
resend.api_key = "re_f5Ti1v1h_LDrsTxKoRJEUTqk72wgw4j9V"
resend.Emails.send({
    "from": "onboarding@resend.dev",
    "to": "recipient@example.com",
    "subject": "Hello",
    "text": "Message body"
})
```

---

## 🐙 GitHub CLI

**Location:** Mac Mini `/opt/homebrew/bin/gh`
**Account:** tommieseals

```bash
ssh tommie@100.88.105.106 "/opt/homebrew/bin/gh repo create <name> --private"
ssh tommie@100.88.105.106 "/opt/homebrew/bin/gh repo list"
```

---

## 💎 Google Gemini API

**Key:** `AIzaSyAjz7FmPHmbsVlrUHJJ8749mTyC357QwuU`

```python
import google.generativeai as genai
genai.configure(api_key='AIzaSyAjz7FmPHmbsVlrUHJJ8749mTyC357QwuU')
model = genai.GenerativeModel('gemini-2.0-flash')
response = model.generate_content('Your prompt')
```

---

*Add new tools as you discover them!*
