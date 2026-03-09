# TerminatorBot Deployment Guide

> How to run TerminatorBot in production with monitoring and best practices.

---

## 📋 Prerequisites

- **Python 3.12+** (required)
- **Windows/Linux/macOS** (cross-platform)
- **~2GB RAM** minimum (more for ML training)
- **Stable internet** connection
- **API credentials** for at least one prediction market

---

## 🔧 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd TerminatorBot
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Download NLP Data (Optional)

For sentiment analysis:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger')"
python -m textblob.download_corpora
```

---

## ⚙️ Environment Variables

Create `.env` file from the example:

```bash
cp .env.example .env
```

### Required Variables

```ini
# =============================================================================
# TRADING MODE
# =============================================================================
# PAPER = Paper trading (simulated, no real money)
# LIVE  = Live trading (real money, be careful!)
TRADING_MODE=PAPER

# =============================================================================
# LOGGING
# =============================================================================
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR

# =============================================================================
# PLATFORM CREDENTIALS
# =============================================================================
# At least ONE platform must be configured

# Kalshi (US-regulated)
KALSHI_API_KEY=your_api_key_here
KALSHI_PRIVATE_KEY_PATH=/path/to/kalshi_private.pem

# Polymarket (Crypto/USDC)
POLYMARKET_PRIVATE_KEY=0x...your_eth_private_key...
POLYMARKET_API_KEY=your_api_key
POLYMARKET_API_SECRET=your_api_secret
POLYMARKET_API_PASSPHRASE=your_passphrase

# Betfair (UK)
BETFAIR_USERNAME=your_username
BETFAIR_PASSWORD=your_password
BETFAIR_APP_KEY=your_app_key
BETFAIR_CERT_PATH=/path/to/betfair_certs/

# Limitless
LIMITLESS_API_KEY=your_api_key

# Smarkets
SMARKETS_API_KEY=your_api_key

# =============================================================================
# OPTIONAL ENHANCEMENTS
# =============================================================================
# OpenAI (for LLM market match verification)
OPENAI_API_KEY=sk-...

# News API (for sentiment data)
NEWS_API_KEY=your_news_api_key

# Discord Webhooks (for alerts)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Environment Variable Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `TRADING_MODE` | Yes | `PAPER` or `LIVE` |
| `LOG_LEVEL` | No | `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `KALSHI_API_KEY` | Platform | Kalshi API key |
| `KALSHI_PRIVATE_KEY_PATH` | Platform | Path to Kalshi PEM file |
| `POLYMARKET_PRIVATE_KEY` | Platform | Ethereum private key (hex) |
| `BETFAIR_USERNAME` | Platform | Betfair account username |
| `BETFAIR_APP_KEY` | Platform | Betfair application key |
| `OPENAI_API_KEY` | No | Enables LLM match verification |
| `DISCORD_WEBHOOK_URL` | No | Enables Discord alerts |

---

## 🏃 Running in Paper Mode

Always start with paper trading to validate your setup:

```bash
# Check platform connections
python src/main.py --status

# Expected output:
#   TerminatorBot - Global Prediction Market Exploitation System
#   Trading mode: PAPER
#   kalshi          [OK]
#   polymarket      [FAIL]  <- Missing credentials
#   betfair         [OK]
#   1/3 platforms online
```

### Run Single Scan

```bash
python src/main.py --scan all
```

### Start Continuous Mode

```bash
python src/main.py --continuous
```

---

## 🚀 Production Deployment

### Option 1: Systemd Service (Linux)

Create `/etc/systemd/system/terminatorbot.service`:

```ini
[Unit]
Description=TerminatorBot Prediction Market Trading System
After=network.target

[Service]
Type=simple
User=terminator
WorkingDirectory=/opt/terminatorbot
Environment="PATH=/opt/terminatorbot/venv/bin"
ExecStart=/opt/terminatorbot/venv/bin/python src/main.py --continuous
Restart=always
RestartSec=30

# Safety limits
MemoryMax=4G
CPUQuota=200%

# Logging
StandardOutput=append:/var/log/terminatorbot/stdout.log
StandardError=append:/var/log/terminatorbot/stderr.log

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable terminatorbot
sudo systemctl start terminatorbot

# Check status
sudo systemctl status terminatorbot
sudo journalctl -u terminatorbot -f
```

### Option 2: Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task → "TerminatorBot"
3. Trigger: "When the computer starts"
4. Action: Start a program
   - Program: `C:\path\to\venv\Scripts\python.exe`
   - Arguments: `src\main.py --continuous`
   - Start in: `C:\path\to\TerminatorBot`
5. Finish and set "Run whether user is logged on or not"

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLP data
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger')"

# Copy source
COPY src/ ./src/
COPY .env .

# Run
CMD ["python", "src/main.py", "--continuous"]
```

```bash
# Build
docker build -t terminatorbot .

# Run
docker run -d \
  --name terminatorbot \
  --restart=unless-stopped \
  --env-file .env \
  terminatorbot
```

### Option 4: PM2 (Node.js Process Manager)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
module.exports = {
  apps: [{
    name: 'terminatorbot',
    script: 'python',
    args: 'src/main.py --continuous',
    cwd: '/opt/terminatorbot',
    interpreter: '/opt/terminatorbot/venv/bin/python',
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
  }]
}

# Start
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 Monitoring

### Log Files

| Log | Location | Description |
|-----|----------|-------------|
| Console | stdout | Real-time output |
| Trades | `data/trades.db` | SQLite trade log |
| System | `data/terminator.log` | System events |

### Health Checks

The bot performs self-health checks:

```python
# Circuit breaker states
OPERATIONAL  # Normal operation
WARNING      # 2.5% drawdown, reducing size
LOCKOUT      # 5% drawdown, all trading stopped
SENTRY       # Hourly loss cap hit, paused
```

### Monitoring Commands

```bash
# Check current status
python src/main.py --status

# View recent trades (from SQLite)
sqlite3 data/trades.db "SELECT * FROM trades ORDER BY timestamp DESC LIMIT 10;"

# Watch continuous output
tail -f /var/log/terminatorbot/stdout.log
```

### Discord Alerts

With `DISCORD_WEBHOOK_URL` configured, you'll receive:

- 🚨 Circuit breaker triggers
- 💰 Trade executions
- ⚠️ Drawdown warnings
- 🔍 High-value opportunity alerts

---

## 🔒 Security Best Practices

### 1. Secure API Keys

```bash
# Set restrictive permissions
chmod 600 .env
chmod 600 /path/to/kalshi_private.pem

# Never commit to git
echo ".env" >> .gitignore
echo "*.pem" >> .gitignore
```

### 2. Network Security

- Run behind a firewall
- Use VPN for additional protection
- Whitelist IPs if platforms support it

### 3. Resource Limits

```bash
# Linux: limit memory usage
ulimit -v 4000000  # 4GB max virtual memory

# Or use cgroups/systemd limits
MemoryMax=4G
```

### 4. Backup Strategy

```bash
# Backup trade database daily
cp data/trades.db data/backups/trades_$(date +%Y%m%d).db

# Backup trained models
cp models/*.pkl models/backups/
```

---

## ⚡ Performance Tuning

### Config Adjustments

```python
# config.py

# Reduce scan interval for faster detection
SCAN_INTERVAL_SECONDS = 30  # Default: 60

# Adjust position sizes based on account size
MAX_POSITION_SIZE = 0.01    # 1% for larger accounts
MAX_POSITION_SIZE = 0.05    # 5% for smaller accounts

# More aggressive Kelly for experienced users
KELLY_FRACTION = 0.75       # Default: 0.50
```

### Platform Rate Limits

Be aware of API rate limits:

| Platform | Rate Limit | Recommendation |
|----------|------------|----------------|
| Kalshi | 60/min | 1 req/sec safe |
| Polymarket | 120/min | 2 req/sec safe |
| Betfair | 12/sec | Built-in throttling |

### Memory Optimization

```python
# For low-memory systems, disable ML model
# In main.py, set:
self._alpha_model = None
```

---

## 🔄 Updating

### Standard Update

```bash
# Pull latest
git pull origin main

# Update dependencies
pip install -r requirements.txt --upgrade

# Restart service
sudo systemctl restart terminatorbot
```

### Database Migrations

If schema changes are needed:

```bash
# Backup first
cp data/trades.db data/trades_backup.db

# Apply migration (if provided)
python scripts/migrate_db.py
```

---

## 🐛 Troubleshooting

### Platform Connection Issues

```bash
# Test individual platform
python -c "
from src.platforms.kalshi_broker import KalshiBroker
import asyncio
broker = KalshiBroker()
print(asyncio.run(broker.connect()))
"
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `No platforms connected` | Missing/invalid credentials | Check `.env` file |
| `Circuit breaker: LOCKOUT` | 5% daily drawdown | Wait 24h or restart |
| `Model not loaded` | Missing trained model | Run `--train` |
| `Rate limit exceeded` | Too many API calls | Increase `SCAN_INTERVAL_SECONDS` |

### Reset Circuit Breaker

If stuck in lockout during paper trading:

```python
# In Python console
from src.core.circuit_breaker import PortfolioCircuitBreaker
cb = PortfolioCircuitBreaker(starting_balance=10000)
cb.release_lockout()
```

---

## 📈 Recommended Configuration by Account Size

### Small Account ($100-$1,000)

```ini
TRADING_MODE=PAPER  # Practice first!
MAX_POSITION_SIZE=0.05
KELLY_FRACTION=0.40
DUMB_BET_MIN_VOLUME=100
```

### Medium Account ($1,000-$10,000)

```ini
TRADING_MODE=LIVE
MAX_POSITION_SIZE=0.02
KELLY_FRACTION=0.50
DUMB_BET_MIN_VOLUME=500
```

### Large Account ($10,000+)

```ini
TRADING_MODE=LIVE
MAX_POSITION_SIZE=0.01
KELLY_FRACTION=0.50
MAX_PLATFORM_ALLOCATION=0.30
```

---

## 📞 Support

For issues:

1. Check logs for error messages
2. Review this documentation
3. Check GitHub issues
4. Review `config.py` for parameter explanations

---

## ⚠️ Legal Disclaimer

- Ensure prediction market trading is legal in your jurisdiction
- Never invest more than you can afford to lose
- Past performance does not guarantee future results
- This software is provided "as is" with no warranty
