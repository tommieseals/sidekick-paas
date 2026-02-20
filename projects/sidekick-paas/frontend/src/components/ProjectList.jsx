import React from 'react';
import ProjectCard from './ProjectCard';
import { Inbox } from 'lucide-react';

function ProjectList({ projects, loading, onAction, onRedeploy }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-devops-card rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-devops-border rounded w-1/3 mb-4" />
            <div className="h-4 bg-devops-border rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-devops-card rounded-full flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
        <p className="text-gray-500 mb-4">
          Deploy your first project from GitHub
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-300 mb-4">
        Projects ({projects.length})
      </h2>
      
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onAction={onAction}
          onRedeploy={onRedeploy}
        />
      ))}
    </div>
  );
}

export default ProjectList;
