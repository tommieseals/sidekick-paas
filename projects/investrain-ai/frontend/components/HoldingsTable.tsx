'use client';

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  shares: number;
  avgCost: number;
  sector: string;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  volatility: number;
  beta: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
  topGainer: Holding | null;
  topLoser: Holding | null;
}

export default function HoldingsTable({ holdings, topGainer, topLoser }: HoldingsTableProps) {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(n);

  const formatPercent = (n: number) =>
    `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

  const sortedHoldings = [...holdings].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-finance-card rounded-2xl p-6 card-glow border border-finance-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Holdings</h3>
        <div className="flex gap-4 text-sm">
          {topGainer && (
            <div className="flex items-center gap-2 text-finance-green">
              <TrendingUp className="w-4 h-4" />
              <span>{topGainer.symbol} {formatPercent(topGainer.dayChangePercent)}</span>
            </div>
          )}
          {topLoser && (
            <div className="flex items-center gap-2 text-finance-red">
              <TrendingDown className="w-4 h-4" />
              <span>{topLoser.symbol} {formatPercent(topLoser.dayChangePercent)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-finance-border">
              <th className="text-left py-3 px-2">Symbol</th>
              <th className="text-right py-3 px-2">Shares</th>
              <th className="text-right py-3 px-2">Price</th>
              <th className="text-right py-3 px-2">Value</th>
              <th className="text-right py-3 px-2">Today</th>
              <th className="text-right py-3 px-2">Total P&L</th>
              <th className="text-right py-3 px-2">Risk</th>
            </tr>
          </thead>
          <tbody>
            {sortedHoldings.map((holding) => (
              <tr
                key={holding.id}
                className="border-b border-finance-border/50 hover:bg-finance-dark/30 transition"
              >
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-finance-blue/20 rounded-lg flex items-center justify-center text-xs font-bold text-finance-blue">
                      {holding.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold">{holding.symbol}</p>
                      <p className="text-xs text-gray-500">{holding.sector}</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 px-2 font-mono">
                  {holding.shares}
                </td>
                <td className="text-right py-4 px-2 font-mono">
                  {formatCurrency(holding.currentPrice)}
                </td>
                <td className="text-right py-4 px-2 font-mono font-semibold">
                  {formatCurrency(holding.value)}
                </td>
                <td className={`text-right py-4 px-2 font-mono ${holding.dayChangePercent >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                  {formatPercent(holding.dayChangePercent)}
                </td>
                <td className={`text-right py-4 px-2 font-mono ${holding.gainPercent >= 0 ? 'text-finance-green' : 'text-finance-red'}`}>
                  <div>
                    {formatCurrency(holding.gain)}
                    <span className="text-xs ml-1">({formatPercent(holding.gainPercent)})</span>
                  </div>
                </td>
                <td className="text-right py-4 px-2">
                  <div className="flex items-center justify-end gap-2">
                    {holding.volatility > 0.35 && (
                      <AlertTriangle className="w-4 h-4 text-finance-yellow" />
                    )}
                    <span className={`text-sm ${holding.volatility > 0.35 ? 'text-finance-yellow' : 'text-gray-400'}`}>
                      {(holding.volatility * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
