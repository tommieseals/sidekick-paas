"""Tests for the Dumb Bet Scanner."""

import pytest
from scanners.dumb_bet_scanner import DumbBetScanner
from platforms.base import UnifiedMarket


@pytest.fixture
def scanner():
    return DumbBetScanner(
        max_prob=0.10,
        min_volume=500,
    )


class TestDumbBetDetection:
    @pytest.mark.asyncio
    async def test_finds_cheap_yes(self, scanner, dumb_bet_markets):
        opps = await scanner.scan(dumb_bet_markets)
        # Should find "aliens" market (yes=0.03) and "GDP" market (no=0.04)
        assert len(opps) >= 1
        for opp in opps:
            assert opp.scanner_type == "dumb_bet"
            assert opp.price <= 0.10

    @pytest.mark.asyncio
    async def test_skips_low_volume(self, scanner, dumb_bet_markets):
        opps = await scanner.scan(dumb_bet_markets)
        # "Antarctica" market has volume=50, should be skipped
        market_ids = [opp.market_id for opp in opps]
        assert "dumb-low-vol" not in market_ids

    @pytest.mark.asyncio
    async def test_edge_calculation(self, scanner, dumb_bet_markets):
        opps = await scanner.scan(dumb_bet_markets)
        for opp in opps:
            assert opp.edge_estimate > 0
            assert opp.confidence > 0

    @pytest.mark.asyncio
    async def test_no_opportunities_in_normal_market(self, scanner):
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="normal",
                title="Will it rain tomorrow?",
                yes_price=0.50,
                no_price=0.50,
                volume=5000,
            ),
        ]
        opps = await scanner.scan(markets)
        assert len(opps) == 0


class TestKeywordExclusion:
    @pytest.mark.asyncio
    async def test_excludes_gamified_markets(self):
        scanner = DumbBetScanner(
            max_prob=0.10,
            min_volume=100,
            exclude_keywords=["mention", "word", "parlay"],
        )
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="gamified",
                title="Will Trump mention the word economy?",
                yes_price=0.05,
                no_price=0.95,
                volume=2000,
            ),
        ]
        opps = await scanner.scan(markets)
        assert len(opps) == 0
