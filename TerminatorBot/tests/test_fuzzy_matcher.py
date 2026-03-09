"""Tests for the Fuzzy Market Matcher."""

import pytest
from matching.fuzzy_matcher import MarketMatcher, MatchedPair
from platforms.base import UnifiedMarket


@pytest.fixture
def matcher():
    return MarketMatcher(threshold=85, llm_zone_low=70, max_date_diff_days=7)


class TestTitleNormalization:
    def test_prefix_removal(self, matcher):
        # Note: $100k expands to 100000 for better numeric comparison
        assert matcher._normalize_title("Will Bitcoin exceed $100k?") == "bitcoin exceed 100000"
        assert matcher._normalize_title("Will the Fed raise rates?") == "fed raise rates"
        assert matcher._normalize_title("Is inflation above 3%?") == "inflation above 3"

    def test_case_insensitive(self, matcher):
        assert matcher._normalize_title("BITCOIN") == matcher._normalize_title("bitcoin")

    def test_punctuation_removal(self, matcher):
        norm = matcher._normalize_title("Will GDP grow? (yes/no)")
        assert "?" not in norm
        assert "(" not in norm


class TestDateCompatibility:
    def test_same_date(self, matcher):
        assert matcher._dates_compatible(
            "2026-12-31T00:00:00Z",
            "2026-12-31T23:59:00Z",
        )

    def test_close_dates(self, matcher):
        assert matcher._dates_compatible(
            "2026-12-28T00:00:00Z",
            "2026-12-31T00:00:00Z",
        )

    def test_far_dates(self, matcher):
        assert not matcher._dates_compatible(
            "2026-06-01T00:00:00Z",
            "2026-12-31T00:00:00Z",
        )

    def test_missing_dates(self, matcher):
        assert matcher._dates_compatible(None, "2026-12-31T00:00:00Z")
        assert matcher._dates_compatible("2026-12-31T00:00:00Z", None)
        assert matcher._dates_compatible(None, None)


class TestMatching:
    def test_finds_cross_platform_matches(self, matcher, sample_markets):
        pairs = matcher.find_matches(sample_markets)
        assert len(pairs) > 0
        # BTC markets should match
        btc_pairs = [p for p in pairs if "bitcoin" in p.market_a.title.lower() or "bitcoin" in p.market_b.title.lower()]
        assert len(btc_pairs) >= 1

    def test_no_same_platform_matches(self, matcher, sample_markets):
        pairs = matcher.find_matches(sample_markets)
        for pair in pairs:
            assert pair.market_a.platform != pair.market_b.platform

    def test_single_platform_returns_empty(self, matcher):
        markets = [
            UnifiedMarket(platform="kalshi", market_id="1", title="Test 1"),
            UnifiedMarket(platform="kalshi", market_id="2", title="Test 2"),
        ]
        pairs = matcher.find_matches(markets)
        assert pairs == []

    def test_arb_edge_calculation(self, matcher, arb_markets):
        pairs = matcher.find_matches(arb_markets)
        assert len(pairs) >= 1
        # With exact same title, should get 100% match
        pair = pairs[0]
        assert pair.similarity_score == 100.0
        assert pair.arb_edge != 0  # Should have some edge


class TestMatchedPair:
    def test_has_arb(self):
        m1 = UnifiedMarket(platform="a", market_id="1", title="Test", yes_price=0.40, no_price=0.60)
        m2 = UnifiedMarket(platform="b", market_id="2", title="Test", yes_price=0.65, no_price=0.35)

        pair = MatchedPair(
            market_a=m1, market_b=m2,
            similarity_score=100, llm_verified=False,
            combined_yes_cost=0.75, arb_edge=0.25,
            direction="buy_yes_a_no_b",
        )
        assert pair.has_arb

    def test_no_arb(self):
        pair = MatchedPair(
            market_a=UnifiedMarket(platform="a", market_id="1", title="T"),
            market_b=UnifiedMarket(platform="b", market_id="2", title="T"),
            similarity_score=90, llm_verified=False,
            combined_yes_cost=1.05, arb_edge=-0.05,
            direction="buy_yes_a_no_b",
        )
        assert not pair.has_arb
