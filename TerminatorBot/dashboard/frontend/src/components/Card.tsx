import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}

export function Card({ title, children, className, headerRight }: CardProps) {
  return (
    <div className={clsx(
      'bg-terminal-card border border-terminal-border rounded-lg p-4',
      'card-hover',
      className
    )}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-terminal-text">{title}</h3>
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
}

// Stat card for key metrics
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export function StatCard({ label, value, change, changeLabel, icon, variant = 'default' }: StatCardProps) {
  const valueColors = {
    default: 'text-terminal-text',
    success: 'text-profit',
    danger: 'text-loss',
    warning: 'text-warning',
  };

  return (
    <div className="bg-terminal-card border border-terminal-border rounded-lg p-4 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-terminal-muted mb-1">{label}</p>
          <p className={clsx('text-2xl font-bold font-mono', valueColors[variant])}>
            {value}
          </p>
          {change !== undefined && (
            <p className={clsx(
              'text-sm mt-1 font-mono',
              change >= 0 ? 'text-profit' : 'text-loss'
            )}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              {changeLabel && <span className="text-terminal-muted ml-1">{changeLabel}</span>}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-terminal-muted opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Status indicator dot
interface StatusDotProps {
  status: 'active' | 'inactive' | 'warning' | 'error';
  pulse?: boolean;
}

export function StatusDot({ status, pulse = true }: StatusDotProps) {
  const colors = {
    active: 'bg-profit',
    inactive: 'bg-terminal-muted',
    warning: 'bg-warning',
    error: 'bg-loss',
  };

  return (
    <span className="relative flex h-3 w-3">
      {pulse && status === 'active' && (
        <span className={clsx(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          colors[status]
        )} />
      )}
      <span className={clsx(
        'relative inline-flex rounded-full h-3 w-3',
        colors[status]
      )} />
    </span>
  );
}
