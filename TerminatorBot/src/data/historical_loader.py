"""
TerminatorBot - Historical Data Loader

Loads past resolved markets for ML training and backtesting.
Supports: SQLite DB, CSV files, JSON files, and platform APIs.
"""

from __future__ import annotations

import csv
import json
import logging
import os
import sqlite3
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator, Optional

import numpy as np

from .validators import DataValidator, ValidationResult

# Conditional imports for type hints
try:
    from platforms.base import UnifiedMarket
    from platforms.platform_registry import PlatformRegistry
except ImportError:
    UnifiedMarket = None
    PlatformRegistry = None

logger = logging.getLogger(__name__)

DB_DIR = Path(__file__).parent.parent.parent / "data"


class HistoricalLoader:
    """
    Load and manage historical resolved market data.

    Used for:
    1. Training the alpha ML model
    2. Backtesting scanner strategies
    3. Feature engineering validation
    
    Supports multiple data sources:
    - SQLite database (default)
    - CSV files (bulk import/export)
    - JSON files (API snapshots)
    """

    def __init__(self, db_path: str | None = None):
        self._db_path = Path(db_path) if db_path else DB_DIR / "historical.db"
        self._conn: sqlite3.Connection | None = None
        self._validator = DataValidator()
        self._init_db()

    def _init_db(self) -> None:
        """Initialize historical database with enhanced schema."""
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self._db_path))
        self._conn.execute("PRAGMA journal_mode=WAL")
        
        # Main resolved markets table
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS resolved_markets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                market_id TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                category TEXT DEFAULT '',
                yes_price_at_close REAL,
                no_price_at_close REAL,
                volume REAL DEFAULT 0,
                liquidity REAL DEFAULT 0,
                open_interest REAL DEFAULT 0,
                close_date TEXT,
                outcome TEXT,
                resolved_at TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(platform, market_id)
            )
        """)
        
        # Price snapshots for time-series analysis
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS price_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                market_id TEXT NOT NULL,
                yes_price REAL NOT NULL,
                no_price REAL NOT NULL,
                volume REAL DEFAULT 0,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (platform, market_id) 
                    REFERENCES resolved_markets(platform, market_id)
            )
        """)
        
        # Indexes for fast queries
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_resolved_outcome 
            ON resolved_markets(outcome)
        """)
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_resolved_category 
            ON resolved_markets(category)
        """)
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_snapshots_market 
            ON price_snapshots(platform, market_id, timestamp)
        """)
        
        self._conn.commit()

    # ─────────────────────────────────────────────────────────────────
    # Data Loading Methods
    # ─────────────────────────────────────────────────────────────────

    async def fetch_and_store(
        self,
        registry,  # PlatformRegistry
        limit_per_platform: int = 500,
    ) -> int:
        """
        Fetch resolved markets from all platforms and store.

        Returns total number of new records stored.
        """
        total = 0
        for broker in registry.get_active_brokers():
            try:
                markets = await broker.fetch_markets(
                    status="resolved", limit=limit_per_platform
                )
                stored = self._store_markets(markets)
                total += stored
                logger.info(
                    "Loaded %d resolved markets from %s",
                    stored, broker.platform_name,
                )
            except Exception as e:
                logger.warning(
                    "Failed to load history from %s: %s",
                    broker.platform_name, e,
                )
        return total

    def _store_markets(self, markets: list) -> int:
        """Store resolved markets, skipping duplicates."""
        count = 0
        for m in markets:
            if m.status != "resolved":
                continue
            
            # Validate before storing
            validation = self._validator.validate_market_data(
                yes_price=m.yes_price,
                no_price=m.no_price,
                volume=m.volume,
            )
            
            if not validation.is_valid:
                logger.debug(
                    "Skipping invalid market %s: %s",
                    m.market_id, validation.errors
                )
                continue
                
            try:
                self._conn.execute(
                    """INSERT OR IGNORE INTO resolved_markets
                    (platform, market_id, title, description, category,
                     yes_price_at_close, no_price_at_close,
                     volume, liquidity, open_interest, close_date, 
                     outcome, resolved_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        m.platform, m.market_id, m.title, 
                        getattr(m, 'description', ''),
                        m.category,
                        m.yes_price, m.no_price, m.volume,
                        getattr(m, 'liquidity', 0),
                        m.open_interest,
                        m.close_date, 
                        m.raw_data.get("outcome", ""),
                        m.raw_data.get("resolved_at", ""),
                    ),
                )
                count += 1
            except sqlite3.IntegrityError:
                pass
        self._conn.commit()
        return count

    def load_from_csv(self, csv_path: str | Path) -> int:
        """
        Load historical data from CSV file.
        
        Expected columns:
        platform, market_id, title, category, yes_price, no_price,
        volume, close_date, outcome
        
        Returns number of records loaded.
        """
        csv_path = Path(csv_path)
        if not csv_path.exists():
            logger.error("CSV file not found: %s", csv_path)
            return 0
            
        count = 0
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Validate data
                try:
                    yes_price = float(row.get('yes_price', 0))
                    no_price = float(row.get('no_price', 0))
                    volume = float(row.get('volume', 0))
                except (ValueError, TypeError):
                    continue
                    
                validation = self._validator.validate_market_data(
                    yes_price=yes_price,
                    no_price=no_price,
                    volume=volume,
                )
                
                if not validation.is_valid:
                    continue
                    
                try:
                    self._conn.execute(
                        """INSERT OR IGNORE INTO resolved_markets
                        (platform, market_id, title, category,
                         yes_price_at_close, no_price_at_close,
                         volume, close_date, outcome)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        (
                            row.get('platform', 'unknown'),
                            row.get('market_id', f"csv_{count}"),
                            row.get('title', ''),
                            row.get('category', ''),
                            yes_price, no_price, volume,
                            row.get('close_date', ''),
                            row.get('outcome', ''),
                        ),
                    )
                    count += 1
                except sqlite3.IntegrityError:
                    pass
                    
        self._conn.commit()
        logger.info("Loaded %d records from CSV: %s", count, csv_path)
        return count

    def load_from_json(self, json_path: str | Path) -> int:
        """
        Load historical data from JSON file.
        
        Expected format: list of market dictionaries
        
        Returns number of records loaded.
        """
        json_path = Path(json_path)
        if not json_path.exists():
            logger.error("JSON file not found: %s", json_path)
            return 0
            
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if isinstance(data, dict):
            data = data.get('markets', [])
            
        count = 0
        for market in data:
            # Validate data
            try:
                yes_price = float(market.get('yes_price', 0))
                no_price = float(market.get('no_price', 0))
                volume = float(market.get('volume', 0))
            except (ValueError, TypeError):
                continue
                
            validation = self._validator.validate_market_data(
                yes_price=yes_price,
                no_price=no_price,
                volume=volume,
            )
            
            if not validation.is_valid:
                continue
                
            try:
                self._conn.execute(
                    """INSERT OR IGNORE INTO resolved_markets
                    (platform, market_id, title, description, category,
                     yes_price_at_close, no_price_at_close,
                     volume, liquidity, open_interest, close_date, outcome)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        market.get('platform', 'unknown'),
                        market.get('market_id', f"json_{count}"),
                        market.get('title', ''),
                        market.get('description', ''),
                        market.get('category', ''),
                        yes_price, no_price, volume,
                        float(market.get('liquidity', 0)),
                        float(market.get('open_interest', 0)),
                        market.get('close_date', ''),
                        market.get('outcome', ''),
                    ),
                )
                count += 1
            except (sqlite3.IntegrityError, ValueError):
                pass
                
        self._conn.commit()
        logger.info("Loaded %d records from JSON: %s", count, json_path)
        return count

    # ─────────────────────────────────────────────────────────────────
    # Training Data Access
    # ─────────────────────────────────────────────────────────────────

    def load_training_data(
        self,
        category: str | None = None,
        min_volume: float = 0,
        limit: int | None = None,
    ) -> tuple[list[dict], list[int]]:
        """
        Load resolved markets as training data.

        Returns (records, labels) where labels are 1 (YES won) or 0 (NO won).
        
        Args:
            category: Filter by category (politics, sports, etc.)
            min_volume: Minimum volume threshold
            limit: Max records to return
        """
        query = """
            SELECT platform, market_id, title, description, category,
                   yes_price_at_close, no_price_at_close,
                   volume, liquidity, open_interest, close_date, outcome
            FROM resolved_markets
            WHERE outcome IN ('yes', 'no')
        """
        params = []
        
        if category:
            query += " AND category = ?"
            params.append(category)
            
        if min_volume > 0:
            query += " AND volume >= ?"
            params.append(min_volume)
            
        query += " ORDER BY resolved_at DESC"
        
        if limit:
            query += " LIMIT ?"
            params.append(limit)
            
        cursor = self._conn.execute(query, params)

        records = []
        labels = []
        for row in cursor.fetchall():
            records.append({
                "platform": row[0],
                "market_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "yes_price": row[5],
                "no_price": row[6],
                "volume": row[7],
                "liquidity": row[8],
                "open_interest": row[9],
                "close_date": row[10],
            })
            labels.append(1 if row[11] == "yes" else 0)

        logger.info("Loaded %d resolved markets for training", len(records))
        return records, labels

    def iter_training_batches(
        self,
        batch_size: int = 100,
        shuffle: bool = True,
    ) -> Iterator[tuple[list[dict], list[int]]]:
        """
        Iterate over training data in batches.
        
        Memory-efficient for large datasets.
        """
        records, labels = self.load_training_data()
        
        if shuffle:
            indices = np.random.permutation(len(records))
            records = [records[i] for i in indices]
            labels = [labels[i] for i in indices]
            
        for i in range(0, len(records), batch_size):
            yield (
                records[i:i + batch_size],
                labels[i:i + batch_size],
            )

    def get_price_series(
        self,
        platform: str,
        market_id: str,
    ) -> list[dict]:
        """
        Get price time series for a specific market.
        
        Returns list of {timestamp, yes_price, no_price, volume} dicts.
        """
        cursor = self._conn.execute(
            """SELECT timestamp, yes_price, no_price, volume
            FROM price_snapshots
            WHERE platform = ? AND market_id = ?
            ORDER BY timestamp ASC""",
            (platform, market_id),
        )
        return [
            {
                "timestamp": row[0],
                "yes_price": row[1],
                "no_price": row[2],
                "volume": row[3],
            }
            for row in cursor.fetchall()
        ]

    def add_price_snapshot(
        self,
        platform: str,
        market_id: str,
        yes_price: float,
        no_price: float,
        volume: float = 0,
        timestamp: str | None = None,
    ) -> None:
        """Record a price snapshot for time-series analysis."""
        if timestamp is None:
            timestamp = datetime.now(timezone.utc).isoformat()
            
        self._conn.execute(
            """INSERT INTO price_snapshots
            (platform, market_id, yes_price, no_price, volume, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (platform, market_id, yes_price, no_price, volume, timestamp),
        )
        self._conn.commit()

    # ─────────────────────────────────────────────────────────────────
    # Export Methods
    # ─────────────────────────────────────────────────────────────────

    def export_to_csv(self, csv_path: str | Path) -> int:
        """Export all historical data to CSV."""
        csv_path = Path(csv_path)
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        
        cursor = self._conn.execute(
            """SELECT platform, market_id, title, category,
                      yes_price_at_close, no_price_at_close,
                      volume, close_date, outcome
            FROM resolved_markets"""
        )
        
        count = 0
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'platform', 'market_id', 'title', 'category',
                'yes_price', 'no_price', 'volume', 'close_date', 'outcome'
            ])
            for row in cursor.fetchall():
                writer.writerow(row)
                count += 1
                
        logger.info("Exported %d records to CSV: %s", count, csv_path)
        return count

    def export_to_json(self, json_path: str | Path) -> int:
        """Export all historical data to JSON."""
        json_path = Path(json_path)
        json_path.parent.mkdir(parents=True, exist_ok=True)
        
        cursor = self._conn.execute(
            """SELECT platform, market_id, title, description, category,
                      yes_price_at_close, no_price_at_close,
                      volume, liquidity, open_interest, close_date, outcome
            FROM resolved_markets"""
        )
        
        markets = []
        for row in cursor.fetchall():
            markets.append({
                "platform": row[0],
                "market_id": row[1],
                "title": row[2],
                "description": row[3],
                "category": row[4],
                "yes_price": row[5],
                "no_price": row[6],
                "volume": row[7],
                "liquidity": row[8],
                "open_interest": row[9],
                "close_date": row[10],
                "outcome": row[11],
            })
            
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({"markets": markets}, f, indent=2)
            
        logger.info("Exported %d records to JSON: %s", len(markets), json_path)
        return len(markets)

    # ─────────────────────────────────────────────────────────────────
    # Stats & Utilities
    # ─────────────────────────────────────────────────────────────────

    @property
    def record_count(self) -> int:
        cursor = self._conn.execute("SELECT COUNT(*) FROM resolved_markets")
        return cursor.fetchone()[0]

    def get_stats(self) -> dict:
        """Get database statistics."""
        stats = {
            "total_markets": self.record_count,
            "by_outcome": {},
            "by_category": {},
            "by_platform": {},
        }
        
        # By outcome
        cursor = self._conn.execute(
            "SELECT outcome, COUNT(*) FROM resolved_markets GROUP BY outcome"
        )
        for row in cursor.fetchall():
            stats["by_outcome"][row[0] or "unknown"] = row[1]
            
        # By category
        cursor = self._conn.execute(
            "SELECT category, COUNT(*) FROM resolved_markets GROUP BY category"
        )
        for row in cursor.fetchall():
            stats["by_category"][row[0] or "unknown"] = row[1]
            
        # By platform
        cursor = self._conn.execute(
            "SELECT platform, COUNT(*) FROM resolved_markets GROUP BY platform"
        )
        for row in cursor.fetchall():
            stats["by_platform"][row[0]] = row[1]
            
        return stats

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
