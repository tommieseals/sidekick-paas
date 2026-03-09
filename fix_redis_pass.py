#!/usr/bin/env python3
import os

# Fix scheduler_hourly.py
scheduler_file = os.path.expanduser("~/job-hunter-system/hub/scheduler_hourly.py")
with open(scheduler_file, "r") as f:
    content = f.read()

content = content.replace('REDIS_PASSWORD = None', 'REDIS_PASSWORD = "jQN/kqK/wdU+aP1VIWdY3WWRCbKrcxz9VMTtiI3/s0M="')

with open(scheduler_file, "w") as f:
    f.write(content)

print("Fixed scheduler_hourly.py")

# Make Redis password persistent
redis_conf = "/opt/homebrew/etc/redis.conf"
password_line = 'requirepass "jQN/kqK/wdU+aP1VIWdY3WWRCbKrcxz9VMTtiI3/s0M="'

try:
    with open(redis_conf, "r") as f:
        conf = f.read()
    if "requirepass" not in conf:
        with open(redis_conf, "a") as f:
            f.write(f"\n{password_line}\n")
        print("Added password to redis.conf")
    else:
        print("redis.conf already has requirepass")
except Exception as e:
    print(f"Could not update redis.conf: {e}")
