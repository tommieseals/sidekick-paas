"""
Comprehensive tests for the Kelly Criterion Position Sizer.

Covers all sizing calculations:
- Kelly formula for prediction markets
- Fractional Kelly adjustments
- Correlation penalties
- Arbitrage sizing
- Conviction level caps
- Platform multipliers
- Edge case handling
"""

import pytest
import math

from core.position_sizer import (
    PredictionMarketSizer,
    ConvictionLevel,
    PositionResult,
    _CONVICTION_CAPS,
)


# ═══════════════════════════════════════════════════════════════════════════════
# CONVICTION LEVEL TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestConvictionLevels:
    """Test conviction level enum and caps."""

    def test_all_levels_exist(self):
        """All conviction levels should be defined."""
        assert ConvictionLevel.LOW is not None
        assert ConvictionLevel.STANDARD is not None
        assert ConvictionLevel.HIGH is not None
        assert ConvictionLevel.TERMINATOR is not None

    def test_conviction_caps_ordering(self):
        """Higher conviction = higher cap."""
        assert _CONVICTION_CAPS[ConvictionLevel.LOW] < _CONVICTION_CAPS[ConvictionLevel.STANDARD]
        assert _CONVICTION_CAPS[ConvictionLevel.STANDARD] < _CONVICTION_CAPS[ConvictionLevel.HIGH]
        assert _CONVICTION_CAPS[ConvictionLevel.HIGH] < _CONVICTION_CAPS[ConvictionLevel.TERMINATOR]

    def test_conviction_cap_values(self):
        """Verify expected cap percentages."""
        # LOW = 1%, STANDARD = 2%, HIGH = 3.5%, TERMINATOR = 5%
        assert _CONVICTION_CAPS[ConvictionLevel.LOW] == pytest.approx(0.01, rel=0.01)
        assert _CONVICTION_CAPS[ConvictionLevel.STANDARD] == pytest.approx(0.02, rel=0.01)
        assert _CONVICTION_CAPS[ConvictionLevel.HIGH] == pytest.approx(0.035, rel=0.01)
        assert _CONVICTION_CAPS[ConvictionLevel.TERMINATOR] == pytest.approx(0.05, rel=0.01)


# ═══════════════════════════════════════════════════════════════════════════════
# POSITION RESULT DATACLASS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPositionResultDataclass:
    """Test the PositionResult frozen dataclass."""

    def test_creation(self):
        result = PositionResult(
            conviction=ConvictionLevel.STANDARD,
            equity=10000.0,
            allocation_pct=0.02,
            position_value=200.0,
            max_position_value=500.0,
            kelly_raw=0.04,
            kelly_adjusted=0.02,
            is_valid=True,
        )
        assert result.conviction == ConvictionLevel.STANDARD
        assert result.equity == 10000.0
        assert result.is_valid is True

    def test_immutable(self):
        result = PositionResult(
            ConvictionLevel.LOW, 1000.0, 0.01, 10.0, 50.0, 0.02, 0.01, True
        )
        with pytest.raises(AttributeError):
            result.is_valid = False

    def test_all_fields_accessible(self):
        result = PositionResult(
            conviction=ConvictionLevel.HIGH,
            equity=5000.0,
            allocation_pct=0.03,
            position_value=150.0,
            max_position_value=250.0,
            kelly_raw=0.06,
            kelly_adjusted=0.03,
            is_valid=True,
        )
        assert result.kelly_raw == 0.06
        assert result.kelly_adjusted == 0.03


# ═══════════════════════════════════════════════════════════════════════════════
# KELLY FOR BET - CORE FORMULA TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestKellyForBetCore:
    """Test Kelly formula: f* = (p*b - q) / b"""

    def test_positive_edge_basic(self):
        """When estimate > market price, Kelly should be positive."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.60,
            market_price=0.50,
        )
        assert f > 0

    def test_no_edge_exact_match(self):
        """When estimate == market price, Kelly should be zero."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.50,
            market_price=0.50,
        )
        assert f == 0.0

    def test_negative_edge_returns_zero(self):
        """When estimate < market price, Kelly should be zero (no bet)."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.40,
            market_price=0.50,
        )
        assert f == 0.0

    def test_small_positive_edge(self):
        """Small edge should produce small Kelly."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=1.0,
        )
        # Kelly = (b*p - q) / b where b = (1/0.5) - 1 = 1
        # f* = (1.0 * 0.52 - 0.48) / 1.0 = 0.04
        assert f == pytest.approx(0.04, abs=0.001)

    def test_large_positive_edge(self):
        """Large edge should produce larger Kelly (capped at 5%)."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.90,
            market_price=0.50,
            kelly_fraction=1.0,
        )
        # Would be huge Kelly, but capped at HIGH_CONVICTION_SIZE (0.05)
        assert f == pytest.approx(0.05, rel=0.01)

    def test_kelly_formula_manual_verification(self):
        """Manually verify Kelly formula calculation."""
        # market_price = 0.40 => b = (1/0.40) - 1 = 1.5
        # estimated_prob = 0.55 => q = 0.45
        # f* = (1.5 * 0.55 - 0.45) / 1.5 = (0.825 - 0.45) / 1.5 = 0.25
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.40,
            kelly_fraction=1.0,
        )
        # Capped at 0.05
        assert f == pytest.approx(0.05, rel=0.01)


# ═══════════════════════════════════════════════════════════════════════════════
# KELLY FOR BET - EDGE CASES
# ═══════════════════════════════════════════════════════════════════════════════

class TestKellyForBetEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_zero_estimated_prob(self):
        """Zero probability estimate should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(0.0, 0.50)
        assert f == 0.0

    def test_one_estimated_prob(self):
        """100% probability estimate should return 0 (invalid)."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(1.0, 0.50)
        assert f == 0.0

    def test_zero_market_price(self):
        """Zero market price should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(0.50, 0.0)
        assert f == 0.0

    def test_one_market_price(self):
        """Market price of 1.0 should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(0.50, 1.0)
        assert f == 0.0

    def test_very_small_market_price(self):
        """Very small market price (longshot)."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.05,
            market_price=0.02,
            kelly_fraction=1.0,
        )
        # Small bet size but positive
        assert f > 0
        assert f <= 0.05  # Capped

    def test_very_high_market_price(self):
        """Very high market price (heavy favorite)."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.98,
            market_price=0.95,
            kelly_fraction=1.0,
        )
        # Small edge, Kelly may hit cap
        assert f > 0
        assert f <= 0.05  # May be capped at max

    def test_negative_probability_returns_zero(self):
        """Negative probability (invalid input) should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(-0.1, 0.50)
        assert f == 0.0

    def test_probability_over_one_returns_zero(self):
        """Probability > 1 (invalid input) should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(1.5, 0.50)
        assert f == 0.0


# ═══════════════════════════════════════════════════════════════════════════════
# FRACTIONAL KELLY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestFractionalKelly:
    """Test fractional Kelly adjustments."""

    def test_half_kelly(self):
        """Half Kelly should be approximately half of full Kelly."""
        full = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=1.0,
        )
        half = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=0.5,
        )
        assert half == pytest.approx(full * 0.5, rel=0.01)

    def test_quarter_kelly(self):
        """Quarter Kelly for very conservative sizing."""
        full = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=1.0,
        )
        quarter = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=0.25,
        )
        assert quarter == pytest.approx(full * 0.25, rel=0.01)

    def test_aggressive_kelly_75pct(self):
        """75% Kelly for more aggressive sizing."""
        full = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=1.0,
        )
        aggressive = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.52,
            market_price=0.50,
            kelly_fraction=0.75,
        )
        assert aggressive == pytest.approx(full * 0.75, rel=0.01)

    def test_zero_kelly_fraction(self):
        """Zero Kelly fraction should return 0."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.60,
            market_price=0.50,
            kelly_fraction=0.0,
        )
        assert f == 0.0


# ═══════════════════════════════════════════════════════════════════════════════
# CORRELATION PENALTY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCorrelationPenalty:
    """Test correlation penalty for multiple open positions."""

    def test_no_correlated_bets(self):
        """No correlation penalty when no correlated bets."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=0,
        )
        assert f > 0

    def test_one_correlated_bet(self):
        """One correlated bet reduces size."""
        no_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=0,
        )
        one_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=1,
        )
        assert one_corr < no_corr

    def test_multiple_correlated_bets(self):
        """More correlated bets = more reduction."""
        one_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=1,
        )
        three_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=3,
        )
        assert three_corr < one_corr

    def test_correlation_penalty_floor(self):
        """Correlation penalty should never reduce below 10%."""
        # With many correlated bets, should hit the 10% floor
        heavily_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=10,  # Very heavy correlation
        )
        no_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=0,
        )
        # Should be at least 10% of original
        assert heavily_corr >= no_corr * 0.1 - 0.001


# ═══════════════════════════════════════════════════════════════════════════════
# ARB SIZING TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestArbSizing:
    """Test arbitrage-specific position sizing."""

    def test_viable_arb_positive_size(self):
        """Arb with good edge should produce positive size."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.05,  # 5% edge
        )
        assert size > 0
        assert size <= 10_000 * 0.15  # Max 15%

    def test_tiny_edge_rejected(self):
        """Arb with edge below 1.5% minimum should be rejected."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.01,  # 1% edge < 1.5% minimum
        )
        assert size == 0.0

    def test_edge_at_minimum(self):
        """Arb with edge exactly at 1.5% minimum should be rejected."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.015,  # Exactly 1.5%
        )
        assert size == 0.0  # <= 0.015 is rejected

    def test_edge_above_threshold(self):
        """Arb with meaningful edge should be accepted.
        
        Note: The Kelly formula for arbs is (p*(b+1)-1)/b where b=net_edge.
        With p_success=0.97 (default), need edge > ~3.1% for positive Kelly.
        """
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.05,  # 5% edge produces positive Kelly
        )
        assert size > 0

    def test_scales_with_equity(self):
        """Arb size should scale linearly with equity."""
        small_equity = PredictionMarketSizer.calculate_arb_size(5_000.0, 0.04)
        large_equity = PredictionMarketSizer.calculate_arb_size(50_000.0, 0.04)
        # Should scale roughly 10x
        assert large_equity > small_equity * 8  # Allow some variance

    def test_max_15_percent_cap(self):
        """Even large edges should cap at 15% of equity."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.50,  # Huge 50% edge
        )
        assert size <= 10_000 * 0.15

    def test_lower_success_prob(self):
        """Lower p_success should reduce size."""
        high_p = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.05,
            p_success=0.99,
        )
        low_p = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.05,
            p_success=0.90,
        )
        assert low_p < high_p

    def test_zero_equity(self):
        """Zero equity should return 0."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=0.0,
            net_edge=0.05,
        )
        assert size == 0.0

    def test_zero_edge(self):
        """Zero edge should return 0."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.0,
        )
        assert size == 0.0


# ═══════════════════════════════════════════════════════════════════════════════
# FULL POSITION SIZE PIPELINE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCalculatePositionSize:
    """Test the full position sizing pipeline."""

    def test_basic_standard_conviction(self):
        """Standard conviction with positive edge."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            conviction=ConvictionLevel.STANDARD,
        )
        assert isinstance(result, PositionResult)
        assert result.is_valid
        assert result.position_value > 0
        assert result.conviction == ConvictionLevel.STANDARD

    def test_low_conviction_smaller(self):
        """Low conviction should produce smaller position."""
        low = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            conviction=ConvictionLevel.LOW,
        )
        standard = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            conviction=ConvictionLevel.STANDARD,
        )
        assert low.allocation_pct <= standard.allocation_pct

    def test_high_conviction_larger(self):
        """High conviction allows larger positions."""
        standard = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            conviction=ConvictionLevel.STANDARD,
        )
        high = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            conviction=ConvictionLevel.HIGH,
        )
        assert high.allocation_pct >= standard.allocation_pct

    def test_terminator_conviction_max(self):
        """Terminator conviction allows maximum positions."""
        terminator = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.80,
            market_price=0.50,
            conviction=ConvictionLevel.TERMINATOR,
        )
        assert terminator.allocation_pct <= 0.05  # Max 5%
        assert terminator.is_valid

    def test_zero_equity_invalid(self):
        """Zero equity should produce invalid result."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=0.0,
            estimated_prob=0.60,
            market_price=0.50,
        )
        assert not result.is_valid
        assert result.position_value == 0.0

    def test_negative_equity_invalid(self):
        """Negative equity should produce invalid result."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=-1000.0,
            estimated_prob=0.60,
            market_price=0.50,
        )
        assert not result.is_valid

    def test_no_edge_zero_position(self):
        """No edge should produce zero position."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.50,
            market_price=0.50,
        )
        assert result.position_value == 0.0
        assert not result.is_valid  # Zero position is not valid

    def test_platform_multiplier_reduces(self):
        """Platform multiplier < 1 should reduce position."""
        full = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            platform_multiplier=1.0,
        )
        reduced = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
            platform_multiplier=0.5,
        )
        assert reduced.position_value < full.position_value
        assert reduced.allocation_pct == pytest.approx(full.allocation_pct * 0.5, rel=0.01)

    def test_platform_multiplier_increases(self):
        """Platform multiplier > 1 should increase position (up to cap)."""
        normal = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.52,  # Small edge
            market_price=0.50,
            platform_multiplier=1.0,
        )
        boosted = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.52,
            market_price=0.50,
            platform_multiplier=1.5,
        )
        # Boosted should be larger but still capped
        assert boosted.position_value >= normal.position_value

    def test_kelly_raw_vs_adjusted(self):
        """Kelly raw should be >= adjusted."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.55,
            market_price=0.50,
            kelly_fraction=0.5,
        )
        # Raw is full Kelly, adjusted is fractional
        assert result.kelly_raw >= result.kelly_adjusted

    def test_max_position_value_calculated(self):
        """Max position value should be 5% of equity."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.60,
            market_price=0.50,
        )
        assert result.max_position_value == 500.0  # 5% of $10k


# ═══════════════════════════════════════════════════════════════════════════════
# KELLY FROM HISTORY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestKellyFromHistory:
    """Test classic Kelly from win/loss history."""

    def test_profitable_history(self):
        """Profitable history should produce positive Kelly."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.60,
            avg_win=100.0,
            avg_loss=50.0,
        )
        assert f > 0

    def test_losing_history(self):
        """Losing history should produce zero Kelly."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.30,
            avg_win=50.0,
            avg_loss=100.0,
        )
        assert f == 0.0

    def test_breakeven_edge(self):
        """Breakeven edge case."""
        # b=1, p=0.5, q=0.5 => f*=(1*0.5-0.5)/1=0
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.50,
            avg_win=100.0,
            avg_loss=100.0,
        )
        assert f == 0.0

    def test_high_win_rate_small_wins(self):
        """High win rate with small wins relative to losses."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.80,
            avg_win=20.0,
            avg_loss=100.0,
        )
        # b = 20/100 = 0.2, p = 0.8, q = 0.2
        # f* = (0.2 * 0.8 - 0.2) / 0.2 = (0.16 - 0.2) / 0.2 = -0.2
        assert f == 0.0  # Negative = no edge

    def test_low_win_rate_big_wins(self):
        """Low win rate with big wins."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.40,
            avg_win=300.0,
            avg_loss=100.0,
        )
        # b = 3, p = 0.4, q = 0.6
        # f* = (3 * 0.4 - 0.6) / 3 = (1.2 - 0.6) / 3 = 0.2
        assert f > 0

    def test_zero_avg_loss(self):
        """Zero avg loss should return 0 (avoid div by zero)."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.60,
            avg_win=100.0,
            avg_loss=0.0,
        )
        assert f == 0.0

    def test_zero_win_rate(self):
        """Zero win rate should return 0."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.0,
            avg_win=100.0,
            avg_loss=50.0,
        )
        assert f == 0.0

    def test_100_percent_win_rate(self):
        """100% win rate should return 0 (invalid)."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=1.0,
            avg_win=100.0,
            avg_loss=50.0,
        )
        assert f == 0.0

    def test_capped_at_max(self):
        """Result should be capped at HIGH_CONVICTION_SIZE."""
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.90,
            avg_win=1000.0,
            avg_loss=10.0,
        )
        # This would be huge Kelly, but capped
        assert f <= 0.05


# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestSizerIntegration:
    """Integration tests combining multiple factors."""

    def test_full_pipeline_with_correlation(self):
        """Full pipeline with correlated bets."""
        # Use small edge so Kelly doesn't hit conviction cap
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.52,  # Small edge
            market_price=0.50,
            conviction=ConvictionLevel.HIGH,
            num_correlated_bets=2,
        )
        assert result.is_valid
        # Size should be reduced due to correlation
        no_corr = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.52,
            market_price=0.50,
            conviction=ConvictionLevel.HIGH,
            num_correlated_bets=0,
        )
        assert result.position_value < no_corr.position_value

    def test_edge_scenario_longshot_bet(self):
        """Betting on longshot with perceived value."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.08,   # We think 8% chance
            market_price=0.03,     # Market says 3%
            conviction=ConvictionLevel.LOW,
        )
        assert result.is_valid
        assert result.position_value > 0
        # Should be small due to LOW conviction cap

    def test_edge_scenario_favorite_overpriced(self):
        """Favorite we think is overpriced (negative edge, no bet)."""
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.70,   # We think 70% chance
            market_price=0.85,     # Market says 85%
            conviction=ConvictionLevel.STANDARD,
        )
        # Negative edge = no position
        assert result.position_value == 0.0

    def test_all_conviction_levels_scale(self):
        """Verify all conviction levels produce increasing sizes."""
        sizes = []
        for conviction in [
            ConvictionLevel.LOW,
            ConvictionLevel.STANDARD,
            ConvictionLevel.HIGH,
            ConvictionLevel.TERMINATOR,
        ]:
            result = PredictionMarketSizer.calculate_position_size(
                equity=10_000.0,
                estimated_prob=0.80,  # Strong edge
                market_price=0.50,
                conviction=conviction,
            )
            sizes.append(result.allocation_pct)
        
        # Each should be >= previous (hit cap for each level)
        for i in range(1, len(sizes)):
            assert sizes[i] >= sizes[i-1]
