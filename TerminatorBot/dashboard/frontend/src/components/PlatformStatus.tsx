import { Server, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, StatusDot } from './Card';
import type { PlatformStatus as PlatformStatusType } from '../types';
import clsx from 'clsx';

interface Props {
  platforms: PlatformStatusType[];
}

const platformLogos: Record<string, string> = {
  kalshi: '🎯',
  polymarket: '🔮',
  betfair: '🏇',
  limitless: '∞',
};

export function PlatformStatus({ platforms }: Props) {
  return (
    <Card title="Platform Connections">
      <div className="space-y-3">
        {platforms.map(platform => (
          <div 
            key={platform.id}
            className={clsx(
              'flex items-center justify-between p-3 rounded-lg border',
              platform.status === 'active' 
                ? 'bg-profit/5 border-profit/20' 
                : 'bg-terminal-bg border-terminal-border'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{platformLogos[platform.id] || '📊'}</span>
              <div>
                <p className="font-semibold text-terminal-text">{platform.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <StatusDot status={platform.status} pulse={platform.status === 'active'} />
                  <span className={clsx(
                    'text-sm',
                    platform.status === 'active' ? 'text-profit' : 'text-terminal-muted'
                  )}>
                    {platform.message}
                  </span>
                </div>
              </div>
            </div>
            
            {platform.balance !== null && platform.balance !== undefined && (
              <div className="text-right">
                <p className="font-mono font-semibold text-terminal-text">
                  ${platform.balance.toLocaleString()}
                </p>
                <p className="text-xs text-terminal-muted">balance</p>
              </div>
            )}
            
            {platform.status !== 'active' && (
              <div className="text-right">
                <XCircle className="w-5 h-5 text-terminal-muted" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
