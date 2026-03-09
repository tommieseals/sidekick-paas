"""
Pydantic models for API responses
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class StatusEnum(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    WARNING = "warning"
    ERROR = "error"


class CircuitBreakerStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    TRIPPED = "TRIPPED"
    COOLING_DOWN = "COOLING_DOWN"


# ══════════════════════════════════════════════════════════════════════════════
# Portfolio Models
# ══════════════════════════════════════════════════════════════════════════════

class PortfolioResponse(BaseModel):
    balance: float
    daily_pnl: float
    total_pnl: float
    drawdown_pct: float
    circuit_breaker_status: CircuitBreakerStatus
    last_updated: datetime


class DailyPnLPoint(BaseModel):
    date: str
    pnl: float
    cumulative: float


class PnLChartResponse(BaseModel):
    data: List[DailyPnLPoint]
    period_start: str
    period_end: str


# ══════════════════════════════════════════════════════════════════════════════
# Strategy Models
# ══════════════════════════════════════════════════════════════════════════════

class StrategyConfig(BaseModel):
    min_edge: Optional[float] = None
    confidence_threshold: Optional[float] = None
    consensus_threshold: Optional[float] = None
    bias_adjustment: Optional[float] = None
    max_prob: Optional[float] = None
    min_volume: Optional[int] = None
    min_liquidity: Optional[int] = None


class StrategyStatus(BaseModel):
    id: str
    name: str
    status: StatusEnum
    status_message: str
    trades_today: int
    win_rate: float
    pnl_today: float
    edge_found: int
    config: StrategyConfig


class StrategiesResponse(BaseModel):
    strategies: List[StrategyStatus]
    last_updated: datetime


# ══════════════════════════════════════════════════════════════════════════════
# Position Models
# ══════════════════════════════════════════════════════════════════════════════

class Position(BaseModel):
    id: int
    market_title: str
    market_id: str
    platform: str
    side: str
    entry_price: float
    current_price: float
    unrealized_pnl: float
    strategy: str
    quantity: float
    entry_time: datetime


class PositionsResponse(BaseModel):
    positions: List[Position]
    total_unrealized_pnl: float
    position_count: int


# ══════════════════════════════════════════════════════════════════════════════
# Trade History Models
# ══════════════════════════════════════════════════════════════════════════════

class Trade(BaseModel):
    id: int
    timestamp: datetime
    market_title: str
    platform: str
    side: str
    quantity: float
    entry_price: float
    exit_price: Optional[float] = None
    pnl: float
    edge_at_entry: float
    strategy: str
    status: str


class TradesResponse(BaseModel):
    trades: List[Trade]
    total_count: int
    total_pnl: float


# ══════════════════════════════════════════════════════════════════════════════
# Opportunity Models
# ══════════════════════════════════════════════════════════════════════════════

class Opportunity(BaseModel):
    id: int
    timestamp: datetime
    market_title: str
    market_id: str
    platform: str
    scanner_type: str
    side: Optional[str]
    edge: float
    confidence: float
    acted_on: bool
    reason_not_traded: Optional[str] = None


class OpportunitiesResponse(BaseModel):
    opportunities: List[Opportunity]
    total_count: int


# ══════════════════════════════════════════════════════════════════════════════
# Platform Models
# ══════════════════════════════════════════════════════════════════════════════

class PlatformStatus(BaseModel):
    id: str
    name: str
    status: StatusEnum
    balance: Optional[float] = None
    message: str


class PlatformsResponse(BaseModel):
    platforms: List[PlatformStatus]


# ══════════════════════════════════════════════════════════════════════════════
# Risk Models
# ══════════════════════════════════════════════════════════════════════════════

class RiskMetrics(BaseModel):
    current_drawdown: float
    drawdown_limit: float
    drawdown_pct_of_limit: float
    consecutive_losses: int
    max_consecutive_losses: int
    hourly_loss: float
    hourly_loss_cap: float
    hourly_loss_pct_of_cap: float
    kelly_fraction: float
    position_concentration: Dict[str, float]
    total_exposure: float


class RiskResponse(BaseModel):
    metrics: RiskMetrics
    warnings: List[str]
    circuit_breaker_status: CircuitBreakerStatus
    last_updated: datetime


# ══════════════════════════════════════════════════════════════════════════════
# ML Model Metrics
# ══════════════════════════════════════════════════════════════════════════════

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    brier_score: float
    trained_at: datetime
    sample_count: int
    top_features: List[tuple]


class ModelMetricsResponse(BaseModel):
    alpha_model: Optional[ModelMetrics] = None
    last_updated: datetime


# ══════════════════════════════════════════════════════════════════════════════
# System Events
# ══════════════════════════════════════════════════════════════════════════════

class SystemEvent(BaseModel):
    id: int
    timestamp: datetime
    event_type: str
    severity: str
    details: Optional[str]
    metadata: Optional[Dict[str, Any]] = None


class SystemEventsResponse(BaseModel):
    events: List[SystemEvent]
    total_count: int
