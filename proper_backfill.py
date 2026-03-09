#!/usr/bin/env python3
"""Properly backfill approved jobs with full job data."""
import sys
import json
sys.path.insert(0, '/Users/tommie/job-hunter-system')
from shared.state_manager import StateManager

sm = StateManager()

# Get all approved jobs from pipeline
approved_job_ids = list(sm.redis.smembers('pipeline:approved'))
print(f"Found {len(approved_job_ids)} approved jobs")

# Clear existing bad queue
queue_len = sm.redis.llen('queue:submission')
if queue_len > 0:
    print(f"Clearing {queue_len} malformed tasks from queue...")
    sm.redis.delete('queue:submission')

# Re-queue with full job data
queued = 0
errors = 0

for job_id in approved_job_ids[:50]:  # Start with 50 jobs
    try:
        # Get full job data from Redis
        job_data = sm.redis.hget('jobs', job_id)
        if not job_data:
            print(f"  ⚠️ No job data for {job_id}, skipping")
            errors += 1
            continue
        
        job = json.loads(job_data)
        
        # Create proper task with full job data
        task = {
            "type": "submit_job",
            "job_id": job_id,
            "job": job  # Include full job data!
        }
        
        sm.redis.lpush('queue:submission', json.dumps(task))
        queued += 1
        
        if queued <= 5:
            print(f"  ✅ Queued: {job.get('title', 'Unknown')[:50]} @ {job.get('company', 'Unknown')}")
    
    except Exception as e:
        print(f"  ❌ Error with {job_id}: {e}")
        errors += 1

print(f"\n🎉 Queued {queued} jobs with full data")
print(f"⚠️ Errors: {errors}")
print(f"📊 Queue length: {sm.redis.llen('queue:submission')}")
