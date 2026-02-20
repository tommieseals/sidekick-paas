import { Router } from 'express';
import { getChatHistory, clearChatHistory, getAllHoldings } from '../db/sqlite.js';
import { getBatchQuotes, calculateRiskMetrics } from '../services/marketData.js';
import { answerQuestion, getSuggestedQuestions } from '../services/ragEngine.js';
import { checkOllamaHealth } from '../services/llm.js';

const router = Router();

/**
 * POST /api/chat
 * Send a question about the portfolio
 */
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Get current portfolio data for context
    const holdings = getAllHoldings();
    const symbols = holdings.map(h => h.symbol);
    const quotes = await getBatchQuotes(symbols);
    const portfolioData = calculateRiskMetrics(holdings, quotes);
    
    // Generate AI response
    const response = await answerQuestion(question.trim(), portfolioData);
    
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process question',
      message: error.message 
    });
  }
});

/**
 * GET /api/chat/history
 * Get chat history
 */
router.get('/history', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = getChatHistory(limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

/**
 * POST /api/chat/clear
 * Clear chat history
 */
router.post('/clear', (req, res) => {
  try {
    clearChatHistory();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

/**
 * GET /api/chat/suggestions
 * Get suggested questions based on portfolio
 */
router.get('/suggestions', async (req, res) => {
  try {
    const holdings = getAllHoldings();
    const symbols = holdings.map(h => h.symbol);
    const quotes = await getBatchQuotes(symbols);
    const portfolioData = calculateRiskMetrics(holdings, quotes);
    
    const suggestions = getSuggestedQuestions(portfolioData);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

/**
 * GET /api/chat/health
 * Check LLM availability
 */
router.get('/health', async (req, res) => {
  try {
    const health = await checkOllamaHealth();
    res.json(health);
  } catch (error) {
    res.json({ available: false, error: error.message });
  }
});

export default router;
