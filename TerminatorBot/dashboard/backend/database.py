"""
Database access layer for the TerminatorBot Dashboard
"""
import aiosqlite
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

from config import (
    TRADE_LOGS_DB, HISTORICAL_DB, MARKET_CACHE_DB,
    TRAINING_METRICS_PATH, PAPER_STARTING_BALANCE,
    STRATEGY_CONFIG, RISK_CONFIG
)


class DatabaseService:
    """Async database service for dashboard queries"""
    
    # ══════════════════════════════════════════════════════════════════════════
    # Portfolio Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_portfolio_balance(self) -> float:
        """Calculate current balance from starting balance + all closed P&L"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT COALESCE(SUM(pnl), 0) 
                FROM trades 
                WHERE status = 'CLOSED'
            """)
            row = await cursor.fetchone()
            total_pnl = row[0] if row else 0
            return PAPER_STARTING_BALANCE + total_pnl
    
    async def get_daily_pnl(self, date: Optional[str] = None) -> float:
        """Get P&L for a specific date (default: today)"""
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT COALESCE(SUM(pnl), 0)
                FROM trades
                WHERE DATE(ts) = ? AND status = 'CLOSED'
            """, (date,))
            row = await cursor.fetchone()
            return row[0] if row else 0.0
    
    async def get_total_pnl(self) -> float:
        """Get total P&L since inception"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT COALESCE(SUM(pnl), 0)
                FROM trades
                WHERE status = 'CLOSED'
            """)
            row = await cursor.fetchone()
            return row[0] if row else 0.0
    
    async def get_drawdown(self) -> float:
        """Calculate current drawdown percentage"""
        balance = await self.get_portfolio_balance()
        # Peak is starting balance or highest balance
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            # Calculate running balance and find peak
            cursor = await db.execute("""
                SELECT ts, pnl FROM trades 
                WHERE status = 'CLOSED' 
                ORDER BY ts
            """)
            rows = await cursor.fetchall()
            
            running_balance = PAPER_STARTING_BALANCE
            peak = PAPER_STARTING_BALANCE
            
            for row in rows:
                running_balance += row[1]
                peak = max(peak, running_balance)
            
            if peak == 0:
                return 0.0
            return (peak - balance) / peak
    
    async def get_pnl_history(self, days: int = 30) -> List[Dict[str, Any]]:
        """Get daily P&L for chart"""
        start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT DATE(ts) as date, COALESCE(SUM(pnl), 0) as daily_pnl
                FROM trades
                WHERE DATE(ts) >= ? AND status = 'CLOSED'
                GROUP BY DATE(ts)
                ORDER BY DATE(ts)
            """, (start_date,))
            rows = await cursor.fetchall()
            
            result = []
            cumulative = 0
            for row in rows:
                cumulative += row[1]
                result.append({
                    "date": row[0],
                    "pnl": row[1],
                    "cumulative": cumulative
                })
            return result
    
    # ══════════════════════════════════════════════════════════════════════════
    # Circuit Breaker Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_circuit_breaker_status(self) -> Tuple[str, Optional[str]]:
        """Check if circuit breaker is tripped"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            # Check for recent circuit breaker events
            cursor = await db.execute("""
                SELECT event_type, ts, details FROM system_events
                WHERE event_type IN ('CIRCUIT_BREAKER_TRIPPED', 'CIRCUIT_BREAKER_RESET')
                ORDER BY ts DESC
                LIMIT 1
            """)
            row = await cursor.fetchone()
            
            if row and row[0] == 'CIRCUIT_BREAKER_TRIPPED':
                trip_time = datetime.fromisoformat(row[1])
                lockout_end = trip_time + timedelta(hours=RISK_CONFIG['lockout_hours'])
                if datetime.now() < lockout_end:
                    return "TRIPPED", row[2]
                return "COOLING_DOWN", row[2]
            
            return "OPERATIONAL", None
    
    async def get_consecutive_losses(self) -> int:
        """Count current consecutive losing trades"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT pnl FROM trades
                WHERE status = 'CLOSED'
                ORDER BY ts DESC
                LIMIT 10
            """)
            rows = await cursor.fetchall()
            
            consecutive = 0
            for row in rows:
                if row[0] < 0:
                    consecutive += 1
                else:
                    break
            return consecutive
    
    async def get_hourly_loss(self) -> float:
        """Get total loss in the last hour"""
        one_hour_ago = (datetime.now() - timedelta(hours=1)).isoformat()
        
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT COALESCE(SUM(pnl), 0)
                FROM trades
                WHERE ts >= ? AND pnl < 0 AND status = 'CLOSED'
            """, (one_hour_ago,))
            row = await cursor.fetchone()
            return abs(row[0]) if row else 0.0
    
    # ══════════════════════════════════════════════════════════════════════════
    # Strategy Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_strategy_stats(self, scanner_type: str, date: Optional[str] = None) -> Dict[str, Any]:
        """Get statistics for a specific strategy"""
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            # Trades today
            cursor = await db.execute("""
                SELECT COUNT(*), COALESCE(SUM(pnl), 0),
                       SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END)
                FROM trades
                WHERE scanner_type = ? AND DATE(ts) = ?
            """, (scanner_type, date))
            trade_row = await cursor.fetchone()
            
            trades_today = trade_row[0] if trade_row else 0
            pnl_today = trade_row[1] if trade_row else 0.0
            wins = trade_row[2] if trade_row else 0
            win_rate = (wins / trades_today * 100) if trades_today > 0 else 0.0
            
            # Opportunities found today
            cursor = await db.execute("""
                SELECT COUNT(*) FROM opportunities
                WHERE scanner_type = ? AND DATE(ts) = ?
            """, (scanner_type, date))
            opp_row = await cursor.fetchone()
            edge_found = opp_row[0] if opp_row else 0
            
            return {
                "trades_today": trades_today,
                "pnl_today": pnl_today,
                "win_rate": win_rate,
                "edge_found": edge_found
            }
    
    async def get_all_strategies_status(self) -> List[Dict[str, Any]]:
        """Get status for all 4 strategies"""
        strategies = []
        
        strategy_ids = ["alpha", "contrarian", "dumb_bet", "arbitrage"]
        scanner_type_map = {
            "alpha": "alpha",
            "contrarian": "contrarian", 
            "dumb_bet": "dumb_bet",
            "arbitrage": "arb"
        }
        
        for strat_id in strategy_ids:
            config = STRATEGY_CONFIG.get(strat_id, {})
            scanner_type = scanner_type_map.get(strat_id, strat_id)
            stats = await self.get_strategy_stats(scanner_type)
            
            # Determine status
            status = "active"
            status_message = "Active"
            
            if strat_id == "arbitrage":
                # Check if we have multiple platforms
                status = "warning"
                status_message = "Single Platform"
            
            strategies.append({
                "id": strat_id,
                "name": config.get("name", strat_id.title()),
                "status": status,
                "status_message": status_message,
                "trades_today": stats["trades_today"],
                "win_rate": stats["win_rate"],
                "pnl_today": stats["pnl_today"],
                "edge_found": stats["edge_found"],
                "config": config
            })
        
        return strategies
    
    # ══════════════════════════════════════════════════════════════════════════
    # Position Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_active_positions(self) -> List[Dict[str, Any]]:
        """Get all currently open positions"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT t.id, t.market_title, t.market_id, t.platform, t.side,
                       t.price as entry_price, t.quantity, t.scanner_type, t.ts
                FROM trades t
                WHERE t.status IN ('OPEN', 'PENDING', 'FILLED')
                ORDER BY t.ts DESC
            """)
            rows = await cursor.fetchall()
            
            positions = []
            for row in rows:
                # Get current price from market cache
                current_price = await self._get_current_price(row[2], row[3])
                entry_price = row[5]
                quantity = row[6]
                
                # Calculate unrealized P&L
                if row[4] == 'YES':
                    unrealized_pnl = (current_price - entry_price) * quantity
                else:
                    unrealized_pnl = (entry_price - current_price) * quantity
                
                positions.append({
                    "id": row[0],
                    "market_title": row[1] or "Unknown Market",
                    "market_id": row[2],
                    "platform": row[3],
                    "side": row[4],
                    "entry_price": entry_price,
                    "current_price": current_price,
                    "unrealized_pnl": unrealized_pnl,
                    "strategy": row[7] or "unknown",
                    "quantity": quantity,
                    "entry_time": row[8]
                })
            
            return positions
    
    async def _get_current_price(self, market_id: str, platform: str) -> float:
        """Get current price for a market"""
        async with aiosqlite.connect(MARKET_CACHE_DB) as db:
            cursor = await db.execute("""
                SELECT yes_price FROM markets
                WHERE market_id = ? AND platform = ?
            """, (market_id, platform))
            row = await cursor.fetchone()
            return row[0] if row else 0.5
    
    # ══════════════════════════════════════════════════════════════════════════
    # Trade History Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_trades(
        self, 
        limit: int = 50, 
        offset: int = 0,
        strategy: Optional[str] = None
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Get trade history with pagination"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            # Build query
            where_clause = ""
            params = []
            
            if strategy:
                where_clause = "WHERE scanner_type = ?"
                params.append(strategy)
            
            # Get total count
            count_cursor = await db.execute(
                f"SELECT COUNT(*) FROM trades {where_clause}",
                params
            )
            total = (await count_cursor.fetchone())[0]
            
            # Get trades
            cursor = await db.execute(f"""
                SELECT id, ts, market_title, platform, side, quantity,
                       price, pnl, edge_estimate, scanner_type, status
                FROM trades
                {where_clause}
                ORDER BY ts DESC
                LIMIT ? OFFSET ?
            """, params + [limit, offset])
            rows = await cursor.fetchall()
            
            trades = []
            for row in rows:
                trades.append({
                    "id": row[0],
                    "timestamp": row[1],
                    "market_title": row[2] or "Unknown",
                    "platform": row[3],
                    "side": row[4],
                    "quantity": row[5],
                    "entry_price": row[6],
                    "exit_price": None,  # Would need separate exit tracking
                    "pnl": row[7] or 0.0,
                    "edge_at_entry": row[8] or 0.0,
                    "strategy": row[9] or "unknown",
                    "status": row[10]
                })
            
            return trades, total
    
    # ══════════════════════════════════════════════════════════════════════════
    # Opportunity Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_opportunities(
        self, 
        limit: int = 50,
        acted_on: Optional[bool] = None
    ) -> Tuple[List[Dict[str, Any]], int]:
        """Get opportunity pipeline"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            where_clause = ""
            params = []
            
            if acted_on is not None:
                where_clause = "WHERE acted_on = ?"
                params.append(1 if acted_on else 0)
            
            # Get total
            count_cursor = await db.execute(
                f"SELECT COUNT(*) FROM opportunities {where_clause}",
                params
            )
            total = (await count_cursor.fetchone())[0]
            
            # Get opportunities
            cursor = await db.execute(f"""
                SELECT id, ts, scanner_type, platform, market_id, market_title,
                       side, edge, confidence, acted_on, reasoning
                FROM opportunities
                {where_clause}
                ORDER BY ts DESC
                LIMIT ?
            """, params + [limit])
            rows = await cursor.fetchall()
            
            opportunities = []
            for row in rows:
                # Determine reason not traded
                reason = None
                if not row[9]:  # not acted_on
                    reason = self._infer_reason_not_traded(row)
                
                opportunities.append({
                    "id": row[0],
                    "timestamp": row[1],
                    "scanner_type": row[2],
                    "platform": row[3],
                    "market_id": row[4],
                    "market_title": row[5] or "Unknown",
                    "side": row[6],
                    "edge": row[7] or 0.0,
                    "confidence": row[8] or 0.0,
                    "acted_on": bool(row[9]),
                    "reason_not_traded": reason
                })
            
            return opportunities, total
    
    def _infer_reason_not_traded(self, row: tuple) -> str:
        """Infer why an opportunity wasn't traded"""
        edge = row[7] or 0
        confidence = row[8] or 0
        
        if edge < 0.02:
            return "Edge below minimum"
        if confidence < 0.5:
            return "Low confidence"
        return "Position limit or circuit breaker"
    
    # ══════════════════════════════════════════════════════════════════════════
    # Platform Status Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_platform_status(self) -> List[Dict[str, Any]]:
        """Get connection status for all platforms"""
        # This would normally check actual API connections
        # For now, we return based on config and recent activity
        
        platforms = []
        
        # Check Kalshi (assume connected if we have trades)
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            cursor = await db.execute("""
                SELECT COUNT(*) FROM trades WHERE platform = 'kalshi'
            """)
            kalshi_trades = (await cursor.fetchone())[0]
            
            platforms.append({
                "id": "kalshi",
                "name": "Kalshi",
                "status": "active" if kalshi_trades > 0 else "inactive",
                "balance": PAPER_STARTING_BALANCE if kalshi_trades > 0 else None,
                "message": "Connected" if kalshi_trades > 0 else "No credentials"
            })
        
        # Other platforms (not yet connected)
        for pid, pname in [("polymarket", "Polymarket"), 
                           ("betfair", "Betfair"),
                           ("limitless", "Limitless")]:
            platforms.append({
                "id": pid,
                "name": pname,
                "status": "inactive",
                "balance": None,
                "message": "No credentials"
            })
        
        return platforms
    
    # ══════════════════════════════════════════════════════════════════════════
    # Risk Metrics Queries
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_risk_metrics(self) -> Dict[str, Any]:
        """Get all risk metrics"""
        balance = await self.get_portfolio_balance()
        drawdown = await self.get_drawdown()
        consecutive_losses = await self.get_consecutive_losses()
        hourly_loss = await self.get_hourly_loss()
        
        # Calculate position concentration
        positions = await self.get_active_positions()
        concentration = {}
        total_exposure = 0
        
        for pos in positions:
            platform = pos["platform"]
            value = pos["quantity"] * pos["entry_price"]
            concentration[platform] = concentration.get(platform, 0) + value
            total_exposure += value
        
        # Normalize concentration
        if total_exposure > 0:
            for k in concentration:
                concentration[k] = concentration[k] / balance
        
        return {
            "current_drawdown": drawdown,
            "drawdown_limit": RISK_CONFIG["max_drawdown_pct"],
            "drawdown_pct_of_limit": (drawdown / RISK_CONFIG["max_drawdown_pct"]) * 100 if RISK_CONFIG["max_drawdown_pct"] > 0 else 0,
            "consecutive_losses": consecutive_losses,
            "max_consecutive_losses": RISK_CONFIG["max_consecutive_losses"],
            "hourly_loss": hourly_loss,
            "hourly_loss_cap": balance * RISK_CONFIG["hourly_loss_cap_pct"],
            "hourly_loss_pct_of_cap": (hourly_loss / (balance * RISK_CONFIG["hourly_loss_cap_pct"])) * 100 if balance > 0 else 0,
            "kelly_fraction": RISK_CONFIG["kelly_fraction"],
            "position_concentration": concentration,
            "total_exposure": total_exposure / balance if balance > 0 else 0
        }
    
    # ══════════════════════════════════════════════════════════════════════════
    # ML Model Metrics
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_model_metrics(self) -> Optional[Dict[str, Any]]:
        """Load ML model training metrics"""
        if not TRAINING_METRICS_PATH.exists():
            return None
        
        try:
            with open(TRAINING_METRICS_PATH, 'r') as f:
                data = json.load(f)
            
            return {
                "accuracy": data.get("accuracy", 0),
                "precision": data.get("precision", 0),
                "recall": data.get("recall", 0),
                "f1_score": data.get("f1", 0),
                "roc_auc": data.get("roc_auc", 0),
                "brier_score": data.get("brier_score", 0),
                "trained_at": data.get("metadata", {}).get("trained_at"),
                "sample_count": data.get("metadata", {}).get("n_samples", 0),
                "top_features": data.get("top_features", [])[:10]
            }
        except Exception:
            return None
    
    # ══════════════════════════════════════════════════════════════════════════
    # System Events
    # ══════════════════════════════════════════════════════════════════════════
    
    async def get_system_events(self, limit: int = 50) -> Tuple[List[Dict[str, Any]], int]:
        """Get recent system events"""
        async with aiosqlite.connect(TRADE_LOGS_DB) as db:
            count_cursor = await db.execute("SELECT COUNT(*) FROM system_events")
            total = (await count_cursor.fetchone())[0]
            
            cursor = await db.execute("""
                SELECT id, ts, event_type, details, severity, metadata
                FROM system_events
                ORDER BY ts DESC
                LIMIT ?
            """, (limit,))
            rows = await cursor.fetchall()
            
            events = []
            for row in rows:
                metadata = None
                if row[5]:
                    try:
                        metadata = json.loads(row[5])
                    except:
                        pass
                
                events.append({
                    "id": row[0],
                    "timestamp": row[1],
                    "event_type": row[2],
                    "details": row[3],
                    "severity": row[4],
                    "metadata": metadata
                })
            
            return events, total


# Singleton instance
db_service = DatabaseService()
