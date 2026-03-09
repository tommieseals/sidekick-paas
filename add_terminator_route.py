#!/usr/bin/env python3
import sys

filepath = '/Users/tommie/clawd/dashboard/server.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if already exists
if 'terminator.html' in content:
    print('terminator.html route already exists!')
    sys.exit(0)

# The route to add
new_route = '''    } else if (req.url === '/terminator.html') {
        const html = fs.readFileSync(path.join(__dirname, 'terminator.html'), 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
'''

# Find the 404 handler pattern and insert before it
old_pattern = "    } else {\n        // 404"
if old_pattern in content:
    content = content.replace(old_pattern, new_route + old_pattern)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: terminator.html route added to server.js!')
else:
    print('ERROR: Could not find 404 handler pattern')
    sys.exit(1)
