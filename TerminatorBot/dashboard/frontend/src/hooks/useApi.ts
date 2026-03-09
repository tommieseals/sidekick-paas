import { useState, useEffect, useCallback } from 'react';
import type {
  PortfolioResponse,
  PnLChartResponse,
  StrategiesResponse,
  PositionsResponse,
  TradesResponse,
  OpportunitiesResponse,
  PlatformsResponse,
  RiskResponse,
  ModelMetricsResponse,
} from '../types';

const API_BASE = '/api';
const REFRESH_INTERVAL = 30000; // 30 seconds

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Generic hook for API data with auto-refresh
function useApiData<T>(endpoint: string, refreshInterval = REFRESH_INTERVAL) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refetch = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchApi<T>(endpoint);
      setData(result);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, refreshInterval);
    return () => clearInterval(interval);
  }, [refetch, refreshInterval]);

  return { data, loading, error, lastUpdated, refetch };
}

// ══════════════════════════════════════════════════════════════════════════════
// Specific API Hooks
// ══════════════════════════════════════════════════════════════════════════════

export function usePortfolio() {
  return useApiData<PortfolioResponse>('/portfolio');
}

export function usePnLChart(days = 30) {
  return useApiData<PnLChartResponse>(`/portfolio/pnl-chart?days=${days}`);
}

export function useStrategies() {
  return useApiData<StrategiesResponse>('/strategies');
}

export function usePositions() {
  return useApiData<PositionsResponse>('/positions');
}

export function useTrades(limit = 50, strategy?: string) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (strategy) params.append('strategy', strategy);
  return useApiData<TradesResponse>(`/trades?${params}`);
}

export function useOpportunities(limit = 50, pendingOnly = false) {
  const params = new URLSearchParams({ 
    limit: limit.toString(),
    pending_only: pendingOnly.toString()
  });
  return useApiData<OpportunitiesResponse>(`/opportunities?${params}`);
}

export function usePlatforms() {
  return useApiData<PlatformsResponse>('/platforms');
}

export function useRisk() {
  return useApiData<RiskResponse>('/risk');
}

export function useModelMetrics() {
  return useApiData<ModelMetricsResponse>('/model-metrics', 60000); // Refresh every minute
}

// Combined hook for dashboard overview
export function useDashboardData() {
  const portfolio = usePortfolio();
  const strategies = useStrategies();
  const positions = usePositions();
  const platforms = usePlatforms();
  const risk = useRisk();

  const loading = portfolio.loading || strategies.loading || 
                  positions.loading || platforms.loading || risk.loading;
  
  const error = portfolio.error || strategies.error || 
                positions.error || platforms.error || risk.error;

  const lastUpdated = [
    portfolio.lastUpdated,
    strategies.lastUpdated,
    positions.lastUpdated,
    platforms.lastUpdated,
    risk.lastUpdated,
  ].reduce((latest, current) => {
    if (!latest) return current;
    if (!current) return latest;
    return current > latest ? current : latest;
  }, null as Date | null);

  return {
    portfolio: portfolio.data,
    strategies: strategies.data,
    positions: positions.data,
    platforms: platforms.data,
    risk: risk.data,
    loading,
    error,
    lastUpdated,
    refetchAll: () => {
      portfolio.refetch();
      strategies.refetch();
      positions.refetch();
      platforms.refetch();
      risk.refetch();
    }
  };
}
