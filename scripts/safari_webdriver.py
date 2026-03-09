#!/usr/bin/env python3
"""Use Safari WebDriver to bypass Cloudflare"""
from selenium import webdriver
from selenium.webdriver.safari.options import Options
import time

print("Starting Safari WebDriver...")

# Enable Safari WebDriver
import subprocess
subprocess.run(['safaridriver', '--enable'], capture_output=True)

driver = webdriver.Safari()

print("Navigating to Indeed...")
driver.get('https://www.indeed.com/jobs?q=IT+support&l=Houston%2C+TX')

# Wait for page to load
print("Waiting 20 seconds for Cloudflare...")
time.sleep(20)

# Check title
title = driver.title
print(f"Page title: {title}")

if 'indeed' in title.lower() and 'moment' not in title.lower():
    print("✅ Got past Cloudflare!")
    
    # Find Easy Apply jobs
    from selenium.webdriver.common.by import By
    jobs = driver.find_elements(By.CSS_SELECTOR, '.job_seen_beacon')
    easy_apply = []
    for job in jobs:
        if 'Easily apply' in job.text:
            try:
                title_el = job.find_element(By.CSS_SELECTOR, 'h2 a, .jobTitle a')
                easy_apply.append(title_el.text[:40])
            except:
                pass
    
    print(f"Found {len(easy_apply)} Easy Apply jobs:")
    for j in easy_apply[:5]:
        print(f"  - {j}")
        
    print("\\nSaving cookies for later...")
    cookies = driver.get_cookies()
    print(f"Got {len(cookies)} cookies")
else:
    print(f"❌ Still blocked: {title}")

input("Press Enter to close browser...")
driver.quit()
