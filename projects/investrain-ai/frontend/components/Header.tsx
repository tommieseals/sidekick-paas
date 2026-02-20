'use client';

import { RefreshCw, TrendingUp, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  lastUpdated: string;
  onRefresh: () => void;
}

export default function Header({ lastUpdated, onRefresh }: HeaderProps) {
  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-finance-blue/20 rounded-xl">
            <TrendingUp className="w-8 h-8 text-finance-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Investrain AI</h1>
            <p className="text-gray-500 text-sm">Smart Portfolio Intelligence</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-finance-green rounded-full pulse-live" />
            <span>Live</span>
            <span className="text-gray-600">•</span>
            <span>Updated {formatTime(lastUpdated)}</span>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 hover:bg-finance-card rounded-lg transition group"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
          </button>

          <button
            className="p-2 hover:bg-finance-card rounded-lg transition group"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
          </button>
        </motion.div>
      </div>
    </header>
  );
}
