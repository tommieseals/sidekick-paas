#!/usr/bin/env python3
"""Fix Redis connection to use localhost."""

path = '/Users/tommie/clawd/dashboard/server.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Change from remote IP to localhost
old_config = "host: '100.82.234.66'"
new_config = "host: '127.0.0.1'"

if old_config in content:
    content = content.replace(old_config, new_config)
    print('✅ Changed Redis host from 100.82.234.66 to 127.0.0.1 (localhost)')
else:
    print('⚠️ Redis host config not found or already fixed')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
