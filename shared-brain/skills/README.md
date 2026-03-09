# 🎯 Skills Reference

*Specialized capabilities available to all bots.*

---

## 🔥 FULL CODE Pipeline

For complex code generation with verification.

**Activation:**
```
🔥 FULL CODE ACTIVATED 🔥
Task: [description]
Pipeline: Codex → Claude Code → Implement
```

**Flow:**
1. Codex generates initial code
2. Claude Code reviews for bugs/security
3. Implement the verified code

**When to use:**
- Complex algorithms
- Security-sensitive code
- Production deployments

**When NOT to use:**
- Simple scripts (overkill)
- Quick fixes (just use one agent)

---

## 🐝 Swarm Deployment

For parallel work across multiple sub-agents.

**Use when:**
- Building multiple modules simultaneously
- QA verification across codebase
- Research across multiple sources

**Example:**
```
Deploy 6 QA agents:
- Agent 1: Review core/ modules
- Agent 2: Review api/ modules
- Agent 3: Review utils/ modules
...
```

---

## 🖥️ Desktop Control

Full GUI automation on Dell via PyAutoGUI.

**Capabilities:**
- Screenshots (see what's on screen)
- Mouse control (click, drag, scroll)
- Keyboard input (type, hotkeys)
- Window management

**Code:**
```python
import pyautogui
pyautogui.screenshot().save('screen.png')
pyautogui.click(x, y)
pyautogui.typewrite('text')
pyautogui.hotkey('ctrl', 'c')
```

---

## 🌐 MCP Browser Control

Full browser automation via Chrome extension relay.

**Commands:**
```
browser snapshot profile=chrome     # Read page
browser navigate profile=chrome targetUrl="url"
browser act profile=chrome         # Interact
browser screenshot profile=chrome  # Capture
```

**Setup:** Chrome extension must be attached to tab.

---

## 🎭 Voice Storytelling

Use ElevenLabs TTS (`sag`) for:
- Story narration
- Movie summaries
- "Storytime" moments

Way more engaging than walls of text!

---

## 📊 Sub-Agent Spawning

For long-running or specialized tasks:

```
sessions_spawn task="Your detailed task description"
```

Sub-agent works in background and reports back when done.

**Use for:**
- Heavy research
- Complex builds
- QA verification

---

## 🔍 Memory Search

When context is lost:
```
memory_search query="topic"
```

Then read relevant files with `memory_get`.

**Always check:**
1. CURRENT_STATE.md
2. memory/YYYY-MM-DD.md
3. SOUL.md
4. shared-brain/

---

*Add new skills as you develop them!*
