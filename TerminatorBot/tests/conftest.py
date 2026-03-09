"""
TerminatorBot - Test Fixtures

Common fixtures for all test modules.
"""

import sys
import os
import pytest

# Ensure src/ is on the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from platforms.base import UnifiedMarket, UnifiedOrder, PlatformBalance


@pytest.fixture
def sample_markets():
    """Create a set of sample markets across platforms for testing."""
    return [
        # Kalshi markets
        UnifiedMarket(
            platform="kalshi",
            market_id="kalshi-btc-100k",
            title="Will Bitcoin exceed $100,000 by end of 2026?",
            category="crypto",
            yes_price=0.65,
            no_price=0.35,
            volume=15000,
            liquidity=5000,
            close_date="2026-12-31T23:59:00Z",
        ),
        UnifiedMarket(
            platform="kalshi",
            market_id="kalshi-trump-approve",
            title="Will Trump approval rating exceed 50% in March?",
            category="politics",
            yes_price=0.30,
            no_price=0.70,
            volume=8000,
            liquidity=3000,
            close_date="2026-03-31T23:59:00Z",
        ),
        UnifiedMarket(
            platform="kalshi",
            market_id="kalshi-easy-no",
            title="Will aliens land on Earth in March 2026?",
            category="science",
            yes_price=0.02,
            no_price=0.98,
            volume=2000,
            liquidity=1000,
            close_date="2026-03-31T23:59:00Z",
        ),
        # Polymarket markets
        UnifiedMarket(
            platform="polymarket",
            market_id="poly-btc-100k",
            title="Bitcoin to exceed $100,000 by end of 2026",
            category="crypto",
            yes_price=0.62,
            no_price=0.38,
            volume=25000,
            liquidity=10000,
            close_date="2026-12-31T23:59:00Z",
        ),
        UnifiedMarket(
            platform="polymarket",
            market_id="poly-trump-approve",
            title="Trump approval rating above 50% in March",
            category="politics",
            yes_price=0.35,
            no_price=0.65,
            volume=12000,
            liquidity=6000,
            close_date="2026-03-31T23:59:00Z",
        ),
        UnifiedMarket(
            platform="polymarket",
            market_id="poly-high-yes",
            title="Will the sun rise tomorrow?",
            category="science",
            yes_price=0.99,
            no_price=0.01,
            volume=500,
            liquidity=200,
            close_date="2026-03-02T23:59:00Z",
        ),
    ]


@pytest.fixture
def arb_markets():
    """Markets specifically designed to have arb opportunities."""
    return [
        UnifiedMarket(
            platform="kalshi",
            market_id="k-arb-1",
            title="Will event X happen?",
            category="misc",
            yes_price=0.40,
            no_price=0.60,
            volume=5000,
            liquidity=2000,
            close_date="2026-06-01T00:00:00Z",
        ),
        UnifiedMarket(
            platform="polymarket",
            market_id="p-arb-1",
            title="Will event X happen?",
            category="misc",
            yes_price=0.65,
            no_price=0.35,
            volume=8000,
            liquidity=3000,
            close_date="2026-06-01T00:00:00Z",
        ),
    ]


@pytest.fixture
def dumb_bet_markets():
    """Markets with extreme probabilities for dumb bet testing."""
    return [
        UnifiedMarket(
            platform="kalshi",
            market_id="dumb-1",
            title="Will the US declare war on Mars?",
            yes_price=0.03,
            no_price=0.97,
            volume=1000,
            liquidity=500,
            close_date="2026-12-31T23:59:00Z",
        ),
        UnifiedMarket(
            platform="kalshi",
            market_id="dumb-2",
            title="Will GDP growth exceed 0% this quarter?",
            yes_price=0.96,
            no_price=0.04,
            volume=3000,
            liquidity=1500,
            close_date="2026-06-30T23:59:00Z",
        ),
        UnifiedMarket(
            platform="kalshi",
            market_id="dumb-low-vol",
            title="Will it rain in Antarctica?",
            yes_price=0.05,
            no_price=0.95,
            volume=50,  # Too low volume
            liquidity=20,
            close_date="2026-12-31T23:59:00Z",
        ),
    ]
