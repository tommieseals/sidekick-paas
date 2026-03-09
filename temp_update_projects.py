#!/usr/bin/env python3
"""Update projects.html with current project status - March 2026"""
import re

PROJECTS_FILE = '/Users/tommie/clawd/dashboard/projects.html'

# New Currently Working On section
CURRENT_FOCUS = '''        <!-- Current Focus -->
        <div class="card">
            <h2>🎯 Currently Working On</h2>
            <div class="project-card current-focus">
                <h3>🏴 PROJECT LEGION - Comet MCP Integration <span class="badge badge-in-progress">IN PROGRESS</span></h3>
                <p><strong>Status:</strong> Comet MCP integration in progress</p>
                <p><strong>Progress:</strong> CDP connection working, LinkedIn navigation working, Text injection working</p>
                <p><strong>Remaining:</strong> Fix sidecar input submission</p>
                <p><strong>Victory:</strong> First submission 2026-03-02 (Golden 1 Credit Union)</p>
                <p><strong>Database:</strong> 1,809 approved, 457 ready for review, 242 discovered</p>
            </div>
            
            <div class="project-card" style="border-left-color: #10b981;">
                <h3>💰 Project Vault - LIVE TRADING <span class="badge badge-complete">LIVE</span></h3>
                <p><strong>Equity:</strong> $104,282.36 | <strong>Buying Power:</strong> $64,944.20</p>
                <p><strong>Positions:</strong> AAPL, AMD, NVDA, TSLA, MSTR, QQQ, SPY, DIA, IWM, XLK</p>
                <p><strong>Schedule:</strong> 3x daily (weekdays) - 8:30 AM, 11:00 AM, 2:30 PM</p>
                <p><strong>Live URL:</strong> <a href="/project-vault.html" style="color: #fbbf24;">Dashboard Page</a></p>
            </div>
            
            <div class="project-card" style="border-left-color: #8b5cf6;">
                <h3>🤖 TerminatorBot - Prediction Markets <span class="badge badge-in-progress">OPERATIONAL</span></h3>
                <p><strong>Balance:</strong> $10,000 (Kalshi paper trading)</p>
                <p><strong>Schedule:</strong> 4x daily scans (8:30 AM, 2:30 PM, 8:30 PM, 2:30 AM)</p>
                <p><strong>Latest:</strong> 500 markets scanned, 318 opportunities found, 32% max edge</p>
                <p><strong>Live URL:</strong> <a href="/terminator.html" style="color: #fbbf24;">Dashboard Page</a></p>
            </div>
            
            <div class="project-card" style="border-left-color: #f59e0b;">
                <h3>💊 Arbitrage Pharma - Outreach Phase <span class="badge badge-in-progress">IN PROGRESS</span></h3>
                <p><strong>Pipeline:</strong> 13 deals, $3.53B probability-weighted value</p>
                <p><strong>Outreach:</strong> 1 email sent (Healx - Dr. Mark Youssef), 5 pending</p>
                <p><strong>Live URL:</strong> <a href="/arbitrage-pharma.html" style="color: #fbbf24;">Dashboard Page</a></p>
            </div>
        </div>

        <!-- Live Sites -->
        <div class="card">
            <h2>🌐 Live Sites and External Links</h2>
            <div class="project-card" style="border-left-color: #3b82f6;">
                <h3>📊 GitHub Portfolio <span class="badge badge-complete">36 REPOS</span></h3>
                <p><strong>Profile:</strong> <a href="https://github.com/tommieseals" target="_blank" style="color: #fbbf24;">github.com/tommieseals</a></p>
                <p><strong>Highlights:</strong> ai-portfolio, trading-vault, clawd-dashboard, infra-scripts, agent-swarm</p>
            </div>
            <div class="project-card" style="border-left-color: #22c55e;">
                <h3>🚀 TaskBot - Power Automate <span class="badge badge-complete">LIVE</span></h3>
                <p><strong>Live Site:</strong> <a href="https://tommieseals.github.io/taskbot-power-automate/" target="_blank" style="color: #fbbf24;">tommieseals.github.io/taskbot-power-automate</a></p>
                <p><strong>Features:</strong> Enterprise automation platform with GPT-4 AI builder</p>
            </div>
        </div>'''

# Read file
with open(PROJECTS_FILE, 'r') as f:
    content = f.read()

# Find the Current Focus section and replace it
pattern = r'<!-- Current Focus -->.*?</div>\s*</div>\s*</div>'
if re.search(pattern, content, re.DOTALL):
    new_content = re.sub(pattern, CURRENT_FOCUS, content, flags=re.DOTALL)
    with open(PROJECTS_FILE, 'w') as f:
        f.write(new_content)
    print('Updated Current Focus section in projects.html')
else:
    print('Could not find Current Focus section to replace')
    # Try inserting after nav-bar
    pattern = r'(</nav>)'
    new_content = re.sub(pattern, r'\1\n' + CURRENT_FOCUS, content)
    with open(PROJECTS_FILE, 'w') as f:
        f.write(new_content)
    print('Inserted new sections after nav')
