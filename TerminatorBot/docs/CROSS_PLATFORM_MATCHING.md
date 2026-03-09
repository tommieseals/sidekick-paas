# Cross-Platform Market Matching

## Overview

TerminatorBot uses fuzzy string matching to identify the same prediction market across different platforms (Kalshi, Polymarket, etc.). This enables cross-platform arbitrage where price discrepancies can be exploited.

## Architecture

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Kalshi     │    │  Polymarket  │    │  Limitless   │
│   Markets    │    │   Markets    │    │   Markets    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ▼
                   ┌──────────────┐
                   │ MarketMatcher │
                   │  (fuzzy_matcher.py)
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ MarketGraph  │
                   │  (market_graph.py)
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ ArbitrageScanner │
                   │  (arbitrage_scanner.py)
                   └──────────────┘
```

## Components

### MarketMatcher (`src/matching/fuzzy_matcher.py`)

The core matching engine that:
1. **Normalizes titles** - Removes platform-specific formatting
2. **Groups by platform** - Separates markets for cross-matching
3. **Compares pairs** - Uses `rapidfuzz.fuzz.token_sort_ratio`
4. **Filters** - Category and close-date compatibility
5. **Optional LLM verification** - For borderline matches (70-85% similarity)

### Title Normalization

Platform-specific formatting is normalized:

| Platform | Raw Title | Normalized |
|----------|-----------|------------|
| Kalshi | "Will Bitcoin exceed $100,000 by end of 2026?" | "bitcoin exceed 100000 end of 26" |
| Polymarket | "Bitcoin to exceed $100,000 by end of 2026" | "bitcoin exceed 100000 end of 26" |

Normalization handles:
- Prefix removal ("Will ", "Will the ", "Is the ", etc.)
- Polymarket phrases ("to exceed" → "exceed")
- Price formatting ($100,000 → 100000, $100k → 100000)
- Date standardization (January → jan, 2026 → 26)
- Synonym normalization (above/over/more than → above)

### Matching Thresholds

| Threshold | Value | Behavior |
|-----------|-------|----------|
| Auto-accept | ≥85% | Immediate match |
| LLM zone | 70-84% | LLM verification if available |
| Auto-reject | <70% | No match |
| Max date diff | 7 days | Close dates must be within this |

### MarketGraph (`src/matching/market_graph.py`)

Maintains the graph of matched pairs and provides:
- `refresh(markets)` - Rebuild from fresh data
- `get_arb_opportunities(min_edge)` - Get profitable pairs
- `get_all_pairs()` - Get all matches

### ArbitrageScanner (`src/scanners/arbitrage_scanner.py`)

Uses the MarketGraph to find actionable opportunities:
- Calculates net edge after fees
- Filters by minimum liquidity
- Determines urgency (immediate/soon/watch)
- Tracks arb history

## Usage

```python
from matching import MarketMatcher, MarketGraph
from scanners.arbitrage_scanner import ArbitrageScanner
from platforms.platform_registry import PlatformRegistry

# Initialize
registry = PlatformRegistry()
await registry.initialize()

# Fetch markets from all platforms
markets = await registry.fetch_all_markets()

# Create scanner
matcher = MarketMatcher(threshold=85)
graph = MarketGraph(matcher=matcher)
scanner = ArbitrageScanner(market_graph=graph, min_edge=0.02)

# Find opportunities
opportunities = await scanner.scan(markets)

for opp in opportunities:
    print(f"ARB: {opp.market_title}")
    print(f"  Edge: {opp.edge_estimate:.2%}")
    print(f"  Platforms: {opp.platform}")
```

## Matching Accuracy

Based on test suite (`test_cross_platform_matching.py`):

### High Accuracy (>90%)
- Bitcoin price targets: "Will BTC exceed $X" ↔ "BTC to exceed $X"
- Fed rate decisions: "Will Fed cut rates in [month]" ↔ "Fed to cut [month]"
- Simple yes/no events with same wording

### Moderate Accuracy (70-90%)
- Different phrasing: "exceed 50%" vs "above 50%"
- Slight date differences: "March" vs "March 2026"
- Abbreviations: "US" vs "United States"

### Edge Cases & Known Limitations

#### 1. Different Price Targets ⚠️
```
Kalshi: "Will Bitcoin exceed $100,000?"
Polymarket: "Will Bitcoin exceed $200,000?"
```
**Risk**: Fuzzy matching scores ~97% similarity (only difference is the number).

**Mitigation**:
- LLM verification catches this
- Large price discrepancies (e.g., 0.60 vs 0.25) should raise flags
- Future: Extract and compare numeric thresholds

#### 2. Resolution Criteria Differences ⚠️
Same title, different resolution rules.

**Mitigation**:
- Compare `description` field when available
- LLM verification checks resolution criteria

#### 3. Time Zone Differences
"End of 2026" could resolve at different times.

**Mitigation**:
- Close date comparison (±7 days)
- Manual verification for large positions

## Platform-Specific Notes

### Kalshi
- Titles typically start with "Will..."
- Uses US dollars, regulated CFTC
- Lower liquidity but reliable resolution

### Polymarket
- Titles often "X to happen by Y"
- Uses USDC on Polygon
- Higher liquidity, crypto native

### Limitless
- Similar to Polymarket style
- Newer platform, lower liquidity

## Fee Considerations

| Platform | Approximate Fee |
|----------|-----------------|
| Kalshi | 0.3% |
| Polymarket | 0.1% (maker often free) |
| Limitless | 0.2% |
| Buffer | 0.7% (for slippage) |

Minimum arb edge of 2% accounts for fees + buffer.

## Testing

```bash
# Run cross-platform matching tests
cd TerminatorBot
python -m pytest tests/test_cross_platform_matching.py -v

# Run all matching tests
python -m pytest tests/test_fuzzy_matcher.py tests/test_market_graph.py tests/test_arbitrage_scanner.py -v
```

## Configuration

In `src/config.py`:

```python
# Market Matching
FUZZY_MATCH_THRESHOLD = 85       # Auto-accept threshold
FUZZY_LLM_ZONE_LOW = 70          # Below = auto-reject
FUZZY_LLM_ZONE_HIGH = 85         # Above = auto-accept
MATCH_MAX_DATE_DIFF_DAYS = 7     # Max close-date difference

# Arbitrage
ARB_MIN_EDGE_PCT = 0.02          # 2% minimum edge after fees
ARB_FEE_BUFFER = 0.007           # 0.7% buffer for slippage
ARB_MIN_LIQUIDITY = 100          # Minimum contracts each side
```

## Future Improvements

1. **Numeric threshold extraction** - Parse and compare exact numbers
2. **Semantic matching** - Use embeddings for meaning comparison
3. **Resolution criteria matching** - Compare full descriptions
4. **Multi-leg arbitrage** - Match across 3+ platforms simultaneously
5. **Historical match tracking** - Learn from past match accuracy
