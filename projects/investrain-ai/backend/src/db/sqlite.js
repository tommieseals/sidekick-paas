import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DB_PATH || join(__dirname, '../../data/portfolio.db');

let db;

/**
 * Initialize the database
 */
export function initDB() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  
  // Holdings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS holdings (
      id TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      shares REAL NOT NULL,
      avgCost REAL NOT NULL,
      sector TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
  
  // Chat history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id TEXT PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
  
  // Price cache table
  db.exec(`
    CREATE TABLE IF NOT EXISTS price_cache (
      symbol TEXT PRIMARY KEY,
      price REAL NOT NULL,
      change REAL,
      changePercent REAL,
      volume INTEGER,
      updatedAt TEXT NOT NULL
    )
  `);
  
  console.log('✅ Database initialized at:', DB_PATH);
  
  // Seed sample holdings if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM holdings').get();
  if (count.count === 0) {
    seedSamplePortfolio();
  }
  
  return db;
}

/**
 * Seed sample portfolio for demo
 */
function seedSamplePortfolio() {
  const sampleHoldings = [
    { symbol: 'AAPL', shares: 50, avgCost: 165.00, sector: 'Technology' },
    { symbol: 'MSFT', shares: 30, avgCost: 380.00, sector: 'Technology' },
    { symbol: 'GOOGL', shares: 15, avgCost: 140.00, sector: 'Technology' },
    { symbol: 'TSLA', shares: 25, avgCost: 245.00, sector: 'Automotive' },
    { symbol: 'NVDA', shares: 20, avgCost: 480.00, sector: 'Technology' },
    { symbol: 'JPM', shares: 40, avgCost: 175.00, sector: 'Finance' },
    { symbol: 'JNJ', shares: 35, avgCost: 155.00, sector: 'Healthcare' },
    { symbol: 'V', shares: 25, avgCost: 275.00, sector: 'Finance' },
    { symbol: 'UNH', shares: 10, avgCost: 520.00, sector: 'Healthcare' },
    { symbol: 'HD', shares: 20, avgCost: 350.00, sector: 'Consumer' },
  ];
  
  const stmt = db.prepare(`
    INSERT INTO holdings (id, symbol, shares, avgCost, sector, createdAt, updatedAt)
    VALUES (@id, @symbol, @shares, @avgCost, @sector, @createdAt, @updatedAt)
  `);
  
  const now = new Date().toISOString();
  
  for (const holding of sampleHoldings) {
    stmt.run({
      id: uuidv4(),
      ...holding,
      createdAt: now,
      updatedAt: now
    });
  }
  
  console.log('✅ Seeded sample portfolio with', sampleHoldings.length, 'holdings');
}

// ============== Holdings ==============

export function getAllHoldings() {
  return db.prepare('SELECT * FROM holdings ORDER BY symbol').all();
}

export function getHoldingById(id) {
  return db.prepare('SELECT * FROM holdings WHERE id = ?').get(id);
}

export function createHolding(data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO holdings (id, symbol, shares, avgCost, sector, createdAt, updatedAt)
    VALUES (@id, @symbol, @shares, @avgCost, @sector, @createdAt, @updatedAt)
  `).run({
    id,
    symbol: data.symbol.toUpperCase(),
    shares: data.shares,
    avgCost: data.avgCost,
    sector: data.sector || 'Other',
    createdAt: now,
    updatedAt: now
  });
  
  return getHoldingById(id);
}

export function updateHolding(id, data) {
  const now = new Date().toISOString();
  const existing = getHoldingById(id);
  if (!existing) return null;
  
  db.prepare(`
    UPDATE holdings SET
      symbol = @symbol,
      shares = @shares,
      avgCost = @avgCost,
      sector = @sector,
      updatedAt = @updatedAt
    WHERE id = @id
  `).run({
    id,
    symbol: (data.symbol || existing.symbol).toUpperCase(),
    shares: data.shares ?? existing.shares,
    avgCost: data.avgCost ?? existing.avgCost,
    sector: data.sector ?? existing.sector,
    updatedAt: now
  });
  
  return getHoldingById(id);
}

export function deleteHolding(id) {
  const result = db.prepare('DELETE FROM holdings WHERE id = ?').run(id);
  return result.changes > 0;
}

// ============== Chat History ==============

export function getChatHistory(limit = 50) {
  return db.prepare(`
    SELECT * FROM chat_history 
    ORDER BY createdAt DESC 
    LIMIT ?
  `).all(limit).reverse();
}

export function addChatMessage(role, content) {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO chat_history (id, role, content, createdAt)
    VALUES (@id, @role, @content, @createdAt)
  `).run({ id, role, content, createdAt: now });
  
  return { id, role, content, createdAt: now };
}

export function clearChatHistory() {
  db.prepare('DELETE FROM chat_history').run();
}

// ============== Price Cache ==============

export function getCachedPrice(symbol) {
  const row = db.prepare('SELECT * FROM price_cache WHERE symbol = ?').get(symbol);
  if (!row) return null;
  
  // Check if cache is stale (>5 minutes)
  const age = Date.now() - new Date(row.updatedAt).getTime();
  if (age > 5 * 60 * 1000) return null;
  
  return row;
}

export function setCachedPrice(symbol, data) {
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT OR REPLACE INTO price_cache (symbol, price, change, changePercent, volume, updatedAt)
    VALUES (@symbol, @price, @change, @changePercent, @volume, @updatedAt)
  `).run({
    symbol: symbol.toUpperCase(),
    price: data.price,
    change: data.change || 0,
    changePercent: data.changePercent || 0,
    volume: data.volume || 0,
    updatedAt: now
  });
}
