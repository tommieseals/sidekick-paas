import { Shield, AlertTriangle, TrendingDown, Percent, PieChart } from 'lucide-react';
import { Card } from './Card';
import type { RiskResponse } from '../types';
import clsx from 'clsx';

interface Props {
  risk: RiskResponse;
}

function ProgressBar({ 
  value, 
  max, 
  label, 
  variant = 'default' 
}: { 
  value: number; 
  max: number; 
  label: string;
  variant?: 'default' | 'warning' | 'danger';
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    default: 'bg-profit',
    warning: 'bg-warning',
    danger: 'bg-loss',
  };
  
  const bgColors = {
    default: 'bg-profit/20',
    warning: 'bg-warning/20',
    danger: 'bg-loss/20',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-terminal-muted">{label}</span>
        <span className="font-mono text-terminal-text">
          {value.toFixed(2)} / {max.toFixed(2)}
        </span>
      </div>
      <div className={clsx('h-2 rounded-full', bgColors[variant])}>
        <div 
          className={clsx('h-full rounded-full transition-all duration-500', colors[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  variant = 'default' 
}: { 
  icon: typeof Shield;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: 'default' | 'warning' | 'danger';
}) {
  const colors = {
    default: 'text-terminal-text',
    warning: 'text-warning',
    danger: 'text-loss',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-terminal-bg">
      <div className={clsx(
        'p-2 rounded-lg',
        variant === 'danger' ? 'bg-loss/10' :
        variant === 'warning' ? 'bg-warning/10' : 'bg-terminal-card'
      )}>
        <Icon className={clsx('w-5 h-5', colors[variant])} />
      </div>
      <div>
        <p className="text-sm text-terminal-muted">{label}</p>
        <p className={clsx('font-semibold font-mono', colors[variant])}>{value}</p>
        {subValue && (
          <p className="text-xs text-terminal-muted">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export function RiskDashboard({ risk }: Props) {
  const { metrics, warnings } = risk;
  
  // Determine variants based on thresholds
  const drawdownVariant = metrics.drawdown_pct_of_limit > 80 ? 'danger' : 
                          metrics.drawdown_pct_of_limit > 50 ? 'warning' : 'default';
  const hourlyVariant = metrics.hourly_loss_pct_of_cap > 80 ? 'danger' :
                        metrics.hourly_loss_pct_of_cap > 50 ? 'warning' : 'default';
  const lossVariant = metrics.consecutive_losses >= 2 ? 'warning' :
                      metrics.consecutive_losses >= 3 ? 'danger' : 'default';

  return (
    <Card title="Risk Management">
      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4 space-y-2">
          {warnings.map((warning, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 p-2 rounded bg-loss/10 border border-loss/20 text-sm text-loss"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {warning}
            </div>
          ))}
        </div>
      )}

      {/* Progress Bars */}
      <div className="space-y-4 mb-6">
        <ProgressBar
          label="Drawdown"
          value={metrics.current_drawdown}
          max={metrics.drawdown_limit}
          variant={drawdownVariant}
        />
        <ProgressBar
          label="Hourly Loss"
          value={metrics.hourly_loss}
          max={metrics.hourly_loss_cap}
          variant={hourlyVariant}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={TrendingDown}
          label="Consecutive Losses"
          value={`${metrics.consecutive_losses} / ${metrics.max_consecutive_losses}`}
          variant={lossVariant}
        />
        <MetricCard
          icon={Percent}
          label="Kelly Fraction"
          value={`${(metrics.kelly_fraction * 100).toFixed(0)}%`}
          subValue="Half Kelly"
        />
        <MetricCard
          icon={PieChart}
          label="Total Exposure"
          value={`${metrics.total_exposure.toFixed(1)}%`}
          subValue="of portfolio"
        />
        <MetricCard
          icon={Shield}
          label="Circuit Breaker"
          value={risk.circuit_breaker_status}
          variant={risk.circuit_breaker_status === 'TRIPPED' ? 'danger' : 
                   risk.circuit_breaker_status === 'COOLING_DOWN' ? 'warning' : 'default'}
        />
      </div>

      {/* Position Concentration */}
      {Object.keys(metrics.position_concentration).length > 0 && (
        <div className="mt-4 pt-4 border-t border-terminal-border">
          <p className="text-sm text-terminal-muted mb-2">Position Concentration</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(metrics.position_concentration).map(([platform, pct]) => (
              <span 
                key={platform}
                className={clsx(
                  'px-2 py-1 rounded text-sm font-mono',
                  pct > 0.3 ? 'bg-warning/10 text-warning' : 'bg-terminal-bg text-terminal-muted'
                )}
              >
                {platform}: {(pct * 100).toFixed(1)}%
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
