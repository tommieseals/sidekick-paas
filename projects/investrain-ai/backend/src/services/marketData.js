import axios from 'axios';
import { getCachedPrice, setCachedPrice } from '../db/sqlite.js';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
const USE_MOCK_DATA = process.env.USE_MOCK_DATA !== 'false';

// Mock price data for demo (realistic prices as of 2024)
const MOCK_PRICES = {
  AAPL: { price: 175.50, change: 2.15, changePercent: 1.24, volume: 52000000 },
  MSFT: { price: 415.80, change: 5.20, changePercent: 1.27, volume: 22000000 },
  GOOGL: { price: 155.25, change: -1.80, changePercent: -1.15, volume: 18000000 },
  TSLA: { price: 248.90, change: -6.50, changePercent: -2.55, volume: 95000000 },
  NVDA: { price: 875.40, change: 22.30, changePercent: 2.62, volume: 42000000 },
  JPM: { price: 198.75, change: 1.45, changePercent: 0.73, volume: 8500000 },
  JNJ: { price: 158.20, change: 0.85, changePercent: 0.54, volume: 6200000 },
  V: { price: 285.60, change: 3.20, changePercent: 1.13, volume: 5800000 },
  UNH: { price: 545.30, change: -4.70, changePercent: -0.85, volume: 3200000 },
  HD: { price: 378.90, change: 4.50, changePercent: 1.20, volume: 4100000 },
  AMZN: { price: 185.50, change: 2.80, changePercent: 1.53, volume: 45000000 },
  META: { price: 505.20, change: -8.30, changePercent: -1.62, volume: 15000000 },
  NFLX: { price: 628.40, change: 12.50, changePercent: 2.03, volume: 4800000 },
  DIS: { price: 112.30, change: 1.20, changePercent: 1.08, volume: 9200000 },
  PYPL: { price: 62.45, change: -0.85, changePercent: -1.34, volume: 12000000 },
};

// Historical mock data (last 30 days)
function generateMockHistory(basePrice, volatility = 0.02) {
  const history = [];
  let price = basePrice * 0.95; // Start 5% lower
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, price * 0.9);
    
    history.push({
      date: date.toISOString().split('T')[0],
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.02),
      low: price * (1 - Math.random() * 0.02),
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return history;
}

/**
 * Get stock quote
 */
export async function getQuote(symbol) {
  symbol = symbol.toUpperCase();
  
  // Check cache first
  const cached = getCachedPrice(symbol);
  if (cached) {
    return {
      symbol,
      price: cached.price,
      change: cached.change,
      changePercent: cached.changePercent,
      volume: cached.volume,
      cached: true
    };
  }
  
  // Use mock data in demo mode
  if (USE_MOCK_DATA || ALPHA_VANTAGE_KEY === 'demo') {
    const mock = MOCK_PRICES[symbol];
    if (mock) {
      // Add some randomness to make it feel live
      const variance = mock.price * 0.001 * (Math.random() - 0.5);
      const data = {
        ...mock,
        price: mock.price + variance,
        mock: true
      };
      setCachedPrice(symbol, data);
      return { symbol, ...data };
    }
    
    // Unknown symbol - generate random
    const basePrice = 50 + Math.random() * 200;
    const data = {
      price: basePrice,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 4,
      volume: Math.floor(Math.random() * 10000000),
      mock: true
    };
    setCachedPrice(symbol, data);
    return { symbol, ...data };
  }
  
  // Real API call
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: ALPHA_VANTAGE_KEY
      },
      timeout: 10000
    });
    
    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      throw new Error('Invalid response from Alpha Vantage');
    }
    
    const data = {
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '')),
      volume: parseInt(quote['06. volume']),
    };
    
    setCachedPrice(symbol, data);
    return { symbol, ...data };
  } catch (error) {
    console.error(`Failed to fetch quote for ${symbol}:`, error.message);
    
    // Fallback to mock
    const mock = MOCK_PRICES[symbol] || { price: 100, change: 0, changePercent: 0, volume: 0 };
    return { symbol, ...mock, error: error.message };
  }
}

/**
 * Get multiple quotes at once
 */
export async function getBatchQuotes(symbols) {
  const quotes = {};
  
  // Fetch in parallel (limited concurrency)
  const results = await Promise.all(
    symbols.map(symbol => getQuote(symbol).catch(e => ({ symbol, error: e.message })))
  );
  
  for (const result of results) {
    quotes[result.symbol] = result;
  }
  
  return quotes;
}

/**
 * Get price history
 */
export async function getHistory(symbol, days = 30) {
  symbol = symbol.toUpperCase();
  
  // Always use mock for history (Alpha Vantage free tier is limited)
  const basePrice = MOCK_PRICES[symbol]?.price || 100;
  const volatility = symbol === 'TSLA' ? 0.04 : 0.02;
  
  return generateMockHistory(basePrice, volatility);
}

/**
 * Calculate risk metrics
 */
export function calculateRiskMetrics(holdings, quotes) {
  const metrics = {
    portfolioValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    holdings: [],
    sectors: {},
    topGainer: null,
    topLoser: null,
    highestRisk: null,
    beta: 0,
  };
  
  // Volatility estimates (simplified - would use historical data in production)
  const volatilities = {
    TSLA: 0.45, NVDA: 0.38, META: 0.35, NFLX: 0.32, GOOGL: 0.28,
    AAPL: 0.25, MSFT: 0.24, AMZN: 0.30, JPM: 0.22, JNJ: 0.15,
    V: 0.20, UNH: 0.22, HD: 0.23, DIS: 0.28, PYPL: 0.40
  };
  
  const betas = {
    TSLA: 1.8, NVDA: 1.6, META: 1.3, NFLX: 1.4, GOOGL: 1.1,
    AAPL: 1.2, MSFT: 1.0, AMZN: 1.3, JPM: 1.1, JNJ: 0.6,
    V: 0.9, UNH: 0.8, HD: 1.0, DIS: 1.2, PYPL: 1.5
  };
  
  for (const holding of holdings) {
    const quote = quotes[holding.symbol] || { price: holding.avgCost, change: 0, changePercent: 0 };
    const value = holding.shares * quote.price;
    const costBasis = holding.shares * holding.avgCost;
    const gain = value - costBasis;
    const gainPercent = ((value - costBasis) / costBasis) * 100;
    const dayChange = holding.shares * quote.change;
    
    const enriched = {
      ...holding,
      currentPrice: quote.price,
      value,
      costBasis,
      gain,
      gainPercent,
      dayChange,
      dayChangePercent: quote.changePercent,
      volatility: volatilities[holding.symbol] || 0.25,
      beta: betas[holding.symbol] || 1.0
    };
    
    metrics.holdings.push(enriched);
    metrics.portfolioValue += value;
    metrics.dailyChange += dayChange;
    
    // Track sectors
    const sector = holding.sector || 'Other';
    metrics.sectors[sector] = (metrics.sectors[sector] || 0) + value;
    
    // Track top performers
    if (!metrics.topGainer || enriched.dayChangePercent > metrics.topGainer.dayChangePercent) {
      metrics.topGainer = enriched;
    }
    if (!metrics.topLoser || enriched.dayChangePercent < metrics.topLoser.dayChangePercent) {
      metrics.topLoser = enriched;
    }
    
    // Track highest risk
    if (!metrics.highestRisk || enriched.volatility > metrics.highestRisk.volatility) {
      metrics.highestRisk = enriched;
    }
  }
  
  // Calculate portfolio-level metrics
  if (metrics.portfolioValue > 0) {
    metrics.dailyChangePercent = (metrics.dailyChange / (metrics.portfolioValue - metrics.dailyChange)) * 100;
    
    // Weighted average beta
    metrics.beta = metrics.holdings.reduce((sum, h) => {
      return sum + (h.beta * h.value / metrics.portfolioValue);
    }, 0);
    
    // Convert sectors to percentages
    for (const sector in metrics.sectors) {
      metrics.sectors[sector] = {
        value: metrics.sectors[sector],
        percent: (metrics.sectors[sector] / metrics.portfolioValue) * 100
      };
    }
  }
  
  return metrics;
}
