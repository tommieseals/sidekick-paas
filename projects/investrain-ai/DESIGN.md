# Investrain AI - Design Document

## 🎯 Project Overview

**Investrain AI** is a smart investment tracker dashboard that combines financial data visualization with conversational AI. Users can "chat" with their portfolio data, asking questions like:

- "What is my highest-risk asset?"
- "Summarize my performance this month"
- "Which stocks are down more than 5%?"
- "What's my exposure to tech sector?"

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INVESTRAIN AI ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │    Frontend      │     │    Backend       │     │   Data Layer     │   │
│  │                  │     │                  │     │                  │   │
│  │  Next.js 14      │────▶│  Express API     │────▶│  SQLite DB       │   │
│  │  React Charts    │     │  RAG Engine      │     │  Market Cache    │   │
│  │  Tailwind CSS    │◀────│  LLM Interface   │◀────│                  │   │
│  └──────────────────┘     └──────────────────┘     └──────────────────┘   │
│           │                       │                         │             │
│           │                       │                         │             │
│           │              ┌────────┴────────┐               │             │
│           │              │                 │               │             │
│           │         ┌────▼────┐      ┌─────▼─────┐        │             │
│           │         │ Ollama  │      │ Alpha     │        │             │
│           │         │ LLM     │      │ Vantage   │        │             │
│           │         │ (Local) │      │ API       │        │             │
│           │         └─────────┘      └───────────┘        │             │
│           │                                                │             │
│           └────────────────────────────────────────────────┘             │
│                          Real-time Updates                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🧠 RAG (Retrieval-Augmented Generation) System

### How It Works

1. **User Query** → "What's my riskiest holding?"
2. **Context Retrieval** → Fetch portfolio data, prices, volatility metrics
3. **Prompt Construction** → Inject financial context into LLM prompt
4. **LLM Response** → Generate natural language answer with data
5. **Render** → Display with charts/highlights

### Context Injection Template

```
You are a financial analyst assistant. Here is the user's portfolio data:

PORTFOLIO SUMMARY:
- Total Value: $125,432.50
- Daily Change: +$1,234.56 (+0.99%)
- Holdings: 12 positions

HOLDINGS:
| Symbol | Shares | Value | Daily % | Sector |
|--------|--------|-------|---------|--------|
| AAPL   | 50     | $8,750| +1.2%   | Tech   |
| TSLA   | 25     | $6,250| -2.4%   | Auto   |
...

RISK METRICS:
- Portfolio Beta: 1.24
- Highest Volatility: TSLA (σ=45.2%)
- Sector Concentration: 65% Tech

USER QUESTION: {question}

Provide a clear, data-driven answer. Reference specific numbers.
```

## 📦 Tech Stack

### Frontend (Next.js 14)
- **Next.js 14** - App Router, Server Components
- **React 18** - UI framework
- **Recharts** - Financial charts
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **shadcn/ui** - Component library

### Backend (Express + RAG)
- **Express.js** - REST API
- **LangChain** - RAG orchestration
- **Ollama** - Local LLM (qwen2.5:7b or llama2)
- **SQLite** - Portfolio storage
- **node-cache** - Market data caching

### Market Data
- **Alpha Vantage API** - Free stock quotes (25 req/day)
- **Mock Data Fallback** - Demo mode when API exhausted

## 🎨 UI/UX Design

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  💹 INVESTRAIN AI                              [🔍 Search] [⚙️ Settings] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─── PORTFOLIO VALUE ────────────────────────────────────────────────┐│
│  │                                                                     ││
│  │     $125,432.50                    📈 Performance Chart            ││
│  │     ▲ +$1,234.56 (+0.99%)         ┌─────────────────────┐         ││
│  │                                    │    ~~~~/\~~~~       │         ││
│  │     Today's Change                │   /        \        │         ││
│  │                                    │  /          \_/\    │         ││
│  │                                    │ /               \   │         ││
│  │                                    └─────────────────────┘         ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ┌─── HOLDINGS ───────────────────┐  ┌─── SECTOR ALLOCATION ─────────┐│
│  │ AAPL   50 shares   $8,750 +1.2%│  │    ┌────────────────┐         ││
│  │ TSLA   25 shares   $6,250 -2.4%│  │    │   Tech: 65%    │         ││
│  │ GOOGL  10 shares   $14,200+0.8%│  │    │   Finance: 20% │ (Pie)   ││
│  │ MSFT   30 shares   $12,300+1.5%│  │    │   Healthcare: 15%│       ││
│  │ ...                            │  │    └────────────────┘         ││
│  └────────────────────────────────┘  └───────────────────────────────┘│
│                                                                         │
│  ┌─── AI ASSISTANT ──────────────────────────────────────────────────┐│
│  │                                                                     ││
│  │  🤖 Ask me anything about your portfolio...                        ││
│  │                                                                     ││
│  │  User: What's my highest-risk asset?                               ││
│  │                                                                     ││
│  │  AI: Based on your portfolio, **TSLA** has the highest risk       ││
│  │      profile with a volatility (σ) of 45.2% and a beta of 1.8.    ││
│  │      It represents 5% of your portfolio ($6,250).                  ││
│  │      Consider: Your tech exposure is already 65%...                ││
│  │                                                                     ││
│  │  ┌─────────────────────────────────────────────────────────────┐  ││
│  │  │ Ask about your portfolio...                              [→]│  ││
│  │  └─────────────────────────────────────────────────────────────┘  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Color Scheme (Financial Theme)

| Color | Use Case | Hex |
|-------|----------|-----|
| Green | Positive change | #10B981 |
| Red | Negative change | #EF4444 |
| Blue | Primary accent | #3B82F6 |
| Dark | Background | #0F172A |
| Slate | Cards/panels | #1E293B |

## 📁 File Structure

```
investrain-ai/
├── DESIGN.md
├── README.md
├── docker-compose.yml
├── Dockerfile
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js              # Express server
│   │   ├── routes/
│   │   │   ├── portfolio.js      # CRUD portfolio
│   │   │   ├── market.js         # Market data
│   │   │   └── chat.js           # AI chat endpoint
│   │   ├── services/
│   │   │   ├── marketData.js     # Alpha Vantage / mock
│   │   │   ├── ragEngine.js      # RAG orchestration
│   │   │   └── llm.js            # Ollama interface
│   │   ├── db/
│   │   │   └── sqlite.js         # Database layer
│   │   └── utils/
│   │       ├── riskMetrics.js    # Beta, volatility calc
│   │       └── prompts.js        # LLM prompt templates
│   └── data/
│       └── mock-prices.json      # Fallback data
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── PortfolioSummary.tsx
│   │   ├── HoldingsTable.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── SectorPieChart.tsx
│   │   ├── AIChat.tsx
│   │   └── ChatMessage.tsx
│   └── lib/
│       ├── api.ts                # API client
│       └── formatters.ts         # Currency/percent
│
└── docs/
    └── architecture.svg
```

## 🔌 API Endpoints

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get full portfolio with current prices |
| POST | `/api/portfolio/holdings` | Add holding |
| PUT | `/api/portfolio/holdings/:id` | Update holding |
| DELETE | `/api/portfolio/holdings/:id` | Remove holding |

### Market Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/quote/:symbol` | Get stock quote |
| GET | `/api/market/history/:symbol` | Get price history |
| GET | `/api/market/batch` | Get multiple quotes |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send question, get AI response |
| GET | `/api/chat/history` | Get chat history |
| POST | `/api/chat/clear` | Clear chat history |

## 🧪 Example AI Queries

### Risk Analysis
```
Q: "What is my highest-risk asset?"
A: "Based on volatility metrics, TSLA has the highest risk with σ=45.2% 
   and beta=1.8. It's 3x more volatile than the S&P 500."

Q: "Am I too exposed to tech?"
A: "Yes, 65% of your portfolio is in technology. The S&P 500 tech 
   weighting is ~28%. Consider diversifying into healthcare or utilities."
```

### Performance
```
Q: "Summarize my performance this month"
A: "Your portfolio is up 4.2% ($5,108) this month:
   - Best performer: NVDA (+12.3%)
   - Worst performer: GOOGL (-3.1%)
   - S&P 500 comparison: +2.8% (you're beating it by 1.4%)"

Q: "Which stocks are down more than 5%?"
A: "Two holdings are down >5% this month:
   1. META: -6.2% (-$890)
   2. NFLX: -5.4% (-$432)"
```

### Recommendations
```
Q: "Should I rebalance?"
A: "Based on your 60/30/10 target allocation:
   - Tech is over by 5% → Consider trimming AAPL
   - Bonds are under by 8% → Add fixed income exposure
   - Cash position is healthy"
```

## 🐳 Docker Configuration

### Services
1. `investrain-app` - Next.js + Express (unified)
2. `ollama` - Local LLM server

### Environment Variables
```env
# Market Data
ALPHA_VANTAGE_KEY=your_key_here
USE_MOCK_DATA=false

# LLM
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=qwen2.5:7b

# Database
DB_PATH=/app/data/portfolio.db

# App
PORT=3000
NODE_ENV=production
```

## 📊 Success Metrics

- [ ] Dashboard loads <2s with cached data
- [ ] AI responds <3s for portfolio queries
- [ ] Charts render smoothly (60fps)
- [ ] Works offline with mock data
- [ ] Mobile-responsive design
- [ ] Docker one-command deploy

## 🔐 Security Considerations

- No real financial credentials stored
- Demo data only (simulated portfolio)
- API keys server-side only
- Rate limiting on endpoints

---

*Design Document v1.0 - Ready for Implementation*
