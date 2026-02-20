import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Database } from 'lucide-react';

function Header({ connectionStatus, taskCount }) {
  return (
    <header className="max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-5xl">🦖</span>
          <div>
            <h1 className="font-cyber text-3xl font-bold neon-text-cyan tracking-wider">
              TASCOSAUR
            </h1>
            <p className="text-cyber-pink text-sm font-mono">
              NATURAL LANGUAGE TASK ENGINE
            </p>
          </div>
        </motion.div>

        {/* Status Indicators */}
        <motion.div 
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`status-dot ${connectionStatus}`} />
            <span className="text-xs font-mono uppercase text-gray-500">
              {connectionStatus}
            </span>
          </div>

          {/* System Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-500">
            <div className="flex items-center gap-1">
              <Cpu size={12} className="text-cyber-cyan" />
              <span>NLP_ENGINE</span>
            </div>
            <div className="flex items-center gap-1">
              <Database size={12} className="text-cyber-green" />
              <span>{taskCount} TASKS</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-cyber-yellow" />
              <span>OLLAMA_READY</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative line */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
    </header>
  );
}

export default Header;
