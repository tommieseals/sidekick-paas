#!/usr/bin/env python3
"""
Direct submission test - bypasses Redis, reads approved jobs from SQLite
"""
import sqlite3
import sys
import os
import asyncio

# Add project paths BEFORE any imports
os.chdir("/Users/administrator/job-hunter-system")
sys.path.insert(0, "/Users/administrator/job-hunter-system")

from loguru import logger
logger.add(sys.stdout, format="{time:HH:mm:ss} | {level} | {message}")

async def test_submissions():
    # Get approved jobs from SQLite
    conn = sqlite3.connect("data/legion.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("""
        SELECT job_id, company, title, url, platform, raw_data 
        FROM jobs 
        WHERE status = 'approved'
        ORDER BY discovered_at DESC 
        LIMIT 10
    """)
    jobs = c.fetchall()
    conn.close()
    
    if not jobs:
        print("No approved jobs found!")
        return
    
    print(f"Found {len(jobs)} approved jobs to submit\n")
    
    # Import submission handler  
    from worker.submission.unified_router import UnifiedSubmissionRouter
    
    # Initialize
    router = UnifiedSubmissionRouter()
    
    # Resume path - use DOCX (Indeed accepts it)
    resume_path = "data/resumes/tommie_resume.docx"
    if not os.path.exists(resume_path):
        print(f"ERROR: Resume not found at {resume_path}")
        return
    
    print(f"Resume: {resume_path} ({os.path.getsize(resume_path)} bytes)")
    
    results = []
    for job_row in jobs:
        job = dict(job_row)
        print(f"\n{'='*60}")
        print(f"Submitting: {job['title'][:50]}")
        print(f"Company: {job['company']}")
        print(f"Platform: {job['platform']}")
        print(f"URL: {job['url'][:80]}...")
        
        try:
            # DRY_RUN=True for testing (won't actually submit)
            result = await router.submit(job, resume_path, dry_run=True)
            results.append({
                'job_id': job['job_id'],
                'success': result.get('success', False),
                'message': result.get('message', result.get('error', 'Unknown'))
            })
            status = '✅' if result.get('success') else '❌'
            print(f"Result: {status} {result.get('message', result.get('error', ''))[:100]}")
        except Exception as e:
            import traceback
            results.append({
                'job_id': job['job_id'],
                'success': False,
                'message': str(e)
            })
            print(f"Error: ❌ {str(e)[:100]}")
            traceback.print_exc()
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    success_count = sum(1 for r in results if r['success'])
    print(f"Success: {success_count}/{len(results)}")
    for r in results:
        status = '✅' if r['success'] else '❌'
        print(f"  {status} {r['job_id']}: {r['message'][:60]}")

if __name__ == "__main__":
    asyncio.run(test_submissions())
