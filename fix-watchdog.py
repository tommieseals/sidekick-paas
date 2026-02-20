#!/usr/bin/env python3
import re

with open('/Users/tommie/dta/watchdog/watchdog.py', 'r') as f:
    content = f.read()

# Add skip_ping after mac_pro's tailscale_ip line
old = '"tailscale_ip": "100.101.89.80",  # CORRECTED IP'
new = '"tailscale_ip": "100.101.89.80",  # CORRECTED IP\n        "skip_ping": True,  # Firewall blocks ICMP'

content = content.replace(old, new)

with open('/Users/tommie/dta/watchdog/watchdog.py', 'w') as f:
    f.write(content)

print('Done - added skip_ping for mac_pro')
