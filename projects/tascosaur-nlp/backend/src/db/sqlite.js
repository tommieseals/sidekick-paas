import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DB_PATH || join(__dirname, '../../data/tasks.db');

let db;

/**
 * Initialize the database
 */
export function initDB() {
  // Ensure data directory exists
  const dataDir = dirname(DB_PATH);
  
  db = new Database(DB_PATH);
  
  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');
  
  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'backlog',
      tags TEXT DEFAULT '[]',
      assignee TEXT,
      dueDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
  
  // Create index for common queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
  `);
  
  console.log('✅ Database initialized at:', DB_PATH);
  
  // Add sample tasks if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
  if (count.count === 0) {
    seedSampleTasks();
  }
  
  return db;
}

/**
 * Seed sample tasks for demo
 */
function seedSampleTasks() {
  const sampleTasks = [
    { title: 'Login page bug', priority: 'high', tags: ['bug', 'ui'], status: 'backlog' },
    { title: 'API refactor', priority: 'medium', tags: ['backend', 'refactor'], status: 'in-progress', assignee: 'sarah' },
    { title: 'Update documentation', priority: 'low', tags: ['docs'], status: 'backlog' },
    { title: 'Dark mode theme', priority: 'medium', tags: ['ui', 'feature'], status: 'done' },
  ];
  
  for (const task of sampleTasks) {
    createTask(task);
  }
  
  console.log('✅ Seeded sample tasks');
}

/**
 * Get all tasks with optional filters
 */
export function getAllTasks(filters = {}) {
  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];
  
  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  
  if (filters.priority) {
    query += ' AND priority = ?';
    params.push(filters.priority);
  }
  
  if (filters.assignee) {
    query += ' AND assignee = ?';
    params.push(filters.assignee);
  }
  
  if (filters.tags) {
    // Search for any matching tag
    const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
    for (const tag of tags) {
      query += ` AND tags LIKE ?`;
      params.push(`%"${tag}"%`);
    }
  }
  
  query += ' ORDER BY createdAt DESC';
  
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  
  // Parse tags JSON
  return rows.map(row => ({
    ...row,
    tags: JSON.parse(row.tags || '[]'),
  }));
}

/**
 * Get task by ID
 */
export function getTaskById(id) {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  const row = stmt.get(id);
  
  if (!row) return null;
  
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
  };
}

/**
 * Find task by title (fuzzy match)
 */
export function findTaskByTitle(title) {
  const stmt = db.prepare(`
    SELECT * FROM tasks 
    WHERE LOWER(title) LIKE ? 
    ORDER BY updatedAt DESC 
    LIMIT 1
  `);
  
  const row = stmt.get(`%${title.toLowerCase()}%`);
  
  if (!row) return null;
  
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
  };
}

/**
 * Create a new task
 */
export function createTask(data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const task = {
    id,
    title: data.title || 'Untitled Task',
    description: data.description || '',
    priority: data.priority || 'medium',
    status: data.status || 'backlog',
    tags: JSON.stringify(data.tags || []),
    assignee: data.assignee || null,
    dueDate: data.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
  
  const stmt = db.prepare(`
    INSERT INTO tasks (id, title, description, priority, status, tags, assignee, dueDate, createdAt, updatedAt)
    VALUES (@id, @title, @description, @priority, @status, @tags, @assignee, @dueDate, @createdAt, @updatedAt)
  `);
  
  stmt.run(task);
  
  return {
    ...task,
    tags: data.tags || [],
  };
}

/**
 * Update a task by ID or title match
 */
export function updateTask(idOrTitle, updates) {
  let task = getTaskById(idOrTitle);
  
  // Try finding by title if not found by ID
  if (!task) {
    task = findTaskByTitle(idOrTitle);
  }
  
  if (!task) return null;
  
  const now = new Date().toISOString();
  const newData = {
    ...task,
    ...updates,
    tags: updates.tags ? JSON.stringify(updates.tags) : JSON.stringify(task.tags),
    updatedAt: now,
  };
  
  const stmt = db.prepare(`
    UPDATE tasks SET
      title = @title,
      description = @description,
      priority = @priority,
      status = @status,
      tags = @tags,
      assignee = @assignee,
      dueDate = @dueDate,
      updatedAt = @updatedAt
    WHERE id = @id
  `);
  
  stmt.run(newData);
  
  return {
    ...newData,
    tags: updates.tags || task.tags,
  };
}

/**
 * Delete a task by ID or title match
 */
export function deleteTask(idOrTitle) {
  let task = getTaskById(idOrTitle);
  
  if (!task) {
    task = findTaskByTitle(idOrTitle);
  }
  
  if (!task) return false;
  
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  const result = stmt.run(task.id);
  
  return result.changes > 0;
}

/**
 * Move a task to a different status
 */
export function moveTask(idOrTitle, status) {
  return updateTask(idOrTitle, { status });
}

/**
 * Get tasks grouped by status (for Kanban)
 */
export function getTasksByStatus() {
  const tasks = getAllTasks();
  
  return {
    backlog: tasks.filter(t => t.status === 'backlog'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    review: tasks.filter(t => t.status === 'review'),
    done: tasks.filter(t => t.status === 'done'),
  };
}
