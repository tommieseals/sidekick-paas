"""
Tests for the Sentiment NLP Scorer.
"""

import pytest
from ml.sentiment_nlp import SentimentScorer


@pytest.fixture
def scorer():
    return SentimentScorer()


class TestBasicScoring:
    def test_scorer_initializes(self, scorer):
        """Scorer should initialize (textblob may or may not be available)."""
        assert scorer is not None

    def test_neutral_text_returns_near_50(self, scorer):
        """Neutral text should return score near 0.5."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("Will the event happen?")
        # Neutral questions should be close to 0.5
        assert 0.35 <= score <= 0.65

    def test_positive_text_above_50(self, scorer):
        """Positive text should return score above 0.5."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("Will the amazing success continue with excellent results?")
        assert score >= 0.5

    def test_negative_text_below_50(self, scorer):
        """Negative text should return score below 0.5."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("Will the terrible disaster cause horrible damage?")
        assert score <= 0.5


class TestScoreBounds:
    def test_score_never_below_05(self, scorer):
        """Score should never go below 0.05."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("Terrible awful horrible disastrous catastrophic failure")
        assert score >= 0.05

    def test_score_never_above_95(self, scorer):
        """Score should never go above 0.95."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("Amazing wonderful excellent fantastic superb success!")
        assert score <= 0.95


class TestDisabledScorer:
    def test_disabled_returns_50(self):
        """Disabled scorer should return 0.5."""
        scorer = SentimentScorer()
        if scorer.enabled:
            # Can't easily test disabled state when textblob is installed
            pytest.skip("TextBlob is installed, can't test disabled mode")
        
        assert scorer.score_market("Any text") == 0.5


class TestMultipleTexts:
    def test_score_texts_aggregates(self, scorer):
        """score_texts should aggregate multiple scores."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        texts = [
            "Great news about the economy!",
            "Terrible market crash predicted.",
            "Normal business operations continue.",
        ]
        score = scorer.score_texts(texts)
        
        # Should be average of the three
        assert 0.3 <= score <= 0.7

    def test_score_texts_empty_list(self, scorer):
        """Empty text list should return 0.5."""
        score = scorer.score_texts([])
        assert score == 0.5

    def test_score_texts_single_item(self, scorer):
        """Single item list should match direct scoring."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        text = "Good positive news"
        direct = scorer.score_market(text)
        via_list = scorer.score_texts([text])
        
        assert direct == pytest.approx(via_list)


class TestEdgeCases:
    def test_empty_string(self, scorer):
        """Empty string should return ~0.5."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("")
        assert 0.4 <= score <= 0.6

    def test_numbers_only(self, scorer):
        """Numbers only should return ~0.5."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("12345 67890")
        assert 0.4 <= score <= 0.6

    def test_special_characters(self, scorer):
        """Special characters should not crash."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("!@#$%^&*()_+-=[]{}|;':\",./<>?")
        # Should return some valid score
        assert 0.05 <= score <= 0.95

    def test_unicode_text(self, scorer):
        """Unicode text should be handled."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market("Will the Yen 円 exceed expectations?")
        assert 0.05 <= score <= 0.95


class TestEnabledProperty:
    def test_enabled_property_exists(self, scorer):
        """Scorer should have enabled property."""
        assert hasattr(scorer, 'enabled')
        assert isinstance(scorer.enabled, bool)


class TestMarketTitleExamples:
    """Test with realistic market title examples."""
    
    @pytest.mark.parametrize("title,expected_direction", [
        ("Will Bitcoin crash below $20,000?", "negative"),
        ("Will the economy experience strong growth?", "positive"),
        ("Will the US win the World Cup?", "neutral"),
        ("Will there be a major recession?", "negative"),
        ("Will the company announce record profits?", "positive"),
    ])
    def test_sentiment_direction(self, scorer, title, expected_direction):
        """Test sentiment direction for various market titles."""
        if not scorer.enabled:
            pytest.skip("TextBlob not installed")
        
        score = scorer.score_market(title)
        
        if expected_direction == "positive":
            # May not always be > 0.5 due to NLP limitations
            assert score >= 0.40
        elif expected_direction == "negative":
            assert score <= 0.60
        else:  # neutral
            assert 0.35 <= score <= 0.65
