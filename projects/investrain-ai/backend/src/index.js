import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db/sqlite.js';
import portfolioRoutes from './routes/portfolio.js';
import marketRoutes from './routes/market.js';
import chatRoutes from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
}

// Initialize database
initDB();

// API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// SPA fallback for production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`
  💹 ═══════════════════════════════════════════════════════════
     INVESTRAIN AI - Financial Intelligence Platform
     Running on http://localhost:${PORT}
     
     Endpoints:
       GET  /api/portfolio        - Get portfolio with prices
       POST /api/portfolio/holdings - Add holding
       GET  /api/market/quote/:symbol - Get stock quote
       POST /api/chat             - Chat with AI about portfolio
       
     Environment:
       LLM: ${process.env.OLLAMA_URL || 'http://localhost:11434'}
       Mock Data: ${process.env.USE_MOCK_DATA || 'true'}
  ═══════════════════════════════════════════════════════════ 💹
  `);
});
