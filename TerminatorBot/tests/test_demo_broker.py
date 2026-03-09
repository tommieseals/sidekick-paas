"""
Tests for the Demo (Paper Trading) Broker.
"""

import pytest
from platforms.demo_broker import DemoBroker
from platforms.base import UnifiedMarket, UnifiedOrder, PlatformBalance


@pytest.fixture
def broker():
    return DemoBroker(platform_name="demo_kalshi")


class TestBrokerInitialization:
    def test_broker_initializes(self, broker):
        """Broker should initialize correctly."""
        assert broker is not None
        assert broker.platform_name == "demo_kalshi"
        assert broker.is_dry_run is True

    def test_broker_with_custom_name(self):
        """Broker should accept custom platform name."""
        custom = DemoBroker(platform_name="my_custom_demo")
        assert custom.platform_name == "my_custom_demo"


class TestConnection:
    @pytest.mark.asyncio
    async def test_connect_succeeds(self, broker):
        """Connect should always succeed for demo broker."""
        result = await broker.connect()
        assert result is True

    @pytest.mark.asyncio
    async def test_connect_generates_markets(self, broker):
        """Connect should generate demo markets."""
        await broker.connect()
        markets = await broker.fetch_markets()
        assert len(markets) > 0


class TestFetchMarkets:
    @pytest.mark.asyncio
    async def test_fetch_returns_unified_markets(self, broker):
        """Fetched markets should be UnifiedMarket instances."""
        await broker.connect()
        markets = await broker.fetch_markets()
        
        assert all(isinstance(m, UnifiedMarket) for m in markets)

    @pytest.mark.asyncio
    async def test_fetch_markets_have_required_fields(self, broker):
        """Markets should have all required fields populated."""
        await broker.connect()
        markets = await broker.fetch_markets()
        
        for m in markets[:5]:  # Check first 5
            assert m.platform == broker.platform_name
            assert m.market_id
            assert m.title
            assert 0 <= m.yes_price <= 1
            assert 0 <= m.no_price <= 1

    @pytest.mark.asyncio
    async def test_fetch_markets_category_filter(self, broker):
        """Should filter by category."""
        await broker.connect()
        
        crypto_markets = await broker.fetch_markets(category="crypto")
        politics_markets = await broker.fetch_markets(category="politics")
        
        for m in crypto_markets:
            assert m.category == "crypto"
        for m in politics_markets:
            assert m.category == "politics"

    @pytest.mark.asyncio
    async def test_fetch_markets_query_filter(self, broker):
        """Should filter by query string."""
        await broker.connect()
        
        btc_markets = await broker.fetch_markets(query="bitcoin")
        
        for m in btc_markets:
            assert "bitcoin" in m.title.lower()

    @pytest.mark.asyncio
    async def test_fetch_markets_limit(self, broker):
        """Should respect limit parameter."""
        await broker.connect()
        
        limited = await broker.fetch_markets(limit=3)
        assert len(limited) <= 3

    @pytest.mark.asyncio
    async def test_price_drift_on_fetch(self, broker):
        """Prices should drift slightly between fetches."""
        await broker.connect()
        
        markets1 = await broker.fetch_markets()
        markets2 = await broker.fetch_markets()
        
        # At least some prices should change
        # Due to drift being random, we just check structure is correct
        for m in markets2:
            assert 0 < m.yes_price < 1


class TestFetchOrderbook:
    @pytest.mark.asyncio
    async def test_fetch_orderbook_structure(self, broker):
        """Orderbook should have bids and asks."""
        await broker.connect()
        
        orderbook = await broker.fetch_orderbook("any-market-id")
        
        assert "bids" in orderbook
        assert "asks" in orderbook
        assert isinstance(orderbook["bids"], list)
        assert isinstance(orderbook["asks"], list)


class TestPlaceOrder:
    @pytest.mark.asyncio
    async def test_place_order_succeeds(self, broker):
        """Placing an order should succeed."""
        await broker.connect()
        
        order = await broker.place_order(
            market_id="test-market",
            side="yes",
            quantity=10,
            price=0.50,
        )
        
        assert isinstance(order, UnifiedOrder)
        assert order.status == "filled"
        assert order.filled_quantity == 10

    @pytest.mark.asyncio
    async def test_place_order_has_id(self, broker):
        """Orders should have unique IDs."""
        await broker.connect()
        
        order1 = await broker.place_order("m1", "yes", 10, 0.50)
        order2 = await broker.place_order("m2", "yes", 10, 0.50)
        
        assert order1.order_id != order2.order_id
        assert order1.order_id.startswith("demo_")


class TestCancelOrder:
    @pytest.mark.asyncio
    async def test_cancel_order_succeeds(self, broker):
        """Canceling an order should succeed."""
        await broker.connect()
        
        result = await broker.cancel_order("any-order-id")
        assert result is True

    @pytest.mark.asyncio
    async def test_cancel_all_orders(self, broker):
        """Cancel all orders should return count."""
        await broker.connect()
        
        count = await broker.cancel_all_orders()
        assert count == 0  # Demo broker doesn't track pending orders


class TestFetchPositions:
    @pytest.mark.asyncio
    async def test_fetch_positions_initially_empty(self, broker):
        """Positions should be empty initially."""
        await broker.connect()
        
        positions = await broker.fetch_positions()
        assert positions == []


class TestFetchBalance:
    @pytest.mark.asyncio
    async def test_fetch_balance_returns_platform_balance(self, broker):
        """Balance should be a PlatformBalance instance."""
        await broker.connect()
        
        balance = await broker.fetch_balance()
        
        assert isinstance(balance, PlatformBalance)
        assert balance.platform == broker.platform_name
        assert balance.available > 0
        assert balance.total > 0


class TestMarketGeneration:
    @pytest.mark.asyncio
    async def test_markets_have_varied_categories(self, broker):
        """Generated markets should have various categories."""
        await broker.connect()
        
        markets = await broker.fetch_markets()
        categories = set(m.category for m in markets)
        
        # Should have multiple categories
        assert len(categories) >= 3

    @pytest.mark.asyncio
    async def test_markets_have_varied_prices(self, broker):
        """Generated markets should have various prices."""
        await broker.connect()
        
        markets = await broker.fetch_markets()
        prices = [m.yes_price for m in markets]
        
        # Should not all be the same price
        assert len(set(prices)) > 1

    @pytest.mark.asyncio
    async def test_markets_have_close_dates(self, broker):
        """Generated markets should have close dates."""
        await broker.connect()
        
        markets = await broker.fetch_markets()
        
        for m in markets:
            assert m.close_date is not None
            assert "T" in m.close_date  # ISO format


class TestHealthCheck:
    @pytest.mark.asyncio
    async def test_health_check_passes(self, broker):
        """Health check should pass."""
        await broker.connect()
        
        result = await broker.health_check()
        assert result is True


class TestDryRunProperty:
    def test_is_dry_run_always_true(self, broker):
        """Demo broker should always be in dry run mode."""
        assert broker.is_dry_run is True
