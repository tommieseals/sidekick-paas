import { useState } from 'react';
import { History, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';
import type { Trade } from '../types';
import clsx from 'clsx';
import { format } from 'date-fns';

interface Props {
  trades: Trade[];
  totalCount: number;
  totalPnl: number;
}

const STRATEGIES = ['All', 'alpha', 'contrarian', 'dumb_bet', 'arb'];

export function TradeHistory({ trades, totalCount, totalPnl }: Props) {
  const [selectedStrategy, setSelectedStrategy] = useState('All');

  const filteredTrades = selectedStrategy === 'All' 
    ? trades 
    : trades.filter(t => t.strategy === selectedStrategy);

  return (
    <Card 
      title="Trade History"
      headerRight={
        <div className="flex items-center gap-3">
          <div className={clsx(
            'text-sm font-mono font-semibold px-3 py-1 rounded',
            totalPnl >= 0 ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
          )}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </div>
          <span className="text-sm text-terminal-muted">
            {totalCount} trades
          </span>
        </div>
      }
    >
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {STRATEGIES.map(strat => (
          <button
            key={strat}
            onClick={() => setSelectedStrategy(strat)}
            className={clsx(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap',
              selectedStrategy === strat
                ? 'bg-profit text-white'
                : 'bg-terminal-bg text-terminal-muted hover:text-terminal-text'
            )}
          >
            {strat === 'All' ? 'All' : strat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Trades list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-terminal-muted">
            <History className="w-10 h-10 mb-2 opacity-50" />
            <p>No trades found</p>
          </div>
        ) : (
          filteredTrades.map(trade => (
            <div 
              key={trade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-terminal-bg border border-terminal-border hover:border-terminal-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  'p-2 rounded',
                  trade.pnl >= 0 ? 'bg-profit/10' : 'bg-loss/10'
                )}>
                  {trade.pnl >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-profit" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-loss" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-terminal-text truncate max-w-md" title={trade.market_title}>
                    {trade.market_title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx(
                      'px-1.5 py-0.5 rounded text-xs font-medium',
                      trade.side === 'YES' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                    )}>
                      {trade.side}
                    </span>
                    <span className="text-xs text-terminal-muted">{trade.platform}</span>
                    <span className="text-xs text-terminal-muted">•</span>
                    <span className="text-xs text-terminal-muted">{trade.strategy}</span>
                    <span className="text-xs text-terminal-muted">•</span>
                    <span className="text-xs text-terminal-muted">
                      {format(new Date(trade.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={clsx(
                  'font-mono font-semibold',
                  trade.pnl >= 0 ? 'text-profit' : 'text-loss'
                )}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </p>
                <p className="text-xs text-terminal-muted font-mono">
                  {trade.quantity}x @ ${trade.entry_price.toFixed(3)}
                </p>
                {trade.edge_at_entry > 0 && (
                  <p className="text-xs text-terminal-muted">
                    Edge: {(trade.edge_at_entry * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
