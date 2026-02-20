'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Holding {
  symbol: string;
  value: number;
  dayChangePercent: number;
}

interface PerformanceChartProps {
  holdings: Holding[];
}

// Generate mock historical data based on holdings
function generateChartData(holdings: Holding[]) {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const data = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Simulate historical values with some randomness
    const variance = 1 + (Math.random() - 0.5) * 0.02 * (30 - i);
    const dayValue = totalValue * (0.92 + (30 - i) * 0.003) * variance;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: dayValue,
    });
  }

  return data;
}

export default function PerformanceChart({ holdings }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y'>('1M');
  const chartData = generateChartData(holdings);

  const formatValue = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-finance-card border border-finance-border rounded-lg p-3">
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white font-bold">{formatValue(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-finance-card rounded-2xl p-6 card-glow border border-finance-border h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Performance</h3>
        <div className="flex gap-2">
          {(['1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                timeframe === tf
                  ? 'bg-finance-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-finance-dark'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            stroke="#64748B"
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickLine={false}
            tickFormatter={formatValue}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
