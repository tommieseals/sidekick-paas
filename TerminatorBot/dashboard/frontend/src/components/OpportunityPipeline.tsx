import { Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from './Card';
import type { Opportunity } from '../types';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  opportunities: Opportunity[];
  totalCount: number;
}

export function OpportunityPipeline({ opportunities, totalCount }: Props) {
  const pending = opportunities.filter(o => !o.acted_on);
  const acted = opportunities.filter(o => o.acted_on);

  return (
    <Card 
      title="Opportunity Pipeline"
      headerRight={
        <div className="flex items-center gap-2">
          <span className="text-sm text-terminal-muted">
            {pending.length} pending / {totalCount} total
          </span>
        </div>
      }
    >
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-terminal-muted">
            <Lightbulb className="w-10 h-10 mb-2 opacity-50" />
            <p>No opportunities detected</p>
            <p className="text-sm mt-1">Scanners are looking for edge...</p>
          </div>
        ) : (
          opportunities.slice(0, 20).map(opp => (
            <div 
              key={opp.id}
              className={clsx(
                'p-3 rounded-lg border transition-colors',
                opp.acted_on 
                  ? 'bg-profit/5 border-profit/20' 
                  : 'bg-terminal-bg border-terminal-border hover:border-terminal-muted'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {opp.acted_on ? (
                      <CheckCircle className="w-4 h-4 text-profit flex-shrink-0" />
                    ) : (
                      <Lightbulb className="w-4 h-4 text-warning flex-shrink-0" />
                    )}
                    <p className="font-medium text-terminal-text truncate" title={opp.market_title}>
                      {opp.market_title}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-terminal-card text-terminal-muted">
                      {opp.scanner_type}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-terminal-card text-terminal-muted">
                      {opp.platform}
                    </span>
                    {opp.side && (
                      <span className={clsx(
                        'px-1.5 py-0.5 rounded',
                        opp.side === 'YES' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                      )}>
                        {opp.side}
                      </span>
                    )}
                    <span className="text-terminal-muted">
                      {formatDistanceToNow(new Date(opp.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {!opp.acted_on && opp.reason_not_traded && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                      <AlertCircle className="w-3 h-3" />
                      {opp.reason_not_traded}
                    </div>
                  )}
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="font-mono font-semibold text-profit">
                    +{opp.edge.toFixed(1)}%
                  </p>
                  <p className="text-xs text-terminal-muted">edge</p>
                  <p className="text-xs text-terminal-muted mt-1">
                    {opp.confidence.toFixed(0)}% conf
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
