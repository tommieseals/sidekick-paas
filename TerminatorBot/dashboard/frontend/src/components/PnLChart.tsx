import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Card } from './Card';
import type { DailyPnLPoint } from '../types';
import { format } from 'date-fns';

interface Props {
  data: DailyPnLPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-terminal-card border border-terminal-border rounded-lg p-3 shadow-lg">
        <p className="text-sm text-terminal-muted mb-1">
          {format(new Date(label), 'MMM d, yyyy')}
        </p>
        <p className="font-mono">
          <span className="text-terminal-muted">Daily: </span>
          <span className={data.pnl >= 0 ? 'text-profit' : 'text-loss'}>
            {data.pnl >= 0 ? '+' : ''}${data.pnl.toFixed(2)}
          </span>
        </p>
        <p className="font-mono">
          <span className="text-terminal-muted">Cumulative: </span>
          <span className={data.cumulative >= 0 ? 'text-profit' : 'text-loss'}>
            {data.cumulative >= 0 ? '+' : ''}${data.cumulative.toFixed(2)}
          </span>
        </p>
      </div>
    );
  }
  return null;
}

export function PnLChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card title="P&L Chart (30 Days)">
        <div className="flex items-center justify-center h-64 text-terminal-muted">
          <p>No trading data yet</p>
        </div>
      </Card>
    );
  }

  // Determine if overall P&L is positive or negative
  const finalCumulative = data[data.length - 1]?.cumulative || 0;
  const gradientColor = finalCumulative >= 0 ? '#10b981' : '#ef4444';

  return (
    <Card title="P&L Chart (30 Days)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#1f2937" 
              vertical={false} 
            />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => format(new Date(value), 'MMM d')}
              axisLine={{ stroke: '#1f2937' }}
              tickLine={{ stroke: '#1f2937' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              axisLine={{ stroke: '#1f2937' }}
              tickLine={{ stroke: '#1f2937' }}
              width={60}
            />
            <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="cumulative" 
              stroke={gradientColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPnl)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
