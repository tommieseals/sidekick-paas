import Docker from 'dockerode';
import path from 'path';
import fs from 'fs-extra';
import { getRepoPath } from './git.js';

/**
 * Docker Service
 * 
 * Handles building images, running containers, and container management
 */

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// Container prefix for easy identification
const CONTAINER_PREFIX = 'sidekick_';

/**
 * Build Docker image from repository
 * @param {string} projectId - Project ID
 * @param {string} tag - Image tag
 * @param {function} onProgress - Build progress callback
 */
export async function buildImage(projectId, tag, onProgress = () => {}) {
  const repoPath = getRepoPath(projectId);
  const imageName = `${CONTAINER_PREFIX}${projectId}:${tag}`;
  
  // Check for generated or existing Dockerfile
  let dockerfilePath = 'Dockerfile.sidekick';
  if (!await fs.pathExists(path.join(repoPath, dockerfilePath))) {
    dockerfilePath = 'Dockerfile';
  }
  
  if (!await fs.pathExists(path.join(repoPath, dockerfilePath))) {
    throw new Error('No Dockerfile found');
  }
  
  onProgress({ step: 'build', message: `Building image ${imageName}...` });
  
  return new Promise((resolve, reject) => {
    docker.buildImage(
      {
        context: repoPath,
        src: ['.']
      },
      {
        t: imageName,
        dockerfile: dockerfilePath,
        nocache: false,
        rm: true
      },
      (err, stream) => {
        if (err) {
          onProgress({ step: 'build', message: `Build error: ${err.message}`, error: true });
          return reject(err);
        }
        
        docker.modem.followProgress(
          stream,
          (err, output) => {
            if (err) {
              onProgress({ step: 'build', message: `Build failed: ${err.message}`, error: true });
              reject(err);
            } else {
              onProgress({ step: 'build', message: 'Image built successfully', complete: true });
              resolve({ imageName, output });
            }
          },
          (event) => {
            if (event.stream) {
              const line = event.stream.trim();
              if (line) {
                onProgress({ step: 'build', message: line, stream: true });
              }
            }
            if (event.status) {
              onProgress({ step: 'build', message: `${event.status} ${event.progress || ''}`, stream: true });
            }
            if (event.error) {
              onProgress({ step: 'build', message: event.error, error: true });
            }
          }
        );
      }
    );
  });
}

/**
 * Run container from image
 * @param {string} projectId - Project ID
 * @param {number} port - Port to expose
 * @param {object} envVars - Environment variables
 */
export async function runContainer(projectId, port, envVars = {}) {
  const imageName = `${CONTAINER_PREFIX}${projectId}:latest`;
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  // Stop and remove existing container
  await stopContainer(projectId);
  await removeContainer(projectId);
  
  // Prepare environment variables
  const env = Object.entries(envVars).map(([k, v]) => `${k}=${v}`);
  env.push(`PORT=${port}`);
  
  // Create container
  const container = await docker.createContainer({
    Image: imageName,
    name: containerName,
    Env: env,
    ExposedPorts: {
      [`${port}/tcp`]: {}
    },
    HostConfig: {
      PortBindings: {
        [`${port}/tcp`]: [{ HostPort: '0' }] // Random port
      },
      RestartPolicy: {
        Name: 'unless-stopped'
      }
    },
    Labels: {
      'sidekick.project': projectId,
      'sidekick.managed': 'true'
    }
  });
  
  // Start container
  await container.start();
  
  // Get assigned port
  const info = await container.inspect();
  const hostPort = info.NetworkSettings.Ports[`${port}/tcp`]?.[0]?.HostPort;
  
  return {
    containerId: container.id,
    containerName,
    hostPort: parseInt(hostPort),
    status: 'running'
  };
}

/**
 * Get container status and info
 */
export async function getContainerStatus(projectId) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    const info = await container.inspect();
    
    return {
      id: info.Id,
      name: containerName,
      status: info.State.Status,
      running: info.State.Running,
      startedAt: info.State.StartedAt,
      ports: info.NetworkSettings.Ports,
      health: info.State.Health?.Status
    };
  } catch (error) {
    if (error.statusCode === 404) {
      return { status: 'not_found', running: false };
    }
    throw error;
  }
}

/**
 * Get container logs
 */
export async function getContainerLogs(projectId, options = {}) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: options.tail || 100,
      timestamps: true
    });
    
    return logs.toString('utf-8');
  } catch (error) {
    if (error.statusCode === 404) {
      return 'Container not found';
    }
    throw error;
  }
}

/**
 * Stream container logs
 */
export async function streamContainerLogs(projectId, onLog) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    
    const stream = await container.logs({
      stdout: true,
      stderr: true,
      follow: true,
      tail: 50,
      timestamps: true
    });
    
    stream.on('data', (chunk) => {
      onLog(chunk.toString('utf-8'));
    });
    
    stream.on('error', (err) => {
      onLog(`Error: ${err.message}`);
    });
    
    return () => stream.destroy();
  } catch (error) {
    onLog(`Error: ${error.message}`);
    return () => {};
  }
}

/**
 * Stop container
 */
export async function stopContainer(projectId) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    await container.stop({ t: 10 });
    return true;
  } catch (error) {
    if (error.statusCode === 304 || error.statusCode === 404) {
      return true; // Already stopped or doesn't exist
    }
    throw error;
  }
}

/**
 * Start container
 */
export async function startContainer(projectId) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    await container.start();
    return true;
  } catch (error) {
    if (error.statusCode === 304) {
      return true; // Already running
    }
    throw error;
  }
}

/**
 * Restart container
 */
export async function restartContainer(projectId) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    await container.restart({ t: 10 });
    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Remove container
 */
export async function removeContainer(projectId) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    await container.remove({ force: true });
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      return true; // Doesn't exist
    }
    throw error;
  }
}

/**
 * Get container stats (CPU, memory, etc.)
 */
export async function getContainerStats(projectId) {
  const containerName = `${CONTAINER_PREFIX}${projectId}`;
  
  try {
    const container = docker.getContainer(containerName);
    const stats = await container.stats({ stream: false });
    
    // Calculate CPU percentage
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
    
    // Calculate memory
    const memUsage = stats.memory_stats.usage;
    const memLimit = stats.memory_stats.limit;
    const memPercent = (memUsage / memLimit) * 100;
    
    return {
      cpu: cpuPercent.toFixed(2),
      memory: {
        usage: (memUsage / 1024 / 1024).toFixed(2), // MB
        limit: (memLimit / 1024 / 1024).toFixed(2), // MB
        percent: memPercent.toFixed(2)
      }
    };
  } catch (error) {
    return null;
  }
}

/**
 * List all Sidekick containers
 */
export async function listContainers() {
  const containers = await docker.listContainers({
    all: true,
    filters: {
      label: ['sidekick.managed=true']
    }
  });
  
  return containers.map(c => ({
    id: c.Id,
    name: c.Names[0]?.replace('/', ''),
    image: c.Image,
    status: c.State,
    projectId: c.Labels['sidekick.project']
  }));
}
