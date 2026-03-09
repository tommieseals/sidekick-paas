#!/usr/bin/env python3
import sys
sys.path.insert(0, '/Users/tommie/job-hunter-system/worker')
from tools.job_scrapers_real import IndeedScraper
import asyncio

async def test():
    scraper = IndeedScraper()
    try:
        jobs = await scraper.search("Systems Administrator", "Remote")
        print(f"Found {len(jobs)} jobs")
        for job in jobs[:5]:
            print(f"  - {job.get('title')} @ {job.get('company')}")
    except Exception as e:
        print(f"ERROR: {e}")

asyncio.run(test())
