import { RefreshCw, Skull, Clock } from 'lucide-react';
import { 
  PortfolioOverview, 
  StrategyPanel, 
  PositionsTable,
  TradeHistory,
  OpportunityPipeline,
  PlatformStatus,
  RiskDashboard,
  PnLChart 
} from './components';
import { 
  useDashboardData, 
  usePnLChart, 
  useTrades, 
  useOpportunities 
} from './hooks/useApi';
import clsx from 'clsx';
import { format } from 'date-fns';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-center">
        <Skull className="w-16 h-16 text-profit mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold text-terminal-text mb-2">TerminatorBot</h1>
        <p className="text-terminal-muted">Loading dashboard...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="text-6xl mb-4">💀</div>
        <h1 className="text-2xl font-bold text-loss mb-2">Connection Error</h1>
        <p className="text-terminal-muted mb-4">{error}</p>
        <p className="text-sm text-terminal-muted mb-6">
          Make sure the backend API is running on port 8765
        </p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-profit text-white rounded-lg hover:bg-profit-dark transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const dashboard = useDashboardData();
  const pnlChart = usePnLChart(30);
  const trades = useTrades(50);
  const opportunities = useOpportunities(50);

  // Loading state
  if (dashboard.loading && !dashboard.portfolio) {
    return <LoadingScreen />;
  }

  // Error state
  if (dashboard.error && !dashboard.portfolio) {
    return <ErrorScreen error={dashboard.error} onRetry={dashboard.refetchAll} />;
  }

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-text">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-terminal-bg/95 backdrop-blur border-b border-terminal-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skull className="w-8 h-8 text-profit" />
              <div>
                <h1 className="text-xl font-bold">TerminatorBot</h1>
                <p className="text-xs text-terminal-muted">Prediction Market Trading System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {dashboard.lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-terminal-muted">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {format(dashboard.lastUpdated, 'HH:mm:ss')}</span>
                </div>
              )}
              <button 
                onClick={dashboard.refetchAll}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  'hover:bg-terminal-card text-terminal-muted hover:text-terminal-text',
                  dashboard.loading && 'animate-spin'
                )}
                disabled={dashboard.loading}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Portfolio Overview */}
        {dashboard.portfolio && (
          <section className="mb-6">
            <PortfolioOverview data={dashboard.portfolio} />
          </section>
        )}

        {/* P&L Chart */}
        {pnlChart.data && (
          <section className="mb-6">
            <PnLChart data={pnlChart.data.data} />
          </section>
        )}

        {/* Strategy Performance */}
        {dashboard.strategies && (
          <section className="mb-6">
            <StrategyPanel strategies={dashboard.strategies.strategies} />
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Active Positions */}
          {dashboard.positions && (
            <PositionsTable 
              positions={dashboard.positions.positions}
              totalUnrealizedPnl={dashboard.positions.total_unrealized_pnl}
            />
          )}

          {/* Trade History */}
          {trades.data && (
            <TradeHistory 
              trades={trades.data.trades}
              totalCount={trades.data.total_count}
              totalPnl={trades.data.total_pnl}
            />
          )}
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Opportunity Pipeline */}
          {opportunities.data && (
            <OpportunityPipeline 
              opportunities={opportunities.data.opportunities}
              totalCount={opportunities.data.total_count}
            />
          )}

          {/* Platform Status */}
          {dashboard.platforms && (
            <PlatformStatus platforms={dashboard.platforms.platforms} />
          )}

          {/* Risk Dashboard */}
          {dashboard.risk && (
            <RiskDashboard risk={dashboard.risk} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border py-4 mt-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-terminal-muted">
            TerminatorBot v1.0.0 • Trading system is {dashboard.portfolio?.circuit_breaker_status === 'OPERATIONAL' ? (
              <span className="text-profit">● LIVE</span>
            ) : (
              <span className="text-loss">● HALTED</span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
