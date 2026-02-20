import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initDB, getAllTasks, createTask, updateTask, deleteTask, moveTask } from './db/sqlite.js';
import { parseCommand } from './nlp/parser.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// Broadcast helper
const broadcast = (event, data) => {
  io.emit(event, data);
};

// ============== API Routes ==============

// Parse natural language command
app.post('/api/parse', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const parsed = await parseCommand(text);
    
    // Broadcast parsing preview for real-time feedback
    broadcast('parse:preview', { input: text, parsed });
    
    res.json(parsed);
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: 'Failed to parse command' });
  }
});

// Execute parsed command (parse + execute in one step)
app.post('/api/execute', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const parsed = await parseCommand(text);
    let result;
    
    switch (parsed.intent) {
      case 'CREATE':
        result = createTask(parsed.task);
        broadcast('task:created', result);
        break;
        
      case 'UPDATE':
        result = updateTask(parsed.target, parsed.updates);
        if (result) broadcast('task:updated', result);
        break;
        
      case 'DELETE':
        result = deleteTask(parsed.target);
        if (result) broadcast('task:deleted', { id: parsed.target });
        break;
        
      case 'MOVE':
        result = moveTask(parsed.target, parsed.destination);
        if (result) broadcast('task:updated', result);
        break;
        
      case 'QUERY':
        result = getAllTasks(parsed.filters);
        break;
        
      default:
        return res.status(400).json({ error: 'Unknown intent', parsed });
    }
    
    res.json({ success: true, intent: parsed.intent, result, parsed });
  } catch (error) {
    console.error('Execute error:', error);
    res.status(500).json({ error: 'Failed to execute command' });
  }
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = getAllTasks(req.query);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Create task directly
app.post('/api/tasks', (req, res) => {
  try {
    const task = createTask(req.body);
    broadcast('task:created', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const task = updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    broadcast('task:updated', task);
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const success = deleteTask(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Task not found' });
    }
    broadcast('task:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Move task to different column
app.patch('/api/tasks/:id/move', (req, res) => {
  try {
    const { status } = req.body;
    const task = moveTask(req.params.id, status);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    broadcast('task:updated', task);
    res.json(task);
  } catch (error) {
    console.error('Move task error:', error);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============== WebSocket ==============

io.on('connection', (socket) => {
  console.log('🦖 Client connected:', socket.id);
  
  // Send current tasks on connect
  socket.emit('tasks:sync', getAllTasks());
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============== Start Server ==============

server.listen(PORT, () => {
  console.log(`
  🦖 ═══════════════════════════════════════════════════════════
     TASCOSAUR NLP ENGINE v1.0
     Running on http://localhost:${PORT}
     
     Endpoints:
       POST /api/parse     - Parse natural language
       POST /api/execute   - Parse + execute command
       GET  /api/tasks     - List all tasks
       POST /api/tasks     - Create task
       PUT  /api/tasks/:id - Update task
       DELETE /api/tasks/:id - Delete task
       
     WebSocket: Real-time sync enabled
  ═══════════════════════════════════════════════════════════ 🦖
  `);
});
