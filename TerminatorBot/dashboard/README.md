# TerminatorBot Dashboard

Professional-grade trading dashboard for the TerminatorBot prediction market system.

![Dashboard Preview](docs/dashboard-preview.png)

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or pnpm

### Backend Setup

```bash
cd dashboard/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8765
```

The API will be available at `http://localhost:8765`
- API Docs: `http://localhost:8765/api/docs`
- ReDoc: `http://localhost:8765/api/redoc`

### Frontend Setup

```bash
cd dashboard/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## 📊 Features

### Portfolio Overview
- Real-time portfolio balance
- Daily P&L with trend indicator
- Total P&L since inception
- Current drawdown percentage
- Circuit breaker status (OPERATIONAL / TRIPPED / COOLING_DOWN)

### Strategy Performance Panel
Live status for all 4 trading strategies:

| Strategy | Description | Key Config |
|----------|-------------|------------|
| Alpha (ML) | ML-based alpha signals | 5% min edge, 70% confidence |
| Contrarian | Bets against extreme consensus | 85% consensus threshold |
| Dumb Bet | Targets overpriced longshots | 10% max prob, 500 min vol |
| Arbitrage | Cross-platform arbitrage | 2% min edge, 100 min liq |

### Active Positions Table
- Market name and platform
- Side (YES/NO)
- Entry price vs current price
- Unrealized P&L
- Strategy that found it
- Position size and entry time

### Trade History
- Last 50 trades with strategy filtering
- Entry/Exit prices
- P&L per trade
- Edge at entry

### Opportunity Pipeline
- Current opportunities found but not yet traded
- Edge percentage and confidence
- Reason not traded (position limit, circuit breaker, etc.)

### Platform Status
Connection status for all platforms:
- Kalshi ✅
- Polymarket ❌
- Betfair ❌
- Limitless ❌

### Risk Dashboard
- Current drawdown vs 5% limit
- Consecutive losses count
- Hourly loss vs 3% cap
- Kelly fraction in use
- Position concentration by platform

### P&L Chart
- 30-day cumulative P&L chart
- Daily P&L tooltips
- Color-coded (green/red) based on performance

## 🔧 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/portfolio` | Balance, drawdown, P&L |
| `GET /api/portfolio/pnl-chart` | Historical P&L data |
| `GET /api/strategies` | All 4 strategies status |
| `GET /api/positions` | Active positions |
| `GET /api/trades` | Trade history |
| `GET /api/opportunities` | Opportunity pipeline |
| `GET /api/platforms` | Platform connection status |
| `GET /api/risk` | Risk metrics |
| `GET /api/model-metrics` | ML model performance |
| `GET /api/events` | System events |

## 🎨 Design

- Dark trading terminal theme
- Monospace font (JetBrains Mono)
- Green for profits, red for losses
- Real-time status indicators
- 30-second auto-refresh

## 📁 Project Structure

```
dashboard/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── database.py       # Database service
│   ├── models.py         # Pydantic models
│   ├── config.py         # Configuration
│   └── requirements.txt  # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks (useApi)
│   │   ├── types.ts      # TypeScript types
│   │   ├── App.tsx       # Main app
│   │   └── main.tsx      # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

## 🔒 Security

- CORS configured for localhost only
- No authentication (local use only)
- Read-only database access

## 🛠 Development

### Adding new endpoints

1. Add query method to `database.py`
2. Add Pydantic models to `models.py`
3. Add route to `main.py`
4. Add hook to `hooks/useApi.ts`
5. Create/update component

### Building for production

```bash
# Frontend
cd frontend
npm run build

# Output in frontend/dist/
```

## 📝 License

Part of the TerminatorBot trading system. For personal use only.
