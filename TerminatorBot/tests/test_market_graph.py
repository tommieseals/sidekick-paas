"""
Tests for the Market Graph.
"""

import pytest
from matching.market_graph import MarketGraph
from matching.fuzzy_matcher import MarketMatcher, MatchedPair
from platforms.base import UnifiedMarket


@pytest.fixture
def matcher():
    return MarketMatcher(threshold=85, llm_zone_low=70, max_date_diff_days=7)


@pytest.fixture
def graph(matcher):
    return MarketGraph(matcher=matcher)


@pytest.fixture
def cross_platform_markets():
    """Create markets with arb opportunities across platforms."""
    return [
        # Exact match with arb opportunity
        UnifiedMarket(
            platform="kalshi",
            market_id="k-btc",
            title="Will Bitcoin exceed $100,000?",
            category="crypto",
            yes_price=0.40,
            no_price=0.60,
            volume=5000,
            close_date="2026-12-31T00:00:00Z",
        ),
        UnifiedMarket(
            platform="polymarket",
            market_id="p-btc",
            title="Will Bitcoin exceed $100,000?",
            category="crypto",
            yes_price=0.70,
            no_price=0.30,
            volume=8000,
            close_date="2026-12-31T00:00:00Z",
        ),
        # Another match with smaller edge
        UnifiedMarket(
            platform="kalshi",
            market_id="k-eth",
            title="Will Ethereum exceed $5,000?",
            category="crypto",
            yes_price=0.45,
            no_price=0.55,
            volume=3000,
            close_date="2026-12-31T00:00:00Z",
        ),
        UnifiedMarket(
            platform="polymarket",
            market_id="p-eth",
            title="Will Ethereum exceed $5,000?",
            category="crypto",
            yes_price=0.50,
            no_price=0.50,
            volume=4000,
            close_date="2026-12-31T00:00:00Z",
        ),
    ]


class TestGraphRefresh:
    def test_refresh_builds_pairs(self, graph, cross_platform_markets):
        """Refresh should build matched pairs from markets."""
        graph.refresh(cross_platform_markets)
        
        assert graph.pair_count >= 1

    def test_refresh_clears_old_pairs(self, graph, cross_platform_markets):
        """Refresh should clear old pairs."""
        graph.refresh(cross_platform_markets)
        initial_count = graph.pair_count
        
        # Refresh with fewer markets
        graph.refresh([cross_platform_markets[0]])
        
        # Should have no pairs (only single market)
        assert graph.pair_count == 0

    def test_refresh_with_empty_list(self, graph):
        """Refresh with empty list should result in no pairs."""
        graph.refresh([])
        
        assert graph.pair_count == 0
        assert graph.arb_count == 0


class TestArbOpportunities:
    def test_get_arb_opportunities_returns_profitable(self, graph, cross_platform_markets):
        """Should return pairs with positive arb edge."""
        graph.refresh(cross_platform_markets)
        
        arbs = graph.get_arb_opportunities(min_edge=0.01)
        
        for pair in arbs:
            assert pair.arb_edge >= 0.01

    def test_get_arb_opportunities_sorted_by_edge(self, graph, cross_platform_markets):
        """Arb opportunities should be sorted by edge (highest first)."""
        graph.refresh(cross_platform_markets)
        
        arbs = graph.get_arb_opportunities(min_edge=0.01)
        
        if len(arbs) >= 2:
            for i in range(len(arbs) - 1):
                assert arbs[i].arb_edge >= arbs[i + 1].arb_edge

    def test_get_arb_opportunities_respects_min_edge(self, graph, cross_platform_markets):
        """Should filter out pairs below min_edge."""
        graph.refresh(cross_platform_markets)
        
        # Use a high threshold that might filter some
        arbs = graph.get_arb_opportunities(min_edge=0.20)
        
        for pair in arbs:
            assert pair.arb_edge >= 0.20

    def test_get_arb_opportunities_empty_when_no_arbs(self, graph):
        """Should return empty when no arb opportunities exist."""
        # Markets with same prices = no arb
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-1",
                title="Test event",
                yes_price=0.50,
                no_price=0.50,
                close_date="2026-12-31T00:00:00Z",
            ),
            UnifiedMarket(
                platform="polymarket",
                market_id="p-1",
                title="Test event",
                yes_price=0.50,
                no_price=0.50,
                close_date="2026-12-31T00:00:00Z",
            ),
        ]
        graph.refresh(markets)
        
        # Combined cost = 0.50 + 0.50 = 1.00, no arb
        arbs = graph.get_arb_opportunities(min_edge=0.01)
        assert len(arbs) == 0


class TestAllPairs:
    def test_get_all_pairs_returns_copy(self, graph, cross_platform_markets):
        """get_all_pairs should return a copy of the pairs list."""
        graph.refresh(cross_platform_markets)
        
        pairs1 = graph.get_all_pairs()
        pairs2 = graph.get_all_pairs()
        
        # Should be equal but not same object
        assert pairs1 == pairs2
        assert pairs1 is not pairs2

    def test_get_all_pairs_includes_non_arbs(self, graph):
        """get_all_pairs should include pairs without arb edge."""
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-1",
                title="Same event test",
                yes_price=0.50,
                no_price=0.50,
                close_date="2026-12-31T00:00:00Z",
            ),
            UnifiedMarket(
                platform="polymarket",
                market_id="p-1",
                title="Same event test",
                yes_price=0.50,
                no_price=0.50,
                close_date="2026-12-31T00:00:00Z",
            ),
        ]
        graph.refresh(markets)
        
        # Should have a match even if no arb
        all_pairs = graph.get_all_pairs()
        arb_pairs = graph.get_arb_opportunities(min_edge=0.01)
        
        assert len(all_pairs) >= len(arb_pairs)


class TestCounts:
    def test_pair_count(self, graph, cross_platform_markets):
        """pair_count should match number of pairs."""
        graph.refresh(cross_platform_markets)
        
        assert graph.pair_count == len(graph.get_all_pairs())

    def test_arb_count(self, graph, cross_platform_markets):
        """arb_count should match pairs with positive edge."""
        graph.refresh(cross_platform_markets)
        
        all_pairs = graph.get_all_pairs()
        manual_count = sum(1 for p in all_pairs if p.has_arb)
        
        assert graph.arb_count == manual_count


class TestDefaultMatcher:
    def test_graph_creates_default_matcher(self):
        """Graph should create a default matcher if none provided."""
        graph = MarketGraph(matcher=None)
        
        # Should work without errors
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-1",
                title="Test",
                yes_price=0.50,
                no_price=0.50,
            ),
        ]
        graph.refresh(markets)
        
        assert graph.pair_count == 0  # Single platform = no pairs


class TestEdgeCases:
    def test_single_platform_no_pairs(self, graph):
        """Markets from single platform should produce no pairs."""
        markets = [
            UnifiedMarket(platform="kalshi", market_id="1", title="Test 1"),
            UnifiedMarket(platform="kalshi", market_id="2", title="Test 2"),
        ]
        graph.refresh(markets)
        
        assert graph.pair_count == 0

    def test_unmatching_titles_no_pairs(self, graph):
        """Markets with different titles should not match."""
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-1",
                title="Will event A happen?",
                close_date="2026-12-31T00:00:00Z",
            ),
            UnifiedMarket(
                platform="polymarket",
                market_id="p-1",
                title="Will event B occur?",
                close_date="2026-12-31T00:00:00Z",
            ),
        ]
        graph.refresh(markets)
        
        # These are different events, should not match
        assert graph.pair_count == 0

    def test_three_platforms(self, graph):
        """Should handle markets from three platforms."""
        markets = [
            UnifiedMarket(
                platform="kalshi",
                market_id="k-1",
                title="Will Bitcoin hit 100k?",
                yes_price=0.40,
                close_date="2026-12-31T00:00:00Z",
            ),
            UnifiedMarket(
                platform="polymarket",
                market_id="p-1",
                title="Will Bitcoin hit 100k?",
                yes_price=0.50,
                close_date="2026-12-31T00:00:00Z",
            ),
            UnifiedMarket(
                platform="limitless",
                market_id="l-1",
                title="Will Bitcoin hit 100k?",
                yes_price=0.60,
                close_date="2026-12-31T00:00:00Z",
            ),
        ]
        graph.refresh(markets)
        
        # Should find pairs across all platform combinations
        assert graph.pair_count >= 1
