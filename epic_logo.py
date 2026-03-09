#!/usr/bin/env python3
"""Epic Skynet logo implementation for dashboard."""

path = '/Users/tommie/clawd/dashboard/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Epic CSS for Skynet logo
epic_css = '''
        /* SKYNET EPIC LOGO STYLES */
        .skynet-logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .skynet-logo {
            height: 80px;
            filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))
                    drop-shadow(0 0 20px rgba(0, 255, 255, 0.4))
                    drop-shadow(0 0 30px rgba(255, 0, 100, 0.3));
            transition: all 0.3s ease;
            animation: logo-pulse 3s ease-in-out infinite;
        }
        
        .skynet-logo:hover {
            height: 90px;
            filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.9))
                    drop-shadow(0 0 30px rgba(0, 255, 255, 0.6))
                    drop-shadow(0 0 45px rgba(255, 0, 100, 0.5));
        }
        
        @keyframes logo-pulse {
            0%, 100% { 
                filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))
                        drop-shadow(0 0 20px rgba(0, 255, 255, 0.4))
                        drop-shadow(0 0 30px rgba(255, 0, 100, 0.3));
            }
            50% { 
                filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.9))
                        drop-shadow(0 0 25px rgba(0, 255, 255, 0.5))
                        drop-shadow(0 0 35px rgba(255, 0, 100, 0.4));
            }
        }
        
        .skynet-title {
            font-family: 'Orbitron', 'Courier New', monospace;
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(90deg, #00ffff, #ff0066);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: none;
            letter-spacing: 3px;
            text-transform: uppercase;
        }
        
        @media (max-width: 768px) {
            .skynet-logo { height: 60px; }
            .skynet-logo:hover { height: 65px; }
            .skynet-title { font-size: 1.2rem; letter-spacing: 2px; }
        }
        
        @media (max-width: 480px) {
            .skynet-logo { height: 50px; }
            .skynet-title { display: none; }
        }
'''

# New nav-brand HTML
new_brand_html = '''<div class="nav-brand">
                <a href="/" class="skynet-logo-container">
                    <img src="/skynet_loading.gif" alt="Skynet" class="skynet-logo">
                    <span class="skynet-title">Neural Net</span>
                </a>'''

# Add Google Font for Orbitron (cyberpunk font)
font_link = '<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet">'

# Insert font link after charset meta
if 'Orbitron' not in content:
    content = content.replace('<meta charset="UTF-8">', f'<meta charset="UTF-8">\n    {font_link}')
    print('✅ Added Orbitron font')

# Insert epic CSS before </style>
if 'SKYNET EPIC LOGO' not in content:
    content = content.replace('</style>', epic_css + '\n    </style>')
    print('✅ Added epic CSS styles')

# Replace nav-brand
import re
pattern = r'<div class="nav-brand">.*?(?=</div>\s*<button class="hamburger"|</div>\s*<div class="nav-links")'
match = re.search(pattern, content, re.DOTALL)
if match:
    content = content[:match.start()] + new_brand_html + content[match.end():]
    print('✅ Replaced nav-brand with epic Skynet branding')
else:
    print('⚠️ Could not find nav-brand pattern')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('\\n🔥 SKYNET EPIC LOGO INSTALLED!')
print('Features:')
print('  • 80px logo with cyan/magenta glow')
print('  • Pulsing animation effect')
print('  • Hover zoom + intensified glow')
print('  • Orbitron cyberpunk font')
print('  • "Neural Net" subtitle')
print('  • Responsive sizing for mobile')
