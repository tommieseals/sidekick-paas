import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import DeployForm from './components/DeployForm';
import BuildModal from './components/BuildModal';

const API_URL = '';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeployForm, setShowDeployForm] = useState(false);
  const [buildModal, setBuildModal] = useState(null); // { projectId, projectName }
  const [buildLogs, setBuildLogs] = useState([]);
  const [socket, setSocket] = useState(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize socket
  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🔌 Connected to Sidekick');
    });

    return () => newSocket.close();
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchProjects]);

  // Subscribe to build logs when modal opens
  useEffect(() => {
    if (!socket || !buildModal) return;

    socket.emit('subscribe:build', buildModal.projectId);
    setBuildLogs([]);

    const handleLog = (log) => {
      setBuildLogs(prev => [...prev, log]);
    };

    socket.on('build:log', handleLog);

    return () => {
      socket.off('build:log', handleLog);
      socket.emit('unsubscribe', `build:${buildModal.projectId}`);
    };
  }, [socket, buildModal]);

  // Handle deployment
  const handleDeploy = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok) {
        setShowDeployForm(false);
        setBuildModal({
          projectId: data.project.id,
          projectName: data.project.name,
        });
        fetchProjects();
      } else {
        alert(data.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deploy error:', error);
      alert('Deployment failed');
    }
  };

  // Handle project actions
  const handleAction = async (projectId, action) => {
    try {
      if (action === 'logs') {
        setBuildModal({
          projectId,
          projectName: projects.find(p => p.id === projectId)?.name,
          isLogs: true,
        });
        return;
      }

      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this project?')) return;
      }

      const endpoint = action === 'delete'
        ? `/api/projects/${projectId}`
        : `/api/projects/${projectId}/${action}`;
      
      const method = action === 'delete' ? 'DELETE' : 'POST';

      await fetch(`${API_URL}${endpoint}`, { method });
      fetchProjects();
    } catch (error) {
      console.error(`Action ${action} failed:`, error);
    }
  };

  // Handle redeploy
  const handleRedeploy = async (projectId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      setBuildModal({
        projectId,
        projectName: project?.name,
      });
      
      await fetch(`${API_URL}/api/deploy/${projectId}/redeploy`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Redeploy failed:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNewProject={() => setShowDeployForm(true)} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Deploy Form */}
        {showDeployForm && (
          <DeployForm
            onDeploy={handleDeploy}
            onCancel={() => setShowDeployForm(false)}
          />
        )}

        {/* Project List */}
        <ProjectList
          projects={projects}
          loading={loading}
          onAction={handleAction}
          onRedeploy={handleRedeploy}
        />
      </main>

      {/* Build/Logs Modal */}
      {buildModal && (
        <BuildModal
          projectId={buildModal.projectId}
          projectName={buildModal.projectName}
          logs={buildLogs}
          isLogs={buildModal.isLogs}
          onClose={() => {
            setBuildModal(null);
            setBuildLogs([]);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}

export default App;
