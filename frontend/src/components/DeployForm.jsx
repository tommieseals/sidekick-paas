import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Github, Rocket, Loader2 } from 'lucide-react';

function DeployForm({ onDeploy, onCancel }) {
  const [formData, setFormData] = useState({
    repoUrl: '',
    subdomain: '',
    branch: 'main',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onDeploy(formData);
    setLoading(false);
  };

  // Extract repo name for subdomain suggestion
  const handleRepoChange = (url) => {
    setFormData(prev => ({ ...prev, repoUrl: url }));
    
    // Auto-suggest subdomain from repo name
    const match = url.match(/github\.com\/[^\/]+\/([^\/\.]+)/);
    if (match && !formData.subdomain) {
      setFormData(prev => ({
        ...prev,
        subdomain: match[1].toLowerCase().replace(/[^a-z0-9-]/g, '-')
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-devops-card border border-devops-border rounded-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-devops-green/20 rounded-lg">
            <Rocket className="w-5 h-5 text-devops-green" />
          </div>
          <h2 className="text-lg font-semibold">Deploy New Project</h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub Repository
          </label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={formData.repoUrl}
              onChange={(e) => handleRepoChange(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full bg-devops-dark border border-devops-border rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Paste any GitHub repository URL
          </p>
        </div>

        {/* Subdomain */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subdomain
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formData.subdomain}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
              }))}
              placeholder="my-app"
              className="flex-1 bg-devops-dark border border-devops-border rounded-lg px-4 py-3 text-white placeholder-gray-500"
              required
              pattern="[a-z0-9-]+"
            />
            <span className="text-gray-500">.localhost</span>
          </div>
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Branch
          </label>
          <select
            value={formData.branch}
            onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
            className="w-full bg-devops-dark border border-devops-border rounded-lg px-4 py-3 text-white"
          >
            <option value="main">main</option>
            <option value="master">master</option>
            <option value="develop">develop</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.repoUrl || !formData.subdomain}
            className="btn-primary flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Deploy
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default DeployForm;
