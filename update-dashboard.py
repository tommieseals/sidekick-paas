#!/usr/bin/env python3
import re

# Read the file
with open('/Users/tommie/clawd/dashboard/projects.html', 'r') as f:
    content = f.read()

# New card to add
new_card = '''
            <div class="project-card" style="border-left-color: #58A6FF; background: rgba(88, 166, 255, 0.1);">
                <h3>🐙 GitHub Profile Portfolio <span class="badge badge-complete">COMPLETE</span></h3>
                <p><strong>Date:</strong> February 19, 2026</p>
                <p><strong>Profile:</strong> <a href="https://github.com/tommieseals" style="color: #58A6FF;">github.com/tommieseals</a></p>
                <p><strong>Goal:</strong> Create dynamic, auto-updating profile README that showcases work professionally</p>
                <p><strong>Features Added:</strong></p>
                <ul>
                    <li>🐍 <strong>Snake Animation</strong> - Contribution graph eaten by animated snake (every 12h)</li>
                    <li>📊 <strong>3D Contribution Graph</strong> - Rainbow 3D visualization (daily)</li>
                    <li>⏱️ <strong>WakaTime Stats</strong> - Real coding time breakdown by language (daily)</li>
                    <li>🎯 <strong>Animated Header</strong> - Twinkling gradient banner</li>
                    <li>🏆 <strong>GitHub Trophies</strong> - Achievement badges (real-time)</li>
                    <li>📈 <strong>Stats Cards</strong> - Commits, streak, activity graph (real-time)</li>
                </ul>
                <p><strong>GitHub Actions:</strong> 3 workflows auto-update snake, 3D graph, WakaTime</p>
                <p><strong>WakaTime:</strong> API key stored as repo secret, plugin installed in editor</p>
                <p><strong>Status:</strong> All workflows running ✅</p>
                <p><strong>Files:</strong> ~/clawd/github-profile-upgrade/</p>
            </div>

'''

# Insert after 'Recently Completed' section header
if 'GitHub Profile Portfolio' not in content:
    content = content.replace(
        '<div class="project-card" id="project-legion"',
        new_card + '            <div class="project-card" id="project-legion"'
    )
    
    # Write back
    with open('/Users/tommie/clawd/dashboard/projects.html', 'w') as f:
        f.write(content)
    
    print('Dashboard updated with GitHub Profile Portfolio!')
else:
    print('GitHub Profile Portfolio already exists in dashboard')
