# TerminatorBot Architecture

> Deep dive into system design, data flow, and component interactions.

---

## 🏗️ System Overview

TerminatorBot follows a layered architecture with clear separation of concerns:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                             │
│                    CLI Interface + Terminal UI (colorama)                   │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                      │
┌─────────────────────────────────────▼──────────────────────────────────────┐
│                           ORCHESTRATION LAYER                               │
│                   TerminatorController (main.py)                            │
│    - Initializes all subsystems                                             │
│    - Routes CLI commands to appropriate handlers                            │
│    - Manages continuous scanning loop                                       │
│    - Coordinates data flow between components                               │
└───────┬───────────────────┬───────────────────────┬────────────────────────┘
        │                   │                       │
        ▼                   ▼                       ▼
┌───────────────┐   ┌───────────────┐   ┌─────────────────────┐
│  DATA LAYER   │   │ STRATEGY LAYER│   │  EXECUTION LAYER    │
│               │   │               │   │                     │
│ • Platforms   │◄─►│ • Scanners    │──►│ • OrderManager      │
│ • Cache       │   │ • ML Models   │   │ • ArbExecutor       │
│ • Streams     │   │ • Matching    │   │ • DryRunEngine      │
└───────────────┘   └───────────────┘   └──────────┬──────────┘
                                                   │
                    ┌──────────────────────────────▼──────────────────────────┐
                    │                    RISK LAYER                            │
                    │ CircuitBreaker + PositionSizer + Rebalancer             │
                    └─────────────────────────────────────────────────────────┘
```

---

## 📦 Core Components

### 1. TerminatorController (`main.py`)

The central orchestrator that ties all components together.

```python
class TerminatorController:
    """
    Master controller integrating all TerminatorBot subsystems.
    
    Responsibilities:
    - Initialize and connect to all platforms
    - Manage scanner lifecycle
    - Execute trading commands
    - Coordinate risk checks
    """
    
    def __init__(self):
        # Platform layer
        self._registry = PlatformRegistry()
        
        # Matching engine
        self._matcher = MarketMatcher()
        self._market_graph = MarketGraph(matcher=self._matcher)
        
        # Risk infrastructure
        self._circuit_breaker = PortfolioCircuitBreaker()
        
        # Scanners
        self._scanners = {
            "dumb_bet": DumbBetScanner(),
            "contrarian": ContrarianScanner(),
            "arb": ArbitrageScanner(market_graph=self._market_graph),
            "alpha": AlphaScanner(alpha_model=self._alpha_model),
        }
        
        # Execution
        self._order_manager = OrderManager(...)
        self._arb_executor = ArbExecutor(...)
```

**Key Methods:**
- `initialize()` - Connect to platforms, validate credentials
- `cmd_scan(scanner_type)` - Run specific scanner(s)
- `cmd_continuous()` - 24/7 scanning loop
- `_execute_opportunities()` - Route opportunities to execution

---

### 2. Platform Abstraction (`platforms/`)

All platform differences are normalized through abstract interfaces.

#### UnifiedMarket (Data Class)
```python
@dataclass(frozen=True)
class UnifiedMarket:
    """Normalized market representation across all platforms."""
    platform: str          # "kalshi", "polymarket", "betfair"
    market_id: str         # Platform-specific ID
    title: str             # "Will Bitcoin exceed $100K by June?"
    yes_price: float       # 0.0 to 1.0 (probability)
    no_price: float        # Usually 1 - yes_price
    volume: float          # Total contracts traded
    liquidity: float       # Available depth
    close_date: str        # ISO datetime
    status: str            # "open", "closed", "resolved"
```

#### PlatformBroker (Abstract Interface)
```python
class PlatformBroker(ABC):
    """Interface that every platform adapter must implement."""
    
    @abstractmethod
    async def connect(self) -> bool: ...
    
    @abstractmethod
    async def fetch_markets(self, ...) -> list[UnifiedMarket]: ...
    
    @abstractmethod
    async def place_order(self, ...) -> UnifiedOrder: ...
    
    @abstractmethod
    async def fetch_balance(self) -> PlatformBalance: ...
```

#### PlatformRegistry
```python
class PlatformRegistry:
    """
    Manages all platform connections.
    
    - Initializes brokers based on available credentials
    - Provides unified access to all platforms
    - Aggregates balances and markets
    """
    
    async def fetch_all_markets(self) -> list[UnifiedMarket]:
        """Fetch markets from all connected platforms."""
        tasks = [broker.fetch_markets() for broker in self._brokers]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        # Flatten and return
```

---

### 3. Scanner System (`scanners/`)

Scanners are the strategy engines that identify trading opportunities.

#### Opportunity (Output Data Class)
```python
@dataclass
class Opportunity:
    """A detected money-making opportunity."""
    scanner_type: str      # "arb", "dumb_bet", "alpha", "contrarian"
    platform: str          # "kalshi" or "kalshi+polymarket" for arb
    market_id: str         # Platform ID or "id_a|id_b" for arb
    market_title: str
    side: str              # "yes", "no", or "arb"
    price: float           # Entry price (0-1)
    edge_estimate: float   # Expected edge (0-1)
    confidence: float      # Model confidence (0-1)
    reasoning: str         # Human-readable explanation
    
    @property
    def expected_value(self) -> float:
        """EV = edge * confidence."""
        return self.edge_estimate * self.confidence
```

#### BaseScanner Interface
```python
class BaseScanner(ABC):
    """All scanners implement this interface."""
    
    @property
    @abstractmethod
    def scanner_name(self) -> str: ...
    
    @abstractmethod
    async def scan(self, markets: list[UnifiedMarket]) -> list[Opportunity]: ...
```

#### Scanner Data Flow
```
UnifiedMarket[] ──► Scanner.scan() ──► Opportunity[]
                          │
                          ▼
                   Strategy Logic
                   (varies by scanner)
```

---

### 4. Matching Engine (`matching/`)

Identifies the same event across different platforms for arbitrage.

```
┌─────────────────────────────────────────────────────────────────┐
│                      MATCHING PIPELINE                          │
│                                                                 │
│  Markets ──► MarketMatcher ──► MatchedPair[] ──► MarketGraph   │
│                   │                                    │        │
│                   ▼                                    ▼        │
│            ┌──────────────┐              ┌────────────────────┐ │
│            │ FuzzyMatch   │              │ get_arb_opportunities│
│            │ (rapidfuzz)  │              │ (filtered pairs)    │
│            └──────┬───────┘              └────────────────────┘ │
│                   │                                             │
│            ┌──────▼───────┐                                     │
│            │ LLM Verify   │  (for borderline 70-85 scores)     │
│            │ (optional)   │                                     │
│            └──────────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

#### MarketMatcher
```python
class MarketMatcher:
    """Fuzzy matching across platforms."""
    
    def find_matches(self, markets: list[UnifiedMarket]) -> list[MatchedPair]:
        # 1. Group markets by platform
        # 2. Cross-compare each platform pair
        # 3. Apply fuzzy string matching (token_sort_ratio)
        # 4. Filter by category and close date
        # 5. Optional LLM verification for borderline matches
```

#### MatchedPair
```python
class MatchedPair:
    market_a: UnifiedMarket      # First platform
    market_b: UnifiedMarket      # Second platform
    similarity_score: float      # 0-100 fuzzy score
    llm_verified: bool           # Was LLM used?
    combined_yes_cost: float     # YES_a + NO_b price
    arb_edge: float              # 1.0 - combined_cost
    direction: str               # "buy_yes_a_no_b"
```

---

### 5. Risk Management (`core/`)

Three-layer protection system.

#### Circuit Breaker
```
System States:
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ OPERATIONAL │──►│   WARNING   │──►│   LOCKOUT   │──►│   SENTRY    │
│   (Normal)  │   │  (2.5% DD)  │   │  (5% DD)    │   │ (Hourly cap)│
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

```python
class PortfolioCircuitBreaker:
    """Central risk gate."""
    
    def check_health(self, current_balance: float) -> HealthCheck:
        """
        Returns system health status.
        
        Checks:
        1. Daily drawdown vs 5% limit
        2. Hourly loss vs 3% cap
        3. Lockout expiry
        """
    
    def can_take_position(self, position_value, equity) -> PositionCheck:
        """Validate position size against limits."""
    
    def record_scanner_loss(self, scanner_name, loss_amount):
        """Track consecutive losses per scanner."""
    
    def is_scanner_enabled(self, scanner_name) -> bool:
        """Check if scanner is in cooldown."""
```

#### Position Sizer (Kelly Criterion)
```python
class PredictionMarketSizer:
    """Kelly-optimal sizing for prediction markets."""
    
    @staticmethod
    def calculate_kelly_for_bet(
        estimated_prob: float,    # Our model's probability
        market_price: float,      # Current market price
        kelly_fraction: float,    # 0.5 = half Kelly
        num_correlated_bets: int, # Existing similar positions
    ) -> float:
        """
        Kelly formula for prediction markets:
        
        f* = (p * b - q) / b
        
        where:
            p = estimated true probability
            b = (1/market_price) - 1  (net odds)
            q = 1 - p
        """
```

#### Conviction Levels
```python
class ConvictionLevel(Enum):
    LOW = "LOW"           # Max 1% position
    STANDARD = "STANDARD" # Max 2% position  
    HIGH = "HIGH"         # Max 3.5% position
    TERMINATOR = "TERMINATOR"  # Max 5% position
```

---

### 6. Execution Layer (`execution/`)

Handles order routing and execution.

```
┌─────────────────────────────────────────────────────────────────┐
│                     EXECUTION PIPELINE                          │
│                                                                 │
│  Opportunity                                                    │
│       │                                                         │
│       ▼                                                         │
│  ┌────────────────────┐                                        │
│  │ Circuit Breaker    │◄── Health check                        │
│  │ Gate               │                                        │
│  └─────────┬──────────┘                                        │
│            │ PASS                                               │
│            ▼                                                    │
│  ┌────────────────────┐                                        │
│  │ Position Sizer     │◄── Kelly calculation                   │
│  │ (Kelly)            │                                        │
│  └─────────┬──────────┘                                        │
│            │                                                    │
│            ▼                                                    │
│  ┌─────────────────────────────────────┐                       │
│  │              ROUTER                  │                       │
│  │  ┌─────────────┐  ┌─────────────┐   │                       │
│  │  │ OrderManager│  │ ArbExecutor │   │                       │
│  │  │ (single-leg)│  │ (dual-leg)  │   │                       │
│  │  └──────┬──────┘  └──────┬──────┘   │                       │
│  └─────────┼────────────────┼──────────┘                       │
│            │                │                                   │
│            ▼                ▼                                   │
│  ┌──────────────┐  ┌──────────────────┐                        │
│  │ Live Broker  │  │ DryRunEngine     │                        │
│  │ (platform)   │  │ (paper trading)  │                        │
│  └──────────────┘  └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

#### OrderManager
```python
class OrderManager:
    """Unified order pipeline for single-leg trades."""
    
    async def execute_opportunity(self, opp: Opportunity, equity: float):
        # 1. Circuit breaker check
        # 2. Scanner-specific check
        # 3. Calculate position size (Kelly)
        # 4. Route to broker or dry-run engine
        # 5. Log trade to SQLite
        # 6. Send alert
```

#### ArbExecutor
```python
class ArbExecutor:
    """Executes dual-leg arbitrage trades."""
    
    async def execute_arb(self, opp: Opportunity, equity: float):
        # 1. Parse market IDs (id_a|id_b)
        # 2. Calculate split between legs
        # 3. Execute both legs atomically (best effort)
        # 4. Handle partial fills
```

---

### 7. ML Layer (`ml/`)

Machine learning for alpha generation.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ML PIPELINE                              │
│                                                                 │
│  UnifiedMarket                                                  │
│       │                                                         │
│       ▼                                                         │
│  ┌────────────────────┐                                        │
│  │  Feature Engine    │                                        │
│  │  - Price features  │                                        │
│  │  - Volume features │                                        │
│  │  - Time features   │                                        │
│  │  - Sentiment       │                                        │
│  └─────────┬──────────┘                                        │
│            │                                                    │
│            ▼                                                    │
│  ┌────────────────────┐      ┌────────────────────┐            │
│  │  SentimentScorer   │──────│    TextBlob        │            │
│  │  (NLP analysis)    │      │    (polarity)      │            │
│  └─────────┬──────────┘      └────────────────────┘            │
│            │                                                    │
│            ▼                                                    │
│  ┌────────────────────┐      ┌────────────────────┐            │
│  │   Alpha Model      │──────│    XGBoost         │            │
│  │   (prediction)     │      │    (classifier)    │            │
│  └─────────┬──────────┘      └────────────────────┘            │
│            │                                                    │
│            ▼                                                    │
│  (estimated_prob, confidence)                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### AlphaModel
```python
class AlphaModel:
    """XGBoost-based probability predictor."""
    
    def train(self, X: np.ndarray, y: np.ndarray) -> dict:
        """Train on historical resolved markets."""
    
    def predict(self, market: UnifiedMarket) -> tuple[float, float]:
        """Returns (estimated_probability, confidence)."""
    
    def load(self) -> bool:
        """Load pre-trained model from disk."""
```

---

## 🔄 Data Flow - Continuous Mode

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         CONTINUOUS SCANNING LOOP                          │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                         Every 60 seconds                            │  │
│  │                                                                     │  │
│  │  1. Health Check ────────────────────────────────────────────────┐ │  │
│  │     │                                                            │ │  │
│  │     │ LOCKOUT/SENTRY? ──► Sleep & Retry                         │ │  │
│  │     │                                                            │ │  │
│  │     ▼ PASS                                                       │ │  │
│  │  2. Fetch Markets ◄──────── All Platforms (async)                │ │  │
│  │     │                                                            │ │  │
│  │     ▼                                                            │ │  │
│  │  3. Run Scanners ◄────────── Parallel (asyncio.gather)          │ │  │
│  │     │                                                            │ │  │
│  │     ▼                                                            │ │  │
│  │  4. Aggregate Opportunities                                      │ │  │
│  │     │                                                            │ │  │
│  │     ▼                                                            │ │  │
│  │  5. Sort by Expected Value                                       │ │  │
│  │     │                                                            │ │  │
│  │     ▼                                                            │ │  │
│  │  6. Execute Top 10 ──────────► OrderManager / ArbExecutor       │ │  │
│  │     │                                                            │ │  │
│  │     ▼                                                            │ │  │
│  │  7. Log & Alert                                                  │ │  │
│  │     │                                                            │ │  │
│  │     ▼                                                            │ │  │
│  │  8. Check Rebalance ─────────► CrossPlatformRebalancer          │ │  │
│  │                                                                  │ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                       │
│                                ▼                                       │
│                         Sleep 60 seconds                               │
│                                │                                       │
│                                └─────── Loop ───────────────────────►  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Data Storage

### SQLite Trade Log
```sql
-- Trades table
CREATE TABLE trades (
    id INTEGER PRIMARY KEY,
    timestamp TEXT,
    platform TEXT,
    market_id TEXT,
    market_title TEXT,
    side TEXT,
    quantity INTEGER,
    price REAL,
    order_id TEXT,
    scanner_type TEXT,
    pnl REAL,
    resolved BOOLEAN
);

-- Opportunities table
CREATE TABLE opportunities (
    id INTEGER PRIMARY KEY,
    timestamp TEXT,
    scanner_type TEXT,
    platform TEXT,
    market_id TEXT,
    market_title TEXT,
    side TEXT,
    edge REAL,
    confidence REAL,
    reasoning TEXT
);
```

### Market Cache
- In-memory LRU cache
- TTL-based expiration
- Reduces API calls during rapid scanning

---

## 🔐 Security Considerations

1. **API Keys** - Stored in `.env` file, never committed
2. **Private Keys** - For Polymarket (Ethereum), stored securely
3. **Paper Mode** - Default mode prevents accidental live trading
4. **Rate Limiting** - Built into platform adapters
5. **Input Validation** - All external data validated before processing

---

## 🧪 Testing Strategy

```
tests/
├── unit/
│   ├── test_scanners.py      # Individual scanner logic
│   ├── test_matching.py      # Fuzzy matching
│   ├── test_circuit_breaker.py
│   └── test_position_sizer.py
├── integration/
│   ├── test_platforms.py     # API integration
│   └── test_execution.py
└── fixtures/
    └── sample_markets.json
```

Run tests:
```bash
pytest tests/ -v --cov=src
```

---

## 🚀 Performance Considerations

1. **Async I/O** - All platform calls are async for parallel execution
2. **Caching** - Market data cached to reduce API calls
3. **Batch Processing** - Markets processed in batches
4. **Connection Pooling** - Reused HTTP connections
5. **Lazy Loading** - ML model loaded only when needed

---

## 📈 Scaling Architecture

For high-frequency operation:

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   Collector    │────►│   Redis/Queue  │◄────│   Executor     │
│   (Streams)    │     │                │     │   (Orders)     │
└────────────────┘     └────────────────┘     └────────────────┘
                              │
                              ▼
                    ┌────────────────┐
                    │   Analyzer     │
                    │   (Scanners)   │
                    └────────────────┘
```

This would separate:
- Data collection (real-time streams)
- Analysis (scanner processing)
- Execution (order management)

Currently, TerminatorBot runs as a monolith suitable for individual use.
