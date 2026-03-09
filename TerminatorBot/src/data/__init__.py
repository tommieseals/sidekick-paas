"""
TerminatorBot - Data Module

Provides data infrastructure for market data management:
- Historical data loading for ML training and backtesting
- In-memory caching with TTL management
- Sentiment scraping from news and social sources
- Data validation and cleaning
"""

from .historical_loader import HistoricalLoader
from .market_cache import MarketCache, CacheEntry
from .sentiment_scraper import SentimentScraper, SentimentResult
from .validators import (
    DataValidator,
    ValidationResult,
    ValidationIssue,
    ValidationLevel,
)

__all__ = [
    # Historical data
    "HistoricalLoader",
    
    # Caching
    "MarketCache",
    "CacheEntry",
    
    # Sentiment
    "SentimentScraper",
    "SentimentResult",
    
    # Validation
    "DataValidator",
    "ValidationResult",
    "ValidationIssue",
    "ValidationLevel",
]
