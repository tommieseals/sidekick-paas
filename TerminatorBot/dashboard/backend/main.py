"""
TerminatorBot Dashboard API
Professional-grade trading dashboard backend

Run with: uvicorn main:app --reload --port 8765
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

from config import API_HOST, API_PORT, CORS_ORIGINS
from database import db_service
from models import (
    PortfolioResponse, PnLChartResponse, DailyPnLPoint,
    StrategiesResponse, StrategyStatus, StrategyConfig, StatusEnum,
    PositionsResponse, Position,
    TradesResponse, Trade,
    OpportunitiesResponse, Opportunity,
    PlatformsResponse, PlatformStatus,
    RiskResponse, RiskMetrics, CircuitBreakerStatus,
    ModelMetricsResponse, ModelMetrics,
    SystemEventsResponse, SystemEvent
)


# ══════════════════════════════════════════════════════════════════════════════
# App Configuration
# ══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="TerminatorBot Dashboard API",
    description="Real-time trading dashboard for TerminatorBot prediction market system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════════════════
# Health Check
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "TerminatorBot Dashboard API"
    }


# ══════════════════════════════════════════════════════════════════════════════
# Portfolio Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/portfolio", response_model=PortfolioResponse)
async def get_portfolio():
    """
    Get portfolio overview including:
    - Current balance
    - Daily P&L
    - Total P&L since inception
    - Current drawdown percentage
    - Circuit breaker status
    """
    try:
        balance = await db_service.get_portfolio_balance()
        daily_pnl = await db_service.get_daily_pnl()
        total_pnl = await db_service.get_total_pnl()
        drawdown = await db_service.get_drawdown()
        cb_status, _ = await db_service.get_circuit_breaker_status()
        
        return PortfolioResponse(
            balance=balance,
            daily_pnl=daily_pnl,
            total_pnl=total_pnl,
            drawdown_pct=drawdown * 100,  # Convert to percentage
            circuit_breaker_status=CircuitBreakerStatus(cb_status),
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/portfolio/pnl-chart", response_model=PnLChartResponse)
async def get_pnl_chart(days: int = Query(default=30, ge=1, le=365)):
    """Get P&L history for charting"""
    try:
        data = await db_service.get_pnl_history(days)
        
        pnl_points = [
            DailyPnLPoint(date=d["date"], pnl=d["pnl"], cumulative=d["cumulative"])
            for d in data
        ]
        
        return PnLChartResponse(
            data=pnl_points,
            period_start=(datetime.now().replace(hour=0, minute=0, second=0)).isoformat()[:10],
            period_end=datetime.now().isoformat()[:10]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Strategy Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/strategies", response_model=StrategiesResponse)
async def get_strategies():
    """
    Get status for all 4 trading strategies:
    - Alpha (ML-based)
    - Contrarian
    - Dumb Bet
    - Arbitrage
    """
    try:
        strategies_data = await db_service.get_all_strategies_status()
        
        strategies = []
        for s in strategies_data:
            config_data = s.get("config", {})
            strategies.append(StrategyStatus(
                id=s["id"],
                name=s["name"],
                status=StatusEnum(s["status"]),
                status_message=s["status_message"],
                trades_today=s["trades_today"],
                win_rate=s["win_rate"],
                pnl_today=s["pnl_today"],
                edge_found=s["edge_found"],
                config=StrategyConfig(
                    min_edge=config_data.get("min_edge"),
                    confidence_threshold=config_data.get("confidence_threshold"),
                    consensus_threshold=config_data.get("consensus_threshold"),
                    bias_adjustment=config_data.get("bias_adjustment"),
                    max_prob=config_data.get("max_prob"),
                    min_volume=config_data.get("min_volume"),
                    min_liquidity=config_data.get("min_liquidity")
                )
            ))
        
        return StrategiesResponse(
            strategies=strategies,
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Position Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/positions", response_model=PositionsResponse)
async def get_positions():
    """Get all currently open positions"""
    try:
        positions_data = await db_service.get_active_positions()
        
        positions = []
        total_unrealized = 0
        
        for p in positions_data:
            positions.append(Position(
                id=p["id"],
                market_title=p["market_title"],
                market_id=p["market_id"],
                platform=p["platform"],
                side=p["side"],
                entry_price=p["entry_price"],
                current_price=p["current_price"],
                unrealized_pnl=p["unrealized_pnl"],
                strategy=p["strategy"],
                quantity=p["quantity"],
                entry_time=datetime.fromisoformat(p["entry_time"]) if p["entry_time"] else datetime.now()
            ))
            total_unrealized += p["unrealized_pnl"]
        
        return PositionsResponse(
            positions=positions,
            total_unrealized_pnl=total_unrealized,
            position_count=len(positions)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Trade History Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/trades", response_model=TradesResponse)
async def get_trades(
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    strategy: Optional[str] = Query(default=None)
):
    """
    Get trade history with pagination and optional strategy filter.
    """
    try:
        trades_data, total = await db_service.get_trades(limit, offset, strategy)
        
        trades = []
        total_pnl = 0
        
        for t in trades_data:
            trades.append(Trade(
                id=t["id"],
                timestamp=datetime.fromisoformat(t["timestamp"]) if t["timestamp"] else datetime.now(),
                market_title=t["market_title"],
                platform=t["platform"],
                side=t["side"],
                quantity=t["quantity"],
                entry_price=t["entry_price"],
                exit_price=t.get("exit_price"),
                pnl=t["pnl"],
                edge_at_entry=t["edge_at_entry"],
                strategy=t["strategy"],
                status=t["status"]
            ))
            total_pnl += t["pnl"]
        
        return TradesResponse(
            trades=trades,
            total_count=total,
            total_pnl=total_pnl
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Opportunity Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/opportunities", response_model=OpportunitiesResponse)
async def get_opportunities(
    limit: int = Query(default=50, ge=1, le=200),
    pending_only: bool = Query(default=False)
):
    """
    Get opportunity pipeline - detected edges not yet traded.
    """
    try:
        acted_on = False if pending_only else None
        opportunities_data, total = await db_service.get_opportunities(limit, acted_on)
        
        opportunities = []
        for o in opportunities_data:
            opportunities.append(Opportunity(
                id=o["id"],
                timestamp=datetime.fromisoformat(o["timestamp"]) if o["timestamp"] else datetime.now(),
                market_title=o["market_title"],
                market_id=o["market_id"],
                platform=o["platform"],
                scanner_type=o["scanner_type"],
                side=o["side"],
                edge=o["edge"] * 100,  # Convert to percentage
                confidence=o["confidence"] * 100,
                acted_on=o["acted_on"],
                reason_not_traded=o["reason_not_traded"]
            ))
        
        return OpportunitiesResponse(
            opportunities=opportunities,
            total_count=total
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Platform Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/platforms", response_model=PlatformsResponse)
async def get_platforms():
    """Get connection status for all trading platforms"""
    try:
        platforms_data = await db_service.get_platform_status()
        
        platforms = []
        for p in platforms_data:
            platforms.append(PlatformStatus(
                id=p["id"],
                name=p["name"],
                status=StatusEnum(p["status"]),
                balance=p["balance"],
                message=p["message"]
            ))
        
        return PlatformsResponse(platforms=platforms)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Risk Endpoints
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/risk", response_model=RiskResponse)
async def get_risk():
    """
    Get comprehensive risk metrics including:
    - Drawdown status
    - Consecutive losses
    - Hourly loss tracking
    - Position concentration
    """
    try:
        metrics_data = await db_service.get_risk_metrics()
        cb_status, cb_reason = await db_service.get_circuit_breaker_status()
        
        # Generate warnings
        warnings = []
        if metrics_data["drawdown_pct_of_limit"] > 80:
            warnings.append(f"⚠️ Drawdown at {metrics_data['drawdown_pct_of_limit']:.1f}% of limit")
        if metrics_data["consecutive_losses"] >= 2:
            warnings.append(f"⚠️ {metrics_data['consecutive_losses']} consecutive losses")
        if metrics_data["hourly_loss_pct_of_cap"] > 50:
            warnings.append(f"⚠️ Hourly loss at {metrics_data['hourly_loss_pct_of_cap']:.1f}% of cap")
        
        if cb_status == "TRIPPED":
            warnings.insert(0, f"🛑 Circuit breaker TRIPPED: {cb_reason}")
        
        return RiskResponse(
            metrics=RiskMetrics(
                current_drawdown=metrics_data["current_drawdown"] * 100,
                drawdown_limit=metrics_data["drawdown_limit"] * 100,
                drawdown_pct_of_limit=metrics_data["drawdown_pct_of_limit"],
                consecutive_losses=metrics_data["consecutive_losses"],
                max_consecutive_losses=metrics_data["max_consecutive_losses"],
                hourly_loss=metrics_data["hourly_loss"],
                hourly_loss_cap=metrics_data["hourly_loss_cap"],
                hourly_loss_pct_of_cap=metrics_data["hourly_loss_pct_of_cap"],
                kelly_fraction=metrics_data["kelly_fraction"],
                position_concentration=metrics_data["position_concentration"],
                total_exposure=metrics_data["total_exposure"] * 100
            ),
            warnings=warnings,
            circuit_breaker_status=CircuitBreakerStatus(cb_status),
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# ML Model Metrics Endpoint
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/model-metrics", response_model=ModelMetricsResponse)
async def get_model_metrics():
    """Get ML model performance metrics"""
    try:
        metrics = await db_service.get_model_metrics()
        
        alpha_model = None
        if metrics:
            alpha_model = ModelMetrics(
                accuracy=metrics["accuracy"],
                precision=metrics["precision"],
                recall=metrics["recall"],
                f1_score=metrics["f1_score"],
                roc_auc=metrics["roc_auc"],
                brier_score=metrics["brier_score"],
                trained_at=datetime.fromisoformat(metrics["trained_at"]) if metrics["trained_at"] else datetime.now(),
                sample_count=metrics["sample_count"],
                top_features=metrics["top_features"]
            )
        
        return ModelMetricsResponse(
            alpha_model=alpha_model,
            last_updated=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# System Events Endpoint
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/api/events", response_model=SystemEventsResponse)
async def get_events(limit: int = Query(default=50, ge=1, le=200)):
    """Get system events (circuit breaker trips, errors, etc.)"""
    try:
        events_data, total = await db_service.get_system_events(limit)
        
        events = []
        for e in events_data:
            events.append(SystemEvent(
                id=e["id"],
                timestamp=datetime.fromisoformat(e["timestamp"]) if e["timestamp"] else datetime.now(),
                event_type=e["event_type"],
                severity=e["severity"],
                details=e["details"],
                metadata=e["metadata"]
            ))
        
        return SystemEventsResponse(events=events, total_count=total)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ══════════════════════════════════════════════════════════════════════════════
# Startup
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT)
