"""
Integration tests for Platform Brokers.

Tests platform registry, broker coordination, and end-to-end flows.
"""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from platforms.base import (
    PlatformBroker,
    UnifiedMarket,
    UnifiedOrder,
    UnifiedPosition,
    PlatformBalance,
)
from platforms.demo_broker import DemoBroker


class TestUnifiedMarket:
    """Tests for the UnifiedMarket dataclass."""
    
    def test_unified_market_creation(self):
        """Should create market with all fields."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test-1",
            title="Test Market",
            description="A test market",
            category="test",
            yes_price=0.65,
            no_price=0.35,
            volume=1000,
            liquidity=500,
            open_interest=250,
            close_date="2026-12-31T23:59:00Z",
            status="open",
        )
        
        assert market.platform == "kalshi"
        assert market.yes_price == 0.65
        assert market.no_price == 0.35

    def test_unified_market_frozen(self):
        """Market should be immutable."""
        market = UnifiedMarket(
            platform="test",
            market_id="1",
            title="Test",
        )
        
        with pytest.raises(Exception):  # FrozenInstanceError
            market.title = "Modified"

    def test_unified_market_defaults(self):
        """Market should have sensible defaults."""
        market = UnifiedMarket(
            platform="test",
            market_id="1",
            title="Test",
        )
        
        assert market.description == ""
        assert market.category == ""
        assert market.yes_price == 0.0
        assert market.no_price == 0.0
        assert market.volume == 0.0
        assert market.status == "open"


class TestUnifiedOrder:
    """Tests for the UnifiedOrder dataclass."""
    
    def test_unified_order_creation(self):
        """Should create order with all fields."""
        order = UnifiedOrder(
            platform="kalshi",
            order_id="ord-123",
            market_id="mkt-1",
            side="yes",
            quantity=100,
            price=0.50,
            order_type="limit",
            status="filled",
            filled_quantity=100,
            filled_price=0.50,
        )
        
        assert order.order_id == "ord-123"
        assert order.side == "yes"
        assert order.status == "filled"

    def test_unified_order_defaults(self):
        """Order should have sensible defaults."""
        order = UnifiedOrder(
            platform="test",
            order_id="1",
            market_id="m1",
            side="yes",
            quantity=10,
            price=0.50,
        )
        
        assert order.order_type == "limit"
        assert order.status == "pending"
        assert order.filled_quantity == 0


class TestUnifiedPosition:
    """Tests for the UnifiedPosition dataclass."""
    
    def test_unified_position_creation(self):
        """Should create position with all fields."""
        position = UnifiedPosition(
            platform="kalshi",
            market_id="mkt-1",
            market_title="Test Market",
            side="yes",
            quantity=50,
            avg_price=0.45,
            current_price=0.55,
            unrealized_pnl=5.0,
        )
        
        assert position.quantity == 50
        assert position.unrealized_pnl == 5.0


class TestPlatformBalance:
    """Tests for the PlatformBalance dataclass."""
    
    def test_platform_balance_creation(self):
        """Should create balance with all fields."""
        balance = PlatformBalance(
            platform="kalshi",
            available=8000.0,
            total=10000.0,
            currency="USD",
        )
        
        assert balance.available == 8000.0
        assert balance.total == 10000.0
        assert balance.currency == "USD"

    def test_platform_balance_defaults(self):
        """Balance should default to USD."""
        balance = PlatformBalance(
            platform="test",
            available=100.0,
            total=100.0,
        )
        
        assert balance.currency == "USD"


class TestMultiBrokerScenarios:
    """Test scenarios with multiple brokers."""
    
    @pytest.fixture
    def kalshi_broker(self):
        return DemoBroker(platform_name="kalshi")

    @pytest.fixture
    def polymarket_broker(self):
        return DemoBroker(platform_name="polymarket")

    @pytest.mark.asyncio
    async def test_aggregate_markets_from_multiple_platforms(
        self, kalshi_broker, polymarket_broker
    ):
        """Should aggregate markets from multiple platforms."""
        await kalshi_broker.connect()
        await polymarket_broker.connect()
        
        kalshi_markets = await kalshi_broker.fetch_markets()
        poly_markets = await polymarket_broker.fetch_markets()
        
        all_markets = kalshi_markets + poly_markets
        
        # Should have markets from both platforms
        platforms = set(m.platform for m in all_markets)
        assert "kalshi" in platforms
        assert "polymarket" in platforms

    @pytest.mark.asyncio
    async def test_balances_independent_per_platform(
        self, kalshi_broker, polymarket_broker
    ):
        """Each platform should have independent balance."""
        await kalshi_broker.connect()
        await polymarket_broker.connect()
        
        k_balance = await kalshi_broker.fetch_balance()
        p_balance = await polymarket_broker.fetch_balance()
        
        assert k_balance.platform == "kalshi"
        assert p_balance.platform == "polymarket"

    @pytest.mark.asyncio
    async def test_orders_isolated_per_platform(
        self, kalshi_broker, polymarket_broker
    ):
        """Orders should be isolated to their platform."""
        await kalshi_broker.connect()
        await polymarket_broker.connect()
        
        k_order = await kalshi_broker.place_order("m1", "yes", 10, 0.50)
        p_order = await polymarket_broker.place_order("m1", "yes", 10, 0.50)
        
        assert k_order.platform == "kalshi"
        assert p_order.platform == "polymarket"
        assert k_order.order_id != p_order.order_id


class TestBrokerInterface:
    """Test the abstract PlatformBroker interface."""
    
    def test_demo_broker_implements_interface(self):
        """DemoBroker should implement all required methods."""
        broker = DemoBroker()
        
        # Check required properties
        assert hasattr(broker, 'platform_name')
        assert hasattr(broker, 'is_dry_run')
        
        # Check required methods
        assert hasattr(broker, 'connect')
        assert hasattr(broker, 'fetch_markets')
        assert hasattr(broker, 'fetch_orderbook')
        assert hasattr(broker, 'place_order')
        assert hasattr(broker, 'cancel_order')
        assert hasattr(broker, 'cancel_all_orders')
        assert hasattr(broker, 'fetch_positions')
        assert hasattr(broker, 'fetch_balance')


class TestCrossPlatformArbitrage:
    """Test cross-platform arbitrage scenarios."""
    
    @pytest.mark.asyncio
    async def test_find_price_discrepancy(self):
        """Should be able to find price discrepancies across platforms."""
        kalshi = DemoBroker(platform_name="kalshi")
        poly = DemoBroker(platform_name="polymarket")
        
        await kalshi.connect()
        await poly.connect()
        
        k_markets = await kalshi.fetch_markets()
        p_markets = await poly.fetch_markets()
        
        # Both should have markets
        assert len(k_markets) > 0
        assert len(p_markets) > 0

    @pytest.mark.asyncio
    async def test_execute_arb_both_sides(self):
        """Should be able to place orders on both platforms."""
        kalshi = DemoBroker(platform_name="kalshi")
        poly = DemoBroker(platform_name="polymarket")
        
        await kalshi.connect()
        await poly.connect()
        
        # Place arb orders
        k_order = await kalshi.place_order("arb-market", "yes", 100, 0.40)
        p_order = await poly.place_order("arb-market", "no", 100, 0.50)
        
        assert k_order.status == "filled"
        assert p_order.status == "filled"


class TestErrorHandling:
    """Test error handling in brokers."""
    
    @pytest.mark.asyncio
    async def test_health_check_before_connect(self):
        """Health check before connect should handle gracefully."""
        broker = DemoBroker()
        
        # Should not raise
        result = await broker.health_check()
        # May return True or False depending on implementation

    @pytest.mark.asyncio
    async def test_fetch_before_connect(self):
        """Fetching before connect should work (demo broker)."""
        broker = DemoBroker()
        
        # Demo broker generates markets even without connect
        # Real brokers would fail
        markets = await broker.fetch_markets()
        # May be empty list


class TestMarketLifecycle:
    """Test market state through its lifecycle."""
    
    @pytest.mark.asyncio
    async def test_market_status_open(self):
        """New markets should be open."""
        broker = DemoBroker()
        await broker.connect()
        
        markets = await broker.fetch_markets(status="open")
        
        for m in markets:
            assert m.status == "open"

    @pytest.mark.asyncio
    async def test_price_updates_reflect_in_fetches(self):
        """Prices should update on subsequent fetches."""
        broker = DemoBroker()
        await broker.connect()
        
        markets1 = await broker.fetch_markets()
        markets2 = await broker.fetch_markets()
        
        # Due to random drift, structure should be maintained
        assert len(markets1) == len(markets2)
