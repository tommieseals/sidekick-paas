# Polymarket Integration Setup

TerminatorBot uses the `pmxt` library for Polymarket integration, providing a unified interface for fetching markets, placing orders, and managing positions.

## Overview

| Feature | Status |
|---------|--------|
| Market Data | ✅ Working |
| Order Placement | ✅ Working |
| Position Tracking | ✅ Working |
| Balance Checking | ✅ Working |
| Paper Trading | ✅ Working |
| WebSocket Streaming | ⏳ Planned |

## Credentials Required

Polymarket uses blockchain-based authentication. You'll need to set up API credentials through their platform.

### Option 1: API Keys (Recommended)

For most users, get API credentials from Polymarket:

1. Go to [polymarket.com](https://polymarket.com)
2. Connect your wallet
3. Navigate to Settings → API Access
4. Generate API credentials

Add to your `.env`:

```bash
POLYMARKET_API_KEY=your_api_key
POLYMARKET_API_SECRET=your_api_secret
POLYMARKET_API_PASSPHRASE=your_passphrase
```

### Option 2: Private Key (Advanced)

If you want to use your Ethereum wallet directly:

```bash
POLYMARKET_PRIVATE_KEY=0x... (your Ethereum wallet private key)
```

⚠️ **Security Warning**: Never share your private key. Use a dedicated trading wallet with only the funds you intend to trade.

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TerminatorBot                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │             PlatformRegistry                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │ Kalshi       │  │ Polymarket   │  │ Betfair  │  │    │
│  │  │ (pmxt)       │  │ (pmxt)       │  │ (native) │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                 │
│                     PmxtBroker                              │
│                           │                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │                  pmxt Library                       │    │
│  │  • Local signature server (port 3847)               │    │
│  │  • Handles blockchain auth                          │    │
│  │  • Normalizes API responses                         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │   Polymarket CLOB API │
              │   (Polygon Network)   │
              └───────────────────────┘
```

### pmxt Local Server

The `pmxt` library runs a local signature server for handling blockchain authentication:
- Default port: 3847
- Auto-starts when connecting
- Handles all cryptographic operations locally

## Paper Trading Mode

By default, TerminatorBot runs in paper trading mode:

```bash
TRADING_MODE=PAPER  # Safe default
```

In paper mode:
- Orders are simulated locally
- Starting balance: $10,000 per platform
- No real funds at risk
- Full functionality testing

To go live (use with caution):
```bash
TRADING_MODE=LIVE
```

## Testing Your Setup

### 1. Run Unit Tests

```bash
pytest tests/test_polymarket.py -v
```

### 2. Test Connection (Paper Mode)

```python
import asyncio
from platforms.pmxt_broker import create_polymarket_broker

async def test():
    broker = create_polymarket_broker(dry_run=True)
    connected = await broker.connect()
    print(f"Connected: {connected}")
    
    if connected:
        markets = await broker.fetch_markets(limit=5)
        print(f"Found {len(markets)} markets")
        for m in markets[:3]:
            print(f"  - {m.title[:50]}... (YES: {m.yes_price:.2f})")

asyncio.run(test())
```

### 3. Integration Test (Requires Credentials)

```bash
pytest tests/test_polymarket.py -m integration -v
```

## API Methods

### Available Methods

| Method | Description |
|--------|-------------|
| `connect()` | Initialize connection |
| `fetch_markets(category, limit, query)` | Get available markets |
| `fetch_orderbook(market_id)` | Get order book depth |
| `fetch_balance()` | Get account balance |
| `fetch_positions()` | Get open positions |
| `place_order(market_id, side, quantity, price)` | Place an order |
| `cancel_order(order_id)` | Cancel an order |
| `cancel_all_orders()` | Cancel all orders |
| `health_check()` | Verify connection |

### Example Usage

```python
from platforms.pmxt_broker import create_polymarket_broker

async def trade_example():
    broker = create_polymarket_broker(dry_run=True)
    await broker.connect()
    
    # Fetch markets
    markets = await broker.fetch_markets(category="crypto", limit=10)
    
    # Check balance
    balance = await broker.fetch_balance()
    print(f"Available: ${balance.available:.2f}")
    
    # Place order (dry run)
    order = await broker.place_order(
        market_id="some-market-id",
        side="yes",
        quantity=100,
        price=0.50,  # 50 cents
    )
    print(f"Order: {order.order_id} - {order.status}")
```

## Troubleshooting

### Connection Timeout

If connection times out, pmxt's local server may be slow to start:

```python
# Increase timeout in platform_registry.py
await registry.initialize(timeout_per_platform=60.0)
```

### Auth Errors

1. Verify your API credentials are correct
2. Check that your wallet has been registered with Polymarket
3. Ensure you're not rate-limited

### Market Data Issues

If markets return empty:
- Polymarket API may be temporarily unavailable
- Check their status page
- Try increasing the limit parameter

## Fees

Polymarket has low fees:
- Maker fee: 0% (free to provide liquidity)
- Taker fee: ~0.1%

Fee configuration in `config.py`:
```python
PLATFORM_FEES = {
    "polymarket": 0.001,  # 0.1% average
}
```

## Future Enhancements

- [ ] WebSocket streaming for real-time price updates
- [ ] Advanced order types (FOK, IOC)
- [ ] Historical data fetching
- [ ] Event-based market filtering

## Resources

- [Polymarket Docs](https://docs.polymarket.com/)
- [pmxt Library](https://github.com/pmxt/pmxt)
- [Polymarket Discord](https://discord.gg/polymarket)
