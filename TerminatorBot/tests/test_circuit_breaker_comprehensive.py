"""
Comprehensive tests for the Portfolio Circuit Breaker.

Covers all risk scenarios:
- Daily drawdown (5% limit)
- Hourly loss cap (3% limit)
- Consecutive losses per scanner (3 loss limit)
- Position sizing limits (2% standard, 5% high conviction)
- Per-platform drawdown (10% limit)
- Lockout management and expiry
"""

import pytest
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

from core.circuit_breaker import (
    PortfolioCircuitBreaker,
    SystemMode,
    ScannerStatus,
    HealthCheck,
    PositionCheck,
    _ScannerRecord,
    _HourlyTracker,
)


# ═══════════════════════════════════════════════════════════════════════════════
# FIXTURES
# ═══════════════════════════════════════════════════════════════════════════════

@pytest.fixture
def breaker():
    """Standard circuit breaker with $10k balance."""
    return PortfolioCircuitBreaker(
        starting_balance=10_000.0,
        max_drawdown_pct=0.05,          # 5%
        max_position_size=0.02,          # 2%
        high_conviction_size=0.05,       # 5%
        max_consecutive_losses=3,
        lockout_hours=24,
        hourly_loss_cap_pct=0.03,        # 3%
    )


@pytest.fixture
def small_breaker():
    """Breaker with smaller limits for edge case testing."""
    return PortfolioCircuitBreaker(
        starting_balance=1_000.0,
        max_drawdown_pct=0.10,           # 10%
        max_position_size=0.05,          # 5%
        high_conviction_size=0.10,       # 10%
        max_consecutive_losses=2,
        lockout_hours=1,
        hourly_loss_cap_pct=0.05,        # 5%
    )


# ═══════════════════════════════════════════════════════════════════════════════
# DATACLASS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestHealthCheckDataclass:
    """Test the HealthCheck frozen dataclass."""

    def test_creation(self):
        hc = HealthCheck(
            is_healthy=True,
            current_drawdown_pct=0.025,
            reason="Test",
            system_mode=SystemMode.WARNING,
        )
        assert hc.is_healthy is True
        assert hc.current_drawdown_pct == 0.025
        assert hc.reason == "Test"
        assert hc.system_mode == SystemMode.WARNING

    def test_immutable(self):
        hc = HealthCheck(True, 0.0, "OK", SystemMode.OPERATIONAL)
        with pytest.raises(AttributeError):
            hc.is_healthy = False


class TestPositionCheckDataclass:
    """Test the PositionCheck frozen dataclass."""

    def test_creation(self):
        pc = PositionCheck(allowed=True, max_position_value=500.0, reason="OK")
        assert pc.allowed is True
        assert pc.max_position_value == 500.0

    def test_immutable(self):
        pc = PositionCheck(True, 100.0, "test")
        with pytest.raises(AttributeError):
            pc.allowed = False


class TestScannerRecordDataclass:
    """Test the internal _ScannerRecord dataclass."""

    def test_defaults(self):
        rec = _ScannerRecord()
        assert rec.consecutive_losses == 0
        assert rec.total_wins == 0
        assert rec.total_losses == 0
        assert rec.status == ScannerStatus.ENABLED
        assert rec.disabled_at is None

    def test_mutable(self):
        rec = _ScannerRecord()
        rec.consecutive_losses = 5
        assert rec.consecutive_losses == 5


class TestHourlyTrackerDataclass:
    """Test the internal _HourlyTracker dataclass."""

    def test_defaults(self):
        tracker = _HourlyTracker()
        assert tracker.pnl == 0.0
        assert isinstance(tracker.window_start, datetime)

    def test_record_adds_pnl(self):
        tracker = _HourlyTracker()
        tracker.record(100.0)
        assert tracker.pnl == 100.0
        tracker.record(-50.0)
        assert tracker.pnl == 50.0

    def test_record_resets_after_hour(self):
        """PnL resets when window expires."""
        old_time = datetime.utcnow() - timedelta(hours=2)
        tracker = _HourlyTracker(pnl=500.0, window_start=old_time)
        tracker.record(100.0)
        # After reset, only new amount should be there
        assert tracker.pnl == 100.0


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH CHECK TESTS - DRAWDOWN SCENARIOS
# ═══════════════════════════════════════════════════════════════════════════════

class TestDrawdownScenarios:
    """Test all drawdown-related risk scenarios."""

    def test_zero_drawdown_healthy(self, breaker):
        """Balance at starting = 0% drawdown = healthy."""
        health = breaker.check_health(10_000.0)
        assert health.is_healthy
        assert health.current_drawdown_pct == 0.0
        assert health.system_mode == SystemMode.OPERATIONAL

    def test_new_high_water_mark_updates(self, breaker):
        """Gains should update high water mark."""
        breaker.check_health(11_000.0)
        # Now drawdown calculated from $11k
        health = breaker.check_health(10_450.0)  # 5% from $11k = lockout
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_warning_zone_at_half_limit(self, breaker):
        """2.5% drawdown (50% of 5% limit) triggers WARNING."""
        health = breaker.check_health(9_750.0)
        assert health.is_healthy
        assert health.system_mode == SystemMode.WARNING
        assert "warning" in health.reason.lower()

    def test_warning_zone_boundary(self, breaker):
        """Exactly at 2.5% threshold."""
        health = breaker.check_health(9_750.0)  # Exactly 2.5%
        assert health.is_healthy
        assert health.system_mode == SystemMode.WARNING

    def test_just_under_lockout_threshold(self, breaker):
        """4.9% drawdown should still be healthy (warning)."""
        health = breaker.check_health(9_510.0)  # 4.9% drawdown
        assert health.is_healthy
        assert health.system_mode == SystemMode.WARNING

    def test_exact_lockout_threshold(self, breaker):
        """Exactly 5% drawdown triggers lockout."""
        health = breaker.check_health(9_500.0)  # Exactly 5%
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT
        assert "DRAWDOWN BREACH" in health.reason

    def test_severe_drawdown(self, breaker):
        """10% drawdown (beyond limit) triggers lockout."""
        health = breaker.check_health(9_000.0)
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_lockout_persists_after_recovery(self, breaker):
        """Once in lockout, recovery doesn't auto-release."""
        breaker.check_health(9_500.0)  # Trigger lockout
        health = breaker.check_health(12_000.0)  # Big recovery
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_zero_high_water_mark_edge_case(self):
        """Edge case: starting with $0 balance."""
        breaker = PortfolioCircuitBreaker(starting_balance=0.0)
        health = breaker.check_health(100.0)
        # Should handle gracefully
        assert health.is_healthy

    def test_negative_balance_handling(self, breaker):
        """Extreme case: negative balance (margin call scenario)."""
        health = breaker.check_health(-1000.0)
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT


# ═══════════════════════════════════════════════════════════════════════════════
# HOURLY LOSS CAP TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestHourlyLossCap:
    """Test 3% hourly loss cap scenarios."""

    def test_no_hourly_losses_healthy(self, breaker):
        """No losses = healthy."""
        health = breaker.check_health(10_000.0)
        assert health.is_healthy
        assert health.system_mode == SystemMode.OPERATIONAL

    def test_small_hourly_loss_ok(self, breaker):
        """1% hourly loss is acceptable."""
        breaker.record_scanner_loss("test", 100.0)  # 1% of $10k
        health = breaker.check_health(9_900.0)
        assert health.is_healthy

    def test_hourly_loss_cap_breached(self, breaker):
        """3% hourly loss triggers SENTRY mode."""
        # Record losses to breach 3% hourly cap
        breaker.record_scanner_loss("test", 300.0)  # 3% of $10k
        health = breaker.check_health(9_700.0)
        assert not health.is_healthy
        assert health.system_mode == SystemMode.SENTRY
        assert "HOURLY LOSS CAP" in health.reason

    def test_wins_offset_losses_in_hourly(self, breaker):
        """Wins should reduce hourly PnL impact."""
        breaker.record_scanner_loss("test", 200.0)
        breaker.record_scanner_win("test", 100.0)
        # Net hourly loss = $100 = 1%
        health = breaker.check_health(9_900.0)
        assert health.is_healthy

    def test_sentry_mode_blocks_positions(self, breaker):
        """SENTRY mode should block new positions."""
        breaker.record_scanner_loss("test", 350.0)
        breaker.check_health(9_650.0)  # Triggers SENTRY
        
        check = breaker.can_take_position(50.0, 9_650.0)
        assert not check.allowed
        assert "SENTRY" in check.reason


# ═══════════════════════════════════════════════════════════════════════════════
# POSITION SIZING GATE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPositionSizingGate:
    """Test position size limits."""

    def test_small_position_allowed(self, breaker):
        """$50 on $10k (0.5%) should be allowed."""
        check = breaker.can_take_position(50.0, 10_000.0)
        assert check.allowed
        assert check.max_position_value == 200.0  # 2% of $10k

    def test_at_standard_limit(self, breaker):
        """Exactly 2% should be allowed."""
        check = breaker.can_take_position(200.0, 10_000.0)
        assert check.allowed

    def test_over_standard_limit(self, breaker):
        """2.1% should be rejected."""
        check = breaker.can_take_position(210.0, 10_000.0)
        assert not check.allowed
        assert "exceeds" in check.reason.lower()

    def test_high_conviction_allows_larger(self, breaker):
        """High conviction allows up to 5%."""
        check = breaker.can_take_position(450.0, 10_000.0, high_conviction=True)
        assert check.allowed
        assert check.max_position_value == 500.0  # 5% of $10k

    def test_high_conviction_at_limit(self, breaker):
        """Exactly 5% with high conviction."""
        check = breaker.can_take_position(500.0, 10_000.0, high_conviction=True)
        assert check.allowed

    def test_high_conviction_over_limit(self, breaker):
        """5.1% even with high conviction should fail."""
        check = breaker.can_take_position(510.0, 10_000.0, high_conviction=True)
        assert not check.allowed

    def test_zero_equity_rejects(self, breaker):
        """Zero equity should reject all positions."""
        check = breaker.can_take_position(1.0, 0.0)
        assert not check.allowed

    def test_lockout_rejects_all(self, breaker):
        """Lockout mode rejects all positions."""
        breaker.engage_lockout("test")
        check = breaker.can_take_position(1.0, 10_000.0)
        assert not check.allowed
        assert "LOCKOUT" in check.reason

    def test_position_check_shows_max_allowed(self, breaker):
        """Rejected positions show max allowed amount."""
        check = breaker.can_take_position(1000.0, 10_000.0)
        assert not check.allowed
        assert check.max_position_value == 200.0


# ═══════════════════════════════════════════════════════════════════════════════
# SCANNER LOSS TRACKING TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestScannerLossTracking:
    """Test consecutive loss tracking per scanner."""

    def test_scanner_starts_enabled(self, breaker):
        """New scanners should be enabled."""
        assert breaker.is_scanner_enabled("new_scanner")

    def test_one_loss_stays_enabled(self, breaker):
        """Single loss doesn't disable."""
        breaker.record_scanner_loss("arb")
        assert breaker.is_scanner_enabled("arb")

    def test_two_losses_stays_enabled(self, breaker):
        """Two losses don't disable (limit is 3)."""
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        assert breaker.is_scanner_enabled("arb")

    def test_three_losses_disables(self, breaker):
        """Three consecutive losses disable scanner."""
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        assert not breaker.is_scanner_enabled("arb")

    def test_win_resets_loss_streak(self, breaker):
        """A win should reset the consecutive loss counter."""
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_win("arb")
        breaker.record_scanner_loss("arb")
        breaker.record_scanner_loss("arb")
        # Only 2 consecutive after win
        assert breaker.is_scanner_enabled("arb")

    def test_different_scanners_independent(self, breaker):
        """Losses on one scanner don't affect another."""
        breaker.record_scanner_loss("alpha")
        breaker.record_scanner_loss("alpha")
        breaker.record_scanner_loss("alpha")
        assert not breaker.is_scanner_enabled("alpha")
        assert breaker.is_scanner_enabled("dumb_bet")
        assert breaker.is_scanner_enabled("arb")

    def test_scanner_names_case_insensitive(self, breaker):
        """Scanner names should be case-insensitive."""
        breaker.record_scanner_loss("ARB")
        breaker.record_scanner_loss("Arb")
        breaker.record_scanner_loss("arb")
        assert not breaker.is_scanner_enabled("ARB")
        assert not breaker.is_scanner_enabled("arb")

    def test_disabled_scanner_status(self, breaker):
        """Check status is COOLDOWN after disabling."""
        for _ in range(3):
            breaker.record_scanner_loss("test")
        rec = breaker._get_scanner("test")
        assert rec.status == ScannerStatus.COOLDOWN
        assert rec.disabled_at is not None

    def test_loss_tracking_accumulates_totals(self, breaker):
        """Total losses should accumulate even with wins."""
        breaker.record_scanner_loss("test")
        breaker.record_scanner_win("test")
        breaker.record_scanner_loss("test")
        rec = breaker._get_scanner("test")
        assert rec.total_losses == 2
        assert rec.total_wins == 1


# ═══════════════════════════════════════════════════════════════════════════════
# PLATFORM HEALTH TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPlatformHealth:
    """Test per-platform drawdown tracking (10% limit)."""

    def test_first_check_establishes_hwm(self, breaker):
        """First check establishes high water mark."""
        result = breaker.check_platform_health("kalshi", 5000.0)
        assert result is True

    def test_gain_updates_hwm(self, breaker):
        """Balance increase updates high water mark."""
        breaker.check_platform_health("kalshi", 5000.0)
        breaker.check_platform_health("kalshi", 6000.0)
        # 10% of $6k = $600 drawdown limit, exactly 10% triggers failure
        # Test just under 10% (9.9%) which should pass
        result = breaker.check_platform_health("kalshi", 5406.0)  # 9.9% drawdown
        assert result is True

    def test_small_platform_drawdown_ok(self, breaker):
        """5% platform drawdown is acceptable."""
        breaker.check_platform_health("polymarket", 10000.0)
        result = breaker.check_platform_health("polymarket", 9500.0)
        assert result is True

    def test_platform_drawdown_at_limit(self, breaker):
        """10% platform drawdown triggers warning."""
        breaker.check_platform_health("kalshi", 10000.0)
        result = breaker.check_platform_health("kalshi", 9000.0)
        assert result is False

    def test_platform_drawdown_beyond_limit(self, breaker):
        """15% platform drawdown fails check."""
        breaker.check_platform_health("betfair", 10000.0)
        result = breaker.check_platform_health("betfair", 8500.0)
        assert result is False

    def test_platforms_tracked_independently(self, breaker):
        """Each platform has separate drawdown tracking."""
        breaker.check_platform_health("kalshi", 10000.0)
        breaker.check_platform_health("polymarket", 5000.0)
        
        # 12% drawdown on Kalshi
        kalshi_result = breaker.check_platform_health("kalshi", 8800.0)
        # Polymarket unchanged
        poly_result = breaker.check_platform_health("polymarket", 5000.0)
        
        assert kalshi_result is False
        assert poly_result is True

    def test_platform_names_case_insensitive(self, breaker):
        """Platform names should be case-insensitive."""
        breaker.check_platform_health("KALSHI", 10000.0)
        result = breaker.check_platform_health("kalshi", 8900.0)
        assert result is False


# ═══════════════════════════════════════════════════════════════════════════════
# LOCKOUT MANAGEMENT TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestLockoutManagement:
    """Test lockout engagement and release."""

    def test_engage_lockout(self, breaker):
        """Engaging lockout sets mode and reason."""
        breaker.engage_lockout("Test lockout reason")
        assert breaker.system_mode == SystemMode.LOCKOUT
        assert breaker._lockout_reason == "Test lockout reason"
        assert breaker._lockout_until is not None

    def test_lockout_duration(self, breaker):
        """Lockout should last configured hours."""
        breaker.engage_lockout("test")
        expected = datetime.utcnow() + timedelta(hours=24)
        # Allow 1 second tolerance
        assert abs((breaker._lockout_until - expected).total_seconds()) < 1

    def test_manual_release(self, breaker):
        """Manual release should restore operational mode."""
        breaker.engage_lockout("test")
        breaker.release_lockout()
        assert breaker.system_mode == SystemMode.OPERATIONAL
        assert breaker._lockout_until is None
        assert breaker._lockout_reason == ""

    def test_release_when_not_locked(self, breaker):
        """Releasing when not locked should be safe no-op."""
        breaker.release_lockout()  # No error
        assert breaker.system_mode == SystemMode.OPERATIONAL

    def test_lockout_expiry(self, small_breaker):
        """Lockout should auto-expire after configured time."""
        # small_breaker has 1-hour lockout
        small_breaker.engage_lockout("test")
        
        # Mock time to be 2 hours later
        future_time = datetime.utcnow() + timedelta(hours=2)
        with patch('core.circuit_breaker.datetime') as mock_dt:
            mock_dt.utcnow.return_value = future_time
            # Check health should trigger expiry check
            health = small_breaker.check_health(1000.0)
        
        # Should be back to operational
        assert health.is_healthy

    def test_lockout_not_expired_yet(self, breaker):
        """Lockout should persist until expiry time."""
        breaker.engage_lockout("test")
        
        # Mock time to be 12 hours later (before 24hr lockout)
        future_time = datetime.utcnow() + timedelta(hours=12)
        with patch('core.circuit_breaker.datetime') as mock_dt:
            mock_dt.utcnow.return_value = future_time
            mock_dt.side_effect = lambda *args, **kw: datetime(*args, **kw)
            # system_mode property triggers expiry check
            mode = breaker.system_mode
        
        assert mode == SystemMode.LOCKOUT


# ═══════════════════════════════════════════════════════════════════════════════
# DAILY RESET TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestDailyReset:
    """Test daily reset functionality."""

    def test_reset_updates_hwm(self, breaker):
        """Reset updates high water mark to current balance."""
        breaker.check_health(11000.0)  # HWM = $11k
        breaker.reset_daily(9000.0)
        
        # Now HWM should be $9k, so 5% = $450
        health = breaker.check_health(8550.0)
        assert not health.is_healthy  # 5% of $9k triggered

    def test_reset_clears_hourly_tracker(self, breaker):
        """Reset should clear hourly PnL."""
        breaker.record_scanner_loss("test", 200.0)
        breaker.reset_daily(10000.0)
        
        # Hourly should be reset
        assert breaker._hourly.pnl == 0.0

    def test_reset_reenables_cooled_scanners(self, breaker):
        """Reset should re-enable scanners in COOLDOWN."""
        for _ in range(3):
            breaker.record_scanner_loss("alpha")
        assert not breaker.is_scanner_enabled("alpha")
        
        breaker.reset_daily(10000.0)
        assert breaker.is_scanner_enabled("alpha")

    def test_reset_clears_consecutive_losses(self, breaker):
        """Reset should clear consecutive loss counters."""
        for _ in range(3):
            breaker.record_scanner_loss("test")
        breaker.reset_daily(10000.0)
        
        rec = breaker._get_scanner("test")
        assert rec.consecutive_losses == 0
        assert rec.status == ScannerStatus.ENABLED


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION / COMBINED SCENARIOS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCombinedScenarios:
    """Test multiple risk factors combining."""

    def test_drawdown_after_scanner_losses(self, breaker):
        """Scanner losses + drawdown = full lockout."""
        breaker.record_scanner_loss("arb", 500.0)
        breaker.record_scanner_loss("alpha", 200.0)
        
        health = breaker.check_health(9500.0)  # 5% drawdown
        assert not health.is_healthy
        assert health.system_mode == SystemMode.LOCKOUT

    def test_multiple_platforms_all_down(self, breaker):
        """All platforms down should still track independently."""
        breaker.check_platform_health("kalshi", 5000.0)
        breaker.check_platform_health("poly", 5000.0)
        
        assert not breaker.check_platform_health("kalshi", 4400.0)
        assert not breaker.check_platform_health("poly", 4400.0)

    def test_rapid_losses_trigger_hourly_before_daily(self, breaker):
        """Rapid losses should hit hourly cap before daily drawdown."""
        # 3% loss in one hour = hourly cap
        breaker.record_scanner_loss("test", 300.0)
        
        # This triggers hourly cap (SENTRY) not daily (LOCKOUT)
        health = breaker.check_health(9700.0)
        assert health.system_mode == SystemMode.SENTRY

    def test_full_trading_day_simulation(self, breaker):
        """Simulate a typical trading day with wins and losses."""
        # Morning: good start
        breaker.record_scanner_win("arb", 50.0)
        breaker.record_scanner_win("alpha", 30.0)
        health = breaker.check_health(10080.0)
        assert health.is_healthy
        assert health.system_mode == SystemMode.OPERATIONAL
        
        # Midday: some losses
        breaker.record_scanner_loss("dumb_bet", 80.0)
        breaker.record_scanner_loss("alpha", 40.0)
        health = breaker.check_health(9960.0)
        assert health.is_healthy
        
        # Afternoon: more losses
        breaker.record_scanner_loss("arb", 100.0)
        breaker.record_scanner_loss("alpha", 60.0)
        health = breaker.check_health(9800.0)
        assert health.is_healthy  # Still in warning zone
        
        # Position check should still work
        check = breaker.can_take_position(150.0, 9800.0)
        assert check.allowed
