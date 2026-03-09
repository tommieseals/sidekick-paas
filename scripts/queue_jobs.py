#!/usr/bin/env python3
"""Add approved jobs to Redis queue"""
import sqlite3
import redis
import json

conn = sqlite3.connect("/Users/administrator/job-hunter-system/data/legion.db")
c = conn.cursor()

# Get approved jobs
c.execute("""
    SELECT job_id, company, title, url, platform
    FROM jobs 
    WHERE status = 'approved'
    ORDER BY discovered_at DESC
""")
jobs = c.fetchall()
conn.close()

print(f"Found {len(jobs)} approved jobs")

# Add to Redis
r = redis.Redis(host='localhost', port=6379, db=0)

# Clear old queue
r.delete('pipeline:approved')
r.delete('queue:submission')

for j in jobs:
    task = {
        'job_id': j[0],
        'company': j[1],
        'title': j[2],
        'url': j[3],
        'platform': j[4]
    }
    r.sadd('pipeline:approved', j[0])
    r.rpush('queue:submission', json.dumps(task))

print(f"✅ Queued {len(jobs)} jobs to Redis")
print(f"   pipeline:approved: {r.scard('pipeline:approved')}")
print(f"   queue:submission: {r.llen('queue:submission')}")
