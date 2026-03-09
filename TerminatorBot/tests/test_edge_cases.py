"""
Edge Case Tests for TerminatorBot.

Tests boundary conditions, error handling, and unusual scenarios.
"""

import pytest
from datetime import datetime, timedelta
from unittest.mock import patch
from core.circuit_breaker import (
    PortfolioCircuitBreaker,
    SystemMode,
    ScannerStatus,
)
from core.position_sizer import (
    PredictionMarketSizer,
    ConvictionLevel,
)
from core.rebalancer import CrossPlatformRebalancer
from platforms.base import PlatformBalance, UnifiedMarket
from matching.fuzzy_matcher import MarketMatcher


class TestCircuitBreakerEdgeCases:
    """Edge cases for the Circuit Breaker."""
    
    @pytest.fixture
    def breaker(self):
        return PortfolioCircuitBreaker(
            starting_balance=10_000.0,
            max_drawdown_pct=0.05,
            max_consecutive_losses=3,
            hourly_loss_cap_pct=0.03,
        )

    def test_exact_drawdown_threshold(self, breaker):
        """Exactly 5% drawdown should trigger lockout."""
        health = breaker.check_health(9_500.0)
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_just_below_drawdown_threshold(self, breaker):
        """4.99% drawdown should not trigger lockout."""
        health = breaker.check_health(9_501.0)
        # Should be in WARNING (>2.5%) but not LOCKOUT
        assert health.is_healthy
        assert health.system_mode in (SystemMode.WARNING, SystemMode.OPERATIONAL)

    def test_zero_balance_handling(self):
        """Zero starting balance should handle gracefully."""
        breaker = PortfolioCircuitBreaker(starting_balance=0.0)
        health = breaker.check_health(0.0)
        # Should not crash, even with division by zero potential
        assert health is not None

    def test_negative_balance_handling(self, breaker):
        """Negative balance should trigger lockout."""
        health = breaker.check_health(-100.0)
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_very_large_balance_increase(self, breaker):
        """Massive profit should update high water mark."""
        health = breaker.check_health(1_000_000.0)
        assert health.is_healthy
        assert health.current_drawdown_pct == 0.0

    def test_scanner_name_case_insensitivity(self, breaker):
        """Scanner names should be case-insensitive."""
        breaker.record_scanner_loss("ARB")
        breaker.record_scanner_loss("Arb")
        breaker.record_scanner_loss("arb")
        
        # All should count toward same scanner
        assert not breaker.is_scanner_enabled("arb")
        assert not breaker.is_scanner_enabled("ARB")

    def test_hourly_loss_cap_exact_threshold(self, breaker):
        """Exactly 3% hourly loss should trigger SENTRY."""
        # Record enough loss to hit 3%
        breaker.record_scanner_loss("test", 300.0)  # 3% of 10k
        
        health = breaker.check_health(10_000.0)
        assert health.system_mode == SystemMode.SENTRY

    def test_multiple_scanners_independent(self, breaker):
        """Disabling one scanner should not affect others."""
        # Disable arb scanner
        for _ in range(3):
            breaker.record_scanner_loss("arb")
        
        assert not breaker.is_scanner_enabled("arb")
        assert breaker.is_scanner_enabled("alpha")
        assert breaker.is_scanner_enabled("dumb_bet")

    def test_position_check_with_zero_equity(self, breaker):
        """Position check with zero equity should be denied."""
        check = breaker.can_take_position(100.0, 0.0)
        # With zero equity, any position is too large
        assert not check.allowed

    def test_lockout_expiry_timing(self, breaker):
        """Lockout should respect exact timing."""
        breaker.engage_lockout("test")
        
        # Manually set lockout to expire 1 hour ago
        breaker._lockout_until = datetime.utcnow() - timedelta(hours=1)
        
        # Next check should clear lockout
        health = breaker.check_health(10_000.0)
        assert health.is_healthy


class TestPositionSizerEdgeCases:
    """Edge cases for the Position Sizer."""
    
    def test_kelly_with_50_50_odds(self):
        """50/50 odds with no edge should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.50,
            market_price=0.50,
        )
        assert f == 0.0

    def test_kelly_with_near_zero_probability(self):
        """Near-zero probability should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.001,
            market_price=0.50,
        )
        assert f == 0.0

    def test_kelly_with_near_one_probability(self):
        """Near-one probability edge case."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.999,
            market_price=0.01,
        )
        # Should be capped at max position size
        assert f <= 0.05  # HIGH_CONVICTION_SIZE

    def test_kelly_with_many_correlated_bets(self):
        """Many correlated bets should reduce size significantly."""
        no_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.70,
            market_price=0.50,
            num_correlated_bets=0,
        )
        many_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.70,
            market_price=0.50,
            num_correlated_bets=10,
        )
        
        # Many correlations should reduce significantly
        assert many_corr < no_corr * 0.5

    def test_arb_size_with_negative_edge(self):
        """Negative edge should return 0."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=-0.05,
        )
        assert size == 0.0

    def test_arb_size_with_zero_equity(self):
        """Zero equity should return 0 size."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=0.0,
            net_edge=0.05,
        )
        assert size == 0.0

    def test_position_size_all_conviction_levels(self):
        """All conviction levels should produce valid results."""
        for level in ConvictionLevel:
            result = PredictionMarketSizer.calculate_position_size(
                equity=10_000.0,
                estimated_prob=0.70,
                market_price=0.50,
                conviction=level,
            )
            assert result is not None
            assert result.conviction == level

    def test_position_size_terminator_conviction(self):
        """TERMINATOR conviction should have highest cap."""
        terminator = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.80,
            market_price=0.50,
            conviction=ConvictionLevel.TERMINATOR,
        )
        low = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.80,
            market_price=0.50,
            conviction=ConvictionLevel.LOW,
        )
        
        assert terminator.allocation_pct >= low.allocation_pct

    def test_kelly_from_history_edge_cases(self):
        """Edge cases for historical Kelly."""
        # Zero loss
        assert PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.60,
            avg_win=100.0,
            avg_loss=0.0,
        ) == 0.0
        
        # Zero win rate
        assert PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.0,
            avg_win=100.0,
            avg_loss=50.0,
        ) == 0.0
        
        # 100% win rate
        assert PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=1.0,
            avg_win=100.0,
            avg_loss=50.0,
        ) == 0.0


class TestMatcherEdgeCases:
    """Edge cases for the Market Matcher."""
    
    @pytest.fixture
    def matcher(self):
        return MarketMatcher(threshold=85, max_date_diff_days=7)

    def test_empty_title(self, matcher):
        """Empty titles should be handled."""
        markets = [
            UnifiedMarket(platform="a", market_id="1", title=""),
            UnifiedMarket(platform="b", market_id="2", title=""),
        ]
        pairs = matcher.find_matches(markets)
        # May or may not match, but should not crash
        assert isinstance(pairs, list)

    def test_very_long_title(self, matcher):
        """Very long titles should be handled."""
        long_title = "Will the " + "extremely " * 100 + "event happen?"
        markets = [
            UnifiedMarket(platform="a", market_id="1", title=long_title),
            UnifiedMarket(platform="b", market_id="2", title=long_title),
        ]
        pairs = matcher.find_matches(markets)
        assert len(pairs) >= 1

    def test_unicode_titles(self, matcher):
        """Unicode characters should be handled."""
        markets = [
            UnifiedMarket(
                platform="a",
                market_id="1",
                title="Will the Yen ¥ exceed expectations?",
            ),
            UnifiedMarket(
                platform="b",
                market_id="2",
                title="Will the Yen ¥ exceed expectations?",
            ),
        ]
        pairs = matcher.find_matches(markets)
        assert len(pairs) >= 1

    def test_special_characters_in_title(self, matcher):
        """Special characters should be handled."""
        markets = [
            UnifiedMarket(
                platform="a",
                market_id="1",
                title="Q&A: Will GDP grow >3%?",
            ),
            UnifiedMarket(
                platform="b",
                market_id="2",
                title="Q&A: Will GDP grow >3%?",
            ),
        ]
        pairs = matcher.find_matches(markets)
        assert isinstance(pairs, list)

    def test_date_at_boundary(self, matcher):
        """Dates exactly at boundary should be compatible."""
        date1 = "2026-01-01T00:00:00Z"
        date2 = "2026-01-08T00:00:00Z"  # 7 days later
        
        assert matcher._dates_compatible(date1, date2)

    def test_date_just_past_boundary(self, matcher):
        """Dates just past boundary should not be compatible."""
        date1 = "2026-01-01T00:00:00Z"
        date2 = "2026-01-09T00:00:00Z"  # 8 days later
        
        assert not matcher._dates_compatible(date1, date2)


class TestRebalancerEdgeCases:
    """Edge cases for the Rebalancer."""
    
    @pytest.fixture
    def rebalancer(self):
        return CrossPlatformRebalancer(
            max_allocation=0.40,
            rebalance_threshold=0.10,
        )

    def test_single_platform_100_percent(self, rebalancer):
        """Single platform at 100% should still work."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=10000, total=10000),
        }
        report = rebalancer.analyze(balances)
        
        assert report.percentages["kalshi"] == 1.0

    def test_many_platforms(self, rebalancer):
        """Many platforms should be handled."""
        balances = {
            f"platform_{i}": PlatformBalance(
                platform=f"platform_{i}",
                available=1000,
                total=1000,
            )
            for i in range(10)
        }
        report = rebalancer.analyze(balances)
        
        assert len(report.allocations) == 10
        assert len(report.multipliers) == 10

    def test_extreme_imbalance(self, rebalancer):
        """Extreme imbalance should be capped."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=9999, total=9999),
            "polymarket": PlatformBalance(platform="polymarket", available=1, total=1),
        }
        report = rebalancer.analyze(balances)
        
        # Multipliers should be capped
        assert report.multipliers["kalshi"] >= 0.5
        assert report.multipliers["polymarket"] <= 1.5


class TestCombinedScenarios:
    """Tests combining multiple components."""
    
    def test_circuit_breaker_blocks_oversized_position(self):
        """Circuit breaker should block positions that exceed limits."""
        breaker = PortfolioCircuitBreaker(
            starting_balance=10_000.0,
            max_drawdown_pct=0.05,
        )
        
        # First, calculate position size
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.90,
            market_price=0.50,
            conviction=ConvictionLevel.TERMINATOR,
        )
        
        # Then check with circuit breaker
        check = breaker.can_take_position(
            result.position_value,
            10_000.0,
            high_conviction=True,
        )
        
        # Should be allowed if within 5% limit
        assert check.allowed == (result.position_value <= 500.0)

    def test_rebalancer_affects_position_sizing(self):
        """Rebalancer multiplier should affect final position size."""
        rebalancer = CrossPlatformRebalancer()
        
        # Create imbalanced allocations
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=8000, total=8000),
            "polymarket": PlatformBalance(platform="polymarket", available=2000, total=2000),
        }
        report = rebalancer.analyze(balances)
        
        # Calculate position with multiplier
        multiplier = rebalancer.get_multiplier("kalshi")
        
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.70,
            market_price=0.50,
            platform_multiplier=multiplier,
        )
        
        # Over-allocated platform should have reduced position
        result_normal = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.70,
            market_price=0.50,
            platform_multiplier=1.0,
        )
        
        assert result.position_value <= result_normal.position_value
