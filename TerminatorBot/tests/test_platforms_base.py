"""
Comprehensive tests for the Platform Abstraction Layer (platforms/base.py).

Covers dataclass creation and properties for:
- UnifiedMarket
- UnifiedOrder
- UnifiedPosition
- PlatformBalance
- PlatformBroker abstract interface
"""

import pytest
from dataclasses import FrozenInstanceError
from abc import ABC

from platforms.base import (
    UnifiedMarket,
    UnifiedOrder,
    UnifiedPosition,
    PlatformBalance,
    PlatformBroker,
)


# ═══════════════════════════════════════════════════════════════════════════════
# UNIFIED MARKET TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestUnifiedMarket:
    """Test UnifiedMarket frozen dataclass."""

    def test_basic_creation(self):
        """Create market with required fields only."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test-123",
            title="Will Bitcoin reach $100k?",
        )
        assert market.platform == "kalshi"
        assert market.market_id == "test-123"
        assert market.title == "Will Bitcoin reach $100k?"

    def test_full_creation(self):
        """Create market with all fields."""
        market = UnifiedMarket(
            platform="polymarket",
            market_id="poly-btc-100k",
            title="Bitcoin to exceed $100,000",
            description="Resolves YES if BTC/USD exceeds $100,000 at any point",
            category="crypto",
            yes_price=0.65,
            no_price=0.35,
            volume=50000.0,
            liquidity=15000.0,
            open_interest=25000.0,
            close_date="2026-12-31T23:59:00Z",
            status="open",
            last_updated="2026-03-01T12:00:00Z",
            raw_data={"source": "api", "version": 2},
        )
        assert market.platform == "polymarket"
        assert market.yes_price == 0.65
        assert market.no_price == 0.35
        assert market.volume == 50000.0
        assert market.category == "crypto"
        assert market.raw_data["source"] == "api"

    def test_default_values(self):
        """Verify default values are applied."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test",
            title="Test Market",
        )
        assert market.description == ""
        assert market.category == ""
        assert market.yes_price == 0.0
        assert market.no_price == 0.0
        assert market.volume == 0.0
        assert market.liquidity == 0.0
        assert market.open_interest == 0.0
        assert market.close_date is None
        assert market.status == "open"
        assert market.last_updated is None
        assert market.raw_data == {}

    def test_immutable_frozen(self):
        """UnifiedMarket should be immutable (frozen)."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test",
            title="Test",
        )
        with pytest.raises((AttributeError, FrozenInstanceError)):
            market.platform = "polymarket"

    def test_immutable_nested_raw_data(self):
        """raw_data dict can still be mutated (dict is mutable)."""
        # Note: frozen only prevents reassignment, not mutation
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test",
            title="Test",
            raw_data={"key": "value"},
        )
        # This works (mutation) but is bad practice
        market.raw_data["new_key"] = "new_value"
        assert "new_key" in market.raw_data

    def test_equality(self):
        """Two markets with same fields should be equal."""
        m1 = UnifiedMarket("kalshi", "test-1", "Market A", yes_price=0.5)
        m2 = UnifiedMarket("kalshi", "test-1", "Market A", yes_price=0.5)
        assert m1 == m2

    def test_inequality(self):
        """Markets with different fields should not be equal."""
        m1 = UnifiedMarket("kalshi", "test-1", "Market A")
        m2 = UnifiedMarket("kalshi", "test-2", "Market B")
        assert m1 != m2

    def test_hashable_limitation(self):
        """Frozen dataclass with mutable dict field is NOT hashable.
        
        Note: While frozen=True prevents reassignment, the raw_data dict
        makes the dataclass unhashable. This is a known Python limitation.
        If hashability is needed, raw_data should use a frozenset or tuple.
        """
        market = UnifiedMarket("kalshi", "test", "Test")
        # Cannot use in sets due to mutable dict field
        with pytest.raises(TypeError, match="unhashable"):
            hash(market)

    def test_price_normalization_0_to_1(self):
        """Prices should be 0.0 to 1.0 range."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test",
            title="Test",
            yes_price=0.75,
            no_price=0.25,
        )
        assert 0.0 <= market.yes_price <= 1.0
        assert 0.0 <= market.no_price <= 1.0
        assert market.yes_price + market.no_price == pytest.approx(1.0, rel=0.01)


# ═══════════════════════════════════════════════════════════════════════════════
# UNIFIED ORDER TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestUnifiedOrder:
    """Test UnifiedOrder frozen dataclass."""

    def test_basic_creation(self):
        """Create order with required fields only."""
        order = UnifiedOrder(
            platform="kalshi",
            order_id="order-123",
            market_id="market-456",
            side="yes",
            quantity=100,
            price=0.50,
        )
        assert order.platform == "kalshi"
        assert order.order_id == "order-123"
        assert order.side == "yes"
        assert order.quantity == 100
        assert order.price == 0.50

    def test_full_creation(self):
        """Create order with all fields."""
        order = UnifiedOrder(
            platform="polymarket",
            order_id="poly-order-789",
            market_id="poly-market-123",
            side="no",
            quantity=500,
            price=0.35,
            order_type="limit",
            status="filled",
            filled_quantity=500,
            filled_price=0.34,
            created_at="2026-03-01T10:00:00Z",
            raw_data={"execution_id": "exec-001"},
        )
        assert order.side == "no"
        assert order.order_type == "limit"
        assert order.status == "filled"
        assert order.filled_quantity == 500
        assert order.filled_price == 0.34

    def test_default_values(self):
        """Verify default values."""
        order = UnifiedOrder(
            platform="kalshi",
            order_id="test",
            market_id="test",
            side="yes",
            quantity=1,
            price=0.5,
        )
        assert order.order_type == "limit"
        assert order.status == "pending"
        assert order.filled_quantity == 0
        assert order.filled_price == 0.0
        assert order.created_at is None
        assert order.raw_data == {}

    def test_immutable_frozen(self):
        """UnifiedOrder should be immutable."""
        order = UnifiedOrder(
            platform="kalshi",
            order_id="test",
            market_id="test",
            side="yes",
            quantity=1,
            price=0.5,
        )
        with pytest.raises((AttributeError, FrozenInstanceError)):
            order.status = "cancelled"

    def test_side_values(self):
        """Side should be 'yes' or 'no'."""
        yes_order = UnifiedOrder("k", "1", "m", "yes", 10, 0.5)
        no_order = UnifiedOrder("k", "2", "m", "no", 10, 0.5)
        assert yes_order.side == "yes"
        assert no_order.side == "no"

    def test_order_type_values(self):
        """Order types: limit, market, fok."""
        limit = UnifiedOrder("k", "1", "m", "yes", 10, 0.5, order_type="limit")
        market = UnifiedOrder("k", "2", "m", "yes", 10, 0.5, order_type="market")
        fok = UnifiedOrder("k", "3", "m", "yes", 10, 0.5, order_type="fok")
        assert limit.order_type == "limit"
        assert market.order_type == "market"
        assert fok.order_type == "fok"

    def test_status_values(self):
        """Order statuses: pending, filled, cancelled, partial."""
        pending = UnifiedOrder("k", "1", "m", "yes", 10, 0.5, status="pending")
        filled = UnifiedOrder("k", "2", "m", "yes", 10, 0.5, status="filled")
        cancelled = UnifiedOrder("k", "3", "m", "yes", 10, 0.5, status="cancelled")
        partial = UnifiedOrder("k", "4", "m", "yes", 10, 0.5, status="partial")
        assert pending.status == "pending"
        assert filled.status == "filled"
        assert cancelled.status == "cancelled"
        assert partial.status == "partial"


# ═══════════════════════════════════════════════════════════════════════════════
# UNIFIED POSITION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestUnifiedPosition:
    """Test UnifiedPosition frozen dataclass."""

    def test_basic_creation(self):
        """Create position with required fields."""
        pos = UnifiedPosition(
            platform="kalshi",
            market_id="market-123",
            market_title="Will Bitcoin reach $100k?",
            side="yes",
            quantity=100,
            avg_price=0.45,
        )
        assert pos.platform == "kalshi"
        assert pos.market_id == "market-123"
        assert pos.side == "yes"
        assert pos.quantity == 100
        assert pos.avg_price == 0.45

    def test_full_creation(self):
        """Create position with all fields."""
        pos = UnifiedPosition(
            platform="polymarket",
            market_id="poly-123",
            market_title="ETH merge successful",
            side="no",
            quantity=500,
            avg_price=0.30,
            current_price=0.25,
            unrealized_pnl=25.0,  # (0.30 - 0.25) * 500
            raw_data={"position_id": "pos-001"},
        )
        assert pos.current_price == 0.25
        assert pos.unrealized_pnl == 25.0
        assert pos.raw_data["position_id"] == "pos-001"

    def test_default_values(self):
        """Verify default values."""
        pos = UnifiedPosition(
            platform="kalshi",
            market_id="test",
            market_title="Test Position",
            side="yes",
            quantity=10,
            avg_price=0.5,
        )
        assert pos.current_price == 0.0
        assert pos.unrealized_pnl == 0.0
        assert pos.raw_data == {}

    def test_immutable_frozen(self):
        """UnifiedPosition should be immutable."""
        pos = UnifiedPosition(
            platform="kalshi",
            market_id="test",
            market_title="Test",
            side="yes",
            quantity=10,
            avg_price=0.5,
        )
        with pytest.raises((AttributeError, FrozenInstanceError)):
            pos.quantity = 20

    def test_unrealized_pnl_calculation_example(self):
        """Example of unrealized PnL calculation."""
        # Bought 100 YES at 0.40, now trading at 0.60
        # PnL = (0.60 - 0.40) * 100 = $20
        pos = UnifiedPosition(
            platform="kalshi",
            market_id="btc",
            market_title="BTC $100k",
            side="yes",
            quantity=100,
            avg_price=0.40,
            current_price=0.60,
            unrealized_pnl=20.0,
        )
        assert pos.unrealized_pnl == pytest.approx(
            (pos.current_price - pos.avg_price) * pos.quantity
        )


# ═══════════════════════════════════════════════════════════════════════════════
# PLATFORM BALANCE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPlatformBalance:
    """Test PlatformBalance frozen dataclass."""

    def test_basic_creation(self):
        """Create balance with required fields."""
        balance = PlatformBalance(
            platform="kalshi",
            available=5000.0,
            total=7500.0,
        )
        assert balance.platform == "kalshi"
        assert balance.available == 5000.0
        assert balance.total == 7500.0

    def test_full_creation(self):
        """Create balance with all fields."""
        balance = PlatformBalance(
            platform="polymarket",
            available=10000.0,
            total=15000.0,
            currency="USDC",
            raw_data={"last_updated": "2026-03-01T12:00:00Z"},
        )
        assert balance.currency == "USDC"
        assert balance.raw_data["last_updated"] == "2026-03-01T12:00:00Z"

    def test_default_values(self):
        """Verify default values."""
        balance = PlatformBalance(
            platform="kalshi",
            available=1000.0,
            total=1000.0,
        )
        assert balance.currency == "USD"
        assert balance.raw_data == {}

    def test_immutable_frozen(self):
        """PlatformBalance should be immutable."""
        balance = PlatformBalance(
            platform="kalshi",
            available=1000.0,
            total=1000.0,
        )
        with pytest.raises((AttributeError, FrozenInstanceError)):
            balance.available = 2000.0

    def test_different_currencies(self):
        """Test different currency values."""
        usd = PlatformBalance("kalshi", 1000.0, 1000.0, currency="USD")
        usdc = PlatformBalance("polymarket", 1000.0, 1000.0, currency="USDC")
        gbp = PlatformBalance("betfair", 500.0, 500.0, currency="GBP")
        
        assert usd.currency == "USD"
        assert usdc.currency == "USDC"
        assert gbp.currency == "GBP"

    def test_available_vs_total(self):
        """Available should typically be <= total."""
        balance = PlatformBalance(
            platform="kalshi",
            available=5000.0,
            total=8000.0,  # 3k tied up in positions
        )
        assert balance.available <= balance.total


# ═══════════════════════════════════════════════════════════════════════════════
# PLATFORM BROKER ABSTRACT CLASS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestPlatformBrokerAbstract:
    """Test PlatformBroker abstract base class."""

    def test_cannot_instantiate_directly(self):
        """PlatformBroker is abstract and cannot be instantiated."""
        with pytest.raises(TypeError):
            PlatformBroker()

    def test_is_abstract_class(self):
        """Verify PlatformBroker inherits from ABC."""
        assert issubclass(PlatformBroker, ABC)

    def test_required_abstract_methods(self):
        """Check that all required abstract methods are defined."""
        abstract_methods = [
            'platform_name',
            'is_dry_run',
            'connect',
            'fetch_markets',
            'fetch_orderbook',
            'place_order',
            'cancel_order',
            'cancel_all_orders',
            'fetch_positions',
            'fetch_balance',
        ]
        for method in abstract_methods:
            assert hasattr(PlatformBroker, method)


class TestPlatformBrokerImplementation:
    """Test implementing the PlatformBroker interface."""

    def test_minimal_implementation(self):
        """Test that a minimal implementation works."""
        
        class TestBroker(PlatformBroker):
            @property
            def platform_name(self) -> str:
                return "test"
            
            @property
            def is_dry_run(self) -> bool:
                return True
            
            async def connect(self) -> bool:
                return True
            
            async def fetch_markets(self, category=None, status="open", limit=500, query=None):
                return []
            
            async def fetch_orderbook(self, market_id: str) -> dict:
                return {"bids": [], "asks": []}
            
            async def place_order(self, market_id, side, quantity, price, order_type="limit"):
                return UnifiedOrder("test", "1", market_id, side, quantity, price)
            
            async def cancel_order(self, order_id: str) -> bool:
                return True
            
            async def cancel_all_orders(self) -> int:
                return 0
            
            async def fetch_positions(self):
                return []
            
            async def fetch_balance(self):
                return PlatformBalance("test", 1000.0, 1000.0)
        
        broker = TestBroker()
        assert broker.platform_name == "test"
        assert broker.is_dry_run is True

    def test_health_check_default(self):
        """Test default health_check implementation."""
        
        class TestBroker(PlatformBroker):
            @property
            def platform_name(self) -> str:
                return "test"
            
            @property
            def is_dry_run(self) -> bool:
                return True
            
            async def connect(self) -> bool:
                return True
            
            async def fetch_markets(self, **kwargs):
                return []
            
            async def fetch_orderbook(self, market_id):
                return {}
            
            async def place_order(self, **kwargs):
                return UnifiedOrder("t", "1", "m", "yes", 1, 0.5)
            
            async def cancel_order(self, order_id):
                return True
            
            async def cancel_all_orders(self):
                return 0
            
            async def fetch_positions(self):
                return []
            
            async def fetch_balance(self):
                return PlatformBalance("test", 500.0, 1000.0)
        
        broker = TestBroker()
        # health_check has a default implementation using fetch_balance
        assert hasattr(broker, 'health_check')


# ═══════════════════════════════════════════════════════════════════════════════
# CROSS-PLATFORM NORMALIZATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestCrossPlatformNormalization:
    """Test that dataclasses properly normalize across platforms."""

    def test_kalshi_market_normalization(self):
        """Test Kalshi market normalization."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="BTCUSD-100K-DEC31",
            title="Will Bitcoin exceed $100,000 by December 31, 2026?",
            yes_price=0.65,  # 65 cents normalized to 0.65
            no_price=0.35,
            volume=15000,
            status="open",
        )
        assert market.platform == "kalshi"
        assert 0 <= market.yes_price <= 1

    def test_polymarket_market_normalization(self):
        """Test Polymarket market normalization."""
        market = UnifiedMarket(
            platform="polymarket",
            market_id="0x1234abcd",
            title="Bitcoin to exceed $100,000 by end of 2026",
            yes_price=0.62,  # USDC-based, normalized
            no_price=0.38,
            volume=250000,  # USDC volume
            status="open",
        )
        assert market.platform == "polymarket"

    def test_betfair_market_normalization(self):
        """Test Betfair back/lay normalization."""
        market = UnifiedMarket(
            platform="betfair",
            market_id="1.234567890",
            title="Next US President",
            yes_price=0.55,  # Back price converted from odds
            no_price=0.45,
            volume=5000000,  # GBP matched
            status="open",
        )
        assert market.platform == "betfair"

    def test_market_comparison_across_platforms(self):
        """Compare similar markets across platforms."""
        kalshi = UnifiedMarket(
            platform="kalshi",
            market_id="k-btc",
            title="Will Bitcoin reach $100k?",
            yes_price=0.65,
            no_price=0.35,
        )
        poly = UnifiedMarket(
            platform="polymarket",
            market_id="p-btc",
            title="Bitcoin $100k by EOY",
            yes_price=0.62,
            no_price=0.38,
        )
        
        # Price difference (potential arb)
        price_diff = abs(kalshi.yes_price - poly.yes_price)
        assert price_diff == pytest.approx(0.03, abs=0.001)


# ═══════════════════════════════════════════════════════════════════════════════
# EDGE CASE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

class TestEdgeCases:
    """Test edge cases and unusual inputs."""

    def test_empty_strings(self):
        """Handle empty string fields."""
        market = UnifiedMarket(
            platform="",
            market_id="",
            title="",
        )
        assert market.platform == ""
        assert market.market_id == ""

    def test_unicode_title(self):
        """Handle unicode in title."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test",
            title="Will €/$  exchange rate exceed 1.2? 🚀",
        )
        assert "€" in market.title
        assert "🚀" in market.title

    def test_very_long_title(self):
        """Handle very long titles."""
        long_title = "A" * 1000
        market = UnifiedMarket(
            platform="kalshi",
            market_id="test",
            title=long_title,
        )
        assert len(market.title) == 1000

    def test_extreme_prices(self):
        """Handle extreme price values."""
        # Very low probability
        low_prob = UnifiedMarket("k", "1", "Alien landing", yes_price=0.001, no_price=0.999)
        assert low_prob.yes_price == 0.001
        
        # Very high probability
        high_prob = UnifiedMarket("k", "2", "Sun rises", yes_price=0.999, no_price=0.001)
        assert high_prob.yes_price == 0.999

    def test_zero_volume(self):
        """Handle zero volume markets."""
        market = UnifiedMarket(
            platform="kalshi",
            market_id="new-market",
            title="Brand new market",
            volume=0.0,
            liquidity=0.0,
        )
        assert market.volume == 0.0

    def test_negative_unrealized_pnl(self):
        """Handle losing position with negative PnL."""
        pos = UnifiedPosition(
            platform="kalshi",
            market_id="btc",
            market_title="BTC $100k",
            side="yes",
            quantity=100,
            avg_price=0.70,
            current_price=0.50,
            unrealized_pnl=-20.0,  # Losing position
        )
        assert pos.unrealized_pnl == -20.0

    def test_large_quantity(self):
        """Handle large position quantities."""
        pos = UnifiedPosition(
            platform="polymarket",
            market_id="whale",
            market_title="Whale position",
            side="yes",
            quantity=1_000_000,
            avg_price=0.50,
        )
        assert pos.quantity == 1_000_000

    def test_partial_fill(self):
        """Test partial fill scenario."""
        order = UnifiedOrder(
            platform="kalshi",
            order_id="partial-1",
            market_id="test",
            side="yes",
            quantity=100,
            price=0.50,
            status="partial",
            filled_quantity=60,
            filled_price=0.49,
        )
        assert order.filled_quantity < order.quantity
        assert order.status == "partial"
