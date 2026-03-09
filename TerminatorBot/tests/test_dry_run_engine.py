"""Tests for the Dry Run (Paper Trading) Engine."""

import pytest
from execution.dry_run_engine import DryRunEngine


@pytest.fixture
def engine():
    return DryRunEngine(starting_balance=10_000.0)


class TestOrderExecution:
    def test_successful_order(self, engine):
        order = engine.execute_order(
            platform="kalshi",
            market_id="test-1",
            market_title="Test Market",
            side="yes",
            quantity=100,
            price=0.50,
        )
        assert order.status == "filled"
        assert order.filled_quantity == 100
        assert order.order_id.startswith("dry_")

    def test_balance_deducted(self, engine):
        engine.execute_order(
            platform="kalshi",
            market_id="test-1",
            market_title="Test",
            side="yes",
            quantity=100,
            price=0.50,
        )
        balance = engine.get_balance("kalshi")
        assert balance.available == 10_000.0 - 50.0  # 100 * 0.50

    def test_insufficient_balance(self, engine):
        order = engine.execute_order(
            platform="kalshi",
            market_id="big",
            market_title="Too expensive",
            side="yes",
            quantity=100_000,
            price=0.50,
        )
        assert order.status == "rejected"

    def test_position_created(self, engine):
        engine.execute_order(
            platform="kalshi",
            market_id="test-1",
            market_title="Test",
            side="yes",
            quantity=100,
            price=0.50,
        )
        positions = engine.get_positions("kalshi")
        assert len(positions) == 1
        assert positions[0].side == "yes"
        assert positions[0].quantity == 100


class TestMarketResolution:
    def test_winning_position(self, engine):
        engine.execute_order(
            platform="kalshi",
            market_id="win",
            market_title="Winner",
            side="yes",
            quantity=100,
            price=0.30,
        )
        pnl = engine.resolve_market("win", "yes")
        # Paid 100 * 0.30 = $30, received 100 * $1.00 = $100
        assert pnl == pytest.approx(70.0)

    def test_losing_position(self, engine):
        engine.execute_order(
            platform="kalshi",
            market_id="lose",
            market_title="Loser",
            side="yes",
            quantity=100,
            price=0.70,
        )
        pnl = engine.resolve_market("lose", "no")
        # Paid 100 * 0.70 = $70, received nothing
        assert pnl == pytest.approx(-70.0)

    def test_positions_cleared_after_resolve(self, engine):
        engine.execute_order(
            platform="kalshi",
            market_id="clear",
            market_title="Clear",
            side="yes",
            quantity=50,
            price=0.50,
        )
        engine.resolve_market("clear", "yes")
        positions = engine.get_positions("kalshi")
        assert len(positions) == 0


class TestMultiPlatform:
    def test_separate_balances(self, engine):
        engine.execute_order("kalshi", "k1", "K", "yes", 100, 0.50)
        engine.execute_order("polymarket", "p1", "P", "no", 50, 0.40)

        k_bal = engine.get_balance("kalshi")
        p_bal = engine.get_balance("polymarket")

        assert k_bal.available == 9_950.0
        assert p_bal.available == 9_980.0

    def test_total_equity(self, engine):
        engine.execute_order("kalshi", "k1", "K", "yes", 100, 0.50)
        # Only kalshi initialized: $9950 cash + $50 position = $10000
        assert engine.total_equity == 10_000.0


class TestSummary:
    def test_summary_structure(self, engine):
        engine.execute_order("kalshi", "k1", "K", "yes", 10, 0.50)
        s = engine.summary()
        assert "total_equity" in s
        assert "total_pnl" in s
        assert "trade_count" in s
        assert s["trade_count"] == 1
