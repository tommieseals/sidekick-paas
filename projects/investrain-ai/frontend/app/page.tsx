'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortfolioSummary from '@/components/PortfolioSummary';
import HoldingsTable from '@/components/HoldingsTable';
import PerformanceChart from '@/components/PerformanceChart';
import SectorPieChart from '@/components/SectorPieChart';
import AIChat from '@/components/AIChat';
import Header from '@/components/Header';

interface PortfolioData {
  portfolioValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  holdings: any[];
  sectors: Record<string, { value: number; percent: number }>;
  topGainer: any;
  topLoser: any;
  highestRisk: any;
  beta: number;
  suggestedQuestions: string[];
  lastUpdated: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_URL}/api/portfolio`);
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      const data = await res.json();
      setPortfolio(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPortfolio, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-finance-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-finance-red text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={fetchPortfolio}
            className="px-4 py-2 bg-finance-blue rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Header lastUpdated={portfolio.lastUpdated} onRefresh={fetchPortfolio} />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PortfolioSummary
            value={portfolio.portfolioValue}
            change={portfolio.dailyChange}
            changePercent={portfolio.dailyChangePercent}
            beta={portfolio.beta}
            holdingsCount={portfolio.holdings.length}
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <PerformanceChart holdings={portfolio.holdings} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SectorPieChart sectors={portfolio.sectors} />
          </motion.div>
        </div>

        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HoldingsTable
            holdings={portfolio.holdings}
            topGainer={portfolio.topGainer}
            topLoser={portfolio.topLoser}
          />
        </motion.div>

        {/* AI Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AIChat
            suggestedQuestions={portfolio.suggestedQuestions}
            portfolioValue={portfolio.portfolioValue}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-finance-border text-center text-gray-500 text-sm">
        <p>💹 Investrain AI • Educational purposes only • Not financial advice</p>
      </footer>
    </div>
  );
}
