import React from 'react';
import { Rocket, Plus, Github } from 'lucide-react';

function Header({ onNewProject }) {
  return (
    <header className="border-b border-devops-border bg-devops-dark/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-devops-green/20 rounded-lg">
              <Rocket className="w-6 h-6 text-devops-green" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sidekick</h1>
              <p className="text-xs text-gray-500">Zero-Config Deployments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <button
              onClick={onNewProject}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
