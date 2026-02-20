import { Router } from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../db/sqlite.js';
import { 
  getContainerStatus, 
  getContainerStats,
  stopContainer,
  startContainer,
  restartContainer,
  removeContainer
} from '../services/docker.js';
import { removeRepository } from '../services/git.js';
import { removeConfig } from '../services/nginx.js';

const router = Router();

/**
 * GET /api/projects
 * List all projects with container status
 */
router.get('/', async (req, res) => {
  try {
    const projects = getAllProjects();
    
    // Enrich with container status
    const enriched = await Promise.all(projects.map(async (project) => {
      const status = await getContainerStatus(project.id);
      const stats = status.running ? await getContainerStats(project.id) : null;
      
      return {
        ...project,
        envVars: JSON.parse(project.envVars || '{}'),
        containerStatus: status.status || 'stopped',
        running: status.running || false,
        stats
      };
    }));
    
    res.json(enriched);
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

/**
 * GET /api/projects/:id
 * Get single project details
 */
router.get('/:id', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const status = await getContainerStatus(project.id);
    const stats = status.running ? await getContainerStats(project.id) : null;
    
    res.json({
      ...project,
      envVars: JSON.parse(project.envVars || '{}'),
      containerStatus: status.status || 'stopped',
      running: status.running || false,
      stats
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

/**
 * POST /api/projects
 * Create a new project (without deploying)
 */
router.post('/', (req, res) => {
  try {
    const { name, repoUrl, branch, subdomain, envVars } = req.body;
    
    if (!name || !repoUrl || !subdomain) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, repoUrl, subdomain' 
      });
    }
    
    const project = createProject({ name, repoUrl, branch, subdomain, envVars });
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

/**
 * PUT /api/projects/:id
 * Update project settings
 */
router.put('/:id', (req, res) => {
  try {
    const project = updateProject(req.params.id, req.body);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete project and all resources
 */
router.delete('/:id', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Stop and remove container
    await stopContainer(project.id);
    await removeContainer(project.id);
    
    // Remove nginx config
    await removeConfig(project.id);
    
    // Remove repository
    await removeRepository(project.id);
    
    // Delete from database
    deleteProject(project.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

/**
 * POST /api/projects/:id/stop
 * Stop project container
 */
router.post('/:id/stop', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await stopContainer(project.id);
    updateProject(project.id, { containerStatus: 'stopped' });
    
    res.json({ success: true, status: 'stopped' });
  } catch (error) {
    console.error('Stop container error:', error);
    res.status(500).json({ error: 'Failed to stop container' });
  }
});

/**
 * POST /api/projects/:id/start
 * Start project container
 */
router.post('/:id/start', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await startContainer(project.id);
    updateProject(project.id, { containerStatus: 'running' });
    
    res.json({ success: true, status: 'running' });
  } catch (error) {
    console.error('Start container error:', error);
    res.status(500).json({ error: 'Failed to start container' });
  }
});

/**
 * POST /api/projects/:id/restart
 * Restart project container
 */
router.post('/:id/restart', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    await restartContainer(project.id);
    
    res.json({ success: true, status: 'running' });
  } catch (error) {
    console.error('Restart container error:', error);
    res.status(500).json({ error: 'Failed to restart container' });
  }
});

export default router;
