"""Tests for the Arbitrage Scanner."""

import pytest
from scanners.arbitrage_scanner import ArbitrageScanner
from matching.fuzzy_matcher import MarketMatcher
from matching.market_graph import MarketGraph
from platforms.base import UnifiedMarket


@pytest.fixture
def scanner():
    matcher = MarketMatcher(threshold=85)
    graph = MarketGraph(matcher=matcher)
    return ArbitrageScanner(
        market_graph=graph,
        min_edge=0.02,
        min_liquidity=100,
    )


class TestArbDetection:
    @pytest.mark.asyncio
    async def test_finds_arb_opportunity(self, scanner, arb_markets):
        opps = await scanner.scan(arb_markets)
        # These markets should produce an arb (combined < 1.0)
        # Kalshi YES=0.40, Poly NO=0.35 -> combined=0.75, edge=0.25 gross
        assert len(opps) >= 1
        opp = opps[0]
        assert opp.scanner_type == "arb"
        assert opp.edge_estimate > 0

    @pytest.mark.asyncio
    async def test_no_arb_when_prices_aligned(self, scanner):
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-1",
                title="Same event test",
                yes_price=0.60,
                no_price=0.40,
                volume=5000,
                close_date="2026-06-01T00:00:00Z",
            ),
            UnifiedMarket(
                platform="polymarket",
                market_id="p-1",
                title="Same event test",
                yes_price=0.60,
                no_price=0.40,
                volume=5000,
                close_date="2026-06-01T00:00:00Z",
            ),
        ]
        opps = await scanner.scan(markets)
        # Combined cost = 0.60 + 0.40 = 1.00, no arb
        assert len(opps) == 0

    @pytest.mark.asyncio
    async def test_arb_has_correct_metadata(self, scanner, arb_markets):
        opps = await scanner.scan(arb_markets)
        if opps:
            opp = opps[0]
            assert "platform_a" in opp.raw_data
            assert "platform_b" in opp.raw_data
            assert "net_edge" in opp.raw_data
            assert opp.side == "arb"
            assert opp.urgency == "immediate"

    @pytest.mark.asyncio
    async def test_skips_low_liquidity(self, scanner):
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-low",
                title="Low liquidity test",
                yes_price=0.30,
                no_price=0.70,
                volume=10,  # Very low
                close_date="2026-06-01T00:00:00Z",
            ),
            UnifiedMarket(
                platform="polymarket",
                market_id="p-low",
                title="Low liquidity test",
                yes_price=0.80,
                no_price=0.20,
                volume=10,
                close_date="2026-06-01T00:00:00Z",
            ),
        ]
        opps = await scanner.scan(markets)
        assert len(opps) == 0  # Filtered by min_liquidity
