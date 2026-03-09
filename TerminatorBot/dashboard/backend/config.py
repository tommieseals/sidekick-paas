"""
Dashboard Backend Configuration
"""
import os
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"

# Database paths
TRADE_LOGS_DB = DATA_DIR / "trade_logs.db"
HISTORICAL_DB = DATA_DIR / "historical.db"
MARKET_CACHE_DB = DATA_DIR / "market_cache.db"

# Training metrics
TRAINING_METRICS_PATH = MODELS_DIR / "training_metrics.json"

# Strategy configuration (from main config.py)
STRATEGY_CONFIG = {
    "alpha": {
        "name": "Alpha (ML)",
        "min_edge": 0.05,  # 5%
        "confidence_threshold": 0.70,
        "description": "ML-based alpha signals"
    },
    "contrarian": {
        "name": "Contrarian",
        "consensus_threshold": 0.85,  # 85%
        "bias_adjustment": 0.15,  # 15%
        "description": "Bets against extreme consensus"
    },
    "dumb_bet": {
        "name": "Dumb Bet",
        "max_prob": 0.10,  # 10%
        "min_volume": 500,
        "description": "Targets overpriced longshots"
    },
    "arbitrage": {
        "name": "Arbitrage",
        "min_edge": 0.02,  # 2%
        "min_liquidity": 100,
        "description": "Cross-platform arbitrage"
    }
}

# Risk parameters
RISK_CONFIG = {
    "max_drawdown_pct": 0.05,  # 5%
    "max_consecutive_losses": 3,
    "hourly_loss_cap_pct": 0.03,  # 3%
    "kelly_fraction": 0.50,
    "max_position_size": 0.02,  # 2%
    "lockout_hours": 24
}

# Platform configuration
PLATFORMS = {
    "kalshi": {"name": "Kalshi", "fee": 0.003},
    "polymarket": {"name": "Polymarket", "fee": 0.001},
    "betfair": {"name": "Betfair", "fee": 0.05},
    "limitless": {"name": "Limitless", "fee": 0.002}
}

# Paper trading starting balance
PAPER_STARTING_BALANCE = 10000

# API Settings
API_HOST = "0.0.0.0"
API_PORT = 8765
CORS_ORIGINS = [
    "http://localhost:3000", 
    "http://localhost:5173", 
    "http://127.0.0.1:3000",
    "http://100.88.105.106:8080",
    "http://100.88.105.106",
    "https://tommies-mac-mini-1.tail2157ab.ts.net",
    "*"  # Allow all for now
]
