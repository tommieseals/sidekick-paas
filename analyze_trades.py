import sqlite3
import os
from collections import defaultdict

os.chdir(r'C:\Users\tommi\clawd\TerminatorBot')

conn = sqlite3.connect('data/trade_logs.db')
cursor = conn.cursor()

# Check schema first
cursor.execute("PRAGMA table_info(trades)")
columns = cursor.fetchall()
print("Trades table columns:")
for col in columns:
    print(f"  {col}")

# Get all trades with correct column names
cursor.execute("SELECT * FROM trades ORDER BY id")
trades = cursor.fetchall()

print(f"\n=== TERMINATORBOT PAPER TRADE ANALYSIS ===\n")
print(f"Total paper trades logged: {len(trades)}")

# Trades structure based on what we saw:
# (id, created_at, platform, ticker, title, side, qty, price, strategy, order_id, status, pnl, edge, ???)

# Group by unique market/title
markets = defaultdict(list)
strategy_stats = defaultdict(lambda: {'count': 0, 'cost': 0, 'edge_sum': 0})

for trade in trades:
    id_, created_at, platform, ticker, title, side, qty, price, strategy, order_id, status, pnl, edge, _ = trade
    cost = qty * price
    
    markets[title].append({
        'date': created_at,
        'side': side,
        'qty': qty,
        'price': price,
        'strategy': strategy,
        'cost': cost,
        'edge': edge
    })
    
    strategy_stats[strategy]['count'] += 1
    strategy_stats[strategy]['cost'] += cost
    if edge:
        strategy_stats[strategy]['edge_sum'] += edge

print(f"Unique markets traded: {len(markets)}\n")

print("=== BY STRATEGY ===")
total_invested = 0
for strategy, stats in sorted(strategy_stats.items()):
    avg_edge = stats['edge_sum'] / stats['count'] * 100 if stats['count'] > 0 else 0
    print(f"{strategy}: {stats['count']} trades, ${stats['cost']:,.2f} invested, avg edge: {avg_edge:.1f}%")
    total_invested += stats['cost']

print(f"\nTotal paper capital deployed: ${total_invested:,.2f}")

# Calculate potential profit
print("\n=== POTENTIAL PROFIT ANALYSIS ===")
total_potential = 0
for market, trade_list in markets.items():
    for t in trade_list:
        if t['side'] == 'yes':
            potential_profit = t['qty'] * (1 - t['price'])
            total_potential += potential_profit
        else:  # 'no' side
            potential_profit = t['qty'] * (1 - t['price'])
            total_potential += potential_profit

print(f"If all bets resolve correctly: ${total_potential:,.2f} potential profit")
if total_invested > 0:
    print(f"Potential ROI: {(total_potential/total_invested)*100:.1f}%")

# Show markets being traded
print("\n=== TOP 10 MARKETS TRADED ===")
for i, (title, trade_list) in enumerate(sorted(markets.items(), key=lambda x: sum(t['cost'] for t in x[1]), reverse=True)[:10]):
    total_cost = sum(t['cost'] for t in trade_list)
    avg_edge = sum(t['edge'] for t in trade_list if t['edge']) / len([t for t in trade_list if t['edge']]) * 100 if any(t['edge'] for t in trade_list) else 0
    print(f"\n{i+1}. {title[:70]}")
    print(f"   Trades: {len(trade_list)} | Cost: ${total_cost:,.2f} | Avg Edge: {avg_edge:.1f}%")

conn.close()
