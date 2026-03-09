import re
import sys

filepath = sys.argv[1] if len(sys.argv) > 1 else '/Users/tommie/clawd/dashboard/index.html'

with open(filepath, 'r') as f:
    content = f.read()

# Find the nav-links section and replace it with complete list
old_nav = re.search(r'<div class="nav-links" id="navLinks">.*?</div>\s*</nav>', content, re.DOTALL)

if old_nav:
    new_nav = '''<div class="nav-links" id="navLinks">
                <a href="index.html" class="nav-link active">Dashboard</a>
                <a href="infrastructure.html" class="nav-link">Infrastructure</a>
                <a href="agents.html" class="nav-link">Agents</a>
                <a href="projects.html" class="nav-link">Projects</a>
                <a href="apis.html" class="nav-link">APIs</a>
                <a href="skills.html" class="nav-link">Skills</a>
                <a href="tools.html" class="nav-link">Tools</a>
                <a href="achievements.html" class="nav-link">Achievements</a>
                <a href="shared-brain.html" class="nav-link">🧠 Brain</a>
                <a href="swarm-monitor.html" class="nav-link">🐝 Swarm</a>
                <a href="arbitrage-pharma.html" class="nav-link">💊 Pharma</a>
                <a href="terminator.html" class="nav-link">🤖 Terminator</a>
                <a href="project-vault.html" class="nav-link">💰 Vault</a>
                <a href="fort-knox.html" class="nav-link">🏦 Fort Knox</a>
                <a href="legion-tracker.html" class="nav-link">🎖️ Legion</a>
                <a href="legion.html" class="nav-link">⚔️ Legion HQ</a>
                <a href="fraud-detection.html" class="nav-link">🛡️ Fraud</a>
                <a href="n8n-hub.html" class="nav-link">⚡ n8n</a>
                <a href="fiverr.html" class="nav-link">🛒 Fiverr</a>
                <a href="borbott-army.html" class="nav-link">📚 KDP</a>
                <a href="tascosaur.html" class="nav-link">🦖 Tascosaur</a>
                <a href="taskbot.html" class="nav-link">📋 TaskBot</a>
                <a href="teams-translator.html" class="nav-link">🌐 Translator</a>
                <a href="sidekick-paas.html" class="nav-link">🦸 Sidekick</a>
                <a href="memory.html" class="nav-link">🧬 Memory</a>
                <a href="sessions.html" class="nav-link">💬 Sessions</a>
                <a href="a2a-server.html" class="nav-link">🔗 A2A</a>
                <a href="docs.html" class="nav-link">Docs</a>
            </div>
        </nav>'''
    
    content = content[:old_nav.start()] + new_nav + content[old_nav.end():]
    
    with open(filepath, 'w') as f:
        f.write(content)
    print('Nav updated with all React pages!')
else:
    print('Could not find nav-links section')
