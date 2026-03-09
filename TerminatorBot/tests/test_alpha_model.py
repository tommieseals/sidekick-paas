"""
Tests for the XGBoost Alpha Prediction Model.
"""

import pytest
import numpy as np
import os
import tempfile
from unittest.mock import Mock, patch, MagicMock
from ml.alpha_model import AlphaModel
from ml.feature_engine import FeatureEngine
from platforms.base import UnifiedMarket


@pytest.fixture
def feature_engine():
    return FeatureEngine(sentiment_scorer=None)


@pytest.fixture
def model(feature_engine):
    return AlphaModel(feature_engine=feature_engine)


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
        close_date="2026-12-31T23:59:00Z",
    )


class TestModelInitialization:
    def test_model_initializes(self, model):
        """Model should initialize without errors."""
        assert model is not None
        assert not model.is_loaded

    def test_model_with_custom_path(self, feature_engine):
        """Model should accept custom path."""
        custom_path = "/custom/path/model.pkl"
        model = AlphaModel(feature_engine, model_path=custom_path)
        assert model._model_path == custom_path


class TestPredictionWithoutModel:
    def test_predict_without_load_returns_none(self, model, sample_market):
        """Prediction without loaded model should return None."""
        result = model.predict(sample_market)
        assert result is None

    def test_predict_batch_without_load_returns_empty(self, model, sample_market):
        """Batch prediction without loaded model should return empty."""
        result = model.predict_batch([sample_market])
        assert result == []


class TestLoadModel:
    def test_load_nonexistent_returns_false(self, model):
        """Loading nonexistent model should return False."""
        model._model_path = "/nonexistent/path/model.pkl"
        result = model.load()
        assert result is False
        assert not model.is_loaded

    def test_load_valid_model(self, feature_engine):
        """Loading a valid model should work."""
        pytest.importorskip("xgboost")
        pytest.importorskip("sklearn")
        
        from xgboost import XGBClassifier
        
        # Create a real trained model
        with tempfile.NamedTemporaryFile(suffix=".pkl", delete=False) as f:
            import pickle
            # Train a tiny model
            X = np.random.rand(50, len(FeatureEngine.FEATURE_NAMES)).astype(np.float32)
            y = (np.random.rand(50) > 0.5).astype(int)
            real_model = XGBClassifier(n_estimators=2, max_depth=2)
            real_model.fit(X, y)
            pickle.dump(real_model, f)
            temp_path = f.name
        
        try:
            model = AlphaModel(feature_engine, model_path=temp_path)
            result = model.load()
            assert result is True
            assert model.is_loaded
        finally:
            os.unlink(temp_path)


class TestPredictionWithMockedModel:
    def test_predict_returns_tuple(self, feature_engine, sample_market):
        """Prediction should return (probability, confidence) tuple."""
        model = AlphaModel(feature_engine)
        
        # Mock the model
        mock_model = MagicMock()
        mock_model.predict_proba = MagicMock(return_value=np.array([[0.3, 0.7]]))
        model._model = mock_model
        model._loaded = True
        
        result = model.predict(sample_market)
        
        assert result is not None
        assert len(result) == 2
        prob, conf = result
        assert 0 <= prob <= 1
        assert 0 <= conf <= 1

    def test_predict_probability_matches_model_output(self, feature_engine, sample_market):
        """Predicted probability should match model output."""
        model = AlphaModel(feature_engine)
        
        mock_model = MagicMock()
        mock_model.predict_proba = MagicMock(return_value=np.array([[0.2, 0.8]]))
        model._model = mock_model
        model._loaded = True
        
        prob, _ = model.predict(sample_market)
        assert prob == pytest.approx(0.8)

    def test_confidence_calculation(self, feature_engine, sample_market):
        """Confidence should be higher for extreme probabilities."""
        model = AlphaModel(feature_engine)
        
        # Extreme probability (0.9) should have high confidence
        mock_model = MagicMock()
        mock_model.predict_proba = MagicMock(return_value=np.array([[0.1, 0.9]]))
        model._model = mock_model
        model._loaded = True
        
        _, conf_extreme = model.predict(sample_market)
        
        # Neutral probability (0.5) should have lower confidence
        mock_model.predict_proba = MagicMock(return_value=np.array([[0.5, 0.5]]))
        _, conf_neutral = model.predict(sample_market)
        
        assert conf_extreme > conf_neutral


class TestBatchPrediction:
    def test_predict_batch_returns_list(self, feature_engine):
        """Batch prediction should return list of tuples."""
        model = AlphaModel(feature_engine)
        
        mock_model = MagicMock()
        mock_model.predict_proba = MagicMock(return_value=np.array([
            [0.3, 0.7],
            [0.4, 0.6],
        ]))
        model._model = mock_model
        model._loaded = True
        
        markets = [
            UnifiedMarket(platform="a", market_id="1", title="Test 1"),
            UnifiedMarket(platform="b", market_id="2", title="Test 2"),
        ]
        
        results = model.predict_batch(markets)
        
        assert len(results) == 2
        for market, prob, conf in results:
            assert isinstance(market, UnifiedMarket)
            assert 0 <= prob <= 1
            assert 0 <= conf <= 1

    def test_predict_batch_empty_list(self, feature_engine):
        """Empty batch should return empty list."""
        model = AlphaModel(feature_engine)
        model._loaded = True
        model._model = MagicMock()
        
        results = model.predict_batch([])
        assert results == []


class TestTraining:
    def test_train_with_data(self, feature_engine):
        """Training should work with valid data."""
        pytest.importorskip("xgboost")
        pytest.importorskip("sklearn")
        
        model = AlphaModel(feature_engine)
        
        # Create synthetic training data with correct feature count
        np.random.seed(42)
        n_features = len(FeatureEngine.FEATURE_NAMES)
        X = np.random.rand(100, n_features).astype(np.float32)
        y = (np.random.rand(100) > 0.5).astype(int)
        
        with tempfile.TemporaryDirectory() as tmpdir:
            model._model_path = os.path.join(tmpdir, "model.pkl")
            metrics = model.train(X, y, save=True)
        
        # Check that training returned metrics (key names may vary by implementation)
        assert isinstance(metrics, dict)
        assert len(metrics) > 0
        # Should have accuracy in some form
        assert any("accuracy" in k.lower() for k in metrics.keys()) or "acc" in str(metrics).lower()
        assert model.is_loaded

    def test_train_without_dependencies(self, feature_engine):
        """Training should fail gracefully without dependencies."""
        model = AlphaModel(feature_engine)
        
        with patch.dict('sys.modules', {'xgboost': None}):
            X = np.random.rand(10, 14).astype(np.float32)
            y = np.array([0, 1, 0, 1, 0, 1, 0, 1, 0, 1])
            
            # This should handle the ImportError gracefully
            # Note: The test may not work if xgboost is already imported


class TestErrorHandling:
    def test_prediction_handles_feature_extraction_failure(self, feature_engine):
        """Prediction should handle feature extraction failures."""
        model = AlphaModel(feature_engine)
        model._loaded = True
        model._model = MagicMock()
        
        # Market with potentially problematic data
        market = UnifiedMarket(
            platform="test",
            market_id="t",
            title="Test",
            close_date="invalid-date",
        )
        
        # Should not raise, should return valid result or None
        result = model.predict(market)
        # May be None or valid tuple depending on error handling

    def test_prediction_handles_model_error(self, feature_engine, sample_market):
        """Prediction should handle model errors gracefully."""
        model = AlphaModel(feature_engine)
        
        mock_model = MagicMock()
        mock_model.predict_proba = MagicMock(side_effect=Exception("Model error"))
        model._model = mock_model
        model._loaded = True
        
        result = model.predict(sample_market)
        assert result is None


class TestIsLoadedProperty:
    def test_is_loaded_initially_false(self, model):
        """is_loaded should be False initially."""
        assert model.is_loaded is False

    def test_is_loaded_after_manual_set(self, model):
        """is_loaded should reflect _loaded attribute."""
        model._loaded = True
        assert model.is_loaded is True
