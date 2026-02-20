#!/usr/bin/env python3
import json
with open('/Users/tommie/dta/watchdog/state.json', 'w') as f:
    json.dump({"failures": {"mac_pro": 0, "dell": 0}, "last_recovery": {}, "last_alert": {}}, f, indent=2)
print('State reset to zero failures')
