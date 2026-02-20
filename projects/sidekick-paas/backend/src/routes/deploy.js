import { Router } from 'express';
import { 
  createProject, 
  getProjectById, 
  updateProject,
  createDeployment,
  updateDeployment,
  getDeploymentById,
  getDeploymentsByProject
} from '../db/sqlite.js';
import { cloneRepository, pullRepository, parseGitHubUrl, getCommitInfo } from '../services/git.js';
import { detectProjectType, getProjectTypeDisplayName } from '../services/detector.js';
import { generateDockerfile, generateDockerignore, getDefaultPort } from '../services/dockerBuilder.js';
import { buildImage, runContainer, stopContainer, removeContainer } from '../services/docker.js';
import { generateConfig, BASE_DOMAIN } from '../services/nginx.js';

const router = Router();

/**
 * POST /api/deploy
 * Full deployment from GitHub URL
 */
router.post('/', async (req, res) => {
  const io = req.app.get('io');
  const { repoUrl, subdomain, branch = 'main', envVars = {} } = req.body;
  
  if (!repoUrl || !subdomain) {
    return res.status(400).json({ 
      error: 'Missing required fields: repoUrl, subdomain' 
    });
  }
  
  // Parse and validate GitHub URL
  let repoInfo;
  try {
    repoInfo = parseGitHubUrl(repoUrl);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid GitHub URL' });
  }
  
  // Create project
  const project = createProject({
    name: repoInfo.repo,
    repoUrl: repoInfo.fullUrl,
    branch,
    subdomain,
    envVars
  });
  
  // Create deployment record
  const deployment = createDeployment(project.id);
  
  // Emit initial status
  const emit = (message, extra = {}) => {
    const log = {
      timestamp: new Date().toISOString(),
      message,
      ...extra
    };
    io.to(`build:${project.id}`).emit('build:log', log);
    console.log(`[${project.id}] ${message}`);
  };
  
  // Return immediately with project info
  res.status(202).json({
    message: 'Deployment started',
    project: {
      id: project.id,
      name: project.name,
      subdomain: project.subdomain
    },
    deployment: {
      id: deployment.id,
      status: 'pending'
    }
  });
  
  // Run deployment pipeline asynchronously
  runDeploymentPipeline(project, deployment, emit).catch(err => {
    console.error('Deployment failed:', err);
    updateDeployment(deployment.id, {
      status: 'failed',
      completedAt: new Date().toISOString()
    });
    emit(`❌ Deployment failed: ${err.message}`, { error: true });
  });
});

/**
 * Run the full deployment pipeline
 */
async function runDeploymentPipeline(project, deployment, emit) {
  try {
    updateDeployment(deployment.id, { status: 'running' });
    
    // Step 1: Clone repository
    emit('📥 Cloning repository...');
    await cloneRepository(project.repoUrl, project.id, project.branch, (p) => {
      if (p.stream || p.progress) {
        emit(p.message);
      }
    });
    emit('✅ Repository cloned successfully');
    
    // Step 2: Detect project type
    emit('🔍 Detecting project type...');
    const { getRepoPath } = await import('../services/git.js');
    const repoPath = getRepoPath(project.id);
    const detection = await detectProjectType(repoPath);
    
    if (!detection.type) {
      throw new Error('Could not detect project type');
    }
    
    emit(`✅ Detected: ${getProjectTypeDisplayName(detection.type)}${detection.framework ? ` (${detection.framework})` : ''}`);
    
    // Update project with detected type
    const port = detection.port || getDefaultPort(detection.type);
    updateProject(project.id, {
      projectType: detection.type,
      port
    });
    
    // Step 3: Generate Dockerfile (if needed)
    if (detection.type !== 'dockerfile') {
      emit('📝 Generating Dockerfile...');
      await generateDockerfile(detection.type, repoPath, detection);
      await generateDockerignore(repoPath);
      emit('✅ Dockerfile generated');
    }
    
    // Step 4: Build Docker image
    emit('🐳 Building Docker image...');
    await buildImage(project.id, 'latest', (p) => {
      emit(p.message, { stream: p.stream });
    });
    emit('✅ Image built successfully');
    
    // Step 5: Run container
    emit('🚀 Starting container...');
    const container = await runContainer(project.id, port, JSON.parse(project.envVars || '{}'));
    emit(`✅ Container started on port ${container.hostPort}`);
    
    // Update project with container info
    updateProject(project.id, {
      containerId: container.containerId,
      containerStatus: 'running',
      lastDeployedAt: new Date().toISOString()
    });
    
    // Step 6: Generate nginx config
    emit('🌐 Configuring reverse proxy...');
    const nginxConfig = await generateConfig(project.id, {
      name: project.name,
      subdomain: project.subdomain,
      hostPort: container.hostPort,
      ssl: false // SSL setup would be separate
    });
    emit('✅ Nginx configured');
    
    // Get commit info
    const commitInfo = await getCommitInfo(project.id);
    updateDeployment(deployment.id, {
      status: 'success',
      commitHash: commitInfo?.hash,
      completedAt: new Date().toISOString()
    });
    
    // Final success message
    const domain = `${project.subdomain}.${BASE_DOMAIN}`;
    emit('════════════════════════════════════════════════════════');
    emit(`🎉 Deployment successful!`);
    emit(`🔗 http://${domain}`);
    emit('════════════════════════════════════════════════════════');
    
    updateProject(project.id, { domain });
    
  } catch (error) {
    throw error;
  }
}

/**
 * POST /api/deploy/:id/redeploy
 * Redeploy an existing project
 */
router.post('/:id/redeploy', async (req, res) => {
  const io = req.app.get('io');
  const project = getProjectById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const deployment = createDeployment(project.id);
  
  const emit = (message, extra = {}) => {
    io.to(`build:${project.id}`).emit('build:log', {
      timestamp: new Date().toISOString(),
      message,
      ...extra
    });
  };
  
  res.status(202).json({
    message: 'Redeployment started',
    deployment: { id: deployment.id }
  });
  
  // Pull and redeploy
  try {
    updateDeployment(deployment.id, { status: 'running' });
    
    emit('📥 Pulling latest changes...');
    await pullRepository(project.id, emit);
    
    emit('🐳 Rebuilding image...');
    await buildImage(project.id, 'latest', emit);
    
    emit('🔄 Restarting container...');
    await stopContainer(project.id);
    await removeContainer(project.id);
    
    const container = await runContainer(
      project.id, 
      project.port, 
      JSON.parse(project.envVars || '{}')
    );
    
    updateProject(project.id, {
      containerId: container.containerId,
      containerStatus: 'running',
      lastDeployedAt: new Date().toISOString()
    });
    
    updateDeployment(deployment.id, {
      status: 'success',
      completedAt: new Date().toISOString()
    });
    
    emit('🎉 Redeployment complete!');
    
  } catch (error) {
    emit(`❌ Redeployment failed: ${error.message}`, { error: true });
    updateDeployment(deployment.id, {
      status: 'failed',
      completedAt: new Date().toISOString()
    });
  }
});

/**
 * GET /api/deploy/:id/status
 * Get deployment status
 */
router.get('/:id/status', (req, res) => {
  const deployment = getDeploymentById(req.params.id);
  
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }
  
  res.json(deployment);
});

/**
 * GET /api/deploy/history/:projectId
 * Get deployment history for a project
 */
router.get('/history/:projectId', (req, res) => {
  const deployments = getDeploymentsByProject(req.params.projectId);
  res.json(deployments);
});

export default router;
