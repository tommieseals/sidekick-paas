import sqlite3
import redis
import json

conn = sqlite3.connect("/Users/administrator/job-hunter-system/data/legion.db")
c = conn.cursor()

# Get 10 latest qualified jobs
c.execute("""
    SELECT job_id, company, title, url, match_score 
    FROM jobs 
    WHERE status = 'qualified'
    ORDER BY discovered_at DESC 
    LIMIT 10
""")
jobs = c.fetchall()

print(f"Found {len(jobs)} qualified jobs to approve:\n")
for j in jobs:
    print(f"  {j[0]} | {j[1][:25]:<25} | {j[2][:40]:<40} | Score: {j[4]}")

if jobs:
    job_ids = [j[0] for j in jobs]
    placeholders = ','.join('?' * len(job_ids))
    c.execute(f"UPDATE jobs SET status = 'approved' WHERE job_id IN ({placeholders})", job_ids)
    conn.commit()
    print(f"\n✅ Approved {len(jobs)} jobs in SQLite")
    
    # Also add to Redis queue
    try:
        r = redis.Redis(host='localhost', port=6379, db=0)
        for j in jobs:
            task = {
                'job_id': j[0],
                'company': j[1],
                'title': j[2],
                'url': j[3]
            }
            r.sadd('pipeline:approved', j[0])
            r.rpush('queue:submission', json.dumps(task))
        print(f"✅ Added {len(jobs)} jobs to Redis submission queue")
    except Exception as e:
        print(f"⚠️ Redis not available: {e}")

conn.close()
