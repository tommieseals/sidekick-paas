"""
TerminatorBot - Sentiment Data Scraper

Collects sentiment signals from multiple sources:
- NewsAPI (news articles)
- Twitter/X (social sentiment)
- Reddit (community discussions)
- Market metadata (descriptions, keywords)

All sources are aggregated into a unified sentiment score.
"""

from __future__ import annotations

import json
import logging
import re
import sqlite3
import time
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional
from urllib.parse import quote

try:
    from config import Config
except ImportError:
    class Config:
        NEWS_API_KEY = ""

logger = logging.getLogger(__name__)

DB_DIR = Path(__file__).parent.parent.parent / "data"


@dataclass
class SentimentResult:
    """Aggregated sentiment analysis result."""
    score: float  # -1.0 (bearish) to +1.0 (bullish)
    confidence: float  # 0.0 to 1.0
    sources: dict[str, float]  # Source name -> individual score
    article_count: int
    tweet_count: int
    keywords_found: list[str]
    timestamp: str
    
    def to_dict(self) -> dict:
        return {
            "score": self.score,
            "confidence": self.confidence,
            "sources": self.sources,
            "article_count": self.article_count,
            "tweet_count": self.tweet_count,
            "keywords_found": self.keywords_found,
            "timestamp": self.timestamp,
        }


class SentimentScraper:
    """
    Scrape sentiment data from news APIs and social sources.

    Sources:
    - NewsAPI.org (when API key configured)
    - Twitter/X API (when configured)
    - Reddit API (when configured)
    - Keyword analysis (always available)
    
    Results are cached to avoid redundant API calls.
    """

    # Prediction market keyword lexicons
    BULLISH_KEYWORDS = [
        "confirmed", "announced", "approved", "signed", "passed",
        "breakthrough", "surge", "record", "wins", "elected",
        "deal", "agreement", "majority", "landslide", "success",
        "victory", "leads", "ahead", "favored", "likely",
        "unanimous", "bipartisan", "rally", "momentum", "boost",
    ]
    
    BEARISH_KEYWORDS = [
        "denied", "rejected", "failed", "collapsed", "cancelled",
        "postponed", "unlikely", "doubt", "opposition", "defeated",
        "scandal", "investigation", "crisis", "crash", "drops",
        "loses", "trails", "behind", "longshot", "impossible",
        "blocked", "vetoed", "withdrawn", "suspended", "plunges",
    ]
    
    # Category-specific keywords
    POLITICS_BULLISH = ["endorsed", "momentum", "polling", "frontrunner", "incumbent"]
    POLITICS_BEARISH = ["impeach", "resign", "scandal", "indicted", "controversy"]
    
    SPORTS_BULLISH = ["undefeated", "streak", "dominant", "healthy", "playoff"]
    SPORTS_BEARISH = ["injured", "suspended", "losing", "eliminated", "underdog"]
    
    CRYPTO_BULLISH = ["bullish", "moon", "pump", "adoption", "institutional"]
    CRYPTO_BEARISH = ["bearish", "dump", "hack", "regulation", "ban"]

    # Cache TTL
    CACHE_TTL_SECONDS = 300  # 5 minutes

    def __init__(
        self,
        news_api_key: str = "",
        twitter_bearer_token: str = "",
        reddit_client_id: str = "",
        reddit_client_secret: str = "",
        db_path: str | None = None,
    ):
        self._news_api_key = news_api_key or getattr(Config, 'NEWS_API_KEY', '')
        self._twitter_token = twitter_bearer_token
        self._reddit_id = reddit_client_id
        self._reddit_secret = reddit_client_secret
        
        self._requests = None
        self._db_path = Path(db_path) if db_path else DB_DIR / "sentiment_cache.db"
        self._conn: sqlite3.Connection | None = None
        
        # Initialize clients
        try:
            import requests
            self._requests = requests
        except ImportError:
            logger.warning("requests not installed, API scraping disabled")
            
        self._init_db()
        self._log_enabled_sources()

    def _init_db(self) -> None:
        """Initialize sentiment cache database."""
        self._db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(self._db_path), check_same_thread=False)
        self._conn.execute("PRAGMA journal_mode=WAL")
        
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS sentiment_cache (
                query_hash TEXT PRIMARY KEY,
                query TEXT NOT NULL,
                result_json TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL
            )
        """)
        
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS sentiment_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                market_id TEXT,
                query TEXT NOT NULL,
                score REAL NOT NULL,
                confidence REAL NOT NULL,
                sources TEXT,
                timestamp TEXT NOT NULL
            )
        """)
        
        self._conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_sentiment_market
            ON sentiment_history(market_id, timestamp DESC)
        """)
        
        self._conn.commit()

    def _log_enabled_sources(self) -> None:
        """Log which sentiment sources are enabled."""
        sources = ["keyword_analysis"]
        if self._news_api_key:
            sources.append("news_api")
        if self._twitter_token:
            sources.append("twitter")
        if self._reddit_id and self._reddit_secret:
            sources.append("reddit")
        logger.info("SentimentScraper enabled sources: %s", ", ".join(sources))

    # ─────────────────────────────────────────────────────────────────
    # Main API
    # ─────────────────────────────────────────────────────────────────

    def analyze(
        self,
        query: str,
        category: str = "",
        market_id: str | None = None,
        use_cache: bool = True,
    ) -> SentimentResult:
        """
        Analyze sentiment for a query (market title, entity name, etc.).
        
        Aggregates sentiment from all available sources.
        
        Args:
            query: Search query (e.g., "Will Trump win 2024 election")
            category: Market category for specialized keywords
            market_id: Optional market ID for history tracking
            use_cache: Whether to use cached results
            
        Returns:
            SentimentResult with aggregated sentiment
        """
        # Check cache
        if use_cache:
            cached = self._get_cached(query)
            if cached:
                return cached

        sources = {}
        article_count = 0
        tweet_count = 0
        keywords_found = []
        
        # 1. Keyword analysis (always available)
        kw_score, kw_found = self._keyword_analysis(query, category)
        sources["keywords"] = kw_score
        keywords_found.extend(kw_found)
        
        # 2. NewsAPI
        if self._news_api_key and self._requests:
            news_score, news_count = self._get_news_sentiment(query)
            if news_count > 0:
                sources["news"] = news_score
                article_count = news_count
        
        # 3. Twitter (mock for now, implement with actual API)
        if self._twitter_token and self._requests:
            twitter_score, tw_count = self._get_twitter_sentiment(query)
            if tw_count > 0:
                sources["twitter"] = twitter_score
                tweet_count = tw_count
        
        # 4. Reddit (mock for now)
        if self._reddit_id and self._requests:
            reddit_score = self._get_reddit_sentiment(query)
            if reddit_score != 0:
                sources["reddit"] = reddit_score

        # Aggregate scores with weights
        final_score = self._aggregate_scores(sources)
        confidence = self._calculate_confidence(sources, article_count, tweet_count)
        
        result = SentimentResult(
            score=final_score,
            confidence=confidence,
            sources=sources,
            article_count=article_count,
            tweet_count=tweet_count,
            keywords_found=keywords_found,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        
        # Cache result
        self._cache_result(query, result)
        
        # Record history
        if market_id:
            self._record_history(market_id, query, result)
        
        return result

    def get_news_sentiment(self, query: str, max_articles: int = 10) -> float:
        """
        Get sentiment score from recent news articles.

        Returns score from -1.0 (bearish) to +1.0 (bullish).
        """
        score, _ = self._get_news_sentiment(query, max_articles)
        return score

    def keyword_sentiment(self, text: str, category: str = "") -> float:
        """
        Quick keyword-based sentiment from market title/description.

        Returns score from -1.0 (bearish) to +1.0 (bullish).
        """
        score, _ = self._keyword_analysis(text, category)
        return score

    # ─────────────────────────────────────────────────────────────────
    # Source Implementations
    # ─────────────────────────────────────────────────────────────────

    def _keyword_analysis(
        self,
        text: str,
        category: str = "",
    ) -> tuple[float, list[str]]:
        """
        Analyze text for sentiment keywords.
        
        Returns (score, list of keywords found).
        """
        text_lower = text.lower()
        found = []
        
        # Base keywords
        bullish_keywords = list(self.BULLISH_KEYWORDS)
        bearish_keywords = list(self.BEARISH_KEYWORDS)
        
        # Add category-specific keywords
        if category == "politics":
            bullish_keywords.extend(self.POLITICS_BULLISH)
            bearish_keywords.extend(self.POLITICS_BEARISH)
        elif category == "sports":
            bullish_keywords.extend(self.SPORTS_BULLISH)
            bearish_keywords.extend(self.SPORTS_BEARISH)
        elif category in ("crypto", "cryptocurrency"):
            bullish_keywords.extend(self.CRYPTO_BULLISH)
            bearish_keywords.extend(self.CRYPTO_BEARISH)
        
        bullish = 0
        bearish = 0
        
        for kw in bullish_keywords:
            if kw in text_lower:
                bullish += 1
                found.append(f"+{kw}")
                
        for kw in bearish_keywords:
            if kw in text_lower:
                bearish += 1
                found.append(f"-{kw}")

        total = bullish + bearish
        if total == 0:
            return 0.0, found

        return (bullish - bearish) / total, found

    def _get_news_sentiment(
        self,
        query: str,
        max_articles: int = 10,
    ) -> tuple[float, int]:
        """
        Get sentiment from NewsAPI.
        
        Returns (score, article_count).
        """
        if not self._requests or not self._news_api_key:
            return 0.0, 0

        try:
            # Clean query for search
            search_query = self._clean_query(query)
            
            response = self._requests.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": search_query,
                    "sortBy": "publishedAt",
                    "pageSize": max_articles,
                    "language": "en",
                    "apiKey": self._news_api_key,
                },
                timeout=10,
            )
            data = response.json()

            if data.get("status") != "ok":
                logger.warning("NewsAPI error: %s", data.get("message", "unknown"))
                return 0.0, 0

            articles = data.get("articles", [])
            if not articles:
                return 0.0, 0

            # Score each article
            scores = []
            for article in articles:
                title = article.get("title", "")
                desc = article.get("description", "")
                text = f"{title} {desc}"
                score, _ = self._keyword_analysis(text)
                scores.append(score)

            avg_score = sum(scores) / len(scores) if scores else 0.0
            return avg_score, len(articles)

        except Exception as e:
            logger.warning("News API request failed: %s", e)
            return 0.0, 0

    def _get_twitter_sentiment(self, query: str) -> tuple[float, int]:
        """
        Get sentiment from Twitter/X API.
        
        Returns (score, tweet_count).
        
        Note: Requires Twitter API v2 Bearer Token.
        """
        if not self._requests or not self._twitter_token:
            return 0.0, 0

        try:
            search_query = self._clean_query(query)
            
            response = self._requests.get(
                "https://api.twitter.com/2/tweets/search/recent",
                headers={
                    "Authorization": f"Bearer {self._twitter_token}",
                },
                params={
                    "query": f"{search_query} -is:retweet lang:en",
                    "max_results": 100,
                    "tweet.fields": "text,created_at,public_metrics",
                },
                timeout=10,
            )
            
            if response.status_code != 200:
                logger.warning("Twitter API error: %s", response.status_code)
                return 0.0, 0
                
            data = response.json()
            tweets = data.get("data", [])
            
            if not tweets:
                return 0.0, 0
            
            # Score tweets with engagement weighting
            weighted_scores = []
            total_weight = 0
            
            for tweet in tweets:
                text = tweet.get("text", "")
                score, _ = self._keyword_analysis(text)
                
                # Weight by engagement
                metrics = tweet.get("public_metrics", {})
                likes = metrics.get("like_count", 0)
                retweets = metrics.get("retweet_count", 0)
                weight = 1 + (likes * 0.1) + (retweets * 0.5)
                
                weighted_scores.append(score * weight)
                total_weight += weight
            
            avg_score = sum(weighted_scores) / total_weight if total_weight > 0 else 0.0
            return avg_score, len(tweets)
            
        except Exception as e:
            logger.warning("Twitter API request failed: %s", e)
            return 0.0, 0

    def _get_reddit_sentiment(self, query: str) -> float:
        """
        Get sentiment from Reddit.
        
        Returns sentiment score.
        
        Note: Requires Reddit API credentials.
        """
        if not self._requests or not self._reddit_id:
            return 0.0

        try:
            # Get OAuth token
            auth = (self._reddit_id, self._reddit_secret)
            token_response = self._requests.post(
                "https://www.reddit.com/api/v1/access_token",
                auth=auth,
                data={"grant_type": "client_credentials"},
                headers={"User-Agent": "TerminatorBot/1.0"},
                timeout=10,
            )
            
            if token_response.status_code != 200:
                return 0.0
                
            token = token_response.json().get("access_token")
            
            # Search posts
            search_query = self._clean_query(query)
            response = self._requests.get(
                "https://oauth.reddit.com/search",
                headers={
                    "Authorization": f"Bearer {token}",
                    "User-Agent": "TerminatorBot/1.0",
                },
                params={
                    "q": search_query,
                    "sort": "new",
                    "limit": 50,
                    "t": "week",
                },
                timeout=10,
            )
            
            if response.status_code != 200:
                return 0.0
                
            data = response.json()
            posts = data.get("data", {}).get("children", [])
            
            if not posts:
                return 0.0
            
            scores = []
            for post in posts:
                post_data = post.get("data", {})
                title = post_data.get("title", "")
                selftext = post_data.get("selftext", "")
                score, _ = self._keyword_analysis(f"{title} {selftext}")
                scores.append(score)
            
            return sum(scores) / len(scores) if scores else 0.0
            
        except Exception as e:
            logger.warning("Reddit API request failed: %s", e)
            return 0.0

    # ─────────────────────────────────────────────────────────────────
    # Aggregation & Confidence
    # ─────────────────────────────────────────────────────────────────

    def _aggregate_scores(self, sources: dict[str, float]) -> float:
        """
        Aggregate scores from multiple sources with weighting.
        """
        if not sources:
            return 0.0
            
        # Source weights (higher = more trusted)
        weights = {
            "news": 1.5,      # News is generally reliable
            "twitter": 1.0,   # Social can be noisy
            "reddit": 0.8,    # Reddit can be very biased
            "keywords": 0.5,  # Simple keyword matching
        }
        
        weighted_sum = 0.0
        total_weight = 0.0
        
        for source, score in sources.items():
            weight = weights.get(source, 1.0)
            weighted_sum += score * weight
            total_weight += weight
            
        return weighted_sum / total_weight if total_weight > 0 else 0.0

    def _calculate_confidence(
        self,
        sources: dict[str, float],
        article_count: int,
        tweet_count: int,
    ) -> float:
        """
        Calculate confidence in the sentiment score.
        
        Based on:
        - Number of sources
        - Amount of data
        - Agreement between sources
        """
        if not sources:
            return 0.0
            
        # Base confidence from number of sources
        source_conf = min(len(sources) / 4, 1.0) * 0.4
        
        # Data volume confidence
        data_count = article_count + (tweet_count / 10)
        volume_conf = min(data_count / 20, 1.0) * 0.3
        
        # Agreement confidence (sources agree = higher confidence)
        scores = list(sources.values())
        if len(scores) > 1:
            # Check if all sources agree on direction
            all_positive = all(s > 0 for s in scores if s != 0)
            all_negative = all(s < 0 for s in scores if s != 0)
            agree_conf = 0.3 if (all_positive or all_negative) else 0.1
        else:
            agree_conf = 0.15
            
        return source_conf + volume_conf + agree_conf

    # ─────────────────────────────────────────────────────────────────
    # Caching
    # ─────────────────────────────────────────────────────────────────

    def _get_cached(self, query: str) -> SentimentResult | None:
        """Get cached sentiment result if still valid."""
        query_hash = self._hash_query(query)
        now = datetime.now(timezone.utc).isoformat()
        
        cursor = self._conn.execute(
            """SELECT result_json FROM sentiment_cache
            WHERE query_hash = ? AND expires_at > ?""",
            (query_hash, now),
        )
        row = cursor.fetchone()
        
        if row:
            try:
                data = json.loads(row[0])
                return SentimentResult(**data)
            except (json.JSONDecodeError, TypeError):
                pass
        return None

    def _cache_result(self, query: str, result: SentimentResult) -> None:
        """Cache sentiment result."""
        query_hash = self._hash_query(query)
        now = datetime.now(timezone.utc)
        expires = now + timedelta(seconds=self.CACHE_TTL_SECONDS)
        
        self._conn.execute(
            """INSERT OR REPLACE INTO sentiment_cache
            (query_hash, query, result_json, created_at, expires_at)
            VALUES (?, ?, ?, ?, ?)""",
            (
                query_hash, query,
                json.dumps(result.to_dict()),
                now.isoformat(),
                expires.isoformat(),
            ),
        )
        self._conn.commit()

    def _record_history(
        self,
        market_id: str,
        query: str,
        result: SentimentResult,
    ) -> None:
        """Record sentiment result for historical tracking."""
        self._conn.execute(
            """INSERT INTO sentiment_history
            (market_id, query, score, confidence, sources, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)""",
            (
                market_id, query,
                result.score, result.confidence,
                json.dumps(result.sources),
                result.timestamp,
            ),
        )
        self._conn.commit()

    def get_sentiment_history(
        self,
        market_id: str,
        limit: int = 100,
    ) -> list[dict]:
        """Get sentiment history for a market."""
        cursor = self._conn.execute(
            """SELECT score, confidence, sources, timestamp
            FROM sentiment_history
            WHERE market_id = ?
            ORDER BY timestamp DESC LIMIT ?""",
            (market_id, limit),
        )
        return [
            {
                "score": row[0],
                "confidence": row[1],
                "sources": json.loads(row[2]) if row[2] else {},
                "timestamp": row[3],
            }
            for row in cursor.fetchall()
        ]

    def _hash_query(self, query: str) -> str:
        """Create hash for cache key."""
        import hashlib
        return hashlib.md5(query.lower().encode()).hexdigest()

    def _clean_query(self, query: str) -> str:
        """Clean query for API searches."""
        # Remove common question words
        cleaned = re.sub(
            r'\b(will|does|is|are|can|would|should|has|have|had|be)\b',
            '',
            query,
            flags=re.IGNORECASE,
        )
        # Remove punctuation
        cleaned = re.sub(r'[?!.,;:]', '', cleaned)
        # Collapse whitespace
        cleaned = ' '.join(cleaned.split())
        return cleaned[:100]  # Limit length

    # ─────────────────────────────────────────────────────────────────
    # Cleanup
    # ─────────────────────────────────────────────────────────────────

    def cleanup_cache(self) -> int:
        """Remove expired cache entries."""
        now = datetime.now(timezone.utc).isoformat()
        cursor = self._conn.execute(
            "DELETE FROM sentiment_cache WHERE expires_at < ?",
            (now,),
        )
        self._conn.commit()
        return cursor.rowcount

    def close(self) -> None:
        """Close database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
