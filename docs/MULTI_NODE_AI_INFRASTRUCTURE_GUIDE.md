# Multi-Node AI Infrastructure Setup Guide
## Personal AI Data Center with Intelligent Routing

*A guide to building your own distributed AI infrastructure using commodity hardware.*

---

## Overview

This guide walks you through setting up a **multi-node AI infrastructure** where:
- Multiple machines work together as one system
- Tasks route intelligently based on type and resource availability
- A watchdog monitors health and auto-recovers failures
- All communication happens over a secure mesh network (Tailscale)
- Total monthly cost: **$0** (using local hardware + free cloud tiers)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR AI DATA CENTER                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐         ┌─────────────────┐              │
│   │  ORCHESTRATOR   │         │  COMPUTE NODE   │              │
│   │   (Mac Mini)    │◄───────►│   (Mac Pro)     │              │
│   │                 │         │                 │              │
│   │ • Clawdbot      │         │ • Heavy models  │              │
│   │ • LLM Gateway   │         │ • Code tasks    │              │
│   │ • Watchdog      │         │ • Reasoning     │              │
│   │ • Light models  │         │                 │              │
│   └────────┬────────┘         └─────────────────┘              │
│            │                                                    │
│            │  Tailscale Mesh (100.x.x.x)                       │
│            │                                                    │
│   ┌────────▼────────┐         ┌─────────────────┐              │
│   │  CLOUD NODE     │         │  FAILSAFE NODE  │              │
│   │  (GCP/Oracle)   │         │  (Any spare PC) │              │
│   │                 │         │                 │              │
│   │ • 7B+ models    │         │ • Emergency     │              │
│   │ • Transcription │         │ • Backup only   │              │
│   │ • Heavy compute │         │                 │              │
│   └─────────────────┘         └─────────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Hardware (Minimum)
- **Orchestrator Node**: Any Mac/Linux machine with 8GB+ RAM
- **Optional Compute Node**: More powerful machine for heavy models
- **Optional Cloud Node**: GCP/Oracle Cloud free tier VM

### Software
1. **Tailscale** - Mesh VPN (free for personal use)
2. **Ollama** - Local LLM runtime (free, open source)
3. **Clawdbot** - AI agent framework (npm package)
4. **Node.js 18+** - Runtime for Clawdbot

---

## Step 1: Set Up Tailscale Mesh Network

Install Tailscale on ALL machines that will be part of your infrastructure.

```bash
# macOS
brew install tailscale
sudo tailscaled

# Linux
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Windows
# Download from https://tailscale.com/download/windows
```

After setup, each machine gets a stable 100.x.x.x IP address.

**Verify connectivity:**
```bash
tailscale status
# Should show all your devices
```

---

## Step 2: Install Ollama on Each Node

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve

# Pull models based on node role
ollama pull qwen2.5:3b      # Light model for orchestrator
ollama pull deepseek-coder  # Code model for compute node
ollama pull qwen2.5:7b      # Reasoning model for compute/cloud
```

### RAM-Based Model Selection

| Available RAM | Recommended Models |
|--------------|-------------------|
| 8GB | phi3:mini (2.3GB), qwen2.5:3b (1.9GB) |
| 16GB | Above + qwen2.5:7b (4.4GB) |
| 32GB+ | Above + deepseek-coder:6.7b, llama2:13b |

**⚠️ Rule of Thumb:** Model VRAM ≈ 1.2x parameter count in GB. Never exceed 60% of total RAM.

---

## Step 3: Configure Ollama for Network Access

By default, Ollama only listens on localhost. To enable cross-node access:

**macOS (LaunchAgent):**
```bash
# Create/edit ~/Library/LaunchAgents/com.ollama.server.plist
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OLLAMA_HOST</key>
        <string>0.0.0.0:11434</string>
        <key>OLLAMA_KEEP_ALIVE</key>
        <string>-1</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.ollama.server.plist
```

**Linux (systemd):**
```bash
sudo systemctl edit ollama
```
Add:
```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_KEEP_ALIVE=-1"
```
```bash
sudo systemctl restart ollama
```

**Verify cross-node access:**
```bash
# From orchestrator, test compute node
curl http://100.x.x.x:11434/api/tags
```

---

## Step 4: Install Clawdbot (Orchestrator Only)

```bash
npm install -g clawdbot

# Initialize workspace
mkdir ~/clawd && cd ~/clawd
clawdbot init

# Configure your channel (Telegram example)
clawdbot config
```

### Key Config Sections

**clawdbot.json:**
```json
{
  "channels": {
    "telegram": {
      "token": "YOUR_BOT_TOKEN"
    }
  },
  "auth": {
    "profiles": {
      "anthropic:claude-cli": {
        "provider": "anthropic",
        "mode": "oauth"
      }
    }
  }
}
```

---

## Step 5: Create the LLM Gateway

The gateway routes tasks to the right node based on task type and node health.

**~/dta/gateway/llm-gateway.py:**
```python
#!/usr/bin/env python3
"""
LLM Gateway v2.0 - Intelligent Multi-Node Routing
"""

import requests
import json
import sys
from typing import Optional

# Node Configuration
NODES = {
    "orchestrator": {
        "url": "http://localhost:11434",
        "models": ["qwen2.5:3b", "phi3:mini", "nomic-embed-text"],
        "role": "fast_queries"
    },
    "compute": {
        "url": "http://100.67.192.21:11434",  # Your compute node IP
        "models": ["deepseek-coder:6.7b", "qwen2.5:7b"],
        "role": "heavy_compute"
    },
    "cloud": {
        "url": "http://100.107.231.87:11434",  # Your cloud node IP
        "models": ["qwen2.5:7b"],
        "role": "fallback"
    }
}

# Routing Rules
ROUTING = {
    "code": ["compute", "orchestrator"],
    "fast": ["orchestrator", "cloud"],
    "reasoning": ["compute", "cloud", "orchestrator"],
    "embeddings": ["orchestrator"]
}

def check_node_health(node_name: str) -> bool:
    """Check if a node is responsive."""
    try:
        url = NODES[node_name]["url"]
        response = requests.get(f"{url}/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False

def route_query(task_type: str, prompt: str) -> Optional[str]:
    """Route query to appropriate node with fallback."""
    chain = ROUTING.get(task_type, ["orchestrator"])
    
    for node_name in chain:
        if not check_node_health(node_name):
            print(f"[Gateway] {node_name} unhealthy, trying next...")
            continue
        
        node = NODES[node_name]
        model = node["models"][0]
        
        try:
            response = requests.post(
                f"{node['url']}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False},
                timeout=120
            )
            if response.status_code == 200:
                return response.json().get("response")
        except Exception as e:
            print(f"[Gateway] {node_name} failed: {e}")
            continue
    
    return None

def classify_task(prompt: str) -> str:
    """Simple task classification based on keywords."""
    prompt_lower = prompt.lower()
    
    if any(kw in prompt_lower for kw in ["code", "function", "script", "debug", "error"]):
        return "code"
    if any(kw in prompt_lower for kw in ["quick", "simple", "yes/no", "what is"]):
        return "fast"
    return "reasoning"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: llm-gateway.py 'your prompt'")
        sys.exit(1)
    
    prompt = " ".join(sys.argv[1:])
    task_type = classify_task(prompt)
    print(f"[Gateway] Task type: {task_type}")
    
    response = route_query(task_type, prompt)
    if response:
        print(response)
    else:
        print("All nodes failed to respond.")
```

**Make executable:**
```bash
chmod +x ~/dta/gateway/llm-gateway.py

# Create convenience wrapper
echo '#!/bin/bash
python3 ~/dta/gateway/llm-gateway.py "$@"' > ~/dta/gateway/ask
chmod +x ~/dta/gateway/ask
```

---

## Step 6: Create the Watchdog System

The watchdog monitors node health and auto-recovers failures.

**~/dta/watchdog/watchdog.py:**
```python
#!/usr/bin/env python3
"""
Watchdog System - Monitor nodes, auto-recover, alert on failures
"""

import requests
import subprocess
import json
import os
from datetime import datetime
from pathlib import Path

# Configuration
NODES_TO_MONITOR = {
    "compute": {
        "ip": "100.67.192.21",
        "url": "http://100.67.192.21:11434",
        "recovery_cmd": "ssh administrator@100.67.192.21 'brew services restart ollama'",
        "max_failures": 3
    },
    "cloud": {
        "ip": "100.107.231.87", 
        "url": "http://100.107.231.87:11434",
        "recovery_cmd": "ssh user@100.107.231.87 'sudo systemctl restart ollama'",
        "max_failures": 3
    }
}

STATE_FILE = Path.home() / "dta/watchdog/state.json"
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")

def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {"failures": {}, "last_check": None}

def save_state(state: dict):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))

def check_node(name: str, config: dict) -> bool:
    """Check if node is healthy via HTTP."""
    try:
        response = requests.get(f"{config['url']}/api/tags", timeout=10)
        return response.status_code == 200
    except:
        return False

def attempt_recovery(name: str, config: dict) -> bool:
    """Try to recover a failed node via SSH."""
    try:
        result = subprocess.run(
            config["recovery_cmd"],
            shell=True,
            capture_output=True,
            timeout=60
        )
        return result.returncode == 0
    except:
        return False

def send_telegram_alert(message: str):
    """Send alert via Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return
    try:
        requests.post(
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage",
            json={"chat_id": TELEGRAM_CHAT_ID, "text": message}
        )
    except:
        pass

def run_watchdog():
    state = load_state()
    state["last_check"] = datetime.now().isoformat()
    
    for name, config in NODES_TO_MONITOR.items():
        healthy = check_node(name, config)
        
        if healthy:
            if name in state["failures"]:
                del state["failures"][name]
            continue
        
        # Node unhealthy
        failures = state["failures"].get(name, 0) + 1
        state["failures"][name] = failures
        
        print(f"[Watchdog] {name} unhealthy (failure #{failures})")
        
        # Attempt recovery
        if attempt_recovery(name, config):
            print(f"[Watchdog] {name} recovery attempted")
        
        # Alert after max failures
        if failures >= config["max_failures"]:
            send_telegram_alert(
                f"🚨 ALERT: {name} has failed {failures} times!\n"
                f"Recovery attempts unsuccessful.\n"
                f"Manual intervention may be required."
            )
    
    save_state(state)
    print(f"[Watchdog] Check complete at {state['last_check']}")

if __name__ == "__main__":
    run_watchdog()
```

**Schedule with launchd (macOS) - runs every 5 minutes:**

**~/Library/LaunchAgents/com.watchdog.plist:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.watchdog</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/YOU/dta/watchdog/watchdog.py</string>
    </array>
    <key>StartInterval</key>
    <integer>300</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/watchdog.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/watchdog.err</string>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.watchdog.plist
```

---

## Step 7: Configure Clawdbot Workspace

Create the agent workspace structure:

```
~/clawd/
├── AGENTS.md          # Agent behavior rules
├── SOUL.md            # Agent personality
├── USER.md            # Info about you
├── MEMORY.md          # Persistent memory
├── TOOLS.md           # Tool reference
├── HEARTBEAT.md       # Periodic check tasks
├── memory/            # Daily logs
│   └── YYYY-MM-DD.md
├── shared-memory/     # Cross-agent state
│   └── *.json
└── scripts/           # Utility scripts
```

**Key files:**

**AGENTS.md** - Tells the agent how to behave
**MEMORY.md** - Persistent knowledge across sessions
**HEARTBEAT.md** - What to check on periodic polls

---

## Step 8: Test Everything

```bash
# Test local node
curl http://localhost:11434/api/tags

# Test compute node (from orchestrator)
curl http://100.x.x.x:11434/api/tags

# Test LLM Gateway
~/dta/gateway/ask "Write a hello world function in Python"

# Test routing
~/dta/gateway/ask "What is 2+2?"  # Should use fast route
~/dta/gateway/ask "Debug this code: def foo(): return bar"  # Should use code route

# Check watchdog state
cat ~/dta/watchdog/state.json
```

---

## Routing Matrix (Example)

| Task Type | Primary Node | Fallback Chain |
|-----------|-------------|----------------|
| Code/Debug | Compute (deepseek-coder) | Orchestrator → Cloud |
| Fast queries | Orchestrator (phi3:mini) | Cloud |
| Reasoning | Compute (qwen2.5:7b) | Cloud → Orchestrator |
| Vision | Cloud API (Kimi/GPT-4V) | (no local fallback) |
| Embeddings | Orchestrator (nomic-embed) | - |

---

## Cost Breakdown

| Component | Cost |
|-----------|------|
| Tailscale | $0 (free for personal) |
| Ollama | $0 (open source) |
| Local hardware | $0 (use what you have) |
| Cloud VM (optional) | $0-103/mo (free tiers available) |
| Clawdbot | $0 (open source) |
| Claude API (optional) | Pay-per-use |

**Total: $0-20/month** depending on API usage

---

## Troubleshooting

### Node not responding
```bash
# Check if Ollama is running
curl http://NODE_IP:11434/api/tags

# Check Tailscale connectivity
tailscale ping NODE_IP

# Restart Ollama
# macOS: brew services restart ollama
# Linux: sudo systemctl restart ollama
```

### Model loading fails
```bash
# Check available RAM
free -h  # Linux
vm_stat | head -5  # macOS

# Remove large models if needed
ollama rm MODEL_NAME

# Pull smaller model
ollama pull phi3:mini
```

### Cross-node connection refused
```bash
# Verify OLLAMA_HOST is set to 0.0.0.0
# Check firewall (UFW, macOS firewall)
# Verify both machines are on Tailscale
```

---

## Next Steps

1. **Add more nodes** - Any machine can join the mesh
2. **Set up admin agents** - Automated security/network/systems monitoring
3. **Create dashboards** - Visualize node health and usage
4. **Integrate cloud APIs** - Add vision models, speech-to-text
5. **Build automation pipelines** - Job search, email processing, etc.

---

## Resources

- [Tailscale Docs](https://tailscale.com/kb)
- [Ollama Docs](https://ollama.com/docs)
- [Clawdbot Docs](https://docs.clawd.bot)
- [Model Library](https://ollama.com/library)

---

*Guide created from production infrastructure running since February 2026.*
*Questions? This is a living document - adapt it to your needs!*
