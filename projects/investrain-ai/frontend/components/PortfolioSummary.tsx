'use client';

import { TrendingUp, TrendingDown, Activity, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface PortfolioSummaryProps {
  value: number;
  change: number;
  changePercent: number;
  beta: number;
  holdingsCount: number;
}

export default function PortfolioSummary({
  value,
  change,
  changePercent,
  beta,
  holdingsCount,
}: PortfolioSummaryProps) {
  const isPositive = change >= 0;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(n);

  const formatPercent = (n: number) =>
    `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

  return (
    <div className="bg-finance-card rounded-2xl p-6 card-glow border border-finance-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Value */}
        <div className="md:col-span-2">
          <p className="text-gray-400 text-sm mb-1">Total Portfolio Value</p>
          <h2 className="text-4xl font-bold mb-2">{formatCurrency(value)}</h2>
          <div className={`flex items-center gap-2 ${isPositive ? 'text-finance-green' : 'text-finance-red'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            <span className="text-lg font-semibold">
              {formatCurrency(Math.abs(change))} ({formatPercent(changePercent)})
            </span>
            <span className="text-gray-500 text-sm">Today</span>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-finance-dark/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-finance-purple" />
            <span className="text-gray-400 text-sm">Portfolio Beta</span>
          </div>
          <p className="text-2xl font-bold">{beta.toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {beta > 1 ? 'More volatile than market' : 'Less volatile than market'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-finance-dark/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-finance-blue" />
            <span className="text-gray-400 text-sm">Holdings</span>
          </div>
          <p className="text-2xl font-bold">{holdingsCount}</p>
          <p className="text-xs text-gray-500">Active positions</p>
        </motion.div>
      </div>
    </div>
  );
}
