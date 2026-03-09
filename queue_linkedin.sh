#!/bin/bash
cd ~/job-hunter-system
/opt/homebrew/bin/python3 << 'PYTHON'
import redis
import json
import sqlite3

r = redis.Redis(host='100.88.105.106', port=6379, password='jQN/kqK/wdU+aP1VIWdY3WWRCbKrcxz9VMTtiI3/s0M=', decode_responses=True)
conn = sqlite3.connect('data/legion.db')
cursor = conn.cursor()

doc_keys = r.hkeys('document_packages')
queued = 0

for key in doc_keys:
    cursor.execute("SELECT job_id, raw_data, title, company, url, status, platform FROM jobs WHERE job_id = ?", (key,))
    row = cursor.fetchone()
    if row and row[6] == 'linkedin' and row[5] in ('approved', 'ready_for_review'):
        job_id, raw_data, title, company, url, status, platform = row
        job = json.loads(raw_data) if raw_data else {}
        
        task = {
            'type': 'submit_job',
            'job_id': job_id,
            'job': job,
            'priority': 'high'
        }
        r.lpush('queue:submission', json.dumps(task))
        print(f"✅ Queued: {title[:40]} @ {company[:30]}")
        queued += 1

print(f"\n🚀 Queued {queued} LinkedIn jobs")
print(f"📋 Queue depth: {r.llen('queue:submission')}")
PYTHON
