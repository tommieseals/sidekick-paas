# TerminatorBot Scanner Strategies

> Detailed explanation of each trading strategy and how to optimize them.

---

## 📊 Strategy Overview

TerminatorBot employs four distinct scanners, each targeting different market inefficiencies:

| Scanner | Risk Level | Typical Edge | Hold Time | Capital Allocation |
|---------|------------|--------------|-----------|-------------------|
| **Arbitrage** | Low | 2-5% | Minutes | 5-15% per arb |
| **Dumb Bet** | Low | 3-10% | Days-Weeks | 2-5% per bet |
| **Alpha** | Medium | 5-15% | Hours-Days | 1-3% per trade |
| **Contrarian** | Medium | 5-20% | Days-Weeks | 1-2% per bet |

---

## 🔀 1. Arbitrage Scanner

### Concept

Cross-platform arbitrage exploits price discrepancies for the **same event** across different prediction markets. When you can buy YES on one platform and NO on another for less than $1.00 combined, you lock in a guaranteed profit.

### How It Works

```
Market: "Will Bitcoin exceed $100K by June 30?"

Platform A (Kalshi):    YES = $0.45, NO = $0.55
Platform B (Polymarket): YES = $0.52, NO = $0.48

Strategy:
  Buy YES on Kalshi @ $0.45
  Buy NO on Polymarket @ $0.48
  Total cost: $0.93

Outcome (Either way):
  If YES: Kalshi pays $1.00, Polymarket loses $0.48 → Net: +$0.07
  If NO:  Kalshi loses $0.45, Polymarket pays $1.00 → Net: +$0.07

Guaranteed profit: 7.5% ($0.07 / $0.93)
```

### Implementation Details

```python
class ArbitrageScanner(BaseScanner):
    """
    1. Use MarketGraph to find matched pairs across platforms
    2. Calculate combined YES+NO cost for each pair
    3. Subtract fees (platform fees + slippage buffer)
    4. Filter by minimum edge (default: 2%)
    5. Filter by minimum liquidity (default: 100 contracts)
    """
```

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `ARB_MIN_EDGE_PCT` | 0.02 (2%) | Minimum edge after fees |
| `ARB_FEE_BUFFER` | 0.007 (0.7%) | Slippage/fee cushion |
| `ARB_MIN_LIQUIDITY` | 100 | Minimum volume per side |
| `KELLY_ARB_FRACTION` | 0.75 | Aggressive Kelly (low risk) |

### Matching Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│                    MATCHING PIPELINE                        │
│                                                             │
│  1. Normalize titles                                        │
│     "Will the Lakers win?" → "lakers win"                  │
│                                                             │
│  2. Fuzzy match (rapidfuzz token_sort_ratio)               │
│     Score 0-100, threshold: 85                             │
│                                                             │
│  3. Category filter                                         │
│     "sports" matches "sports", not "politics"              │
│                                                             │
│  4. Date proximity check                                    │
│     Close dates within 7 days                              │
│                                                             │
│  5. Optional LLM verification (70-85 zone)                 │
│     GPT-4 confirms semantic equivalence                    │
└─────────────────────────────────────────────────────────────┘
```

### When Arbs Fail

- **Execution risk**: One leg fills, other doesn't
- **Price movement**: Markets move during execution
- **Settlement differences**: Different resolution criteria
- **Fee underestimation**: Hidden fees or spreads

### Optimization Tips

1. **Prioritize liquidity** - Better to get 2% with certainty than 5% with 50% fill
2. **Use LLM verification** - Reduces false matches significantly
3. **Execute simultaneously** - Use `ArbExecutor` for dual-leg orders
4. **Monitor open arbs** - Track until resolution

---

## 🎯 2. Dumb Bet Scanner

### Concept

"Dumb bets" are markets where one side is priced so cheaply that it's essentially free money. These typically involve near-impossible events where the market assigns <10% probability, but you estimate it's even lower.

### Classic Examples

```
"Will aliens make contact by December 2025?"
Market: YES = $0.03, NO = $0.97

Your analysis: Probability ~0.1% (not 3%)
Buy NO at $0.97 → Win $0.03 if no aliens (99.9% likely)

Expected Value:
  0.999 × $0.03 - 0.001 × $0.97 = $0.029 per contract
  ~3% return on nearly certain outcome
```

### Implementation Details

```python
class DumbBetScanner(BaseScanner):
    """
    1. Filter markets by minimum volume (500 contracts)
    2. Find prices < 10% or > 90%
    3. Exclude gamified/subjective markets (word count, mentions)
    4. Exclude markets closing within 24 hours
    5. Apply overconfidence bias adjustment (15%)
    6. Calculate edge: (1 - estimated_prob) - price
    """
```

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `DUMB_BET_MAX_PROB` | 0.10 (10%) | Max price for cheap side |
| `DUMB_BET_MIN_VOLUME` | 500 | Minimum liquidity |
| `CONTRARIAN_OVERCONFIDENCE_BIAS` | 0.15 | Crowd overestimates by 15% |
| `KELLY_DUMB_BET_FRACTION` | 0.60 | Moderately aggressive |

### Excluded Keywords

```python
DUMB_BET_EXCLUDE_KEYWORDS = [
    "mention",           # "Will Elon mention Dogecoin?"
    "word",              # "Will Biden say 'democracy'?"
    "parlay",            # Multi-leg combinations
    "weather forecast",  # Gamified weather markets
]
```

### Edge Calculation

```python
def calculate_dumb_bet_edge(cheap_price: float, bias: float = 0.15) -> float:
    """
    Our estimated probability that cheap side wins,
    adjusted for crowd overconfidence.
    
    If market says 3% chance of YES:
      - Crowd thinks: 3%
      - We think: 3% × (1 + 0.15) = 3.45%
      - Still very unlikely!
      
    Edge = (1 - estimated_prob) - cheap_price
         = (1 - 0.0345) - 0.03
         = 0.9655 - 0.03
         = 0.9355 × $0.03 = ~$0.028 profit per $0.97 risked
    """
```

### Risk Factors

- **Liquidity lock**: Money tied up until resolution
- **Black swan events**: Unlikely ≠ impossible
- **Resolution ambiguity**: Market may resolve unexpectedly
- **Platform risk**: Exchange default or regulatory issues

### Optimization Tips

1. **Diversify across events** - Don't concentrate in one theme
2. **Check resolution criteria** - Read the fine print
3. **Avoid subjective markets** - "Will X be popular?" is risky
4. **Set calendar alerts** - Track resolution dates

---

## 🤖 3. Alpha Scanner

### Concept

The Alpha Scanner uses machine learning to identify markets where our predicted probability differs significantly from the market price. When the model believes the market is mispriced by >5%, we have "alpha."

### How It Works

```
Market: "Will the Fed cut rates in March?"
Market price: YES = $0.35

Alpha Model prediction:
  - Historical data shows 60% cut probability with current indicators
  - Sentiment analysis: 65% positive
  - Estimated probability: 55%

Alpha calculation:
  Our estimate: 55%
  Market price: 35%
  Edge on YES: 55% - 35% = 20% edge

Action: Buy YES at $0.35 (20% edge, high confidence)
```

### ML Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                      ALPHA PIPELINE                         │
│                                                             │
│  UnifiedMarket                                              │
│       │                                                     │
│       ▼                                                     │
│  ┌────────────────┐                                        │
│  │ Feature Engine │                                        │
│  │                │                                        │
│  │ • yes_price    │  (normalized price)                    │
│  │ • no_price     │                                        │
│  │ • price_spread │  (bid-ask proxy)                       │
│  │ • log_volume   │  (liquidity signal)                    │
│  │ • log_oi       │  (open interest)                       │
│  │ • days_to_close│  (time decay)                          │
│  │ • category_enc │  (one-hot encoded)                     │
│  │ • sentiment    │  (TextBlob polarity)                   │
│  └────────┬───────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌────────────────┐      ┌─────────────────────┐          │
│  │  XGBoost Model │◄─────│ Trained on resolved │          │
│  │                │      │ historical markets  │          │
│  └────────┬───────┘      └─────────────────────┘          │
│           │                                                 │
│           ▼                                                 │
│  (estimated_prob, confidence)                               │
│           │                                                 │
│           ▼                                                 │
│  Compare to market price → Generate Opportunity             │
└─────────────────────────────────────────────────────────────┘
```

### Training the Model

```bash
# Train on synthetic data (demo) or historical resolved markets
python src/main.py --train

# Output:
# Model trained! Accuracy: 0.683 (+/- 0.045) on 2000 samples
#
# Feature Importance:
#   yes_price          0.2341 ############
#   days_to_close      0.1823 #########
#   sentiment_score    0.1456 #######
#   log_volume         0.1234 ######
#   ...
```

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `ALPHA_EDGE_THRESHOLD` | 0.05 (5%) | Minimum edge to trade |
| `ALPHA_CONFIDENCE_THRESHOLD` | 0.70 | Minimum model confidence |
| `KELLY_FRACTION` | 0.50 | Half Kelly (conservative) |

### Fallback: Heuristic Mode

When no ML model is available, uses sentiment analysis:

```python
def _heuristic_prediction(self, market: UnifiedMarket):
    """
    Fallback when ML model is unavailable.
    
    Uses TextBlob sentiment analysis on market title.
    Confidence is low (0.55) since this is just NLP.
    """
    sentiment_prob = self._sentiment.score_market(market.title)
    return (sentiment_prob, 0.55)
```

### Feature Engineering

```python
def extract_features(market: UnifiedMarket) -> np.ndarray:
    return np.array([
        market.yes_price,                    # Price signal
        market.no_price,
        abs(market.yes_price - 0.5),         # Distance from 50/50
        np.log1p(market.volume),             # Log volume
        np.log1p(market.liquidity),
        np.log1p(market.open_interest),
        self._days_until_close(market),      # Time decay
        self._sentiment.score(market.title), # NLP sentiment
        *self._encode_category(market.category),  # One-hot
    ])
```

### Optimization Tips

1. **Collect more data** - Model improves with more resolved markets
2. **Specialize by category** - Train separate models per category
3. **Combine with sentiment** - News events can provide short-term alpha
4. **Validate with backtests** - Test on held-out historical data

---

## 🔄 4. Contrarian Scanner

### Concept

When markets show extreme consensus (>85% on one side), crowds tend to overestimate probabilities due to:
- **Availability bias** - Recent news overweighted
- **Anchoring** - Initial price influences perception
- **Herding** - Following the crowd

### The Math

```
Market: "Will incumbent win re-election?"
Price: YES = $0.92, NO = $0.08

Crowd thinks: 92% probability of YES

Research shows: At 92%, true probability is often ~77-80%
  - Overconfidence bias: 15%
  - Adjusted probability: 92% - (92% × 15%) = 78.2%

Edge on NO:
  - True NO probability: 100% - 78.2% = 21.8%
  - Market NO price: $0.08
  - Edge: 21.8% - 8% = 13.8%

Buy NO at $0.08 with 13.8% theoretical edge
```

### Implementation Details

```python
class ContrarianScanner(BaseScanner):
    """
    1. Filter for extreme prices (>85% one side)
    2. Apply overconfidence bias adjustment (15%)
    3. Calculate adjusted probability
    4. Compute edge against the crowd
    5. Cap confidence at 0.60 (high uncertainty)
    """
    
    def _estimate_edge(self, consensus_price: float) -> float:
        if consensus_price < 0.85:
            return 0.0
        
        overestimate = consensus_price * 0.15  # 15% bias
        adjusted_prob = consensus_price - overestimate
        edge = consensus_price - adjusted_prob - (1 - consensus_price)
        return max(0.0, edge)
```

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `CONTRARIAN_CONSENSUS_THRESHOLD` | 0.85 (85%) | Minimum consensus to trigger |
| `CONTRARIAN_OVERCONFIDENCE_BIAS` | 0.15 (15%) | Assumed crowd overestimation |

### When Contrarian Works

- **Political elections** - Overconfidence in favorites
- **Sports championships** - Fan bias
- **Crypto predictions** - FOMO and FUD cycles
- **Any "sure thing"** - Nothing is 100%

### When Contrarian Fails

- **True certainties** - "Will the sun rise tomorrow?"
- **Near-expiration** - Information fully priced in
- **Low liquidity** - Wide spreads eat the edge
- **Insider information** - Market knows something you don't

### Optimization Tips

1. **Increase threshold** - Try 90% for higher-conviction bets
2. **Combine with news** - Look for catalysts that could upset consensus
3. **Avoid last-minute** - Prices stabilize near resolution
4. **Position size small** - High variance strategy

---

## ⚖️ Position Sizing (Kelly Criterion)

All scanners use Kelly-optimal sizing:

```python
def kelly_for_prediction_market(
    estimated_prob: float,  # Our probability estimate
    market_price: float,    # Current market price
    kelly_fraction: float = 0.5,  # Fractional Kelly
) -> float:
    """
    Kelly formula adapted for prediction markets.
    
    Standard Kelly: f* = (bp - q) / b
    where:
        p = estimated true probability
        q = 1 - p
        b = (1/market_price) - 1  (net odds)
    
    Example:
        estimated_prob = 0.60 (we think 60%)
        market_price = 0.40 (market says 40%)
        
        b = (1/0.40) - 1 = 1.5
        full_kelly = (1.5 × 0.60 - 0.40) / 1.5
                   = (0.90 - 0.40) / 1.5
                   = 0.333 (33% of bankroll!)
        
        half_kelly = 0.333 × 0.5 = 0.167 (16.7%)
    """
```

### Kelly Fractions by Strategy

| Strategy | Kelly Fraction | Max Position | Rationale |
|----------|----------------|--------------|-----------|
| Arbitrage | 0.75 | 15% | Low risk, guaranteed |
| Dumb Bet | 0.60 | 5% | High confidence |
| Alpha | 0.50 | 3% | Model uncertainty |
| Contrarian | 0.50 | 2% | High variance |

### Correlation Penalty

When you have multiple similar positions:

```python
# Reduce Kelly by 15% per correlated bet
penalty = 1.0 - (0.15 * num_correlated_bets)
adjusted_kelly = base_kelly * max(penalty, 0.10)
```

---

## 🎚️ Tuning Your Strategy Mix

### Conservative (New Users)

```python
# Focus on low-risk strategies
ARB_MIN_EDGE_PCT = 0.03        # Only 3%+ arbs
DUMB_BET_MAX_PROB = 0.05       # Only 5% max price
ALPHA_EDGE_THRESHOLD = 0.08    # Only 8%+ edge
KELLY_FRACTION = 0.40          # Very conservative
```

### Balanced (Intermediate)

```python
# Default settings
ARB_MIN_EDGE_PCT = 0.02
DUMB_BET_MAX_PROB = 0.10
ALPHA_EDGE_THRESHOLD = 0.05
KELLY_FRACTION = 0.50
```

### Aggressive (Advanced)

```python
# Higher risk for higher returns
ARB_MIN_EDGE_PCT = 0.015       # Take smaller arbs
DUMB_BET_MAX_PROB = 0.12       # Wider net
ALPHA_EDGE_THRESHOLD = 0.03    # More trades
KELLY_FRACTION = 0.65          # Larger sizes
CONTRARIAN_CONSENSUS_THRESHOLD = 0.80  # More contrarian
```

---

## 📈 Expected Performance

Based on backtesting and theoretical analysis:

| Strategy | Expected Sharpe | Win Rate | Avg Hold |
|----------|----------------|----------|----------|
| Arbitrage | 2.5+ | 95%+ | Hours |
| Dumb Bet | 1.5-2.0 | 90%+ | Weeks |
| Alpha | 0.8-1.5 | 55-65% | Days |
| Contrarian | 0.6-1.2 | 40-50% | Weeks |

**Note**: Actual results will vary. Paper trade extensively before going live.

---

## 🔧 Debugging Strategies

### View Scanner Output

```bash
# Verbose scan
LOG_LEVEL=DEBUG python src/main.py --scan alpha
```

### Analyze Opportunity Quality

```python
# In Python
from src.scanners.dumb_bet_scanner import DumbBetScanner
from src.platforms.demo_broker import DemoBroker

scanner = DumbBetScanner()
broker = DemoBroker()
markets = await broker.fetch_markets()
opps = await scanner.scan(markets)

for opp in opps[:5]:
    print(f"{opp.market_title[:40]}")
    print(f"  Side: {opp.side}, Price: ${opp.price:.3f}")
    print(f"  Edge: {opp.edge_estimate:.2%}, Conf: {opp.confidence:.2f}")
    print(f"  EV: {opp.expected_value:.4f}")
    print()
```

### Monitor Strategy Performance

```sql
-- Query trade history by scanner
SELECT 
    scanner_type,
    COUNT(*) as trades,
    AVG(pnl) as avg_pnl,
    SUM(pnl) as total_pnl
FROM trades
WHERE resolved = 1
GROUP BY scanner_type;
```

---

## 🚨 Risk Warnings

1. **No guaranteed profits** - Even arbs can fail
2. **Correlation risk** - Multiple bets on same theme
3. **Platform risk** - Exchanges can fail or freeze funds
4. **Regulatory risk** - Laws change
5. **Model decay** - ML models need retraining

Always size positions conservatively and never risk more than you can lose.
