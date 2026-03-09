import { Briefcase, Clock } from 'lucide-react';
import { Card } from './Card';
import type { Position } from '../types';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  positions: Position[];
  totalUnrealizedPnl: number;
}

function formatCurrency(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return prefix + new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPrice(value: number): string {
  return `$${value.toFixed(3)}`;
}

export function PositionsTable({ positions, totalUnrealizedPnl }: Props) {
  if (positions.length === 0) {
    return (
      <Card title="Active Positions">
        <div className="flex flex-col items-center justify-center py-12 text-terminal-muted">
          <Briefcase className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-lg">No active positions</p>
          <p className="text-sm mt-1">Positions will appear here when trades are opened</p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title="Active Positions"
      headerRight={
        <div className={clsx(
          'text-sm font-mono font-semibold px-3 py-1 rounded',
          totalUnrealizedPnl >= 0 ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
        )}>
          Unrealized: {formatCurrency(totalUnrealizedPnl)}
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-terminal-muted border-b border-terminal-border">
              <th className="py-2 px-3 font-medium">Market</th>
              <th className="py-2 px-3 font-medium">Side</th>
              <th className="py-2 px-3 font-medium text-right">Entry</th>
              <th className="py-2 px-3 font-medium text-right">Current</th>
              <th className="py-2 px-3 font-medium text-right">P&L</th>
              <th className="py-2 px-3 font-medium">Strategy</th>
              <th className="py-2 px-3 font-medium text-right">Size</th>
              <th className="py-2 px-3 font-medium">Entry Time</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(position => (
              <tr 
                key={position.id}
                className="border-t border-terminal-border hover:bg-terminal-bg/50 transition-colors"
              >
                <td className="py-3 px-3">
                  <div>
                    <p className="font-medium text-terminal-text truncate max-w-xs" title={position.market_title}>
                      {position.market_title}
                    </p>
                    <p className="text-xs text-terminal-muted">{position.platform}</p>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={clsx(
                    'px-2 py-1 rounded text-xs font-semibold',
                    position.side === 'YES' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                  )}>
                    {position.side}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm">
                  {formatPrice(position.entry_price)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm">
                  {formatPrice(position.current_price)}
                </td>
                <td className={clsx(
                  'py-3 px-3 text-right font-mono font-semibold',
                  position.unrealized_pnl >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {formatCurrency(position.unrealized_pnl)}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-1 rounded text-xs bg-terminal-bg text-terminal-muted">
                    {position.strategy}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono text-sm">
                  {position.quantity.toFixed(0)}
                </td>
                <td className="py-3 px-3 text-sm text-terminal-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(position.entry_time), { addSuffix: true })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
