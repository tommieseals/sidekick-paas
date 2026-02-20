import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import KanbanBoard from './components/KanbanBoard';
import CommandBar from './components/CommandBar';
import ParsePreview from './components/ParsePreview';
import Header from './components/Header';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const [tasks, setTasks] = useState([]);
  const [parsePreview, setParsePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(API_URL || window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('🦖 Connected to Tascosaur');
      setConnectionStatus('online');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('offline');
    });

    newSocket.on('tasks:sync', (data) => {
      setTasks(data);
    });

    newSocket.on('task:created', (task) => {
      setTasks(prev => [task, ...prev]);
    });

    newSocket.on('task:updated', (task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    });

    newSocket.on('task:deleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    });

    newSocket.on('parse:preview', (data) => {
      setParsePreview(data);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch initial tasks
  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  // Execute command
  const executeCommand = useCallback(async (text) => {
    setIsProcessing(true);
    setParsePreview(null);

    try {
      const res = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      
      if (data.success) {
        setParsePreview({ input: text, parsed: data.parsed, success: true });
      } else {
        setParsePreview({ input: text, error: data.error, success: false });
      }

      // Clear preview after 3 seconds
      setTimeout(() => setParsePreview(null), 3000);
    } catch (error) {
      console.error('Execute error:', error);
      setParsePreview({ input: text, error: error.message, success: false });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Preview parse (on typing)
  const previewParse = useCallback(async (text) => {
    if (text.length < 3) {
      setParsePreview(null);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const parsed = await res.json();
      setParsePreview({ input: text, parsed, preview: true });
    } catch (error) {
      // Ignore preview errors
    }
  }, []);

  // Handle task move via drag and drop
  const handleTaskMove = useCallback(async (taskId, newStatus) => {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error('Move error:', error);
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header connectionStatus={connectionStatus} taskCount={tasks.length} />

      <div className="max-w-7xl mx-auto">
        {/* Kanban Board */}
        <KanbanBoard 
          tasks={tasks} 
          onTaskMove={handleTaskMove}
        />

        {/* Command Bar */}
        <CommandBar 
          onExecute={executeCommand}
          onPreview={previewParse}
          isProcessing={isProcessing}
        />

        {/* Parse Preview */}
        <AnimatePresence>
          {parsePreview && (
            <ParsePreview data={parsePreview} />
          )}
        </AnimatePresence>
      </div>

      {/* Background decoration */}
      <div className="fixed bottom-4 right-4 text-cyber-cyan/20 text-xs font-mono">
        TASCOSAUR v1.0 // NLP ENGINE ACTIVE
      </div>
    </div>
  );
}

export default App;
