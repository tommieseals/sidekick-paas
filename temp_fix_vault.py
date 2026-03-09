import os

with open("/tmp/vault-good.html", "r") as f:
    good_content = f.read()

info_section = '''
    <style>
        .info-section { max-width: 1400px; margin: 2rem auto; padding: 0 2rem 2rem; }
        .info-section h2 { text-align: center; margin-bottom: 2rem; color: #fff; font-size: 1.8rem; }
        .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .info-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transition: transform 0.3s, box-shadow 0.3s; }
        .info-card:hover { transform: translateY(-5px); box-shadow: 0 15px 50px rgba(0,0,0,0.3); }
        .info-card-header { height: 8px; }
        .info-card-body { padding: 1.5rem; text-align: center; }
        .info-card-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem; }
        .info-card-value { font-size: 1.8rem; font-weight: 800; color: #1a202c; margin-bottom: 0.25rem; }
        .info-card-label { color: #718096; font-size: 0.9rem; font-weight: 500; }
        .info-card-change { margin-top: 0.75rem; font-size: 0.85rem; font-weight: 600; }
        .info-card-change.positive { color: #48bb78; }
        .info-card-change.negative { color: #e53e3e; }
        .info-card-change.neutral { color: #718096; }
        .strategy-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .strategy-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.15); transition: transform 0.3s; }
        .strategy-card:hover { transform: translateY(-3px); }
        .strategy-card-header { height: 6px; }
        .strategy-card-body { padding: 1rem; text-align: center; }
        .strategy-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .strategy-name { font-size: 0.85rem; font-weight: 700; color: #1a202c; margin-bottom: 0.25rem; }
        .strategy-status { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.7rem; font-weight: 600; }
        .strategy-status.active { background: rgba(72, 187, 120, 0.2); color: #276749; }
        .strategy-status.paused { background: rgba(237, 137, 54, 0.2); color: #c05621; }
        .strategy-pnl { font-size: 0.8rem; font-weight: 600; margin-top: 0.5rem; }
        .strategy-pnl.positive { color: #48bb78; }
        .strategy-pnl.neutral { color: #718096; }
        .risk-panel { background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        .risk-panel-title { color: #fff; font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; text-align: center; }
        .risk-meters { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1.5rem; }
        .risk-meter { text-align: center; flex: 1; min-width: 150px; }
        .risk-meter-label { color: #a0aec0; font-size: 0.85rem; margin-bottom: 0.5rem; }
        .risk-meter-bar { height: 12px; background: #4a5568; border-radius: 6px; overflow: hidden; margin-bottom: 0.5rem; }
        .risk-meter-fill { height: 100%; border-radius: 6px; transition: width 0.5s; }
        .risk-meter-fill.green { background: linear-gradient(90deg, #48bb78, #38a169); }
        .risk-meter-fill.yellow { background: linear-gradient(90deg, #ecc94b, #d69e2e); }
        .risk-meter-fill.red { background: linear-gradient(90deg, #f56565, #e53e3e); }
        .risk-meter-value { color: #fff; font-size: 1.1rem; font-weight: 700; }
        .trades-section { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .trades-header { background: linear-gradient(135deg, #38a169, #48bb78); padding: 1rem 1.5rem; }
        .trades-title { color: #fff; font-size: 1.1rem; font-weight: 700; }
        .trades-list { padding: 1rem; }
        .no-trades { text-align: center; padding: 2rem; color: #a0aec0; }
        @media (max-width: 1200px) { .info-grid { grid-template-columns: repeat(2, 1fr); } .strategy-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .info-section { padding: 0 1rem 2rem; } .info-grid { grid-template-columns: 1fr; } .strategy-grid { grid-template-columns: repeat(2, 1fr); } .risk-meters { flex-direction: column; } }
    </style>

    <div class="info-section">
        <h2>📊 Portfolio Dashboard</h2>
        <div class="info-grid">
            <div class="info-card">
                <div class="info-card-header" style="background: linear-gradient(135deg, #48bb78, #38a169);"></div>
                <div class="info-card-body">
                    <div class="info-card-icon" style="background: rgba(72, 187, 120, 0.15);">💰</div>
                    <div class="info-card-value">$10,000</div>
                    <div class="info-card-label">Portfolio Value</div>
                    <div class="info-card-change neutral">Sandbox Mode</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-header" style="background: linear-gradient(135deg, #667eea, #764ba2);"></div>
                <div class="info-card-body">
                    <div class="info-card-icon" style="background: rgba(102, 126, 234, 0.15);">📈</div>
                    <div class="info-card-value">$0.00</div>
                    <div class="info-card-label">Daily P&L</div>
                    <div class="info-card-change neutral">0.00%</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-header" style="background: linear-gradient(135deg, #ed8936, #f6ad55);"></div>
                <div class="info-card-body">
                    <div class="info-card-icon" style="background: rgba(237, 137, 54, 0.15);">📊</div>
                    <div class="info-card-value">0</div>
                    <div class="info-card-label">Open Positions</div>
                    <div class="info-card-change neutral">No exposure</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-header" style="background: linear-gradient(135deg, #e94560, #ff6b6b);"></div>
                <div class="info-card-body">
                    <div class="info-card-icon" style="background: rgba(233, 69, 96, 0.15);">⚡</div>
                    <div class="info-card-value">0</div>
                    <div class="info-card-label">Trades Today</div>
                    <div class="info-card-change neutral">Limit: 50/day</div>
                </div>
            </div>
        </div>

        <h2 style="font-size: 1.3rem; margin-bottom: 1rem;">🎯 Strategy Status</h2>
        <div class="strategy-grid">
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #3182CE, #2B6CB0);"></div><div class="strategy-card-body"><div class="strategy-icon">💎</div><div class="strategy-name">Deep Value</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #9F7AEA, #805AD5);"></div><div class="strategy-card-body"><div class="strategy-icon">📈</div><div class="strategy-name">Volatility</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #38B2AC, #319795);"></div><div class="strategy-card-body"><div class="strategy-icon">🌍</div><div class="strategy-name">Macro</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #ED8936, #DD6B20);"></div><div class="strategy-card-body"><div class="strategy-icon">🚀</div><div class="strategy-name">Momentum</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #E53E3E, #C53030);"></div><div class="strategy-card-body"><div class="strategy-icon">↩️</div><div class="strategy-name">Mean Reversion</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #667EEA, #5A67D8);"></div><div class="strategy-card-body"><div class="strategy-icon">📅</div><div class="strategy-name">Event Arb</div><div class="strategy-status paused">PAUSED</div><div class="strategy-pnl neutral">$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #48BB78, #38A169);"></div><div class="strategy-card-body"><div class="strategy-icon">🔄</div><div class="strategy-name">Sector Rotation</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #D69E2E, #B7791F);"></div><div class="strategy-card-body"><div class="strategy-icon">⚖️</div><div class="strategy-name">Pairs Trading</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #805AD5, #6B46C1);"></div><div class="strategy-card-body"><div class="strategy-icon">📊</div><div class="strategy-name">Options</div><div class="strategy-status paused">PAUSED</div><div class="strategy-pnl neutral">$0.00</div></div></div>
            <div class="strategy-card"><div class="strategy-card-header" style="background: linear-gradient(135deg, #DD6B20, #C05621);"></div><div class="strategy-card-body"><div class="strategy-icon">🧠</div><div class="strategy-name">Sentiment</div><div class="strategy-status active">ACTIVE</div><div class="strategy-pnl positive">+$0.00</div></div></div>
        </div>

        <div class="risk-panel">
            <div class="risk-panel-title">🛡️ Risk Controls Status</div>
            <div class="risk-meters">
                <div class="risk-meter"><div class="risk-meter-label">Daily Loss Limit (3%)</div><div class="risk-meter-bar"><div class="risk-meter-fill green" style="width: 0%;"></div></div><div class="risk-meter-value">0.00% used</div></div>
                <div class="risk-meter"><div class="risk-meter-label">Max Drawdown (15%)</div><div class="risk-meter-bar"><div class="risk-meter-fill green" style="width: 0%;"></div></div><div class="risk-meter-value">0.00% used</div></div>
                <div class="risk-meter"><div class="risk-meter-label">Position Concentration</div><div class="risk-meter-bar"><div class="risk-meter-fill green" style="width: 0%;"></div></div><div class="risk-meter-value">0% max single</div></div>
                <div class="risk-meter"><div class="risk-meter-label">Sector Exposure</div><div class="risk-meter-bar"><div class="risk-meter-fill green" style="width: 0%;"></div></div><div class="risk-meter-value">Diversified</div></div>
            </div>
        </div>

        <div class="trades-section">
            <div class="trades-header"><div class="trades-title">📋 Recent Trades</div></div>
            <div class="trades-list">
                <div class="no-trades">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📭</div>
                    <div>No trades executed yet</div>
                    <div style="font-size: 0.8rem; margin-top: 0.5rem;">Sandbox mode - Paper trading enabled</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
'''

final_content = good_content + info_section
with open("/Users/tommie/clawd/dashboard/project-vault.html", "w") as f:
    f.write(final_content)
print("SUCCESS:", len(final_content), "bytes")
