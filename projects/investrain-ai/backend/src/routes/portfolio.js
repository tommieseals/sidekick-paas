import { Router } from 'express';
import { 
  getAllHoldings, 
  getHoldingById, 
  createHolding, 
  updateHolding, 
  deleteHolding 
} from '../db/sqlite.js';
import { getBatchQuotes, calculateRiskMetrics } from '../services/marketData.js';
import { getSuggestedQuestions } from '../services/ragEngine.js';

const router = Router();

/**
 * GET /api/portfolio
 * Get full portfolio with current prices and metrics
 */
router.get('/', async (req, res) => {
  try {
    const holdings = getAllHoldings();
    const symbols = holdings.map(h => h.symbol);
    
    // Fetch current prices
    const quotes = await getBatchQuotes(symbols);
    
    // Calculate metrics
    const metrics = calculateRiskMetrics(holdings, quotes);
    
    // Get AI suggested questions
    const suggestedQuestions = getSuggestedQuestions(metrics);
    
    res.json({
      ...metrics,
      suggestedQuestions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

/**
 * GET /api/portfolio/holdings
 * Get raw holdings without prices
 */
router.get('/holdings', (req, res) => {
  try {
    const holdings = getAllHoldings();
    res.json(holdings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holdings' });
  }
});

/**
 * GET /api/portfolio/holdings/:id
 * Get a single holding
 */
router.get('/holdings/:id', (req, res) => {
  try {
    const holding = getHoldingById(req.params.id);
    if (!holding) {
      return res.status(404).json({ error: 'Holding not found' });
    }
    res.json(holding);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holding' });
  }
});

/**
 * POST /api/portfolio/holdings
 * Add a new holding
 */
router.post('/holdings', (req, res) => {
  try {
    const { symbol, shares, avgCost, sector } = req.body;
    
    if (!symbol || !shares || !avgCost) {
      return res.status(400).json({ 
        error: 'Missing required fields: symbol, shares, avgCost' 
      });
    }
    
    const holding = createHolding({ symbol, shares, avgCost, sector });
    res.status(201).json(holding);
  } catch (error) {
    console.error('Create holding error:', error);
    res.status(500).json({ error: 'Failed to create holding' });
  }
});

/**
 * PUT /api/portfolio/holdings/:id
 * Update a holding
 */
router.put('/holdings/:id', (req, res) => {
  try {
    const holding = updateHolding(req.params.id, req.body);
    if (!holding) {
      return res.status(404).json({ error: 'Holding not found' });
    }
    res.json(holding);
  } catch (error) {
    console.error('Update holding error:', error);
    res.status(500).json({ error: 'Failed to update holding' });
  }
});

/**
 * DELETE /api/portfolio/holdings/:id
 * Remove a holding
 */
router.delete('/holdings/:id', (req, res) => {
  try {
    const success = deleteHolding(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Holding not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete holding error:', error);
    res.status(500).json({ error: 'Failed to delete holding' });
  }
});

export default router;
