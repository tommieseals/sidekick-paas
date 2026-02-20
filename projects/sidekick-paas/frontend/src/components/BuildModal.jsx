import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, CheckCircle, XCircle, Loader2 } from 'lucide-react';

function BuildModal({ projectId, projectName, logs, isLogs, onClose }) {
  const logsEndRef = useRef(null);
  const [containerLogs, setContainerLogs] = useState([]);

  // Fetch container logs if viewing logs
  useEffect(() => {
    if (isLogs) {
      fetch(`/api/logs/${projectId}`)
        .then(res => res.json())
        .then(data => setContainerLogs(data.logs || []))
        .catch(console.error);
    }
  }, [isLogs, projectId]);

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, containerLogs]);

  const displayLogs = isLogs ? containerLogs : logs;
  const lastLog = logs[logs.length - 1];
  const isComplete = lastLog?.message?.includes('Deployment successful') || lastLog?.message?.includes('complete');
  const isError = lastLog?.error;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-devops-card border border-devops-border rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-devops-border">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-devops-green" />
              <h3 className="font-semibold">
                {isLogs ? 'Container Logs' : 'Build Logs'}: {projectName}
              </h3>
              {!isLogs && (
                <span className={`flex items-center gap-1 text-sm ${
                  isComplete ? 'text-devops-green' : 
                  isError ? 'text-devops-red' : 
                  'text-devops-yellow'
                }`}>
                  {isComplete ? (
                    <><CheckCircle className="w-4 h-4" /> Complete</>
                  ) : isError ? (
                    <><XCircle className="w-4 h-4" /> Failed</>
                  ) : (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Building...</>
                  )}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-auto p-4 terminal font-mono text-sm">
            {displayLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {isLogs ? 'No logs available' : 'Waiting for build logs...'}
              </div>
            ) : (
              displayLogs.map((log, index) => {
                // Handle both build logs (object) and container logs (string)
                const isObject = typeof log === 'object';
                const message = isObject ? log.message : log;
                const timestamp = isObject ? log.timestamp : null;
                const isErrorLine = isObject ? log.error : false;
                const isSuccess = message?.includes('✅') || message?.includes('🎉');
                
                return (
                  <div key={index} className="terminal-line">
                    {timestamp && (
                      <span className="terminal-timestamp">
                        [{new Date(timestamp).toLocaleTimeString()}]
                      </span>
                    )}
                    <span className={
                      isErrorLine ? 'terminal-error' :
                      isSuccess ? 'terminal-success' :
                      message?.includes('📥') || message?.includes('🔍') || message?.includes('📝') ? 'terminal-info' :
                      message?.includes('⚠️') ? 'terminal-warning' :
                      ''
                    }>
                      {message}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-devops-border flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-devops-border hover:bg-devops-blue/20 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BuildModal;
