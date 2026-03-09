#!/usr/bin/env python3
"""Full test of Indeed scraper with 2Captcha Turnstile fix"""
import asyncio
import os
import sys

os.environ['TWOCAPTCHA_API_KEY'] = 'b4254a5c82ee4cf2f5d52a8cf47bdcee'
sys.path.insert(0, '/Users/tommie/job-hunter-system')

from worker.tools.indeed_ultra_stealth import IndeedUltraStealthScraper

async def test():
    print("🚀 Full Indeed Scraper Test with 2Captcha Fix", flush=True)
    print("=" * 50, flush=True)
    
    scraper = IndeedUltraStealthScraper(use_real_profile=False)
    
    # Search for real jobs
    jobs = await scraper.search("Python Developer", "Remote")
    
    print(f"\n{'=' * 50}", flush=True)
    print(f"✅ RESULTS: {len(jobs)} jobs found!", flush=True)
    print("=" * 50, flush=True)
    
    for i, job in enumerate(jobs[:5], 1):
        print(f"\n{i}. {job['title']}", flush=True)
        print(f"   Company: {job['company']}", flush=True)
        print(f"   Location: {job['location']}", flush=True)
        print(f"   URL: {job['url'][:60]}...", flush=True)
    
    return jobs

if __name__ == "__main__":
    jobs = asyncio.run(test())
    print(f"\n🎉 Test complete! Found {len(jobs)} jobs.", flush=True)
