#!/usr/bin/env python3
"""Test stealth browser with actual job search"""
import asyncio
import sys
sys.stdout.reconfigure(line_buffering=True)

from worker.tools.indeed_ultra_stealth import IndeedUltraStealthScraper

async def test():
    stealth = IndeedUltraStealthScraper()
    print("Starting stealth browser and searching for jobs...")
    # Note: search() calls setup() internally
    
    # Search for jobs
    jobs = await stealth.search(
        query="Python Developer",
        location="Remote"
    )
    
    print(f"\nFound {len(jobs)} jobs!")
    for i, job in enumerate(jobs[:5]):
        print(f"\n{i+1}. {job.get('title', 'No title')}")
        print(f"   Company: {job.get('company', 'Unknown')}")
        print(f"   Location: {job.get('location', 'Unknown')}")
    
    await stealth.teardown()
    print("\nDone!")

if __name__ == "__main__":
    asyncio.run(test())
