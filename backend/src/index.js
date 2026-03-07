import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db/sqlite.js';
import projectRoutes from './routes/projects.js';
import deployRoutes from './routes/deploy.js';
import logsRoutes from './routes/logs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Make io available to routes
app.set('io', io);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
}

// Initialize database
initDB();

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/logs', logsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// WebSocket handlers
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('subscribe:logs', (projectId) => {
    socket.join(`logs:${projectId}`);
    console.log(`Client subscribed to logs:${projectId}`);
  });
  
  socket.on('subscribe:build', (projectId) => {
    socket.join(`build:${projectId}`);
    console.log(`Client subscribed to build:${projectId}`);
  });
  
  socket.on('unsubscribe', (channel) => {
    socket.leave(channel);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in services
export { io };

// Start server
server.listen(PORT, () => {
  console.log(`
  🚀 ═══════════════════════════════════════════════════════════
     SIDEKICK PAAS - Zero-Config Deployment Engine
     Running on http://localhost:${PORT}
     
     Endpoints:
       GET  /api/projects         - List projects
       POST /api/projects         - Create project
       POST /api/deploy           - Deploy from GitHub
       GET  /api/logs/:id         - Get container logs
       
     WebSocket:
       /ws/logs/:id   - Stream container logs
       /ws/build/:id  - Stream build logs
  ═══════════════════════════════════════════════════════════ 🚀
  `);
});
