"""Tests for the Portfolio Circuit Breaker."""

import pytest
from core.circuit_breaker import (
    PortfolioCircuitBreaker,
    SystemMode,
    ScannerStatus,
)


@pytest.fixture
def breaker():
    return PortfolioCircuitBreaker(
        starting_balance=10_000.0,
        max_drawdown_pct=0.05,
        max_consecutive_losses=3,
        hourly_loss_cap_pct=0.03,
    )


class TestHealthCheck:
    def test_healthy_portfolio(self, breaker):
        health = breaker.check_health(10_000.0)
        assert health.is_healthy
        assert health.system_mode == SystemMode.OPERATIONAL
        assert health.current_drawdown_pct == 0.0

    def test_new_high_water_mark(self, breaker):
        health = breaker.check_health(11_000.0)
        assert health.is_healthy
        assert health.current_drawdown_pct == 0.0

    def test_warning_zone(self, breaker):
        # Drawdown > 2.5% (50% of 5% limit) triggers WARNING
        health = breaker.check_health(9_700.0)  # 3% drawdown
        assert health.is_healthy
        assert health.system_mode == SystemMode.WARNING

    def test_drawdown_lockout(self, breaker):
        # 5% drawdown should trigger lockout
        health = breaker.check_health(9_500.0)
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_lockout_persists(self, breaker):
        breaker.check_health(9_500.0)  # Trigger lockout
        health = breaker.check_health(10_000.0)  # Even with recovery
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT


class TestPositionSizing:
    def test_allowed_position(self, breaker):
        check = breaker.can_take_position(100.0, 10_000.0)
        assert check.allowed

    def test_position_too_large(self, breaker):
        # 2% limit = $200 on $10k
        check = breaker.can_take_position(300.0, 10_000.0)
        assert not check.allowed

    def test_high_conviction_larger(self, breaker):
        # 5% limit = $500 on $10k
        check = breaker.can_take_position(400.0, 10_000.0, high_conviction=True)
        assert check.allowed

    def test_lockout_blocks_all(self, breaker):
        breaker.engage_lockout("test lockout")
        check = breaker.can_take_position(10.0, 10_000.0)
        assert not check.allowed


class TestScannerTracking:
    def test_losses_disable_scanner(self, breaker):
        assert breaker.is_scanner_enabled("dumb_bet")

        breaker.record_scanner_loss("dumb_bet")
        breaker.record_scanner_loss("dumb_bet")
        assert breaker.is_scanner_enabled("dumb_bet")

        breaker.record_scanner_loss("dumb_bet")  # 3rd loss
        assert not breaker.is_scanner_enabled("dumb_bet")

    def test_win_resets_streak(self, breaker):
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_win("arb")
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        # Still enabled because win reset the streak
        assert breaker.is_scanner_enabled("arb")

    def test_daily_reset_reenables(self, breaker):
        for _ in range(3):
            breaker.record_scanner_loss("alpha")
        assert not breaker.is_scanner_enabled("alpha")

        breaker.reset_daily(10_000.0)
        assert breaker.is_scanner_enabled("alpha")


class TestPlatformHealth:
    def test_platform_healthy(self, breaker):
        assert breaker.check_platform_health("kalshi", 5_000.0)

    def test_platform_drawdown(self, breaker):
        breaker.check_platform_health("kalshi", 5_000.0)
        assert not breaker.check_platform_health("kalshi", 4_400.0)  # 12% drawdown


class TestLockoutManagement:
    def test_engage_lockout(self, breaker):
        breaker.engage_lockout("test")
        assert breaker.system_mode == SystemMode.LOCKOUT

    def test_release_lockout(self, breaker):
        breaker.engage_lockout("test")
        breaker.release_lockout()
        assert breaker.system_mode == SystemMode.OPERATIONAL
