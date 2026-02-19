# 🧠 AI Infrastructure Portfolio

> Production-grade AI/ML infrastructure demonstrating intelligent model routing, multi-node orchestration, and autonomous systems.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/tommieseals)
[![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)]()

---

## 👋 About This Portfolio

This portfolio showcases real AI infrastructure I've designed and built — systems that are **actively running in production**. All architectures, metrics, and results are from actual deployments.

**What you'll find here:**
- Architecture diagrams and system designs
- Technical documentation and design decisions
- Code snippets demonstrating key patterns
- Performance metrics and results

**What's not here:**
- Complete source code (available upon request for serious inquiries)
- Proprietary implementations
- Sensitive configuration details

---

## 🏗️ Featured Projects

### 1. LLM Gateway - Intelligent Model Router

A production routing engine that distributes AI workloads across multiple models based on query analysis.

<img src="diagrams/llm-routing.svg" alt="LLM Routing" width="700"/>

**Key Features:**
- Smart query classification (code, vision, reasoning, fast)
- Cost-optimized routing (local-first strategy)
- Automatic failover across nodes
- Budget tracking and enforcement

**Results:**
| Metric | Value |
|--------|-------|
| P95 Latency | <500ms |
| Cost Savings | $1K+/year |
| Routing Accuracy | 98% |

**Tech:** Python, Ollama, NVIDIA NIM, OpenRouter

---

### 2. Multi-Node Infrastructure

Three-node distributed AI system with intelligent workload distribution.

<img src="diagrams/infrastructure.svg" alt="Infrastructure" width="700"/>

**Architecture:**
- **Primary Node**: Gateway, monitoring, fast inference
- **Compute Node**: Large models, GPU-accelerated
- **Backup Node**: Failover and redundancy
- **Cloud APIs**: Overflow capacity

**Results:**
| Metric | Value |
|--------|-------|
| Uptime | 99.9% |
| Nodes | 3 local + cloud |
| Monthly Cost | $0 |

**Tech:** Tailscale VPN, SSH orchestration, Ollama

---

### 3. Auto-Healing Monitoring System

Production monitoring with automatic service recovery.

<img src="diagrams/monitoring.svg" alt="Monitoring" width="700"/>

**Features:**
- Health checks every 60 seconds
- Automatic service restart on failure
- Telegram alerts with crash logs
- 10-minute grace period for manual intervention

**Results:**
| Metric | Value |
|--------|-------|
| MTTR | <15 minutes |
| False Positive Rate | <1% |
| Human Intervention | <30 min/week |

**Tech:** Bash, launchd, Telegram Bot API

---

### 4. Multi-Agent Automation Framework

28-agent system for large-scale data processing and workflow automation.

**Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT SWARM (28 Agents)                   │
├─────────────────────────────────────────────────────────────┤
│  Discovery (7)  │  Enrichment (6)  │  Generation (6)        │
│  Execution (5)  │  Support (4)                              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Raw Data   │  →   │ Enriched    │  →   │  Actions    │
│  (1000s/day)│      │ (100s/day)  │      │  (50-100)   │
└─────────────┘      └─────────────┘      └─────────────┘
```

**Results:**
| Metric | Value |
|--------|-------|
| Throughput | 10x improvement |
| Human Time | 30x reduction |
| Uptime | 24/7 autonomous |

**Tech:** Python, asyncio, Playwright, APScheduler

---

## 💡 Code Snippets

### Smart Query Router
```python
def route_query(query: str, context: dict) -> tuple[str, str]:
    """Route query to optimal model based on content analysis."""
    
    # Code detection
    if any(kw in query.lower() for kw in CODE_KEYWORDS):
        return ("compute_node", "code-specialist-model")
    
    # Speed priority
    if any(kw in query.lower() for kw in FAST_KEYWORDS):
        return ("primary_node", "fast-model")
    
    # Vision tasks
    if context.get("has_image") or "image" in query.lower():
        return ("cloud_api", "vision-model")
    
    # Complex reasoning
    if any(kw in query.lower() for kw in REASONING_KEYWORDS):
        return ("compute_node", "reasoning-model")
    
    # Default: local fast model
    return ("primary_node", "fast-model")
```

### Auto-Recovery Logic
```bash
check_and_recover() {
    if ! pgrep -x "$SERVICE" > /dev/null; then
        send_alert "⚠️ $SERVICE is DOWN"
        sleep 600  # 10-minute grace period
        
        if ! pgrep -x "$SERVICE" > /dev/null; then
            restart_service "$SERVICE"
            verify_health && send_alert "✅ $SERVICE recovered"
        fi
    fi
}
```

### Agent Orchestration Pattern
```python
class AgentSwarm:
    def __init__(self, agents: list[Agent]):
        self.agents = {a.role: a for a in agents}
        self.pipeline = Pipeline()
    
    async def process(self, data: dict) -> dict:
        # Discovery → Enrichment → Generation → Execution
        for stage in ["discover", "enrich", "generate", "execute"]:
            stage_agents = [a for a in self.agents.values() 
                          if a.stage == stage]
            data = await asyncio.gather(
                *[agent.process(data) for agent in stage_agents]
            )
        return data
```

---

## 🛠️ Technical Skills Demonstrated

| Category | Technologies |
|----------|-------------|
| **Languages** | Python, Bash, JavaScript |
| **AI/ML** | LLM orchestration, embeddings, NER, prompt engineering |
| **Infrastructure** | Multi-node systems, VPN mesh, SSH automation |
| **DevOps** | Auto-healing, monitoring, cron scheduling |
| **APIs** | OpenAI, Anthropic, NVIDIA NIM, Telegram |
| **Automation** | Playwright, Selenium, web scraping |

---

## 📫 Contact

Interested in discussing these projects or my approach to AI infrastructure?

- **LinkedIn**: [tommieseals](https://linkedin.com/in/tommieseals)
- **Email**: Available upon request
- **Code Review**: Full source available for serious inquiries

---

*All metrics and results are from production systems actively running.*
