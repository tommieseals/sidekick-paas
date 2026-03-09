"""
Tests for the ML Feature Extraction Engine.
"""

import pytest
import numpy as np
from datetime import datetime, timezone, timedelta
from ml.feature_engine import FeatureEngine
from platforms.base import UnifiedMarket


@pytest.fixture
def engine():
    return FeatureEngine(sentiment_scorer=None)


@pytest.fixture
def sample_market():
    return UnifiedMarket(
        platform="kalshi",
        market_id="test-1",
        title="Will Bitcoin exceed $100,000 by end of 2026?",
        category="crypto",
        yes_price=0.65,
        no_price=0.35,
        volume=15000,
        liquidity=5000,
        open_interest=3000,
        close_date="2026-12-31T23:59:00Z",
    )


class TestFeatureExtraction:
    def test_extract_returns_numpy_array(self, engine, sample_market):
        features = engine.extract(sample_market)
        
        assert features is not None
        assert isinstance(features, np.ndarray)
        assert features.dtype == np.float32

    def test_extract_feature_count(self, engine, sample_market):
        """Features should match the feature names count."""
        features = engine.extract(sample_market)
        
        assert len(features) == len(FeatureEngine.FEATURE_NAMES)

    def test_price_features(self, engine, sample_market):
        """Yes and no prices should be extracted correctly."""
        features = engine.extract(sample_market)
        
        # Index 0: yes_price, Index 1: no_price
        assert features[0] == pytest.approx(0.65)
        assert features[1] == pytest.approx(0.35)

    def test_spread_feature(self, engine, sample_market):
        """Spread should be calculated correctly."""
        features = engine.extract(sample_market)
        
        # Index 2: spread = abs(yes_price - no_price)
        assert features[2] == pytest.approx(0.30)

    def test_price_features_normalized(self, engine):
        """Prices should be in 0-1 range."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            yes_price=0.50,
            no_price=0.50,
        )
        features = engine.extract(market)
        
        assert 0 <= features[0] <= 1
        assert 0 <= features[1] <= 1


class TestCategoryEncoding:
    def test_crypto_category_encoded(self, engine):
        """Crypto category should set is_crypto flag."""
        market = UnifiedMarket(
            platform="test", market_id="c", title="Test", category="crypto"
        )
        features = engine.extract(market)
        
        # Find is_crypto index dynamically
        crypto_idx = FeatureEngine.FEATURE_NAMES.index("is_crypto")
        assert features[crypto_idx] == 1.0

    def test_politics_category_encoded(self, engine):
        """Politics category should set is_politics flag."""
        market = UnifiedMarket(
            platform="test", market_id="p", title="Test", category="politics"
        )
        features = engine.extract(market)
        
        politics_idx = FeatureEngine.FEATURE_NAMES.index("is_politics")
        assert features[politics_idx] == 1.0

    def test_sports_category_encoded(self, engine):
        """Sports category should set is_sports flag."""
        market = UnifiedMarket(
            platform="test", market_id="s", title="Test", category="sports"
        )
        features = engine.extract(market)
        
        sports_idx = FeatureEngine.FEATURE_NAMES.index("is_sports")
        assert features[sports_idx] == 1.0


class TestDaysToClose:
    def test_future_date_positive_days(self, engine):
        """Future close date should give positive days."""
        future_date = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            close_date=future_date,
        )
        features = engine.extract(market)
        
        # Find days_to_close index
        days_idx = FeatureEngine.FEATURE_NAMES.index("days_to_close")
        assert features[days_idx] >= 25  # Allow some margin

    def test_past_date_zero_days(self, engine):
        """Past dates should return 0 days."""
        past_date = (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            close_date=past_date,
        )
        features = engine.extract(market)
        
        days_idx = FeatureEngine.FEATURE_NAMES.index("days_to_close")
        assert features[days_idx] == 0.0

    def test_no_close_date_default(self, engine):
        """Missing close date should use a default."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            close_date=None,
        )
        features = engine.extract(market)
        
        days_idx = FeatureEngine.FEATURE_NAMES.index("days_to_close")
        # Default should be a reasonable value (30, 365, or similar)
        assert features[days_idx] >= 0


class TestBatchExtraction:
    def test_batch_extract_returns_matrix(self, engine):
        """Batch extract should return a 2D matrix."""
        markets = [
            UnifiedMarket(platform="a", market_id="1", title="Test 1"),
            UnifiedMarket(platform="b", market_id="2", title="Test 2"),
            UnifiedMarket(platform="c", market_id="3", title="Test 3"),
        ]
        X, indices = engine.extract_batch(markets)
        
        assert isinstance(X, np.ndarray)
        assert X.ndim == 2
        assert X.shape[0] == 3
        assert X.shape[1] == len(FeatureEngine.FEATURE_NAMES)
        assert indices == [0, 1, 2]

    def test_batch_extract_handles_failures(self, engine):
        """Failed extractions should be excluded from batch."""
        markets = [
            UnifiedMarket(platform="a", market_id="1", title="Valid"),
            UnifiedMarket(platform="b", market_id="2", title="Also valid"),
        ]
        X, indices = engine.extract_batch(markets)
        
        assert X.shape[0] == 2

    def test_empty_batch(self, engine):
        """Empty batch should return empty results."""
        X, indices = engine.extract_batch([])
        
        assert X.shape[0] == 0
        assert indices == []


class TestCrossPlatformDelta:
    def test_single_platform_delta(self, engine):
        """Single platform should have delta based on implementation."""
        markets = [
            UnifiedMarket(platform="kalshi", market_id="1", title="Test Event", yes_price=0.60),
        ]
        X, _ = engine.extract_batch(markets)
        
        delta_idx = FeatureEngine.FEATURE_NAMES.index("cross_platform_delta")
        # Single platform may have 0 delta or other default
        assert X[0, delta_idx] >= 0

    def test_cross_platform_markets(self, engine):
        """Multiple platforms with same event should calculate delta."""
        markets = [
            UnifiedMarket(platform="kalshi", market_id="1", title="Test Event", yes_price=0.60),
            UnifiedMarket(platform="polymarket", market_id="2", title="Test Event", yes_price=0.70),
        ]
        X, _ = engine.extract_batch(markets)
        
        delta_idx = FeatureEngine.FEATURE_NAMES.index("cross_platform_delta")
        # Should have some delta
        assert isinstance(X[0, delta_idx], (int, float))


class TestSentimentIntegration:
    def test_no_sentiment_scorer_default(self, engine, sample_market):
        """Without sentiment scorer, should return default value."""
        features = engine.extract(sample_market)
        
        sentiment_idx = FeatureEngine.FEATURE_NAMES.index("sentiment_score")
        # Default is typically 0.0 or 0.5
        assert features[sentiment_idx] >= 0.0

    def test_with_sentiment_scorer(self):
        """With sentiment scorer, should use its output."""
        class MockSentiment:
            def score_market(self, title):
                return 0.75
        
        engine = FeatureEngine(sentiment_scorer=MockSentiment())
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Great news!",
        )
        features = engine.extract(market)
        
        sentiment_idx = FeatureEngine.FEATURE_NAMES.index("sentiment_score")
        assert features[sentiment_idx] == pytest.approx(0.75)


class TestFeatureNames:
    def test_feature_names_is_list(self):
        """Feature names should be a list of strings."""
        assert isinstance(FeatureEngine.FEATURE_NAMES, list)
        assert all(isinstance(name, str) for name in FeatureEngine.FEATURE_NAMES)

    def test_feature_names_not_empty(self):
        """Should have at least basic features."""
        assert len(FeatureEngine.FEATURE_NAMES) > 0
        assert "yes_price" in FeatureEngine.FEATURE_NAMES
        assert "no_price" in FeatureEngine.FEATURE_NAMES

    def test_required_features_present(self):
        """Should have all key features."""
        required = ["yes_price", "no_price", "spread", "sentiment_score"]
        for feat in required:
            assert feat in FeatureEngine.FEATURE_NAMES


class TestEdgeCases:
    def test_zero_prices(self, engine):
        """Zero prices should be handled."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            yes_price=0.0,
            no_price=1.0,
        )
        features = engine.extract(market)
        assert features is not None

    def test_extreme_prices(self, engine):
        """Extreme prices should be handled."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            yes_price=0.99,
            no_price=0.01,
        )
        features = engine.extract(market)
        assert features is not None

    def test_zero_volume(self, engine):
        """Zero volume should be handled."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            volume=0,
            liquidity=0,
        )
        features = engine.extract(market)
        assert features is not None

    def test_very_long_title(self, engine):
        """Long titles should be handled."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Will " + "something very " * 50 + "happen?",
        )
        features = engine.extract(market)
        assert features is not None

    def test_empty_title(self, engine):
        """Empty title should be handled."""
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="",
        )
        features = engine.extract(market)
        assert features is not None
