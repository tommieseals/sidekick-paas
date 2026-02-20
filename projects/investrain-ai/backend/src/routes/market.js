import { Router } from 'express';
import { getQuote, getBatchQuotes, getHistory } from '../services/marketData.js';

const router = Router();

/**
 * GET /api/market/quote/:symbol
 * Get current quote for a symbol
 */
router.get('/quote/:symbol', async (req, res) => {
  try {
    const quote = await getQuote(req.params.symbol);
    res.json(quote);
  } catch (error) {
    console.error('Quote fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

/**
 * GET /api/market/batch
 * Get quotes for multiple symbols
 * Query: ?symbols=AAPL,MSFT,GOOGL
 */
router.get('/batch', async (req, res) => {
  try {
    const symbols = req.query.symbols?.split(',') || [];
    
    if (symbols.length === 0) {
      return res.status(400).json({ error: 'No symbols provided' });
    }
    
    if (symbols.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 symbols per request' });
    }
    
    const quotes = await getBatchQuotes(symbols);
    res.json(quotes);
  } catch (error) {
    console.error('Batch quote error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

/**
 * GET /api/market/history/:symbol
 * Get price history for a symbol
 * Query: ?days=30
 */
router.get('/history/:symbol', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const history = await getHistory(req.params.symbol, Math.min(days, 365));
    res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * GET /api/market/search
 * Search for symbols (mock implementation)
 */
router.get('/search', (req, res) => {
  const query = (req.query.q || '').toUpperCase();
  
  const allSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'UNH', name: 'UnitedHealth Group' },
    { symbol: 'HD', name: 'The Home Depot' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'DIS', name: 'The Walt Disney Company' },
    { symbol: 'PYPL', name: 'PayPal Holdings' },
  ];
  
  const results = allSymbols.filter(s => 
    s.symbol.includes(query) || s.name.toUpperCase().includes(query)
  ).slice(0, 10);
  
  res.json(results);
});

export default router;
