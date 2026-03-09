# 💰 Project Vault — AI Finance Department

**Status:** ✅ FULLY OPERATIONAL
**Location:** `C:\Users\tommi\clawd\project-vault\`
**Lead:** Bottom Bitch

---

## What It Is

Multi-agent hedge fund system that hunts for money 24/7 across stocks, options, crypto proxies, commodities, and more.

---

## 10 Trading Strategies

| Strategy | Logic | What It Does |
|----------|-------|--------------|
| Deep Value | Burry/DFV | EV/EBITDA screener, insider buying |
| Volatility | Barclays | IV vs RV, selling premium |
| Macro Regression | Cowen | Log regression bands, BTC dominance |
| Contrarian | OpenClaw | Sentiment inversion, Fear & Greed |
| Options | Advanced | Wheel, iron condors, LEAPS, gamma scalping |
| Crypto | Arbitrage | Exchange gaps, DeFi yields (→ stock proxies) |
| Yield Hunting | Income | Dividends, bonds, REITs |
| Predictions | Events | Polymarket, sports betting |
| Commodities | Metals | Gold/silver/energy via ETFs |
| Momentum | Trend | MA crossovers, RSI, sector rotation |

---

## Infrastructure

- **Telegram Alerts** — Trade notifications, daily P&L, risk warnings
- **CLI** — `vault status`, `vault scan`, `vault orders`, `vault pnl`
- **Redis State** — Persistent trade tracking, P&L, kill switch
- **Dashboard** — http://100.88.105.106:8080/project-vault.html

---

## Risk Controls (CANNOT BE OVERRIDDEN)

- Daily loss > 3% → **HALT ALL TRADING**
- Drawdown > 15% → **CLOSE ALL POSITIONS**
- VIX > 35 → **REDUCE EXPOSURE 50%**
- Max position: 10% of portfolio

---

## Tradier API

**Production:** `3tQdWwMQKGqSrRG9bP5w1N0gAukk`
**Sandbox:** Account `VA80461088`, Token `kikIYi4LsL2WGdbfJ4iHPRKIZaEt`

---

## Commands

```bash
cd C:\Users\tommi\clawd\project-vault
vault status              # Portfolio overview
vault scan                # Run all strategies
vault orders              # Pending orders
python run_all_strategies.py  # Execute trades
```

---

## QA Status

✅ 52 bugs fixed, 232 tests passing. All modules verified.
