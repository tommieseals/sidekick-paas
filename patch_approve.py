#!/usr/bin/env python3
"""Patch legion-api-server.py to sync approvals to Redis."""

path = '/Users/tommie/clawd/dashboard/legion-api-server.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add redis import after other imports
old_imports = '''import threading

# Configuration'''

new_imports = '''import threading
import redis

# Configuration'''

if 'import redis' not in content:
    content = content.replace(old_imports, new_imports)
    print('✅ Added redis import')

# 2. Add Redis client after PORT config
old_config = '''PORT = 8080

def get_db_connection():'''

new_config = '''PORT = 8080

# Redis connection for pipeline sync
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379
REDIS_PASSWORD = 'jQN/kqK/wdU+aP1VIWdY3WWRCbKrcxz9VMTtiI3/s0M='

def get_redis_client():
    """Get Redis connection"""
    return redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASSWORD,
        decode_responses=True
    )

def get_db_connection():'''

if 'get_redis_client' not in content:
    content = content.replace(old_config, new_config)
    print('✅ Added Redis client function')

# 3. Modify approve_job to sync to Redis
old_approve = '''def approve_job(job_id, action):
    """Approve or reject a job"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if action == "approve":
        new_status = "approved"
    elif action == "reject":
        new_status = "rejected"
    else:
        conn.close()
        return {"success": False, "error": "Invalid action"}
    
    cursor.execute("UPDATE jobs SET status = ?, updated_at = ? WHERE job_id = ?", 
                   (new_status, datetime.now().isoformat(), job_id))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    
    return {"success": affected > 0, "job_id": job_id, "new_status": new_status}'''

new_approve = '''def approve_job(job_id, action):
    """Approve or reject a job - syncs to both SQLite AND Redis"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if action == "approve":
        new_status = "approved"
    elif action == "reject":
        new_status = "rejected"
    else:
        conn.close()
        return {"success": False, "error": "Invalid action"}
    
    # Update SQLite
    cursor.execute("UPDATE jobs SET status = ?, updated_at = ? WHERE job_id = ?", 
                   (new_status, datetime.now().isoformat(), job_id))
    conn.commit()
    affected = cursor.rowcount
    
    # Sync to Redis if approved
    if action == "approve" and affected > 0:
        try:
            r = get_redis_client()
            # Move job to approved set in pipeline
            r.srem('pipeline:ready_for_review', job_id)
            r.sadd('pipeline:approved', job_id)
            # Queue for submission
            task = json.dumps({
                "type": "submit_job",
                "job_id": job_id,
                "queued_at": datetime.now().isoformat()
            })
            r.lpush('queue:submission', task)
            print(f"✅ Job {job_id} synced to Redis and queued for submission")
        except Exception as e:
            print(f"⚠️ Redis sync failed for {job_id}: {e}")
    
    conn.close()
    return {"success": affected > 0, "job_id": job_id, "new_status": new_status}'''

if 'Sync to Redis if approved' not in content:
    content = content.replace(old_approve, new_approve)
    print('✅ Patched approve_job() with Redis sync')
else:
    print('ℹ️ approve_job() already patched')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('\n🎉 Patch complete! Restart legion-api-server to apply.')
