import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DB_PATH || join(__dirname, '../../data/sidekick.db');

let db;

export function initDB() {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  
  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      repoUrl TEXT NOT NULL,
      branch TEXT DEFAULT 'main',
      subdomain TEXT UNIQUE,
      domain TEXT,
      projectType TEXT,
      port INTEGER,
      containerId TEXT,
      containerStatus TEXT DEFAULT 'stopped',
      sslEnabled INTEGER DEFAULT 0,
      envVars TEXT DEFAULT '{}',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastDeployedAt TEXT
    )
  `);
  
  // Deployments table (history)
  db.exec(`
    CREATE TABLE IF NOT EXISTS deployments (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      commitHash TEXT,
      logs TEXT,
      startedAt TEXT NOT NULL,
      completedAt TEXT,
      FOREIGN KEY (projectId) REFERENCES projects(id)
    )
  `);
  
  console.log('✅ Database initialized at:', DB_PATH);
  return db;
}

// ============== Projects ==============

export function getAllProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY updatedAt DESC').all();
}

export function getProjectById(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

export function getProjectBySubdomain(subdomain) {
  return db.prepare('SELECT * FROM projects WHERE subdomain = ?').get(subdomain);
}

export function createProject(data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO projects (id, name, repoUrl, branch, subdomain, projectType, port, envVars, createdAt, updatedAt)
    VALUES (@id, @name, @repoUrl, @branch, @subdomain, @projectType, @port, @envVars, @createdAt, @updatedAt)
  `).run({
    id,
    name: data.name,
    repoUrl: data.repoUrl,
    branch: data.branch || 'main',
    subdomain: data.subdomain,
    projectType: data.projectType || null,
    port: data.port || null,
    envVars: JSON.stringify(data.envVars || {}),
    createdAt: now,
    updatedAt: now
  });
  
  return getProjectById(id);
}

export function updateProject(id, data) {
  const now = new Date().toISOString();
  const project = getProjectById(id);
  if (!project) return null;
  
  const updates = {
    ...project,
    ...data,
    envVars: data.envVars ? JSON.stringify(data.envVars) : project.envVars,
    updatedAt: now
  };
  
  db.prepare(`
    UPDATE projects SET
      name = @name,
      repoUrl = @repoUrl,
      branch = @branch,
      subdomain = @subdomain,
      domain = @domain,
      projectType = @projectType,
      port = @port,
      containerId = @containerId,
      containerStatus = @containerStatus,
      sslEnabled = @sslEnabled,
      envVars = @envVars,
      updatedAt = @updatedAt,
      lastDeployedAt = @lastDeployedAt
    WHERE id = @id
  `).run(updates);
  
  return getProjectById(id);
}

export function deleteProject(id) {
  db.prepare('DELETE FROM deployments WHERE projectId = ?').run(id);
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return result.changes > 0;
}

// ============== Deployments ==============

export function createDeployment(projectId) {
  const id = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO deployments (id, projectId, status, startedAt)
    VALUES (@id, @projectId, 'pending', @startedAt)
  `).run({ id, projectId, startedAt: now });
  
  return getDeploymentById(id);
}

export function getDeploymentById(id) {
  return db.prepare('SELECT * FROM deployments WHERE id = ?').get(id);
}

export function getDeploymentsByProject(projectId, limit = 10) {
  return db.prepare(`
    SELECT * FROM deployments 
    WHERE projectId = ? 
    ORDER BY startedAt DESC 
    LIMIT ?
  `).all(projectId, limit);
}

export function updateDeployment(id, data) {
  const deployment = getDeploymentById(id);
  if (!deployment) return null;
  
  const updates = { ...deployment, ...data };
  
  db.prepare(`
    UPDATE deployments SET
      status = @status,
      commitHash = @commitHash,
      logs = @logs,
      completedAt = @completedAt
    WHERE id = @id
  `).run(updates);
  
  return getDeploymentById(id);
}
