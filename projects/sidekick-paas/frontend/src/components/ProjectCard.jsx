import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  RotateCcw, 
  Square, 
  Play, 
  Trash2, 
  Terminal,
  Cpu,
  HardDrive,
  Clock,
  GitBranch
} from 'lucide-react';

const PROJECT_ICONS = {
  nextjs: '▲',
  react: '⚛️',
  vue: '💚',
  express: '🚂',
  nodejs: '📦',
  fastapi: '⚡',
  flask: '🧪',
  django: '🎸',
  python: '🐍',
  go: '🐹',
  rust: '🦀',
  static: '📄',
  dockerfile: '🐳',
};

function ProjectCard({ project, onAction, onRedeploy }) {
  const isRunning = project.containerStatus === 'running';
  const isBuilding = project.containerStatus === 'building';
  
  const formatUptime = (startedAt) => {
    if (!startedAt) return '-';
    const diff = Date.now() - new Date(startedAt).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    return '< 1h';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="project-card bg-devops-card rounded-lg p-5"
    >
      <div className="flex items-start justify-between">
        {/* Project Info */}
        <div className="flex items-start gap-4">
          <div className="text-3xl">
            {PROJECT_ICONS[project.projectType] || '📦'}
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <span className={`status-dot ${
                isRunning ? 'status-running' : 
                isBuilding ? 'status-building' : 
                'status-stopped'
              }`} />
              <span className={`text-sm ${
                isRunning ? 'text-devops-green' : 
                isBuilding ? 'text-devops-yellow' : 
                'text-devops-red'
              }`}>
                {project.containerStatus?.toUpperCase() || 'STOPPED'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {project.branch || 'main'}
              </span>
              
              {project.domain && (
                <a
                  href={`http://${project.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-devops-blue hover:underline"
                >
                  {project.domain}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            
            {/* Stats */}
            {isRunning && project.stats && (
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  CPU: {project.stats.cpu}%
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  RAM: {project.stats.memory?.usage}MB
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Uptime: {formatUptime(project.lastDeployedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAction(project.id, 'logs')}
            className="p-2 text-gray-400 hover:text-white hover:bg-devops-border rounded transition"
            title="View Logs"
          >
            <Terminal className="w-4 h-4" />
          </button>
          
          {isRunning ? (
            <>
              <button
                onClick={() => onAction(project.id, 'restart')}
                className="p-2 text-gray-400 hover:text-devops-yellow hover:bg-devops-border rounded transition"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAction(project.id, 'stop')}
                className="p-2 text-gray-400 hover:text-devops-red hover:bg-devops-border rounded transition"
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onAction(project.id, 'start')}
              className="p-2 text-gray-400 hover:text-devops-green hover:bg-devops-border rounded transition"
              title="Start"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onRedeploy(project.id)}
            className="px-3 py-1.5 text-sm bg-devops-border hover:bg-devops-blue/20 rounded transition"
          >
            Redeploy
          </button>
          
          <button
            onClick={() => onAction(project.id, 'delete')}
            className="p-2 text-gray-400 hover:text-devops-red hover:bg-devops-border rounded transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
