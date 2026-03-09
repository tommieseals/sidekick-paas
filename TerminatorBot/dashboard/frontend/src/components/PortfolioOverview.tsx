import { 
  TrendingUp, TrendingDown, AlertTriangle, 
  CheckCircle, XCircle, Activity 
} from 'lucide-react';
import { StatCard, StatusDot } from './Card';
import type { PortfolioResponse, CircuitBreakerStatus } from '../types';
import clsx from 'clsx';

interface Props {
  data: PortfolioResponse;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

function CircuitBreakerBadge({ status }: { status: CircuitBreakerStatus }) {
  const config = {
    OPERATIONAL: { 
      icon: CheckCircle, 
      label: 'OPERATIONAL', 
      color: 'text-profit bg-profit/10 border-profit/30',
      dotStatus: 'active' as const
    },
    TRIPPED: { 
      icon: XCircle, 
      label: 'TRIPPED', 
      color: 'text-loss bg-loss/10 border-loss/30',
      dotStatus: 'error' as const
    },
    COOLING_DOWN: { 
      icon: AlertTriangle, 
      label: 'COOLING DOWN', 
      color: 'text-warning bg-warning/10 border-warning/30',
      dotStatus: 'warning' as const
    },
  };

  const { icon: Icon, label, color, dotStatus } = config[status];

  return (
    <div className={clsx(
      'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
      color
    )}>
      <StatusDot status={dotStatus} />
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}

export function PortfolioOverview({ data }: Props) {
  const pnlVariant = data.daily_pnl >= 0 ? 'success' : 'danger';
  const totalPnlVariant = data.total_pnl >= 0 ? 'success' : 'danger';
  const drawdownVariant = data.drawdown_pct > 3 ? 'danger' : data.drawdown_pct > 1 ? 'warning' : 'default';

  return (
    <div className="space-y-4">
      {/* Circuit Breaker Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-terminal-text flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Portfolio Overview
        </h2>
        <CircuitBreakerBadge status={data.circuit_breaker_status} />
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Balance"
          value={formatCurrency(data.balance)}
          icon={<Activity className="w-6 h-6" />}
        />
        <StatCard
          label="Today's P&L"
          value={formatCurrency(data.daily_pnl)}
          variant={pnlVariant}
          icon={data.daily_pnl >= 0 ? 
            <TrendingUp className="w-6 h-6 text-profit" /> : 
            <TrendingDown className="w-6 h-6 text-loss" />
          }
        />
        <StatCard
          label="Total P&L"
          value={formatCurrency(data.total_pnl)}
          variant={totalPnlVariant}
          change={(data.total_pnl / 10000) * 100}
          changeLabel="since inception"
        />
        <StatCard
          label="Current Drawdown"
          value={`${data.drawdown_pct.toFixed(2)}%`}
          variant={drawdownVariant}
          icon={<AlertTriangle className={clsx(
            'w-6 h-6',
            drawdownVariant === 'danger' ? 'text-loss' : 
            drawdownVariant === 'warning' ? 'text-warning' : 'text-terminal-muted'
          )} />}
        />
      </div>
    </div>
  );
}
