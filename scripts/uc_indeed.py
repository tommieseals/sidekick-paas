#!/usr/bin/env python3
"""Use undetected-chromedriver to bypass Cloudflare"""
import undetected_chromedriver as uc
import time

print("Starting undetected Chrome...")
options = uc.ChromeOptions()
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

driver = uc.Chrome(options=options, use_subprocess=True)

print("Navigating to Indeed...")
driver.get('https://www.indeed.com/jobs?q=IT+support&l=Houston%2C+TX')

# Wait for page to load and pass Cloudflare
print("Waiting for Cloudflare...")
time.sleep(15)

# Check title
title = driver.title
print(f"Page title: {title}")

if 'indeed' in title.lower() and 'moment' not in title.lower():
    print("✅ Got past Cloudflare!")
    
    # Find Easy Apply jobs
    jobs = driver.find_elements('css selector', '.job_seen_beacon')
    easy_apply = []
    for job in jobs:
        if 'Easily apply' in job.text:
            title_el = job.find_element('css selector', 'h2 a, .jobTitle a')
            if title_el:
                easy_apply.append(title_el.text[:40])
    
    print(f"Found {len(easy_apply)} Easy Apply jobs:")
    for j in easy_apply[:5]:
        print(f"  - {j}")
else:
    print(f"❌ Still on Cloudflare or wrong page: {title}")

print("\nKeeping browser open for 30 seconds...")
time.sleep(30)

driver.quit()
print("Done.")
