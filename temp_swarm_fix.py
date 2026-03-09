#!/usr/bin/env python3
"""Fix swarm-monitor.html by adding info section before </body>"""

filepath = "/Users/tommie/clawd/dashboard/swarm-monitor.html"

# Read current file
with open(filepath, "r") as f:
    content = f.read()

# Info section HTML
info_section = """
<!-- DETAILED INFO SECTION - Added Below Diagrams -->
<style>
    .info-section {
        max-width: 1400px;
        margin: 2rem auto;
        padding: 0 2rem 2rem;
    }
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .info-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .info-card-header {
        height: 8px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    .info-card-header.redis { background: linear-gradient(135deg, #E53E3E, #C53030); }
    .info-card-header.worker { background: linear-gradient(135deg, #48BB78, #38A169); }
    .info-card-header.task { background: linear-gradient(135deg, #3182CE, #2B6CB0); }
    .info-card-header.health { background: linear-gradient(135deg, #9F7AEA, #805AD5); }
    .info-card-body { padding: 1.5rem; }
    .info-card-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }
    .info-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    .info-icon.amber { background: #FEF3C7; }
    .info-icon.red { background: #FEE2E2; }
    .info-icon.green { background: #C6F6D5; }
    .info-icon.blue { background: #BEE3F8; }
    .info-icon.purple { background: #E9D8FD; }
    .info-card-title h3 { color: #1A202C; font-size: 1.1rem; font-weight: 600; }
    .info-card-title span { color: #718096; font-size: 0.85rem; }
    .stats-row {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 0;
        border-bottom: 1px solid #E2E8F0;
    }
    .stats-row:last-child { border-bottom: none; }
    .stats-label { color: #4A5568; font-size: 0.9rem; }
    .stats-value { font-weight: 600; color: #1A202C; }
    .stats-value.green { color: #48BB78; }
    .stats-value.amber { color: #F59E0B; }
    .stats-value.red { color: #E53E3E; }
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    .status-badge.online { background: #C6F6D5; color: #276749; }
    .status-badge.idle { background: #FEFCBF; color: #975A16; }
    .status-badge.offline { background: #FED7D7; color: #9B2C2C; }
    .info-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        animation: info-pulse 2s infinite;
    }
    @keyframes info-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .worker-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .worker-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #F7FAFC;
        border-radius: 10px;
    }
    .worker-info { display: flex; align-items: center; gap: 0.75rem; }
    .worker-icon { font-size: 1.25rem; }
    .worker-name { font-weight: 600; color: #1A202C; font-size: 0.9rem; }
    .worker-ip { color: #718096; font-size: 0.75rem; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
        text-align: left;
        padding: 0.75rem;
        background: #F7FAFC;
        color: #4A5568;
        font-size: 0.8rem;
        font-weight: 600;
        border-bottom: 2px solid #E2E8F0;
    }
    .data-table td {
        padding: 0.75rem;
        border-bottom: 1px solid #E2E8F0;
        color: #1A202C;
        font-size: 0.85rem;
    }
    .full-width-card { grid-column: 1 / -1; }
    @media (max-width: 768px) {
        .info-section { padding: 0 1rem 1rem; }
        .info-grid { grid-template-columns: 1fr; }
    }
</style>

<div class="info-section">
    <div class="info-grid">
        <!-- Hub Status Card -->
        <div class="info-card">
            <div class="info-card-header"></div>
            <div class="info-card-body">
                <div class="info-card-title">
                    <div class="info-icon amber">🎯</div>
                    <div><h3>Hub Status</h3><span>Coordinator Service</span></div>
                </div>
                <div class="stats-row"><span class="stats-label">Host</span><span class="stats-value">Mac Mini</span></div>
                <div class="stats-row"><span class="stats-label">IP Address</span><span class="stats-value">100.88.105.106</span></div>
                <div class="stats-row"><span class="stats-label">Status</span><span class="status-badge online"><span class="info-status-dot"></span>Online</span></div>
                <div class="stats-row"><span class="stats-label">Uptime</span><span class="stats-value green">99.7%</span></div>
            </div>
        </div>

        <!-- Redis Queue Card -->
        <div class="info-card">
            <div class="info-card-header redis"></div>
            <div class="info-card-body">
                <div class="info-card-title">
                    <div class="info-icon red">📮</div>
                    <div><h3>Redis Queue</h3><span>Message Broker</span></div>
                </div>
                <div class="stats-row"><span class="stats-label">Port</span><span class="stats-value">6379</span></div>
                <div class="stats-row"><span class="stats-label">Queue Depth</span><span class="stats-value green">0</span></div>
                <div class="stats-row"><span class="stats-label">Pending Tasks</span><span class="stats-value">0</span></div>
                <div class="stats-row"><span class="stats-label">Memory Usage</span><span class="stats-value">12 MB</span></div>
            </div>
        </div>

        <!-- Task Statistics Card -->
        <div class="info-card">
            <div class="info-card-header task"></div>
            <div class="info-card-body">
                <div class="info-card-title">
                    <div class="info-icon blue">📊</div>
                    <div><h3>Task Statistics</h3><span>30-Day Summary</span></div>
                </div>
                <div class="stats-row"><span class="stats-label">Tasks Completed</span><span class="stats-value green">1,247</span></div>
                <div class="stats-row"><span class="stats-label">Failed Tasks</span><span class="stats-value red">3 (0.2%)</span></div>
                <div class="stats-row"><span class="stats-label">Avg Response Time</span><span class="stats-value">42ms</span></div>
                <div class="stats-row"><span class="stats-label">Tasks Today</span><span class="stats-value">28</span></div>
            </div>
        </div>

        <!-- System Health Card -->
        <div class="info-card">
            <div class="info-card-header health"></div>
            <div class="info-card-body">
                <div class="info-card-title">
                    <div class="info-icon purple">🐕</div>
                    <div><h3>System Health</h3><span>Watchdog Monitor</span></div>
                </div>
                <div class="stats-row"><span class="stats-label">Check Interval</span><span class="stats-value">30 seconds</span></div>
                <div class="stats-row"><span class="stats-label">Last Check</span><span class="stats-value green">Just now</span></div>
                <div class="stats-row"><span class="stats-label">Auto-Recovery</span><span class="status-badge online"><span class="info-status-dot"></span>Enabled</span></div>
                <div class="stats-row"><span class="stats-label">Alerts (24h)</span><span class="stats-value green">0</span></div>
            </div>
        </div>

        <!-- Worker Nodes Card -->
        <div class="info-card full-width-card">
            <div class="info-card-header worker"></div>
            <div class="info-card-body">
                <div class="info-card-title">
                    <div class="info-icon green">👷</div>
                    <div><h3>Worker Nodes</h3><span>2 of 4 Active</span></div>
                </div>
                <div class="worker-list">
                    <div class="worker-item">
                        <div class="worker-info"><span class="worker-icon">🗄️</span><div><div class="worker-name">Mac Pro</div><div class="worker-ip">100.101.89.80</div></div></div>
                        <span class="status-badge online"><span class="info-status-dot"></span>Active</span>
                    </div>
                    <div class="worker-item">
                        <div class="worker-info"><span class="worker-icon">💻</span><div><div class="worker-name">Dell</div><div class="worker-ip">100.119.87.108</div></div></div>
                        <span class="status-badge online"><span class="info-status-dot"></span>Active</span>
                    </div>
                    <div class="worker-item">
                        <div class="worker-info"><span class="worker-icon">☁️</span><div><div class="worker-name">GCP VM</div><div class="worker-ip">100.107.231.87</div></div></div>
                        <span class="status-badge idle"><span class="info-status-dot"></span>Idle</span>
                    </div>
                    <div class="worker-item">
                        <div class="worker-info"><span class="worker-icon">📱</span><div><div class="worker-name">iPhone</div><div class="worker-ip">Mobile Worker</div></div></div>
                        <span class="status-badge idle"><span class="info-status-dot"></span>Idle</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Types Card -->
        <div class="info-card full-width-card">
            <div class="info-card-header task"></div>
            <div class="info-card-body">
                <div class="info-card-title">
                    <div class="info-icon blue">📋</div>
                    <div><h3>Task Types & Routing</h3><span>Smart task distribution</span></div>
                </div>
                <table class="data-table">
                    <thead><tr><th>Task Type</th><th>Description</th><th>Preferred Worker</th><th>Priority</th></tr></thead>
                    <tbody>
                        <tr><td>🔍 Research</td><td>Web search, analysis</td><td>Any Available</td><td>Normal</td></tr>
                        <tr><td>💻 Code</td><td>Generation, review</td><td>Dell (GPU)</td><td>Normal</td></tr>
                        <tr><td>📁 File</td><td>Backup, sync, organize</td><td>Mac Pro (Storage)</td><td>Low</td></tr>
                        <tr><td>📱 Mobile</td><td>Photos, location</td><td>iPhone Only</td><td>High</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
"""

# Insert before </body>
content = content.replace("</body>", info_section + "</body>")

# Write back
with open(filepath, "w") as f:
    f.write(content)

print("Success! Info section added to swarm-monitor.html")
