#!/usr/bin/env python3
"""
Track resolved markets and calculate actual P&L for TerminatorBot paper trades.
Run daily to check if any markets we bet on have resolved.
"""

import sqlite3
import json
import os
from datetime import datetime
from pathlib import Path

# Config
DB_PATH = Path(__file__).parent / "data" / "trade_logs.db"
RESULTS_PATH = Path(__file__).parent / "data" / "resolved_trades.json"

def get_open_positions():
    """Get all unique markets we have paper positions in."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT market_id, market_title, side, SUM(quantity) as total_qty, 
               AVG(price) as avg_price, SUM(quantity * price) as total_cost
        FROM trades 
        WHERE status = 'FILLED'
        GROUP BY market_id, side
    """)
    
    positions = []
    for row in cursor.fetchall():
        market_id, title, side, qty, avg_price, cost = row
        positions.append({
            'market_id': market_id,
            'title': title,
            'side': side,
            'quantity': qty,
            'avg_price': avg_price,
            'cost': cost,
            'potential_profit': qty * (1 - avg_price) if side == 'yes' else qty * avg_price
        })
    
    conn.close()
    return positions

def load_resolved():
    """Load previously resolved markets."""
    if RESULTS_PATH.exists():
        with open(RESULTS_PATH) as f:
            return json.load(f)
    return {'resolved': [], 'total_pnl': 0, 'last_check': None}

def save_resolved(data):
    """Save resolved markets data."""
    with open(RESULTS_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def generate_report():
    """Generate P&L report."""
    positions = get_open_positions()
    resolved_data = load_resolved()
    
    print("=" * 60)
    print("TERMINATORBOT P&L REPORT")
    print("Generated: {}".format(datetime.now().strftime('%Y-%m-%d %H:%M')))
    print("=" * 60)
    
    # Open positions
    print("\n[OPEN POSITIONS - Pending Resolution]")
    print("-" * 60)
    total_cost = 0
    total_potential = 0
    
    for pos in positions:
        print("\n{}...".format(pos['title'][:50]))
        print("  Side: {} | Qty: {:,.0f}".format(pos['side'].upper(), pos['quantity']))
        print("  Avg Price: ${:.4f} | Cost: ${:,.2f}".format(pos['avg_price'], pos['cost']))
        print("  Potential Profit: ${:,.2f}".format(pos['potential_profit']))
        total_cost += pos['cost']
        total_potential += pos['potential_profit']
    
    print("\n" + "-" * 60)
    print("Total Invested: ${:,.2f}".format(total_cost))
    print("Total Potential (if all win): ${:,.2f}".format(total_potential))
    if total_cost > 0:
        print("Potential ROI: {:.1f}%".format((total_potential/total_cost)*100))
    
    # Resolved positions
    if resolved_data['resolved']:
        print("\n\n[RESOLVED POSITIONS]")
        print("-" * 60)
        for res in resolved_data['resolved']:
            status = "WON" if res['won'] else "LOST"
            print("{}... {} | P&L: ${:+,.2f}".format(res['title'][:40], status, res['pnl']))
        
        print("\nTotal Realized P&L: ${:+,.2f}".format(resolved_data['total_pnl']))
    else:
        print("\n\n[No markets resolved yet]")
    
    print("\n" + "=" * 60)
    
    return {
        'open_positions': len(positions),
        'total_invested': total_cost,
        'total_potential': total_potential,
        'realized_pnl': resolved_data['total_pnl'],
        'resolved_count': len(resolved_data['resolved'])
    }

if __name__ == "__main__":
    report = generate_report()
    print("\nSummary: {} open, {} resolved, ${:+,.2f} realized P&L".format(
        report['open_positions'], report['resolved_count'], report['realized_pnl']))
