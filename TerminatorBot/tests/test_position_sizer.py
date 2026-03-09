"""Tests for the Kelly Criterion Position Sizer."""

import pytest
from core.position_sizer import (
    PredictionMarketSizer,
    ConvictionLevel,
    PositionResult,
)


class TestKellyForBet:
    def test_positive_edge(self):
        """When our estimate > market price, Kelly should be positive."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.70,
            market_price=0.50,
        )
        assert f > 0

    def test_no_edge(self):
        """When our estimate == market price, Kelly should be zero."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.50,
            market_price=0.50,
        )
        assert f == 0.0

    def test_negative_edge(self):
        """When our estimate < market price, Kelly should be zero."""
        f = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.30,
            market_price=0.50,
        )
        assert f == 0.0

    def test_fractional_kelly_smaller(self):
        """Half Kelly should be smaller than full Kelly."""
        # Use very small edge so results don't hit the 5% cap
        # Kelly = (b*p - q) / b where b=(1/price)-1
        # With p=0.52, price=0.50: b=1.0, f*=(0.52-0.48)/1.0=0.04
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
        assert full > 0
        assert half < full
        assert abs(half - full * 0.5) < 0.001

    def test_correlation_penalty(self):
        """Correlated bets should reduce size."""
        no_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=0,
        )
        with_corr = PredictionMarketSizer.calculate_kelly_for_bet(
            estimated_prob=0.55,
            market_price=0.50,
            num_correlated_bets=2,
        )
        assert with_corr < no_corr

    def test_edge_cases(self):
        """Edge cases should return 0."""
        assert PredictionMarketSizer.calculate_kelly_for_bet(0.0, 0.50) == 0.0
        assert PredictionMarketSizer.calculate_kelly_for_bet(1.0, 0.50) == 0.0
        assert PredictionMarketSizer.calculate_kelly_for_bet(0.50, 0.0) == 0.0
        assert PredictionMarketSizer.calculate_kelly_for_bet(0.50, 1.0) == 0.0


class TestArbSize:
    def test_viable_arb(self):
        """Arb with good edge should produce positive size."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.05,
        )
        assert size > 0
        assert size <= 10_000 * 0.15  # Max 15% on one arb

    def test_tiny_edge_rejected(self):
        """Arb with edge below 1.5% should be rejected."""
        size = PredictionMarketSizer.calculate_arb_size(
            equity=10_000.0,
            net_edge=0.01,
        )
        assert size == 0.0

    def test_scales_with_equity(self):
        """Larger equity should produce larger position."""
        small = PredictionMarketSizer.calculate_arb_size(5_000.0, 0.04)
        large = PredictionMarketSizer.calculate_arb_size(50_000.0, 0.04)
        assert large > small


class TestPositionSize:
    def test_standard_conviction(self):
        result = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.70,
            market_price=0.55,
            conviction=ConvictionLevel.STANDARD,
        )
        assert isinstance(result, PositionResult)
        assert result.is_valid
        assert result.position_value > 0

    def test_high_conviction_larger(self):
        standard = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.70,
            market_price=0.55,
            conviction=ConvictionLevel.STANDARD,
        )
        high = PredictionMarketSizer.calculate_position_size(
            equity=10_000.0,
            estimated_prob=0.70,
            market_price=0.55,
            conviction=ConvictionLevel.HIGH,
        )
        assert high.position_value >= standard.position_value

    def test_zero_equity(self):
        result = PredictionMarketSizer.calculate_position_size(
            equity=0.0,
            estimated_prob=0.70,
            market_price=0.55,
        )
        assert not result.is_valid
        assert result.position_value == 0


class TestKellyFromHistory:
    def test_profitable_history(self):
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.60,
            avg_win=100.0,
            avg_loss=50.0,
        )
        assert f > 0

    def test_losing_history(self):
        f = PredictionMarketSizer.calculate_kelly_fraction_from_history(
            win_rate=0.30,
            avg_win=50.0,
            avg_loss=100.0,
        )
        assert f == 0.0
