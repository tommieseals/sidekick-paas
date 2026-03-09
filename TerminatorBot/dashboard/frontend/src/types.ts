// ══════════════════════════════════════════════════════════════════════════════
// API Response Types
// ══════════════════════════════════════════════════════════════════════════════

export type StatusEnum = 'active' | 'inactive' | 'warning' | 'error';
export type CircuitBreakerStatus = 'OPERATIONAL' | 'TRIPPED' | 'COOLING_DOWN';

// Portfolio
export interface PortfolioResponse {
  balance: number;
  daily_pnl: number;
  total_pnl: number;
  drawdown_pct: number;
  circuit_breaker_status: CircuitBreakerStatus;
  last_updated: string;
}

export interface DailyPnLPoint {
  date: string;
  pnl: number;
  cumulative: number;
}

export interface PnLChartResponse {
  data: DailyPnLPoint[];
  period_start: string;
  period_end: string;
}

// Strategies
export interface StrategyConfig {
  min_edge?: number;
  confidence_threshold?: number;
  consensus_threshold?: number;
  bias_adjustment?: number;
  max_prob?: number;
  min_volume?: number;
  min_liquidity?: number;
}

export interface StrategyStatus {
  id: string;
  name: string;
  status: StatusEnum;
  status_message: string;
  trades_today: number;
  win_rate: number;
  pnl_today: number;
  edge_found: number;
  config: StrategyConfig;
}

export interface StrategiesResponse {
  strategies: StrategyStatus[];
  last_updated: string;
}

// Positions
export interface Position {
  id: number;
  market_title: string;
  market_id: string;
  platform: string;
  side: string;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  strategy: string;
  quantity: number;
  entry_time: string;
}

export interface PositionsResponse {
  positions: Position[];
  total_unrealized_pnl: number;
  position_count: number;
}

// Trades
export interface Trade {
  id: number;
  timestamp: string;
  market_title: string;
  platform: string;
  side: string;
  quantity: number;
  entry_price: number;
  exit_price?: number;
  pnl: number;
  edge_at_entry: number;
  strategy: string;
  status: string;
}

export interface TradesResponse {
  trades: Trade[];
  total_count: number;
  total_pnl: number;
}

// Opportunities
export interface Opportunity {
  id: number;
  timestamp: string;
  market_title: string;
  market_id: string;
  platform: string;
  scanner_type: string;
  side?: string;
  edge: number;
  confidence: number;
  acted_on: boolean;
  reason_not_traded?: string;
}

export interface OpportunitiesResponse {
  opportunities: Opportunity[];
  total_count: number;
}

// Platforms
export interface PlatformStatus {
  id: string;
  name: string;
  status: StatusEnum;
  balance?: number;
  message: string;
}

export interface PlatformsResponse {
  platforms: PlatformStatus[];
}

// Risk
export interface RiskMetrics {
  current_drawdown: number;
  drawdown_limit: number;
  drawdown_pct_of_limit: number;
  consecutive_losses: number;
  max_consecutive_losses: number;
  hourly_loss: number;
  hourly_loss_cap: number;
  hourly_loss_pct_of_cap: number;
  kelly_fraction: number;
  position_concentration: Record<string, number>;
  total_exposure: number;
}

export interface RiskResponse {
  metrics: RiskMetrics;
  warnings: string[];
  circuit_breaker_status: CircuitBreakerStatus;
  last_updated: string;
}

// Model Metrics
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  brier_score: number;
  trained_at: string;
  sample_count: number;
  top_features: [string, number][];
}

export interface ModelMetricsResponse {
  alpha_model?: ModelMetrics;
  last_updated: string;
}

// System Events
export interface SystemEvent {
  id: number;
  timestamp: string;
  event_type: string;
  severity: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

export interface SystemEventsResponse {
  events: SystemEvent[];
  total_count: number;
}
