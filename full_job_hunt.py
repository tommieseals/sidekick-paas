#!/usr/bin/env python3
"""
Full Job Hunt Test - Search, Match, Apply
Using the 2Captcha Cloudflare fix
"""
import asyncio
import os
import sys

os.environ['TWOCAPTCHA_API_KEY'] = 'b4254a5c82ee4cf2f5d52a8cf47bdcee'
sys.path.insert(0, '/Users/tommie/job-hunter-system')

from worker.tools.indeed_ultra_stealth import IndeedUltraStealthScraper
from loguru import logger

# Rusty's job preferences
SEARCH_QUERIES = [
    ("Cloud Architect", "Remote"),
    ("DevOps Engineer", "Remote"),
    ("Platform Engineer", "Remote"),
]

async def search_jobs():
    """Search Indeed for matching jobs"""
    all_jobs = []
    scraper = IndeedUltraStealthScraper(use_real_profile=False)
    
    for query, location in SEARCH_QUERIES:
        print(f"\n🔍 Searching: {query} in {location}...", flush=True)
        try:
            jobs = await scraper.search(query, location)
            print(f"   Found {len(jobs)} jobs", flush=True)
            all_jobs.extend(jobs)
        except Exception as e:
            print(f"   ❌ Error: {e}", flush=True)
        
        # Small delay between searches
        await asyncio.sleep(5)
    
    return all_jobs

def filter_jobs(jobs):
    """Filter jobs based on preferences"""
    # Remove duplicates by URL
    seen_urls = set()
    unique_jobs = []
    for job in jobs:
        if job['url'] not in seen_urls:
            seen_urls.add(job['url'])
            unique_jobs.append(job)
    
    print(f"\n📋 {len(unique_jobs)} unique jobs after dedup", flush=True)
    
    # Filter by keywords (basic matching)
    good_keywords = ['cloud', 'aws', 'azure', 'devops', 'platform', 'kubernetes', 'docker', 'python', 'infrastructure']
    bad_keywords = ['senior director', 'vp ', 'vice president', 'intern', 'internship']
    
    filtered = []
    for job in unique_jobs:
        title_lower = job['title'].lower()
        desc_lower = job.get('description', '').lower()
        
        # Skip bad matches
        if any(bad in title_lower for bad in bad_keywords):
            continue
        
        # Boost good matches
        score = sum(1 for kw in good_keywords if kw in title_lower or kw in desc_lower)
        job['match_score'] = score
        
        if score > 0:
            filtered.append(job)
    
    # Sort by score
    filtered.sort(key=lambda x: x['match_score'], reverse=True)
    
    print(f"✅ {len(filtered)} jobs match criteria", flush=True)
    return filtered[:10]  # Top 10

async def main():
    print("=" * 60, flush=True)
    print("🚀 FULL JOB HUNT - Search, Match, Apply", flush=True)
    print("=" * 60, flush=True)
    
    # Search
    print("\n📡 PHASE 1: DISCOVERY", flush=True)
    all_jobs = await search_jobs()
    print(f"\n📊 Total jobs found: {len(all_jobs)}", flush=True)
    
    if not all_jobs:
        print("❌ No jobs found!", flush=True)
        return
    
    # Filter
    print("\n🎯 PHASE 2: MATCHING", flush=True)
    matched_jobs = filter_jobs(all_jobs)
    
    # Display matches
    print("\n" + "=" * 60, flush=True)
    print("🎯 TOP MATCHES FOR RUSTY:", flush=True)
    print("=" * 60, flush=True)
    
    for i, job in enumerate(matched_jobs, 1):
        print(f"\n{i}. {job['title']}", flush=True)
        print(f"   🏢 {job['company']}", flush=True)
        print(f"   📍 {job['location']}", flush=True)
        print(f"   ⭐ Match Score: {job.get('match_score', 0)}", flush=True)
        print(f"   🔗 {job['url'][:70]}...", flush=True)
    
    # Ready for application
    print("\n" + "=" * 60, flush=True)
    print(f"✅ {len(matched_jobs)} jobs ready for application!", flush=True)
    print("=" * 60, flush=True)
    
    return matched_jobs

if __name__ == "__main__":
    jobs = asyncio.run(main())
    print(f"\n🎉 Job hunt complete! {len(jobs) if jobs else 0} matches found.", flush=True)
