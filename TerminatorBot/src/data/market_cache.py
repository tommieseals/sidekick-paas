"""
TerminatorBot - Market Data Cache

In-memory + SQLite cache with TTL management, stale price detection,
and efficient batch operations for real-time market data.
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
import threading
from collections import OrderedDict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Optional

from .validators import DataValidator, ValidationResult

# Conditional imports for type hints
try:
    from platforms.base import UnifiedMarket
except ImportError:
    UnifiedMarket = None

logger = logging.getLogger(__name__)

DB_DIR = Path(__file__).parent.parent.parent / "data"


@dataclass
class CacheEntry:
    """Wrapper for cached market with metadata."""
    market: object  # UnifiedMarket
    cached_at: datetime
    ttl_seconds: float
    access_count: int = 0
    last_accessed: datetime = None
    
    def __post_init__(self):
        if self.last_accessed is None:
            self.last_accessed = self.cached_at
    
    @property
    def is_expired(self) -> bool:
        """Check if entry has exceeded TTL."""
        age = (datetime.now(timezone.utc) - self.cached_at).total_seconds()
        return age > self.ttl_seconds
    
    @property
    def age_seconds(self) -> float:
        """Get age of cache entry in seconds."""
        return (datetime.now(timezone.utc) - self.cached_at).total_seconds()
    
    def touch(self) -> None:
        """Update access metadata."""
        self.access_count += 1
        self.last_accessed = datetime.now(timezone.utc)


class MarketCache:
    """
    Two-tier cache: in-memory LRU + SQLite for persistence.

    Features:
    - TTL-based expiration
    - LRU eviction for memory management
    - Stale price detection
    - Price history tracking
    - Thread-safe operations
    - Batch operations for efficiency
    """

    # Default TTL values (seconds)
    DEFAULT_TTL = 60  # 1 minute for live prices
    STALE_THRESHOLD = 300  # 5 minutes = stale
    MAX_MEMORY_ENTRIES = 10000  # LRU limit

    def __init__(
        self,
        db_path: str | None = None,
        default_ttl: float = DEFAULT_TTL,
        max_memory_entries: int = MAX_MEMORY_ENTRIES,
    ):
        self._db_path = Path(db_path) if db_path else DB_DIR / "market_cache.db"
        self._default_ttl = default_ttl
        self._max_entries = max_memory_entries
        
        # Thread-safe LRU cache
        self._memory: OrderedDict[str, CacheEntry] = OrderedDict()
        self._lock = threading.RLock()
        
        self._conn: sqlite3.Connection | None = None
        self._validator = DataValidator()
        self._init_db()
        
        # Callbacks for cache events
        self._on_evict: list[Callable[[str, object], None]] = []
        self._on_stale: list[Callable[[str, object], None]] = []

    def _init_db(self) -> None:
        """Initialize SQLite database with enhanced schema."""
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self._db_path), check_same_thread=False)
        self._conn.execute("PRAGMA journal_mode=WAL")
        
        # Main market cache table
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS markets (
                cache_key TEXT PRIMARY KEY,
                platform TEXT NOT NULL,
                market_id TEXT NOT NULL,
                title TEXT,
                yes_price REAL,
                no_price REAL,
                volume REAL DEFAULT 0,
                liquidity REAL DEFAULT 0,
                category TEXT,
                close_date TEXT,
                status TEXT DEFAULT 'open',
                raw_json TEXT,
                updated_at TEXT NOT NULL,
                access_count INTEGER DEFAULT 0
            )
        """)
        
        # Price history for trend analysis
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS price_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                market_id TEXT NOT NULL,
                yes_price REAL NOT NULL,
                no_price REAL NOT NULL,
                volume REAL DEFAULT 0,
                spread REAL DEFAULT 0,
                timestamp TEXT NOT NULL
            )
        """)
        
        # Indexes
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_price_history_market
            ON price_history(platform, market_id, timestamp DESC)
        """)
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_markets_updated
            ON markets(updated_at DESC)
        """)
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_markets_platform
            ON markets(platform)
        """)
        
        self._conn.commit()

    # ─────────────────────────────────────────────────────────────────
    # Cache Operations
    # ─────────────────────────────────────────────────────────────────

    def put(
        self,
        market,  # UnifiedMarket
        ttl: float | None = None,
        validate: bool = True,
    ) -> bool:
        """
        Store a market in both memory and SQLite.
        
        Args:
            market: UnifiedMarket to cache
            ttl: Time-to-live in seconds (None = default)
            validate: Whether to validate data before caching
            
        Returns:
            True if cached successfully, False if validation failed
        """
        if validate:
            validation = self._validator.validate_market_data(
                yes_price=market.yes_price,
                no_price=market.no_price,
                volume=market.volume,
            )
            if not validation.is_valid:
                logger.warning(
                    "Skipping invalid market %s: %s",
                    market.market_id, validation.errors
                )
                return False

        key = f"{market.platform}:{market.market_id}"
        now = datetime.now(timezone.utc)
        ttl = ttl if ttl is not None else self._default_ttl

        with self._lock:
            # Check for stale data callbacks
            if key in self._memory:
                old_entry = self._memory[key]
                if self._is_price_stale(old_entry.market, market):
                    self._notify_stale(key, market)

            # Create cache entry
            entry = CacheEntry(
                market=market,
                cached_at=now,
                ttl_seconds=ttl,
            )
            
            # LRU eviction if needed
            if len(self._memory) >= self._max_entries:
                self._evict_oldest()
            
            # Update memory cache (move to end for LRU)
            self._memory[key] = entry
            self._memory.move_to_end(key)

        # Persist to SQLite
        self._persist_market(market, now)
        
        # Record price history
        self._record_price(market, now)
        
        return True

    def put_batch(
        self,
        markets: list,  # list[UnifiedMarket]
        ttl: float | None = None,
        validate: bool = True,
    ) -> int:
        """
        Store multiple markets efficiently.
        
        Returns count of successfully cached markets.
        """
        now = datetime.now(timezone.utc)
        ttl = ttl if ttl is not None else self._default_ttl
        
        valid_markets = []
        for market in markets:
            if validate:
                validation = self._validator.validate_market_data(
                    yes_price=market.yes_price,
                    no_price=market.no_price,
                    volume=market.volume,
                )
                if not validation.is_valid:
                    continue
            valid_markets.append(market)

        with self._lock:
            for market in valid_markets:
                key = f"{market.platform}:{market.market_id}"
                
                # LRU eviction
                while len(self._memory) >= self._max_entries:
                    self._evict_oldest()
                
                entry = CacheEntry(
                    market=market,
                    cached_at=now,
                    ttl_seconds=ttl,
                )
                self._memory[key] = entry
                self._memory.move_to_end(key)

        # Batch persist to SQLite
        self._persist_markets_batch(valid_markets, now)
        
        return len(valid_markets)

    def get(
        self,
        platform: str,
        market_id: str,
        allow_stale: bool = False,
    ) -> object | None:  # UnifiedMarket | None
        """
        Get a market from cache.
        
        Args:
            platform: Platform name
            market_id: Market identifier
            allow_stale: If False, returns None for expired entries
            
        Returns:
            UnifiedMarket or None if not found/expired
        """
        key = f"{platform}:{market_id}"
        
        with self._lock:
            entry = self._memory.get(key)
            
            if entry is None:
                # Try loading from SQLite
                return self._load_from_db(key)
            
            # Check TTL
            if entry.is_expired and not allow_stale:
                self._evict_key(key)
                return None
            
            # Update access metadata and LRU position
            entry.touch()
            self._memory.move_to_end(key)
            
            return entry.market

    def get_all(
        self,
        platform: str | None = None,
        include_stale: bool = False,
    ) -> list:  # list[UnifiedMarket]
        """
        Get all cached markets, optionally filtered by platform.
        
        Args:
            platform: Filter by platform (None = all)
            include_stale: Whether to include expired entries
        """
        with self._lock:
            markets = []
            for key, entry in list(self._memory.items()):
                if entry.is_expired and not include_stale:
                    continue
                if platform and entry.market.platform != platform:
                    continue
                markets.append(entry.market)
            return markets

    def get_fresh(
        self,
        max_age_seconds: float = 60,
    ) -> list:  # list[UnifiedMarket]
        """Get only recently updated markets."""
        with self._lock:
            markets = []
            for entry in self._memory.values():
                if entry.age_seconds <= max_age_seconds:
                    markets.append(entry.market)
            return markets

    # ─────────────────────────────────────────────────────────────────
    # TTL & Staleness
    # ─────────────────────────────────────────────────────────────────

    def is_stale(self, platform: str, market_id: str) -> bool:
        """Check if a cached market is stale (exceeded STALE_THRESHOLD)."""
        key = f"{platform}:{market_id}"
        with self._lock:
            entry = self._memory.get(key)
            if entry is None:
                return True
            return entry.age_seconds > self.STALE_THRESHOLD

    def get_staleness(self, platform: str, market_id: str) -> float:
        """Get staleness as a ratio (0 = fresh, 1 = at threshold, >1 = stale)."""
        key = f"{platform}:{market_id}"
        with self._lock:
            entry = self._memory.get(key)
            if entry is None:
                return float('inf')
            return entry.age_seconds / self.STALE_THRESHOLD

    def refresh_ttl(
        self,
        platform: str,
        market_id: str,
        new_ttl: float | None = None,
    ) -> bool:
        """
        Reset TTL for a cached market.
        
        Returns True if market was found and refreshed.
        """
        key = f"{platform}:{market_id}"
        with self._lock:
            entry = self._memory.get(key)
            if entry is None:
                return False
            entry.cached_at = datetime.now(timezone.utc)
            if new_ttl is not None:
                entry.ttl_seconds = new_ttl
            return True

    def cleanup_expired(self) -> int:
        """Remove all expired entries. Returns count removed."""
        count = 0
        with self._lock:
            expired_keys = [
                key for key, entry in self._memory.items()
                if entry.is_expired
            ]
            for key in expired_keys:
                self._evict_key(key)
                count += 1
        return count

    def _is_price_stale(self, old_market, new_market) -> bool:
        """Check if price change indicates stale data."""
        price_diff = abs(new_market.yes_price - old_market.yes_price)
        return price_diff > 0.20  # 20% change = likely stale gap

    # ─────────────────────────────────────────────────────────────────
    # Price History
    # ─────────────────────────────────────────────────────────────────

    def get_price_history(
        self,
        platform: str,
        market_id: str,
        limit: int = 100,
        since: datetime | None = None,
    ) -> list[dict]:
        """
        Get price history for a market.
        
        Returns list of price snapshots sorted by timestamp ascending.
        """
        query = """
            SELECT yes_price, no_price, volume, spread, timestamp
            FROM price_history
            WHERE platform = ? AND market_id = ?
        """
        params = [platform, market_id]
        
        if since:
            query += " AND timestamp >= ?"
            params.append(since.isoformat())
            
        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)
        
        cursor = self._conn.execute(query, params)
        results = [
            {
                "yes_price": r[0],
                "no_price": r[1],
                "volume": r[2],
                "spread": r[3],
                "timestamp": r[4],
            }
            for r in cursor.fetchall()
        ]
        # Return in ascending order
        return list(reversed(results))

    def get_price_trend(
        self,
        platform: str,
        market_id: str,
        lookback_minutes: int = 60,
    ) -> dict:
        """
        Calculate price trend metrics over a time window.
        
        Returns dict with trend analysis.
        """
        history = self.get_price_history(platform, market_id, limit=1000)
        
        if len(history) < 2:
            return {
                "direction": "neutral",
                "change_pct": 0.0,
                "volatility": 0.0,
                "data_points": len(history),
            }
        
        # Filter to lookback window
        cutoff = datetime.now(timezone.utc).isoformat()
        # Simple: just use all available data for now
        
        prices = [h["yes_price"] for h in history]
        first_price = prices[0]
        last_price = prices[-1]
        
        change_pct = (last_price - first_price) / max(first_price, 0.01)
        
        # Calculate volatility (standard deviation)
        import statistics
        volatility = statistics.stdev(prices) if len(prices) > 1 else 0.0
        
        return {
            "direction": "up" if change_pct > 0.01 else "down" if change_pct < -0.01 else "neutral",
            "change_pct": change_pct,
            "volatility": volatility,
            "data_points": len(history),
            "first_price": first_price,
            "last_price": last_price,
        }

    def _record_price(self, market, timestamp: datetime) -> None:
        """Record price snapshot to history."""
        spread = abs(market.yes_price - market.no_price)
        self._conn.execute(
            """INSERT INTO price_history
            (platform, market_id, yes_price, no_price, volume, spread, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                market.platform, market.market_id,
                market.yes_price, market.no_price,
                market.volume, spread,
                timestamp.isoformat(),
            ),
        )
        self._conn.commit()

    # ─────────────────────────────────────────────────────────────────
    # Persistence Layer
    # ─────────────────────────────────────────────────────────────────

    def _persist_market(self, market, timestamp: datetime) -> None:
        """Save market to SQLite."""
        key = f"{market.platform}:{market.market_id}"
        self._conn.execute(
            """INSERT OR REPLACE INTO markets
            (cache_key, platform, market_id, title, yes_price, no_price,
             volume, liquidity, category, close_date, status, raw_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                key, market.platform, market.market_id, market.title,
                market.yes_price, market.no_price, market.volume,
                getattr(market, 'liquidity', 0),
                market.category, market.close_date, market.status,
                json.dumps(market.raw_data),
                timestamp.isoformat(),
            ),
        )
        self._conn.commit()

    def _persist_markets_batch(self, markets: list, timestamp: datetime) -> None:
        """Save multiple markets to SQLite efficiently."""
        ts_str = timestamp.isoformat()
        
        self._conn.executemany(
            """INSERT OR REPLACE INTO markets
            (cache_key, platform, market_id, title, yes_price, no_price,
             volume, liquidity, category, close_date, status, raw_json, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            [
                (
                    f"{m.platform}:{m.market_id}",
                    m.platform, m.market_id, m.title,
                    m.yes_price, m.no_price, m.volume,
                    getattr(m, 'liquidity', 0),
                    m.category, m.close_date, m.status,
                    json.dumps(m.raw_data),
                    ts_str,
                )
                for m in markets
            ],
        )
        
        # Batch record prices
        spread_data = [
            (m.platform, m.market_id, m.yes_price, m.no_price, m.volume,
             abs(m.yes_price - m.no_price), ts_str)
            for m in markets
        ]
        self._conn.executemany(
            """INSERT INTO price_history
            (platform, market_id, yes_price, no_price, volume, spread, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            spread_data,
        )
        
        self._conn.commit()

    def _load_from_db(self, key: str) -> object | None:
        """Load market from SQLite if not in memory."""
        cursor = self._conn.execute(
            """SELECT platform, market_id, title, yes_price, no_price,
                      volume, liquidity, category, close_date, status, raw_json
            FROM markets WHERE cache_key = ?""",
            (key,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
            
        # Would need to reconstruct UnifiedMarket here
        # For now, return raw dict
        return {
            "platform": row[0],
            "market_id": row[1],
            "title": row[2],
            "yes_price": row[3],
            "no_price": row[4],
            "volume": row[5],
            "liquidity": row[6],
            "category": row[7],
            "close_date": row[8],
            "status": row[9],
            "raw_data": json.loads(row[10]) if row[10] else {},
        }

    # ─────────────────────────────────────────────────────────────────
    # Eviction & Cleanup
    # ─────────────────────────────────────────────────────────────────

    def _evict_oldest(self) -> None:
        """Evict the oldest (least recently used) entry."""
        if not self._memory:
            return
        key, entry = self._memory.popitem(last=False)
        self._notify_evict(key, entry.market)
        logger.debug("Evicted cache entry: %s", key)

    def _evict_key(self, key: str) -> None:
        """Evict a specific key."""
        if key in self._memory:
            entry = self._memory.pop(key)
            self._notify_evict(key, entry.market)

    def _notify_evict(self, key: str, market) -> None:
        """Call eviction callbacks."""
        for callback in self._on_evict:
            try:
                callback(key, market)
            except Exception as e:
                logger.warning("Eviction callback failed: %s", e)

    def _notify_stale(self, key: str, market) -> None:
        """Call staleness callbacks."""
        for callback in self._on_stale:
            try:
                callback(key, market)
            except Exception as e:
                logger.warning("Stale callback failed: %s", e)

    def on_evict(self, callback: Callable[[str, object], None]) -> None:
        """Register callback for cache eviction events."""
        self._on_evict.append(callback)

    def on_stale(self, callback: Callable[[str, object], None]) -> None:
        """Register callback for stale data detection."""
        self._on_stale.append(callback)

    # ─────────────────────────────────────────────────────────────────
    # Cache Management
    # ─────────────────────────────────────────────────────────────────

    def clear_memory(self) -> None:
        """Clear in-memory cache (SQLite persists)."""
        with self._lock:
            self._memory.clear()

    def clear_all(self) -> None:
        """Clear both memory and SQLite cache."""
        with self._lock:
            self._memory.clear()
        self._conn.execute("DELETE FROM markets")
        self._conn.commit()

    def prune_history(self, older_than_days: int = 30) -> int:
        """Remove old price history entries."""
        from datetime import timedelta
        cutoff = datetime.now(timezone.utc) - timedelta(days=older_than_days)
        cursor = self._conn.execute(
            "DELETE FROM price_history WHERE timestamp < ?",
            (cutoff.isoformat(),),
        )
        self._conn.commit()
        return cursor.rowcount

    @property
    def memory_size(self) -> int:
        """Number of entries in memory cache."""
        return len(self._memory)

    @property
    def db_size(self) -> int:
        """Number of entries in SQLite cache."""
        cursor = self._conn.execute("SELECT COUNT(*) FROM markets")
        return cursor.fetchone()[0]

    def get_stats(self) -> dict:
        """Get cache statistics."""
        with self._lock:
            expired_count = sum(
                1 for e in self._memory.values() if e.is_expired
            )
            total_accesses = sum(
                e.access_count for e in self._memory.values()
            )
            
        return {
            "memory_entries": self.memory_size,
            "db_entries": self.db_size,
            "expired_in_memory": expired_count,
            "total_accesses": total_accesses,
            "max_memory_entries": self._max_entries,
            "default_ttl": self._default_ttl,
        }

    def close(self) -> None:
        """Close database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
