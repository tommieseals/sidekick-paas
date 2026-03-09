#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/tommie/job-hunter-system')
from shared.state_manager import StateManager

sm = StateManager()
print('Redis connected')
print(f"Approved jobs in pipeline: {sm.redis.scard('pipeline:approved')}")
print(f"Ready for review: {sm.redis.scard('pipeline:ready_for_review')}")

# List a few approved jobs
approved = list(sm.redis.smembers('pipeline:approved'))[:5]
print(f"Sample approved job IDs: {approved}")
