# 🏗️ INFRASTRUCTURE DASHBOARD - ARCHITECTURE SPECIFICATION

*Created: 2026-02-28 by infra-architect subagent*
*Purpose: Detailed specs for builder agents to create 10 jaw-dropping diagrams*

---

## 🎨 GLOBAL DESIGN PRINCIPLES

### Color Scheme (Sci-Fi Dark Theme)
| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Background | Deep Space | `#0a0e17` | Main canvas |
| Card BG | Dark Blue | `#0d1321` | Container backgrounds |
| Primary Accent | Electric Cyan | `#00ffff` | Active elements, flows |
| Secondary Accent | Neon Purple | `#9d4edd` | Secondary highlights |
| Success | Matrix Green | `#00ff88` | Online, healthy, success |
| Warning | Amber | `#ffa500` | Warnings, medium priority |
| Danger | Red Alert | `#ff3366` | Errors, critical, offline |
| Data Flow | Gradient | `#00ffff → #9d4edd` | Animated data packets |
| Text Primary | White | `#ffffff` | Headers |
| Text Secondary | Silver | `#a0aec0` | Body text |

### Visual Style
- **Glassmorphism** cards with subtle backdrop blur
- **Glow effects** on active/hover states
- **Animated gradients** for data flows
- **Particle systems** for network traffic
- **Pulsing nodes** for live status
- **Connection lines** with flowing dots/dashes
- **NO dead space** — fill with useful data or subtle patterns

### Interaction Patterns
- **Hover:** Expand details, highlight connections
- **Click:** Drill-down modal with full stats
- **Pulse:** Indicate real-time activity
- **Auto-refresh:** Every 30-60 seconds

---

## 📊 DIAGRAM 1: MASTER NETWORK TOPOLOGY

### What It Shows
Complete visual map of the 3-node Tailscale mesh with all external connections.

### Layout
```
                    ┌─────────────────────────────────┐
                    │        EXTERNAL SERVICES         │
                    │  ┌─────┐ ┌─────┐ ┌─────┐        │
                    │  │Cloud│ │APIs │ │CDN  │        │
                    │  │flare│ │     │ │     │        │
                    │  └──┬──┘ └──┬──┘ └──┬──┘        │
                    └─────┼──────┼──────┼────────────┘
                          │      │      │
                    ╔═════╧══════╧══════╧═════════════╗
                    ║     TAILSCALE VPN MESH          ║
                    ║        (100.x.x.x)              ║
                    ╚═══════════════════════════════╚═╝
                          │      │      │
            ┌─────────────┼──────┼──────┼─────────────┐
            │             │      │      │             │
       ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
       │  DELL   │   │MAC MINI │   │ MAC PRO │
       │ Windows │◄──►│  macOS  │◄──►│  macOS  │
       │  Worker │   │   Hub   │   │ Compute │
       └─────────┘   └─────────┘   └─────────┘
```

### Nodes (3D or 2.5D icons)

**Node 1: Mac Mini (HUB)**
- **IP:** 100.88.105.106
- **Icon:** Mini server with glowing antenna
- **Role Badge:** "ORCHESTRATOR"
- **Live Stats to Show:**
  - CPU Load (currently ~2.1)
  - Disk: 19% used (61GB free)
  - Services: Ollama, Gateway, Dashboard, Clawdbot
  - Port 8080 open (dashboard)
- **Glow:** Cyan (primary node)

**Node 2: Mac Pro (COMPUTE)**
- **IP:** 100.101.89.80
- **Icon:** Tower server with heat vents
- **Role Badge:** "COMPUTE"
- **Live Stats to Show:**
  - CPU Load (~3.4)
  - Disk: 6% used (Fort Knox storage)
  - Models: deepseek-coder:6.7b, qwen2.5:7b, llama2
  - Fort Knox backup storage
- **Glow:** Purple (heavy compute)

**Node 3: Dell (WORKER)**
- **IP:** 100.119.87.108
- **Icon:** Desktop tower with Windows logo
- **Role Badge:** "FAILSAFE"
- **Live Stats to Show:**
  - RAM: 63% used
  - Primary workspace
  - Projects: TaskBot, Vault, Pharma
  - CrowdStrike monitored badge
- **Glow:** Green (healthy)

### Connection Lines
- **Tailscale mesh:** Animated dashed lines between all 3 nodes
- **Data packets:** Small glowing dots traveling along lines
- **Latency badges:** Show ping times on each connection
- **Bidirectional arrows:** Show data can flow both ways

### External Services (Top Row)
| Service | Icon | Connection |
|---------|------|------------|
| Cloudflare | Orange shield | → Dell (TaskBot tunnel) |
| OpenRouter | Brain icon | → Mac Mini (LLM API) |
| NVIDIA | Green GPU | → Mac Mini (50 calls/day) |
| Tradier | Dollar sign | → Dell (Project Vault) |
| Telegram | Paper plane | → Mac Mini (Clawdbot) |
| GitHub | Octocat | → All nodes |
| Resend | Mail icon | → Dell (Arbitrage Pharma) |

### Hover Interactions
- **Node hover:** Show expanded stats card
- **Connection hover:** Show bandwidth/latency
- **External service hover:** Show API status/limits

---

## 📊 DIAGRAM 2: CLAWDBOT GATEWAY FLOW

### What It Shows
Complete message lifecycle from Telegram to LLM response.

### Flow Sequence
```
┌────────────┐
│  TELEGRAM  │ ← User sends message
│   CLIENT   │
└─────┬──────┘
      │ 1. Message arrives
      ▼
┌────────────────────────────────────────────────────────┐
│                    CLAWDBOT GATEWAY                     │
│                   (Mac Mini :8080)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │              MESSAGE PARSER                      │   │
│  │  • Extract text, images, commands               │   │
│  │  • Identify context (channel, user, thread)     │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         │ 2. Parsed message             │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              LLM ROUTER (SMART)                  │   │
│  │  • Analyze query type                           │   │
│  │  • Check model availability                     │   │
│  │  • Route to optimal model                       │   │
│  └──────────────────────┬──────────────────────────┘   │
│                         │ 3. Routing decision           │
└─────────────────────────┼──────────────────────────────┘
                          │
     ┌────────────────────┼────────────────────┐
     │                    │                    │
     ▼                    ▼                    ▼
┌─────────┐         ┌─────────┐         ┌─────────┐
│  LOCAL  │         │  CLOUD  │         │  CLOUD  │
│ OLLAMA  │         │ CLAUDE  │         │  OTHER  │
│qwen2.5:3b│        │Opus/Son.│         │NVIDIA/Gem│
└────┬────┘         └────┬────┘         └────┬────┘
     │                    │                    │
     └────────────────────┼────────────────────┘
                          │ 4. LLM response
                          ▼
┌────────────────────────────────────────────────────────┐
│                    TOOL EXECUTOR                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Browser │ │  Exec   │ │  File   │ │ Process │       │
│  │ Control │ │  Shell  │ │ System  │ │  Mgmt   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└──────────────────────────┬─────────────────────────────┘
                           │ 5. Tool results
                           ▼
┌────────────────────────────────────────────────────────┐
│                  RESPONSE FORMATTER                     │
│  • Format for platform (Telegram markdown)              │
│  • Split long messages                                  │
│  • Add reactions/buttons                                │
└──────────────────────────┬─────────────────────────────┘
                           │ 6. Formatted response
                           ▼
                    ┌────────────┐
                    │  TELEGRAM  │ ← Response delivered
                    │   CLIENT   │
                    └────────────┘
```

### Visual Elements
- **Numbered steps** (1-6) with connecting arrows
- **Timing badges:** Show latency at each step
- **Status indicators:** Green checkmarks for success
- **Branching lines:** For LLM routing decision

### Data Points to Show
| Step | Metric |
|------|--------|
| Message received | Timestamp, user, channel |
| Parse time | ~10-50ms |
| Route decision | Model selected, reason |
| LLM latency | 185ms (Ollama) to 3s (Opus) |
| Tool execution | Tool name, duration |
| Total round-trip | Full end-to-end time |

### Hover Interactions
- **LLM boxes:** Show model specs, token limits, costs
- **Tool boxes:** Show available actions
- **Arrows:** Show data being transferred

---

## 📊 DIAGRAM 3: PROJECT VAULT (Trading System)

### What It Shows
10-strategy trading system from market scan to order execution.

### Flow Layout (Horizontal Pipeline)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         💰 PROJECT VAULT - TRADING PIPELINE                  │
└─────────────────────────────────────────────────────────────────────────────┘

    MARKET DATA                STRATEGIES                 RISK MGMT              EXECUTION
    ──────────               ──────────                 ─────────              ─────────
  ┌───────────┐           ┌───────────────┐          ┌───────────┐         ┌───────────┐
  │  TRADIER  │           │               │          │   RISK    │         │  TRADIER  │
  │    API    │──────────►│   10 STRATS   │─────────►│  OFFICER  │────────►│   ORDERS  │
  │  (quotes) │           │               │          │           │         │           │
  └───────────┘           └───────────────┘          └───────────┘         └───────────┘
        │                        │                         │                      │
        │                        ▼                         ▼                      ▼
        │                 ┌─────────────┐          ┌─────────────┐         ┌───────────┐
        │                 │    CFO      │          │    KILL     │         │ TELEGRAM  │
        │                 │  (sizing)   │          │   SWITCH    │         │  ALERTS   │
        │                 └─────────────┘          └─────────────┘         └───────────┘
        │
        ▼
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                           10 TRADING STRATEGIES                            │
  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
  │  │  DEEP   │ │VOLATIL- │ │ MACRO   │ │CONTRAR- │ │ OPTIONS │              │
  │  │  VALUE  │ │   ITY   │ │REGRESS. │ │  IAN    │ │         │              │
  │  │ +3.54%  │ │ +2.76%  │ │ +7.30%  │ │ +1.22%  │ │  Wheel  │              │
  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
  │  │ CRYPTO  │ │  YIELD  │ │PREDICT- │ │COMMODIT-│ │MOMENTUM │              │
  │  │ PROXIES │ │ HUNTING │ │  IONS   │ │   IES   │ │         │              │
  │  │COIN/MSTR│ │DIV/REITs│ │Polymark.│ │Gold/Oil │ │ +1.74%  │              │
  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
  └───────────────────────────────────────────────────────────────────────────┘
```

### Strategy Cards (Show for each)
| Strategy | Backtest Return | Max Drawdown | Win Rate | Asset Class |
|----------|-----------------|--------------|----------|-------------|
| Deep Value | +3.54% | 1.85% | 57.1% | Stocks |
| Volatility | +2.76% | 4.26% | 50.0% | Options |
| Macro Regression | +7.30% | 7.65% | 52.4% | BTC/Stocks |
| Contrarian | +1.22% | 1.15% | 60.0% | Sentiment |
| Options | Varies | - | - | Options |
| Crypto | Varies | - | - | COIN/MSTR |
| Yield Hunting | Varies | - | - | DIV/REITs |
| Predictions | Varies | - | - | Events |
| Commodities | Varies | - | - | GLD/USO |
| Momentum | +1.74% | 3.74% | 45.7% | Sectors |

### Risk Controls (Red Zone)
```
┌─────────────────────────────────────────────────────────┐
│                    🛑 RISK CONTROLS                      │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ DAILY LOSS  │  │  DRAWDOWN   │  │    VIX      │     │
│  │    > 3%     │  │    > 15%    │  │    > 35     │     │
│  │             │  │             │  │             │     │
│  │    HALT     │  │  CLOSE ALL  │  │ REDUCE 50%  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  Max Position: 10% │ Kelly Sizing: ON │ VaR: Active    │
└─────────────────────────────────────────────────────────┘
```

### Data Sources (Left side inputs)
- OpenInsider (insider trades)
- Reddit/WSB sentiment
- SEC filings
- Earnings calendar
- Fear & Greed Index

### Output Targets (Right side)
- Tradier sandbox/production
- Redis state persistence
- Telegram alerts
- Dashboard stats

### Real Data Points
| Metric | Current Value |
|--------|---------------|
| Sandbox Account | VA80461088 |
| Pending Orders | 21+ |
| Strategies Active | 10/10 |
| Kill Switch | OFF |
| Circuit Breakers | Armed |

---

## 📊 DIAGRAM 4: PROJECT LEGION (Job Hunting)

### What It Shows
Event-driven job hunting pipeline from scraping to interview prep.

### Architecture (Event-Driven Flow)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🏴 PROJECT LEGION - JOB HUNTING SWARM                     │
│                         (Event-Driven Pipeline)                              │
└─────────────────────────────────────────────────────────────────────────────┘

  JOB BOARDS                   REDIS QUEUE                    PIPELINE
  ──────────                   ───────────                    ────────

┌───────────┐              ┌───────────────────────────────────────────────────┐
│  INDEED   │──┐           │                   REDIS                           │
│           │  │           │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
└───────────┘  │           │  │qualified│ │researched│ │approved │ │interview│  │
               │           │  │  190    │ │    2    │ │  1234   │ │    6    │  │
┌───────────┐  │  scrape   │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘  │
│ LINKEDIN  │──┼──────────►│       │           │           │           │       │
│           │  │           └───────┼───────────┼───────────┼───────────┼───────┘
└───────────┘  │                   │           │           │           │
               │                   ▼           ▼           ▼           ▼
┌───────────┐  │           ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   DICE    │──┘           │ RESEARCH  │ │  RESUME   │ │SUBMISSION │ │ INTERVIEW │
│           │              │           │ │           │ │           │ │   PREP    │
└───────────┘              │• Dossiers │ │• Tailoring│ │• ATS Auto │ │• STAR     │
                           │• Intel    │ │• Keywords │ │• Forms    │ │• Coaching │
                           └───────────┘ └───────────┘ └───────────┘ └───────────┘
                                 │              │             │             │
                                 └──────────────┴─────────────┴─────────────┘
                                              │
                                    PIPELINE WATCHER
                                    (5-second polling)
                                    Auto-cascades triggers
```

### Department Cards (8 Total)
| Dept | Icon | Function | Status | Auto-Trigger |
|------|------|----------|--------|--------------|
| Headhunting | 🔍 | Job discovery | ✅ Active | Daily 6 AM |
| Research | 📊 | Company intel | ✅ Active | On qualified++ |
| Resume | 📄 | AI tailoring | ✅ Active | On researched++ |
| Submission | 📤 | ATS automation | ✅ Active | On approved++ |
| Marketing | 📣 | LinkedIn content | ✅ Active | Manual |
| Portfolio | 💼 | GitHub showcases | ✅ Active | Manual |
| Analytics | 📈 | Pipeline metrics | ✅ Active | Continuous |
| Interview Prep | 🎤 | STAR coaching | ✅ Active | On interview++ |

### Infrastructure Details
| Component | Location | Status |
|-----------|----------|--------|
| CEO Hub | Mac Mini (100.88.105.106) | 🟢 Online |
| Worker | Mac Pro (100.101.89.80) | 🟢 Online |
| Redis | Mac Mini | 🟢 Running |
| LLM Primary | Claude Sonnet | 🟢 Active |
| LLM Fallback | Ollama llama3.1:8b | 🟡 Standby |

### Pipeline Stats (Live Counters)
```
┌─────────────────────────────────────────────────────────┐
│                    PIPELINE METRICS                      │
│                                                         │
│  QUALIFIED    RESEARCHED    TAILORING    APPROVED       │
│    190           2            60          1234          │
│    ████         █             ███         █████████     │
│                                                         │
│  SUBMITTED    INTERVIEWS    OFFERS                      │
│     6             0            0                         │
│     █             ░            ░                         │
└─────────────────────────────────────────────────────────┘
```

### Scraper Status
| Platform | Status | Last Updated |
|----------|--------|--------------|
| Indeed | ✅ Working | Today |
| LinkedIn | ✅ Working | Today |
| Dice | ✅ Fixed 2026-02-26 | Today |

---

## 📊 DIAGRAM 5: ARBITRAGE PHARMA (Drug Deals)

### What It Shows
Multi-agent pharmaceutical asset discovery and BD pipeline.

### 5-Layer Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🧬 ARBITRAGE PHARMA - DRUG DEAL MACHINE                   │
└─────────────────────────────────────────────────────────────────────────────┘

LAYER 1: HARVESTERS                    DATA SOURCES
━━━━━━━━━━━━━━━━━━                    ━━━━━━━━━━━━
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ PubMed  │ │Clinical │ │  FDA    │ │  Lens   │ │Pipeline │               │
│  │         │ │ Trials  │ │ Orphan  │ │ Patents │ │ Tracker │               │
│  │ Papers  │ │Withdrawn│ │   DB    │ │  IP     │ │Companies│               │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘               │
└───────┼──────────┼──────────┼──────────┼──────────┼─────────────────────────┘
        └──────────┴──────────┴──────────┴──────────┘
                              │
                              ▼
LAYER 2: ALCHEMISTS                    ANALYSIS
━━━━━━━━━━━━━━━━━━                    ━━━━━━━━
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  NPV Calc   │ │Market Sizing│ │  Compound   │ │   Scoring   │           │
│  │             │ │             │ │  Analyzer   │ │   Engine    │           │
│  │ Cash flows  │ │ <200k pts   │ │ Repurpose   │ │   0-100     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
LAYER 3: MOAT BUILDERS                 REGULATORY
━━━━━━━━━━━━━━━━━━━━                 ━━━━━━━━━━
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │   ODD Drafter   │ │  FDA Pathway    │ │   IP Strategy   │               │
│  │                 │ │   Predictor     │ │    Analyzer     │               │
│  │ 7-year monopoly │ │ 505(b)(2)/etc   │ │  Patent gaps    │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
LAYER 4: HUSTLERS                      OUTREACH
━━━━━━━━━━━━━━━━                      ━━━━━━━━
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│  │BD Contacts│ │Cold Email │ │ LinkedIn  │ │Negotiation│                   │
│  │  Finder   │ │ Generator │ │    Bot    │ │   Tree    │                   │
│  │           │ │  Resend   │ │           │ │           │                   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘                   │
│                                                                             │
│  📧 40 emails ready │ 10 BD contacts loaded │ API: re_f5Ti1v1h_...         │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
LAYER 5: CARTOGRAPHERS                 MAPPING
━━━━━━━━━━━━━━━━━━━━                 ━━━━━━━
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │  Investor DB  │ │ Family Office │ │  Deal Flow    │ │   SEC 13F     │   │
│  │   10,000+     │ │   Tracker     │ │   Analyzer    │ │   Parser      │   │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │       CRM       │
                    │   Deal Tracker  │
                    │   Pipeline View │
                    └─────────────────┘
```

### Pipeline Statistics
| Metric | Value |
|--------|-------|
| Total Pipeline | $150M |
| Weighted | $15M |
| Active Deals | 9 |
| Emails Sent | 7 |
| Response Rate | Pending |

### Top 3 Targets
| Compound | Score | Indication | Est. Value |
|----------|-------|------------|------------|
| Tolrestat | 92 | Galactosemia | TBD |
| Mibefradil | 88 | Pulm. Hypertension | TBD |
| Rimonabant | 85 | Prader-Willi | TBD |

### Top Pipeline Deals
| Asset | Value | Status |
|-------|-------|--------|
| figitumumab | $75M | Active |
| danicamtiv | $30M | Active |
| NVS-2847 | $12M | Active |

### Twitter Outreach Status
- **Targets collected:** 45 (goal: 200)
- **Account status:** ⚠️ Needs Rusty to create
- **Key follows:** @eperlste, @BioDueDiligence, @davidkmyang

---

## 📊 DIAGRAM 6: FORT KNOX (Backup System)

### What It Shows
Automated backup lifecycle across all nodes with retention policies.

### Timeline Visualization
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     🏰 FORT KNOX - BACKUP LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    TIME AXIS (Days)
  ◄─────────────────────────────────────────────────────────────────────────►
  DAY 0          DAY 7              DAY 30                    DAY 30+
    │              │                   │                         │
    ▼              ▼                   ▼                         ▼
┌─────────┐   ┌─────────┐        ┌─────────┐              ┌─────────┐
│  HOT    │──►│ STILL   │───────►│COMPRESS │─────────────►│ DELETE  │
│ STORAGE │   │   HOT   │        │& ARCHIVE│              │         │
│         │   │         │        │         │              │   🗑️    │
│ Local   │   │ Local   │        │Mac Pro  │              │ Gone    │
│ Node    │   │ Node    │        │Fort Knox│              │ Forever │
└─────────┘   └─────────┘        └─────────┘              └─────────┘
    │              │                   │
    │    0-7 DAYS  │    7-30 DAYS      │   30+ DAYS
    │   UNCOMPRESSED│   .tar.gz         │   AUTO-DELETED
    │              │                   │
```

### Node Backup Flows
```
┌───────────────┐                          ┌───────────────┐
│   MAC MINI    │                          │   MAC PRO     │
│ 100.88.105.106│                          │ 100.101.89.80 │
│               │         SCP/rsync        │               │
│ ~/backups/    │─────────────────────────►│ ~/fort-knox/  │
│ ~/clawd-vers/ │                          │   backups/    │
│               │                          │   clawd-vers/ │
│   19% used    │                          │   6% used     │
└───────────────┘                          └───────────────┘
        ▲                                         ▲
        │                                         │
        │         ┌───────────────┐               │
        │         │     DELL      │               │
        │         │100.119.87.108 │               │
        └─────────│               │───────────────┘
                  │C:\...\backups\│
                  │               │
                  │  63% RAM used │
                  └───────────────┘
```

### Cron Schedule
| Task | Schedule | Script |
|------|----------|--------|
| Fort Knox Policy | 3 AM Daily | `fort-knox-policy.sh` |
| LaunchD Service | `com.clawd.fort-knox` | Auto-managed |

### Disk Status
| Node | Current Usage | Before Cleanup | Freed |
|------|---------------|----------------|-------|
| Mac Mini | 19% | 100% | 81% |
| Mac Pro | 6% | - | - |
| Dell | OK | - | - |

### What Gets Backed Up
```
Mac Mini:
├── ~/backups/           → Fort Knox after 7 days
├── ~/clawd-versions/    → Fort Knox after 7 days
└── ~/clawd/             → (project files, git managed)

Dell:
├── C:\Users\tommi\clawd\backups\  → Fort Knox
└── Project folders                 → git managed

Mac Pro:
├── ~/fort-knox/backups/      → IS Fort Knox
└── ~/fort-knox/clawd-versions/
```

### Key Metrics
- **Files cleaned tonight:** 697 failed deploy backups (71GB)
- **Policy run time:** ~2 min per node
- **Retention policy:** Strictly enforced

---

## 📊 DIAGRAM 7: SHARED BRAIN (Knowledge Sync)

### What It Shows
Multi-agent knowledge sharing and sync mechanism.

### Architecture
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🧠 SHARED BRAIN - KNOWLEDGE HUB                           │
└─────────────────────────────────────────────────────────────────────────────┘

                           MAC PRO (Central Repository)
                           ┌─────────────────────────────┐
                           │      ~/shared-brain/        │
                           │                             │
                           │  ┌───────┐ ┌───────┐       │
                           │  │HOT.md │ │STATUS │       │
                           │  │ 🔥    │ │  .md  │       │
                           │  └───────┘ └───────┘       │
                           │                             │
                           │  /agents/   /projects/      │
                           │  /tools/    /knowledge/     │
                           │  /prompts/  /scripts/       │
                           │  /skills/   /handoffs/      │
                           │                             │
                           └──────────────┬──────────────┘
                                          │
                     ┌────────────────────┼────────────────────┐
                     │                    │                    │
                     ▼                    │                    ▼
            ┌─────────────────┐           │           ┌─────────────────┐
            │    MAC MINI     │           │           │      DELL       │
            │  ~/clawd/       │◄──────────┴──────────►│ C:\...\clawd\   │
            │  shared-brain/  │      git sync         │ shared-brain\   │
            │                 │                       │                 │
            │ sync-script.sh  │                       │ sync-script.ps1 │
            └─────────────────┘                       └─────────────────┘
                     │                                         │
                     ▼                                         ▼
            ┌─────────────────┐                       ┌─────────────────┐
            │  BOTTOM BITCH   │                       │   CODE BITCH    │
            │    (Agent)      │                       │    (Agent)      │
            └─────────────────┘                       └─────────────────┘
```

### Key Files
| File | Purpose | Read Frequency |
|------|---------|----------------|
| `HOT.md` | 🔥 Current priorities | Every session |
| `INDEX.md` | Quick file lookup | As needed |
| `CHANGELOG.md` | Who changed what | Daily |
| `STATUS.md` | System overview | Every session |

### Directory Structure
```
shared-brain/
├── HOT.md              ← 🔥 ALWAYS READ FIRST
├── INDEX.md            ← Quick lookup
├── CHANGELOG.md        ← Change log
├── STATUS.md           ← Overview
├── agents/             ← Per-bot status files
│   ├── bottom-bitch.md
│   ├── code-bitch.md
│   └── mac-mini-agent.md
├── projects/           ← Project documentation
├── tools/              ← Tool references
├── knowledge/          ← APIs, infra, credentials
├── prompts/            ← Useful prompts
├── scripts/            ← Shared scripts
├── skills/             ← Skill documentation
└── handoffs/           ← Task delegation
```

### Sync Commands
```bash
# Dell (PowerShell)
.\scripts\sync-shared-brain.ps1 pull
.\scripts\sync-shared-brain.ps1 push

# Mac Mini (bash)
~/clawd/scripts/sync-shared-brain.sh pull
~/clawd/scripts/sync-shared-brain.sh push
```

### Agent Communication Flow
1. Agent makes discovery/change
2. Updates local shared-brain file
3. Runs `push` to sync to Mac Pro
4. Other agents run `pull` on next session
5. Knowledge is shared!

---

## 📊 DIAGRAM 8: SECURITY ARCHITECTURE

### What It Shows
Defense layers from external threats to data protection.

### Onion Layers (Defense in Depth)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     🔒 SECURITY ARCHITECTURE                                 │
│                       (Defense in Depth)                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                    EXTERNAL THREATS
                    ┌─────────────────┐
                    │   🌐 INTERNET   │
                    │                 │
                    │ Port scanners   │
                    │ Brute force     │
                    │ Malware         │
                    │ Phishing        │
                    └────────┬────────┘
                             │
                             ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║ LAYER 1: NETWORK PERIMETER                                                 ║
║ ┌─────────────────────────────────────────────────────────────────────┐   ║
║ │                      TAILSCALE VPN                                   │   ║
║ │                                                                      │   ║
║ │  • WireGuard encryption (256-bit)                                    │   ║
║ │  • Zero-trust mesh network                                           │   ║
║ │  • Only 100.x.x.x can access nodes                                   │   ║
║ │  • No open ports to internet                                         │   ║
║ └─────────────────────────────────────────────────────────────────────┘   ║
╚═══════════════════════════════════════════════════════════════════════════╝
                             │
                             ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║ LAYER 2: HOST FIREWALL                                                     ║
║ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               ║
║ │   MAC MINI      │ │    MAC PRO      │ │      DELL       │               ║
║ │ ✅ Firewall ON  │ │ ⚠️ Firewall OFF │ │ ✅ Firewall ON  │               ║
║ │ ✅ Stealth ON   │ │ (needs fixing!) │ │ CrowdStrike     │               ║
║ │ ✅ Block incom. │ │                 │ │ monitored       │               ║
║ └─────────────────┘ └─────────────────┘ └─────────────────┘               ║
╚═══════════════════════════════════════════════════════════════════════════╝
                             │
                             ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║ LAYER 3: APPLICATION AUTH                                                  ║
║ ┌─────────────────────────────────────────────────────────────────────┐   ║
║ │  • SSH key-based auth (no passwords)                                 │   ║
║ │  • Telegram bot token validation                                     │   ║
║ │  • API keys rotated periodically                                     │   ║
║ │  • Browser relay requires tab attachment                             │   ║
║ └─────────────────────────────────────────────────────────────────────┘   ║
╚═══════════════════════════════════════════════════════════════════════════╝
                             │
                             ▼
╔═══════════════════════════════════════════════════════════════════════════╗
║ LAYER 4: DATA PROTECTION                                                   ║
║ ┌─────────────────────────────────────────────────────────────────────┐   ║
║ │  • Git for version control (rollback capability)                     │   ║
║ │  • Fort Knox backups (compressed, offsite)                           │   ║
║ │  • Secrets in SOUL.md (not in git history)                           │   ║
║ │  • MEMORY.md only loaded in main sessions                            │   ║
║ └─────────────────────────────────────────────────────────────────────┘   ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### ⚠️ Known Vulnerabilities
| Issue | Location | Severity | Status |
|-------|----------|----------|--------|
| Firewall OFF | Mac Pro | 🟡 Medium | Needs fixing |
| GitHub secrets | Repo history | 🔴 High | Blocked push |

### Security Checklist
- [x] Tailscale VPN active
- [x] SSH key auth only
- [x] Fort Knox backups
- [ ] Mac Pro firewall
- [x] CrowdStrike on Dell
- [x] No public dashboard

---

## 📊 DIAGRAM 9: LLM ROUTING

### What It Shows
Smart router decision tree for optimal model selection.

### Decision Tree
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     🧠 LLM SMART ROUTER                                      │
│                    (Gateway on Mac Mini)                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │   QUERY     │
                         │  ARRIVES    │
                         └──────┬──────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    ANALYZE QUERY      │
                    │  • Keywords           │
                    │  • Complexity         │
                    │  • Attached files     │
                    │  • Context length     │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼───────┐ ┌─────▼─────┐ ┌───────▼───────┐
        │   IS CODE?    │ │ IS VISION?│ │   IS SIMPLE?  │
        │ code, debug,  │ │ image URL │ │ short, basic  │
        │ function, api │ │ screenshot│ │ lookup        │
        └───────┬───────┘ └─────┬─────┘ └───────┬───────┘
                │               │               │
                ▼               ▼               ▼
        ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
        │   MAC PRO     │ │    CLOUD      │ │   MAC MINI    │
        │               │ │               │ │               │
        │ deepseek-coder│ │  Kimi K2.5    │ │   qwen2.5:3b  │
        │   :6.7b       │ │  (NVIDIA)     │ │   (Ollama)    │
        │               │ │               │ │               │
        │  Code expert  │ │ Vision+Multi  │ │  FREE, fast   │
        └───────────────┘ └───────────────┘ └───────────────┘
                │               │               │
                │               │               │
                │   COMPLEX / LONG DOC?         │
                │               │               │
                │               ▼               │
                │       ┌───────────────┐       │
                │       │   MAC PRO     │       │
                │       │               │       │
                │       │  qwen2.5:7b   │       │
                │       │               │       │
                │       │  Reasoning    │       │
                │       └───────────────┘       │
                │               │               │
                └───────────────┼───────────────┘
                                │
                        FALLBACK CHAIN
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
        │    CLAUDE     │ │    GEMINI     │ │     DELL      │
        │ Opus/Sonnet   │ │    API        │ │  (Failsafe)   │
        │               │ │               │ │               │
        │ Primary for   │ │ Backup        │ │  phi3:mini    │
        │ conversations │ │ multimodal    │ │  Last resort  │
        └───────────────┘ └───────────────┘ └───────────────┘
```

### Model Inventory
| Model | Location | Params | Best For | Latency |
|-------|----------|--------|----------|---------|
| qwen2.5:3b | Mac Mini | 3B | Fast queries | ~185ms |
| deepseek-coder:6.7b | Mac Pro | 6.7B | Code | ~500ms |
| qwen2.5:7b | Mac Pro | 7B | Reasoning | ~800ms |
| llama2 | Mac Pro | 7B | General | ~700ms |
| phi3:mini | Dell | 3.8B | Failsafe | ~6.5s |
| Claude Opus | Cloud | - | Complex tasks | ~3s |
| Claude Sonnet | Cloud | - | Balanced | ~1.5s |
| Kimi K2.5 | NVIDIA | - | Vision/Multi | ~2s |
| Gemini 2.0 | Google | - | Backup | ~2s |

### Routing Rules
```python
if "code" in query.lower():
    return MAC_PRO_DEEPSEEK
elif has_image(query):
    return KIMI_CLOUD
elif len(query) < 100 and is_simple(query):
    return MAC_MINI_OLLAMA
elif is_complex(query):
    return MAC_PRO_QWEN
else:
    return CLAUDE_SONNET
```

### API Limits
| Service | Daily Limit | Current Usage |
|---------|-------------|---------------|
| NVIDIA | 50 calls | Shared |
| Claude | Token-based | Primary |
| Gemini | Paid sub | Unlimited* |

---

## 📊 DIAGRAM 10: MCP SERVER CONNECTIONS

### What It Shows
All MCP (Model Context Protocol) tools and their capabilities.

### Tool Categories
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     🔧 MCP SERVER CONNECTIONS                                │
│                      (Clawdbot Tool System)                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🌐 BROWSER CONTROL (Chrome Extension Relay)                                  │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │                                                                      │     │
│ │  ┌─────────┐     ┌─────────────┐     ┌─────────────┐               │     │
│ │  │CLAWDBOT │────►│   CHROME    │────►│  ANY TAB    │               │     │
│ │  │ GATEWAY │     │ EXTENSION   │     │ (CDP conn)  │               │     │
│ │  └─────────┘     └─────────────┘     └─────────────┘               │     │
│ │                                                                      │     │
│ │  Actions: snapshot │ navigate │ click │ type │ screenshot          │     │
│ │  Profiles: chrome (relay) │ clawd (isolated)                        │     │
│ │  Status: ✅ OPERATIONAL                                              │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 💻 EXEC/SHELL (Command Execution)                                            │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │                                                                      │     │
│ │  ┌─────────┐     ┌─────────────┐     ┌─────────────┐               │     │
│ │  │ COMMAND │────►│    SHELL    │────►│   OUTPUT    │               │     │
│ │  │         │     │ bash/pwsh   │     │   stdout    │               │     │
│ │  └─────────┘     └─────────────┘     └─────────────┘               │     │
│ │                                                                      │     │
│ │  Features: timeout │ background │ PTY │ env vars                    │     │
│ │  Targets: sandbox │ host │ node (via SSH)                           │     │
│ │  Status: ✅ OPERATIONAL                                              │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 📁 FILE SYSTEM (Read/Write/Edit)                                             │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │                                                                      │     │
│ │  ┌─────────┐     ┌─────────────┐     ┌─────────────┐               │     │
│ │  │  READ   │     │   WRITE     │     │    EDIT     │               │     │
│ │  │         │     │             │     │   (patch)   │               │     │
│ │  │ 50KB    │     │  Create/    │     │   Precise   │               │     │
│ │  │ limit   │     │  Overwrite  │     │   surgical  │               │     │
│ │  └─────────┘     └─────────────┘     └─────────────┘               │     │
│ │                                                                      │     │
│ │  Supports: text │ images │ binary (base64)                          │     │
│ │  Status: ✅ OPERATIONAL                                              │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚙️ PROCESS MANAGEMENT                                                        │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │                                                                      │     │
│ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │     │
│ │  │  LIST   │ │  POLL   │ │   LOG   │ │  WRITE  │ │  KILL   │       │     │
│ │  │         │ │         │ │         │ │         │ │         │       │     │
│ │  │Sessions │ │ Status  │ │ stdout  │ │  stdin  │ │Terminate│       │     │
│ │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │     │
│ │                                                                      │     │
│ │  Also: send-keys │ paste │ submit                                   │     │
│ │  Status: ✅ OPERATIONAL                                              │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 WEB TOOLS                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │                                                                      │     │
│ │  ┌─────────────────┐         ┌─────────────────┐                    │     │
│ │  │   WEB SEARCH    │         │   WEB FETCH     │                    │     │
│ │  │   (Brave API)   │         │ (URL → Markdown)│                    │     │
│ │  │                 │         │                 │                    │     │
│ │  │ region, lang,   │         │ extractMode:    │                    │     │
│ │  │ freshness       │         │ markdown/text   │                    │     │
│ │  └─────────────────┘         └─────────────────┘                    │     │
│ │                                                                      │     │
│ │  Status: ✅ OPERATIONAL                                              │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 📱 OTHER TOOLS                                                               │
│ ┌─────────────────────────────────────────────────────────────────────┐     │
│ │                                                                      │     │
│ │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │     │
│ │  │  TTS    │ │ MESSAGE │ │  IMAGE  │ │ CANVAS  │ │  NODES  │       │     │
│ │  │         │ │         │ │         │ │         │ │         │       │     │
│ │  │ElevenLab│ │Telegram │ │ Vision  │ │ Present │ │ Remote  │       │     │
│ │  │ voices  │ │send/del │ │ analyze │ │  HTML   │ │ control │       │     │
│ │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │     │
│ │                                                                      │     │
│ │  Status: ✅ ALL OPERATIONAL                                          │     │
│ └─────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tool Quick Reference
| Tool | Primary Use | Key Actions |
|------|-------------|-------------|
| browser | Automation | snapshot, navigate, click, type |
| exec | Commands | run shell commands |
| Read/Write/Edit | Files | CRUD operations |
| process | Sessions | manage background tasks |
| web_search | Research | Brave search API |
| web_fetch | Scraping | URL to markdown |
| message | Telegram | send, delete, react |
| tts | Voice | text to speech |
| image | Vision | analyze images |
| canvas | Present | HTML display |
| nodes | Infra | node management |

---

## 🎯 LAYOUT RECOMMENDATIONS

### Full Page Layout
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE DASHBOARD                                  │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                        │
│  │Network│ │Gateway│ │Projects││Security│ │ Tools │                        │
│  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐   │
│  │    DIAGRAM 1: NETWORK          │ │   DIAGRAM 2: GATEWAY FLOW       │   │
│  │    (Master Topology)           │ │   (Message lifecycle)           │   │
│  │                                │ │                                 │   │
│  │         [LARGE]                │ │         [LARGE]                 │   │
│  │                                │ │                                 │   │
│  └─────────────────────────────────┘ └─────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐   │
│  │ VAULT (3)      │ │ LEGION (4)     │ │ PHARMA (5)     │ │FORT KNOX(6)│   │
│  │                │ │                │ │                │ │            │   │
│  │   [MEDIUM]     │ │   [MEDIUM]     │ │   [MEDIUM]     │ │  [MEDIUM]  │   │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘   │
│                                                                             │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────┐   │
│  │SHARED BRAIN (7)│ │ SECURITY (8)   │ │LLM ROUTING (9) │ │ MCP (10)   │   │
│  │                │ │                │ │                │ │            │   │
│  │   [MEDIUM]     │ │   [MEDIUM]     │ │   [MEDIUM]     │ │  [MEDIUM]  │   │
│  └────────────────┘ └────────────────┘ └────────────────┘ └────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Alternative: Tab Layout (Current)
- Tab 1: Network + Gateway
- Tab 2: Projects (Vault, Legion, Pharma)
- Tab 3: Infrastructure (Fort Knox, Shared Brain)
- Tab 4: Security + LLM Routing
- Tab 5: Tools (MCP)

### Responsive Considerations
- **Desktop (>1200px):** 2-3 column grid
- **Tablet (768-1200px):** 2 column, stack vertically
- **Mobile (<768px):** Single column, collapsible sections

---

## ⌨️ INTERACTION SPECIFICATIONS

### Global Keyboard Shortcuts
| Key | Action |
|-----|--------|
| 1-5 | Switch tabs |
| R | Refresh data |
| ? | Show help |
| Esc | Close modal |
| ← → | Navigate tabs |

### Click Interactions
| Element | Action |
|---------|--------|
| Node | Open stats modal |
| Connection line | Show bandwidth |
| Service card | Show API details |
| Strategy card | Show backtest results |
| Agent card | Show current task |

### Hover Effects
| Element | Effect |
|---------|--------|
| Node | Glow + expand tooltip |
| Flow line | Highlight full path |
| Button | Scale up 1.05x |
| Card | Lift shadow + border glow |

### Auto-Refresh
- **Global refresh:** Every 60 seconds
- **Node status:** Every 30 seconds
- **Swarm monitor:** Every 15 seconds
- **Pipeline stats:** Every 2 minutes

---

## 📋 BUILDER CHECKLIST

### For Each Diagram, Builder Must:
- [ ] Create SVG/Canvas with animations
- [ ] Add all specified nodes/elements
- [ ] Implement hover interactions
- [ ] Add click drill-down modals
- [ ] Connect to live data endpoints
- [ ] Add auto-refresh
- [ ] Test on mobile

### Live Data Endpoints to Create
| Diagram | Endpoint | Data |
|---------|----------|------|
| Network | `/data/nodes.json` | Node status, IPs, load |
| Gateway | `/data/gateway.json` | Request count, latency |
| Vault | `/data/vault.json` | Positions, P&L, orders |
| Legion | `/data/legion.json` | Pipeline counts |
| Pharma | `/data/pharma.json` | Deal pipeline |
| Fort Knox | `/data/backups.json` | Disk usage, last run |
| Shared Brain | `/data/brain.json` | Sync status |
| Security | `/data/security.json` | Firewall status |
| LLM | `/data/llm.json` | Model usage, routing |
| MCP | `/data/tools.json` | Tool availability |

---

## ✅ SUCCESS CRITERIA

The dashboard is "jaw-dropping" when:
1. **NO dead space** — Every pixel has purpose
2. **10 detailed diagrams** — Each with unique flow visualization
3. **Live data** — Real numbers, not placeholders
4. **Animations** — Data flows, pulses, particles
5. **Interactions** — Click for details, hover for highlights
6. **Mobile works** — Responsive at all sizes
7. **60 FPS** — Smooth animations, no jank
8. **Sci-fi aesthetic** — Dark theme, glows, gradients

---

*This document is the single source of truth for dashboard builders.*
*Last updated: 2026-02-28*
