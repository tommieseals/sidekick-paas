'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SectorData {
  value: number;
  percent: number;
}

interface SectorPieChartProps {
  sectors: Record<string, SectorData>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SectorPieChart({ sectors }: SectorPieChartProps) {
  const data = Object.entries(sectors)
    .map(([name, { value, percent }]) => ({
      name,
      value,
      percent,
    }))
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-finance-card border border-finance-border rounded-lg p-3">
          <p className="text-white font-bold">{item.name}</p>
          <p className="text-gray-400">{formatCurrency(item.value)}</p>
          <p className="text-finance-blue">{item.percent.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-finance-card rounded-2xl p-6 card-glow border border-finance-border h-[350px]">
      <h3 className="text-xl font-bold mb-4">Sector Allocation</h3>

      <div className="flex h-[calc(100%-40px)]">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2 flex flex-col justify-center">
          {data.map((sector, index) => (
            <div
              key={sector.name}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-400">{sector.name}</span>
              </div>
              <span className="text-sm font-mono">{sector.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
