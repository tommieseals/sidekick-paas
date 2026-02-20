import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPOS_DIR = process.env.REPOS_DIR || path.join(__dirname, '../../data/repos');

/**
 * Git Service
 * 
 * Handles cloning, pulling, and managing repositories
 */

/**
 * Clone a repository
 * @param {string} repoUrl - GitHub repository URL
 * @param {string} projectId - Project ID for directory naming
 * @param {string} branch - Branch to clone
 * @param {function} onProgress - Progress callback
 */
export async function cloneRepository(repoUrl, projectId, branch = 'main', onProgress = () => {}) {
  const repoPath = path.join(REPOS_DIR, projectId);
  
  // Ensure repos directory exists
  await fs.ensureDir(REPOS_DIR);
  
  // Remove existing if present
  if (await fs.pathExists(repoPath)) {
    await fs.remove(repoPath);
  }
  
  onProgress({ step: 'clone', message: `Cloning ${repoUrl}...` });
  
  const git = simpleGit({
    progress: ({ method, stage, progress }) => {
      onProgress({
        step: 'clone',
        message: `${method} ${stage}: ${progress}%`,
        progress
      });
    }
  });
  
  try {
    await git.clone(repoUrl, repoPath, ['--branch', branch, '--single-branch', '--depth', '1']);
    
    onProgress({ step: 'clone', message: 'Repository cloned successfully', complete: true });
    
    return {
      success: true,
      path: repoPath,
      branch
    };
  } catch (error) {
    onProgress({ step: 'clone', message: `Clone failed: ${error.message}`, error: true });
    throw error;
  }
}

/**
 * Pull latest changes
 */
export async function pullRepository(projectId, onProgress = () => {}) {
  const repoPath = path.join(REPOS_DIR, projectId);
  
  if (!await fs.pathExists(repoPath)) {
    throw new Error('Repository not found');
  }
  
  onProgress({ step: 'pull', message: 'Pulling latest changes...' });
  
  const git = simpleGit(repoPath);
  
  try {
    await git.pull();
    
    // Get current commit hash
    const log = await git.log(['-1']);
    const commitHash = log.latest?.hash?.substring(0, 7) || 'unknown';
    
    onProgress({ step: 'pull', message: `Pulled successfully (${commitHash})`, complete: true });
    
    return {
      success: true,
      commitHash
    };
  } catch (error) {
    onProgress({ step: 'pull', message: `Pull failed: ${error.message}`, error: true });
    throw error;
  }
}

/**
 * Get current commit info
 */
export async function getCommitInfo(projectId) {
  const repoPath = path.join(REPOS_DIR, projectId);
  
  if (!await fs.pathExists(repoPath)) {
    return null;
  }
  
  const git = simpleGit(repoPath);
  
  try {
    const log = await git.log(['-1']);
    return {
      hash: log.latest?.hash?.substring(0, 7),
      message: log.latest?.message,
      author: log.latest?.author_name,
      date: log.latest?.date
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get repository path
 */
export function getRepoPath(projectId) {
  return path.join(REPOS_DIR, projectId);
}

/**
 * Clean up repository
 */
export async function removeRepository(projectId) {
  const repoPath = path.join(REPOS_DIR, projectId);
  
  if (await fs.pathExists(repoPath)) {
    await fs.remove(repoPath);
    return true;
  }
  
  return false;
}

/**
 * Parse GitHub URL to extract owner and repo
 */
export function parseGitHubUrl(url) {
  // Support various GitHub URL formats
  const patterns = [
    /github\.com[\/:]([^\/]+)\/([^\/\.]+)/,
    /^([^\/]+)\/([^\/]+)$/  // owner/repo format
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace('.git', ''),
        fullUrl: `https://github.com/${match[1]}/${match[2].replace('.git', '')}.git`
      };
    }
  }
  
  throw new Error('Invalid GitHub URL format');
}
