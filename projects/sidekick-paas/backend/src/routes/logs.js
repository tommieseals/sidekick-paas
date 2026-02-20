import { Router } from 'express';
import { getProjectById } from '../db/sqlite.js';
import { getContainerLogs, streamContainerLogs } from '../services/docker.js';

const router = Router();

/**
 * GET /api/logs/:id
 * Get container logs
 */
router.get('/:id', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const tail = parseInt(req.query.tail) || 100;
    const logs = await getContainerLogs(project.id, { tail });
    
    res.json({
      projectId: project.id,
      logs: logs.split('\n').filter(Boolean)
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

/**
 * GET /api/logs/:id/stream
 * Stream container logs (SSE)
 */
router.get('/:id/stream', async (req, res) => {
  const project = getProjectById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  res.write('data: {"connected": true}\n\n');
  
  // Stream logs
  const cleanup = await streamContainerLogs(project.id, (log) => {
    res.write(`data: ${JSON.stringify({ log })}\n\n`);
  });
  
  // Clean up on disconnect
  req.on('close', () => {
    cleanup();
  });
});

export default router;
