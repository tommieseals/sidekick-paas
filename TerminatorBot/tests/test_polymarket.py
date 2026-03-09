"""
TerminatorBot - Polymarket Integration Tests

Tests for the Polymarket broker implementation via pmxt library.
Includes unit tests with mocks and integration tests for real API access.
"""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch, PropertyMock
from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime, timezone

from platforms.base import (
    PlatformBroker,
    UnifiedMarket,
    UnifiedOrder,
    UnifiedPosition,
    PlatformBalance,
)
from platforms.pmxt_broker import PmxtBroker, create_polymarket_broker
from config import Config


# ── Mock pmxt data structures ───────────────────────────────────────────

@dataclass
class MockMarketOutcome:
    """Mock pmxt MarketOutcome."""
    outcome_id: str
    price: float


@dataclass
class MockPmxtMarket:
    """Mock pmxt UnifiedMarket."""
    market_id: str
    title: str
    description: str = ""
    category: str = ""
    volume: float = 1000.0
    liquidity: float = 500.0
    open_interest: float = 250.0
    volume_24h: float = 100.0
    resolution_date: Optional[datetime] = None
    url: str = ""
    yes: Optional[MockMarketOutcome] = None
    no: Optional[MockMarketOutcome] = None


@dataclass
class MockOrderLevel:
    """Mock orderbook level."""
    price: float
    size: int


@dataclass
class MockOrderBook:
    """Mock pmxt OrderBook."""
    bids: List[MockOrderLevel]
    asks: List[MockOrderLevel]


@dataclass
class MockBalance:
    """Mock pmxt Balance."""
    currency: str
    available: float
    total: float


@dataclass
class MockOrder:
    """Mock pmxt Order."""
    id: str
    market_id: str
    status: str
    filled: int
    price: float


@dataclass
class MockPosition:
    """Mock pmxt Position."""
    market_id: str
    outcome_id: str
    outcome_label: str
    size: int
    entry_price: float
    current_price: float
    unrealized_pnl: float


# ── Unit Tests ───────────────────────────────────────────────────────────

class TestPolymarketBrokerCreation:
    """Tests for Polymarket broker instantiation."""

    def test_create_polymarket_broker_dry_run(self):
        """Should create broker in dry run mode."""
        broker = create_polymarket_broker(dry_run=True)
        
        assert broker.platform_name == "polymarket"
        assert broker.is_dry_run is True

    def test_create_polymarket_broker_live(self):
        """Should create broker in live mode."""
        broker = create_polymarket_broker(dry_run=False)
        
        assert broker.platform_name == "polymarket"
        assert broker.is_dry_run is False

    def test_broker_credentials_from_config(self):
        """Should use credentials from Config."""
        with patch.object(Config, 'POLYMARKET_API_KEY', 'test-key'):
            with patch.object(Config, 'POLYMARKET_API_SECRET', 'test-secret'):
                broker = create_polymarket_broker(dry_run=True)
                
                # Credentials should be passed internally
                assert broker._credentials.get('api_key') == 'test-key'
                assert broker._credentials.get('api_secret') == 'test-secret'


class TestPolymarketBrokerInterface:
    """Test that Polymarket broker implements the full interface."""
    
    def test_implements_platform_broker(self):
        """Should implement all PlatformBroker abstract methods."""
        broker = create_polymarket_broker(dry_run=True)
        
        # Properties
        assert hasattr(broker, 'platform_name')
        assert hasattr(broker, 'is_dry_run')
        
        # Methods
        required_methods = [
            'connect', 'fetch_markets', 'fetch_orderbook',
            'place_order', 'cancel_order', 'cancel_all_orders',
            'fetch_positions', 'fetch_balance', 'health_check',
        ]
        
        for method in required_methods:
            assert hasattr(broker, method), f"Missing method: {method}"
            assert callable(getattr(broker, method)), f"Not callable: {method}"


class TestPolymarketDryRunMode:
    """Test dry run (paper trading) functionality."""
    
    @pytest.fixture
    def dry_run_broker(self):
        """Create a dry run broker."""
        return create_polymarket_broker(dry_run=True)
    
    @pytest.mark.asyncio
    async def test_dry_run_order_simulates_fill(self, dry_run_broker):
        """Dry run orders should be simulated as filled."""
        order = await dry_run_broker.place_order(
            market_id="test-market-123",
            side="yes",
            quantity=100,
            price=0.50,
        )
        
        assert order.platform == "polymarket"
        assert order.status == "filled"
        assert order.filled_quantity == 100
        assert order.filled_price == 0.50
        assert order.order_id.startswith("DRY-")

    @pytest.mark.asyncio
    async def test_dry_run_cancel_always_succeeds(self, dry_run_broker):
        """Dry run cancel should always succeed."""
        result = await dry_run_broker.cancel_order("any-order-id")
        assert result is True

    @pytest.mark.asyncio
    async def test_dry_run_balance_uses_paper_balance(self, dry_run_broker):
        """Dry run should return paper balance."""
        balance = await dry_run_broker.fetch_balance()
        
        assert balance.platform == "polymarket"
        assert balance.available == Config.PAPER_STARTING_BALANCE
        assert balance.total == Config.PAPER_STARTING_BALANCE


class TestPolymarketMockedAPI:
    """Test broker with mocked pmxt API."""
    
    @pytest.fixture
    def mock_pmxt_client(self):
        """Create a mock pmxt Polymarket client."""
        client = MagicMock()
        
        # Mock load_markets
        client.load_markets = MagicMock()
        
        # Mock fetch_markets
        client.fetch_markets = MagicMock(return_value=[
            MockPmxtMarket(
                market_id="poly-btc-100k",
                title="Will Bitcoin exceed $100,000?",
                category="crypto",
                yes=MockMarketOutcome("yes-1", 0.65),
                no=MockMarketOutcome("no-1", 0.35),
                volume=50000,
                resolution_date=datetime(2026, 12, 31, tzinfo=timezone.utc),
            ),
            MockPmxtMarket(
                market_id="poly-trump-win",
                title="Will Trump win 2028 election?",
                category="politics",
                yes=MockMarketOutcome("yes-2", 0.45),
                no=MockMarketOutcome("no-2", 0.55),
                volume=100000,
            ),
        ])
        
        # Mock fetch_order_book
        client.fetch_order_book = MagicMock(return_value=MockOrderBook(
            bids=[MockOrderLevel(0.50, 1000), MockOrderLevel(0.49, 500)],
            asks=[MockOrderLevel(0.51, 800), MockOrderLevel(0.52, 600)],
        ))
        
        # Mock fetch_balance
        client.fetch_balance = MagicMock(return_value=[
            MockBalance("USDC", 5000.0, 7500.0)
        ])
        
        # Mock fetch_positions
        client.fetch_positions = MagicMock(return_value=[
            MockPosition(
                market_id="poly-btc-100k",
                outcome_id="yes-1",
                outcome_label="Yes",
                size=100,
                entry_price=0.50,
                current_price=0.65,
                unrealized_pnl=15.0,
            )
        ])
        
        # Mock create_order
        client.create_order = MagicMock(return_value=MockOrder(
            id="ord-123456",
            market_id="poly-btc-100k",
            status="pending",
            filled=0,
            price=0.55,
        ))
        
        # Mock cancel_order
        client.cancel_order = MagicMock()
        
        # Mock fetch_open_orders
        client.fetch_open_orders = MagicMock(return_value=[])
        
        return client

    @pytest.mark.asyncio
    async def test_connect_success(self, mock_pmxt_client):
        """Should connect successfully when pmxt client works."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            result = await broker.connect()
            
            assert result is True
            assert broker._connected is True
            mock_pmxt_client.load_markets.assert_called_once()

    @pytest.mark.asyncio
    async def test_fetch_markets_normalizes_data(self, mock_pmxt_client):
        """Should normalize pmxt markets to UnifiedMarket."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            markets = await broker.fetch_markets()
            
            assert len(markets) == 2
            
            btc_market = markets[0]
            assert isinstance(btc_market, UnifiedMarket)
            assert btc_market.platform == "polymarket"
            assert btc_market.market_id == "poly-btc-100k"
            assert btc_market.title == "Will Bitcoin exceed $100,000?"
            assert btc_market.yes_price == 0.65
            assert btc_market.no_price == 0.35
            assert btc_market.category == "crypto"

    @pytest.mark.asyncio
    async def test_fetch_markets_with_category_filter(self, mock_pmxt_client):
        """Should filter markets by category."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            markets = await broker.fetch_markets(category="crypto")
            
            # Only crypto markets should be returned
            assert len(markets) == 1
            assert markets[0].category == "crypto"

    @pytest.mark.asyncio
    async def test_fetch_orderbook_normalizes_data(self, mock_pmxt_client):
        """Should normalize orderbook data."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            orderbook = await broker.fetch_orderbook("poly-btc-100k")
            
            assert "bids" in orderbook
            assert "asks" in orderbook
            assert orderbook["bids"] == [[0.50, 1000], [0.49, 500]]
            assert orderbook["asks"] == [[0.51, 800], [0.52, 600]]

    @pytest.mark.asyncio
    async def test_fetch_balance_live_mode(self, mock_pmxt_client):
        """Should fetch real balance in live mode."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            balance = await broker.fetch_balance()
            
            assert isinstance(balance, PlatformBalance)
            assert balance.platform == "polymarket"
            assert balance.available == 5000.0
            assert balance.total == 7500.0
            assert balance.currency == "USDC"

    @pytest.mark.asyncio
    async def test_fetch_positions_normalizes_data(self, mock_pmxt_client):
        """Should normalize position data."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            positions = await broker.fetch_positions()
            
            assert len(positions) == 1
            pos = positions[0]
            assert isinstance(pos, UnifiedPosition)
            assert pos.platform == "polymarket"
            assert pos.market_id == "poly-btc-100k"
            assert pos.side == "yes"
            assert pos.quantity == 100
            assert pos.avg_price == 0.50
            assert pos.unrealized_pnl == 15.0

    @pytest.mark.asyncio
    async def test_place_order_live_mode(self, mock_pmxt_client):
        """Should place real order in live mode."""
        with patch('pmxt.Polymarket', return_value=mock_pmxt_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            order = await broker.place_order(
                market_id="poly-btc-100k",
                side="yes",
                quantity=50,
                price=0.55,
            )
            
            assert isinstance(order, UnifiedOrder)
            assert order.platform == "polymarket"
            assert order.order_id == "ord-123456"
            assert order.side == "yes"
            mock_pmxt_client.create_order.assert_called_once()


class TestPolymarketOrderValidation:
    """Test order parameter validation."""
    
    @pytest.fixture
    def broker(self):
        """Create a dry run broker for testing."""
        return create_polymarket_broker(dry_run=True)
    
    @pytest.mark.asyncio
    async def test_invalid_side_raises_error(self, broker):
        """Should raise error for invalid side."""
        with pytest.raises(ValueError, match="Invalid side"):
            await broker.place_order("mkt-1", "invalid", 100, 0.50)

    @pytest.mark.asyncio
    async def test_negative_quantity_raises_error(self, broker):
        """Should raise error for negative quantity."""
        with pytest.raises(ValueError, match="positive"):
            await broker.place_order("mkt-1", "yes", -10, 0.50)

    @pytest.mark.asyncio
    async def test_zero_quantity_raises_error(self, broker):
        """Should raise error for zero quantity."""
        with pytest.raises(ValueError, match="positive"):
            await broker.place_order("mkt-1", "yes", 0, 0.50)

    @pytest.mark.asyncio
    async def test_invalid_price_range_raises_error(self, broker):
        """Should raise error for price outside 0-1 range."""
        with pytest.raises(ValueError, match="between 0 and 1"):
            await broker.place_order("mkt-1", "yes", 100, 1.50)
        
        with pytest.raises(ValueError, match="between 0 and 1"):
            await broker.place_order("mkt-1", "yes", 100, 0.0)

    @pytest.mark.asyncio
    async def test_empty_market_id_raises_error(self, broker):
        """Should raise error for empty market_id."""
        with pytest.raises(ValueError, match="required"):
            await broker.place_order("", "yes", 100, 0.50)


class TestPolymarketErrorHandling:
    """Test error handling and retry logic."""
    
    @pytest.mark.asyncio
    async def test_connection_retry_on_failure(self):
        """Should retry connection on failure."""
        mock_client = MagicMock()
        mock_client.load_markets = MagicMock(side_effect=[
            Exception("Network error"),
            Exception("Network error"),
            None,  # Success on third try
        ])
        
        with patch('pmxt.Polymarket', return_value=mock_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            broker._max_connection_attempts = 3
            
            result = await broker.connect()
            
            assert result is True
            assert mock_client.load_markets.call_count == 3

    @pytest.mark.asyncio
    async def test_fetch_markets_returns_empty_when_not_connected(self):
        """Should return empty list if not connected."""
        broker = PmxtBroker("polymarket", {}, dry_run=True)
        
        markets = await broker.fetch_markets()
        
        assert markets == []

    @pytest.mark.asyncio
    async def test_last_error_captured(self):
        """Should capture last error for debugging."""
        mock_client = MagicMock()
        mock_client.load_markets = MagicMock(side_effect=Exception("Auth failed"))
        
        with patch('pmxt.Polymarket', return_value=mock_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            broker._max_connection_attempts = 1
            
            await broker.connect()
            
            assert broker.last_error == "Auth failed"


class TestPolymarketHealthCheck:
    """Test health check functionality."""
    
    @pytest.mark.asyncio
    async def test_health_check_when_connected(self):
        """Health check should pass when connected with markets."""
        mock_client = MagicMock()
        mock_client.load_markets = MagicMock()
        mock_client.fetch_markets = MagicMock(return_value=[
            MockPmxtMarket(market_id="test", title="Test Market")
        ])
        
        with patch('pmxt.Polymarket', return_value=mock_client):
            broker = PmxtBroker("polymarket", {}, dry_run=False)
            await broker.connect()
            
            result = await broker.health_check()
            
            assert result is True

    @pytest.mark.asyncio
    async def test_health_check_when_not_connected(self):
        """Health check should fail when not connected."""
        broker = PmxtBroker("polymarket", {}, dry_run=True)
        
        result = await broker.health_check()
        
        assert result is False


# ── Integration Tests (marked for manual run with real API) ──────────────

@pytest.mark.integration
@pytest.mark.skipif(
    not Config.POLYMARKET_PRIVATE_KEY and not Config.POLYMARKET_API_KEY,
    reason="Polymarket credentials not configured"
)
class TestPolymarketIntegration:
    """Integration tests requiring real Polymarket API access.
    
    Run with: pytest -m integration tests/test_polymarket.py
    """
    
    @pytest.fixture
    async def live_broker(self):
        """Create a live broker and connect."""
        broker = create_polymarket_broker(dry_run=True)  # Still dry run for safety
        await broker.connect()
        return broker
    
    @pytest.mark.asyncio
    async def test_live_fetch_markets(self, live_broker):
        """Should fetch real markets from Polymarket."""
        markets = await live_broker.fetch_markets(limit=10)
        
        assert len(markets) > 0
        assert all(m.platform == "polymarket" for m in markets)
        assert all(0 <= m.yes_price <= 1 for m in markets)

    @pytest.mark.asyncio
    async def test_live_fetch_orderbook(self, live_broker):
        """Should fetch real orderbook."""
        markets = await live_broker.fetch_markets(limit=1)
        if markets:
            orderbook = await live_broker.fetch_orderbook(markets[0].market_id)
            assert "bids" in orderbook
            assert "asks" in orderbook


# ── WebSocket Tests (placeholder for future implementation) ──────────────

class TestPolymarketWebSocket:
    """Tests for WebSocket streaming (future implementation).
    
    Note: pmxt library may add WebSocket support in future versions.
    These tests are placeholders for when streaming is implemented.
    """
    
    @pytest.mark.skip(reason="WebSocket not yet implemented in pmxt")
    @pytest.mark.asyncio
    async def test_subscribe_to_market_updates(self):
        """Should receive real-time price updates via WebSocket."""
        pass
    
    @pytest.mark.skip(reason="WebSocket not yet implemented in pmxt")
    @pytest.mark.asyncio
    async def test_reconnect_on_disconnect(self):
        """Should automatically reconnect on WebSocket disconnect."""
        pass
