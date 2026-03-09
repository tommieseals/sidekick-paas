#!/usr/bin/env python3
"""Test 2Captcha Turnstile fix on Indeed"""
import asyncio
import os
import sys

# Set API key
os.environ['TWOCAPTCHA_API_KEY'] = 'b4254a5c82ee4cf2f5d52a8cf47bdcee'

sys.path.insert(0, '/Users/tommie/job-hunter-system')

from worker.tools.indeed_ultra_stealth import IndeedUltraStealthScraper

async def test():
    print("🚀 Testing Indeed with 2Captcha Turnstile fix...")
    print(f"API Key: {os.environ.get('TWOCAPTCHA_API_KEY', 'NOT SET')[:20]}...")
    
    # Use headless=False mode requires display, so we test differently
    scraper = IndeedUltraStealthScraper(use_real_profile=False)
    
    try:
        jobs = await scraper.search('Software Engineer', 'Remote')
        print(f"\n✅ Found {len(jobs)} jobs!")
        for job in jobs[:3]:
            print(f"  - {job['title']} @ {job['company']}")
        return jobs
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return []

if __name__ == "__main__":
    asyncio.run(test())
