import { Brain, Shuffle, Dice5, ArrowRightLeft, Settings } from 'lucide-react';
import { Card, StatusDot } from './Card';
import type { StrategyStatus } from '../types';
import clsx from 'clsx';

interface Props {
  strategies: StrategyStatus[];
}

const strategyIcons: Record<string, typeof Brain> = {
  alpha: Brain,
  contrarian: Shuffle,
  dumb_bet: Dice5,
  arbitrage: ArrowRightLeft,
};

function formatConfigValue(key: string, value: number | undefined): string {
  if (value === undefined) return '-';
  
  const percentKeys = ['min_edge', 'confidence_threshold', 'consensus_threshold', 
                       'bias_adjustment', 'max_prob'];
  if (percentKeys.includes(key)) {
    return `${(value * 100).toFixed(0)}%`;
  }
  return value.toLocaleString();
}

function getConfigDisplay(strategy: StrategyStatus): string[] {
  const config = strategy.config;
  const displays: string[] = [];
  
  switch (strategy.id) {
    case 'alpha':
      if (config.min_edge) displays.push(`${formatConfigValue('min_edge', config.min_edge)} min edge`);
      if (config.confidence_threshold) displays.push(`${formatConfigValue('confidence_threshold', config.confidence_threshold)} confidence`);
      break;
    case 'contrarian':
      if (config.consensus_threshold) displays.push(`${formatConfigValue('consensus_threshold', config.consensus_threshold)} consensus`);
      if (config.bias_adjustment) displays.push(`${formatConfigValue('bias_adjustment', config.bias_adjustment)} bias adj`);
      break;
    case 'dumb_bet':
      if (config.max_prob) displays.push(`${formatConfigValue('max_prob', config.max_prob)} max prob`);
      if (config.min_volume) displays.push(`${config.min_volume} min vol`);
      break;
    case 'arbitrage':
      if (config.min_edge) displays.push(`${formatConfigValue('min_edge', config.min_edge)} min edge`);
      if (config.min_liquidity) displays.push(`${config.min_liquidity} min liq`);
      break;
  }
  
  return displays;
}

function StrategyRow({ strategy }: { strategy: StrategyStatus }) {
  const Icon = strategyIcons[strategy.id] || Brain;
  const configDisplay = getConfigDisplay(strategy);
  
  return (
    <tr className="border-t border-terminal-border hover:bg-terminal-bg/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'p-2 rounded-lg',
            strategy.status === 'active' ? 'bg-profit/10 text-profit' :
            strategy.status === 'warning' ? 'bg-warning/10 text-warning' :
            'bg-terminal-muted/10 text-terminal-muted'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-terminal-text">{strategy.name}</p>
            <div className="flex gap-2 mt-0.5">
              {configDisplay.map((cfg, i) => (
                <span key={i} className="text-xs text-terminal-muted bg-terminal-bg px-1.5 py-0.5 rounded">
                  {cfg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <StatusDot status={strategy.status} />
          <span className={clsx(
            'text-sm font-medium',
            strategy.status === 'active' ? 'text-profit' :
            strategy.status === 'warning' ? 'text-warning' :
            'text-terminal-muted'
          )}>
            {strategy.status_message}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 font-mono text-center">
        {strategy.trades_today}
      </td>
      <td className="py-3 px-4 font-mono text-center">
        {strategy.trades_today > 0 ? `${strategy.win_rate.toFixed(0)}%` : '-'}
      </td>
      <td className={clsx(
        'py-3 px-4 font-mono text-right font-semibold',
        strategy.pnl_today > 0 ? 'text-profit' :
        strategy.pnl_today < 0 ? 'text-loss' :
        'text-terminal-muted'
      )}>
        {strategy.pnl_today >= 0 ? '+' : ''}${strategy.pnl_today.toFixed(2)}
      </td>
      <td className="py-3 px-4 font-mono text-center">
        <span className={clsx(
          'px-2 py-1 rounded text-sm',
          strategy.edge_found > 0 ? 'bg-profit/10 text-profit' : 'bg-terminal-bg text-terminal-muted'
        )}>
          {strategy.edge_found} opps
        </span>
      </td>
    </tr>
  );
}

export function StrategyPanel({ strategies }: Props) {
  return (
    <Card 
      title="Strategy Performance" 
      headerRight={
        <button className="p-1.5 rounded hover:bg-terminal-bg transition-colors">
          <Settings className="w-4 h-4 text-terminal-muted" />
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-terminal-muted">
              <th className="py-2 px-4 font-medium">Strategy</th>
              <th className="py-2 px-4 font-medium">Status</th>
              <th className="py-2 px-4 font-medium text-center">Trades Today</th>
              <th className="py-2 px-4 font-medium text-center">Win Rate</th>
              <th className="py-2 px-4 font-medium text-right">P&L Today</th>
              <th className="py-2 px-4 font-medium text-center">Edge Found</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map(strategy => (
              <StrategyRow key={strategy.id} strategy={strategy} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
