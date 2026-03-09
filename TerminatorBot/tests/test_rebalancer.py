"""
Tests for the Cross-Platform Capital Rebalancer.
"""

import pytest
from core.rebalancer import CrossPlatformRebalancer, AllocationReport
from platforms.base import PlatformBalance


@pytest.fixture
def rebalancer():
    return CrossPlatformRebalancer(
        max_allocation=0.40,
        rebalance_threshold=0.10,
    )


class TestAllocationAnalysis:
    def test_balanced_allocation_three_platforms(self, rebalancer):
        """Three platforms with equal allocation should be balanced (33% each < 40% cap)."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=3333, total=3333),
            "polymarket": PlatformBalance(platform="polymarket", available=3333, total=3333),
            "limitless": PlatformBalance(platform="limitless", available=3334, total=3334),
        }
        report = rebalancer.analyze(balances)
        
        assert report.is_balanced
        assert report.total_equity == 10000
        assert len(report.warnings) == 0

    def test_two_platforms_equal_triggers_warning(self, rebalancer):
        """Two platforms with equal 50% allocation exceeds 40% cap."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=5000, total=5000),
            "polymarket": PlatformBalance(platform="polymarket", available=5000, total=5000),
        }
        report = rebalancer.analyze(balances)
        
        # 50% > 40% cap, so not balanced
        assert not report.is_balanced
        assert report.total_equity == 10000
        assert report.percentages["kalshi"] == pytest.approx(0.5)
        assert report.percentages["polymarket"] == pytest.approx(0.5)
        assert len(report.warnings) > 0

    def test_over_allocated_platform(self, rebalancer):
        """Platform exceeding 40% should trigger warning and reduced multiplier."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=8000, total=8000),
            "polymarket": PlatformBalance(platform="polymarket", available=2000, total=2000),
        }
        report = rebalancer.analyze(balances)
        
        assert not report.is_balanced
        assert report.percentages["kalshi"] == pytest.approx(0.8)
        assert len(report.warnings) > 0
        assert report.multipliers["kalshi"] < 1.0  # Should be reduced
        assert report.multipliers["polymarket"] >= 1.0  # Should be normal or increased

    def test_under_allocated_platform_boosted(self, rebalancer):
        """Under-allocated platform should get a sizing boost."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=7000, total=7000),
            "polymarket": PlatformBalance(platform="polymarket", available=3000, total=3000),
        }
        report = rebalancer.analyze(balances)
        
        # polymarket is 30%, target is 50%, difference is 20% > 10% threshold
        assert report.multipliers["polymarket"] > 1.0

    def test_single_platform(self, rebalancer):
        """Single platform should have multiplier of 1.0."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=10000, total=10000),
        }
        report = rebalancer.analyze(balances)
        
        # Single platform exceeds 40% cap but there's nowhere else to go
        assert report.percentages["kalshi"] == 1.0

    def test_three_platforms(self, rebalancer):
        """Three platforms should have target of 33% each."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=4000, total=4000),
            "polymarket": PlatformBalance(platform="polymarket", available=3000, total=3000),
            "limitless": PlatformBalance(platform="limitless", available=3000, total=3000),
        }
        report = rebalancer.analyze(balances)
        
        assert report.total_equity == 10000
        # Kalshi at 40% = max_allocation, on the edge
        assert report.percentages["kalshi"] == pytest.approx(0.4)

    def test_empty_balances(self, rebalancer):
        """Empty balances should return empty report."""
        report = rebalancer.analyze({})
        
        assert report.total_equity == 0
        assert report.is_balanced
        assert report.allocations == {}

    def test_zero_balance(self, rebalancer):
        """Zero total balance should return warning."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=0, total=0),
            "polymarket": PlatformBalance(platform="polymarket", available=0, total=0),
        }
        report = rebalancer.analyze(balances)
        
        assert report.total_equity == 0
        assert len(report.warnings) > 0


class TestMultiplierRetrieval:
    def test_get_multiplier_after_analyze(self, rebalancer):
        """Multiplier should be available after analyze."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=5000, total=5000),
            "polymarket": PlatformBalance(platform="polymarket", available=5000, total=5000),
        }
        rebalancer.analyze(balances)
        
        assert rebalancer.get_multiplier("kalshi") == 1.0
        assert rebalancer.get_multiplier("polymarket") == 1.0

    def test_get_multiplier_before_analyze(self, rebalancer):
        """Should return 1.0 if no analysis has been done."""
        assert rebalancer.get_multiplier("kalshi") == 1.0
        assert rebalancer.get_multiplier("unknown") == 1.0

    def test_get_multiplier_case_insensitive(self, rebalancer):
        """Platform name lookup should be case-insensitive."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=5000, total=5000),
        }
        rebalancer.analyze(balances)
        
        # Both lowercase and original should work
        assert rebalancer.get_multiplier("KALSHI") == rebalancer.get_multiplier("kalshi")


class TestReportProperties:
    def test_allocation_report_structure(self, rebalancer):
        """AllocationReport should have all required fields."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=5000, total=5000),
        }
        report = rebalancer.analyze(balances)
        
        assert isinstance(report, AllocationReport)
        assert hasattr(report, "total_equity")
        assert hasattr(report, "allocations")
        assert hasattr(report, "percentages")
        assert hasattr(report, "multipliers")
        assert hasattr(report, "is_balanced")
        assert hasattr(report, "warnings")

    def test_last_report_stored(self, rebalancer):
        """analyze() should store the report for later retrieval."""
        assert rebalancer.last_report is None
        
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=5000, total=5000),
        }
        report = rebalancer.analyze(balances)
        
        assert rebalancer.last_report == report


class TestMultiplierCapping:
    def test_multiplier_min_cap(self, rebalancer):
        """Multiplier should not go below 0.5."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=9500, total=9500),
            "polymarket": PlatformBalance(platform="polymarket", available=500, total=500),
        }
        report = rebalancer.analyze(balances)
        
        assert report.multipliers["kalshi"] >= 0.5

    def test_multiplier_max_cap(self, rebalancer):
        """Multiplier should not exceed 1.5."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=9000, total=9000),
            "polymarket": PlatformBalance(platform="polymarket", available=1000, total=1000),
        }
        report = rebalancer.analyze(balances)
        
        assert report.multipliers["polymarket"] <= 1.5


class TestEdgeCases:
    def test_very_small_balances(self, rebalancer):
        """Should handle very small balances without division errors."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=0.01, total=0.01),
            "polymarket": PlatformBalance(platform="polymarket", available=0.01, total=0.01),
        }
        report = rebalancer.analyze(balances)
        
        assert report.total_equity == pytest.approx(0.02)

    def test_negative_balance_handling(self, rebalancer):
        """Negative balances should be handled gracefully."""
        balances = {
            "kalshi": PlatformBalance(platform="kalshi", available=-100, total=-100),
            "polymarket": PlatformBalance(platform="polymarket", available=500, total=500),
        }
        # This should not raise an exception
        report = rebalancer.analyze(balances)
        assert report is not None
