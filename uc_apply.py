#!/usr/bin/env python3
"""
Apply using undetected-chromedriver - bypasses automation detection
"""
import time
import random
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

VAULT = {
    "name": "Tommie Seals",
    "email": "tommieseals7700@gmail.com", 
    "phone": "618-203-0978"
}

def human_delay(min_s=1, max_s=3):
    time.sleep(random.uniform(min_s, max_s))

def main():
    print("="*60)
    print("UNDETECTED CHROME - INDEED APPLICATION")
    print("="*60)
    
    # Launch undetected Chrome
    print("\n1. Launching Chrome...")
    options = uc.ChromeOptions()
    options.add_argument("--start-maximized")
    
    driver = uc.Chrome(options=options, use_subprocess=True)
    wait = WebDriverWait(driver, 30)
    
    try:
        # Go to Indeed
        print("\n2. Loading Indeed...")
        driver.get("https://www.indeed.com/jobs?q=IT+Support&l=Remote")
        human_delay(3, 5)
        
        # Take screenshot
        driver.save_screenshot('/tmp/uc_step1.png')
        
        # Check for Cloudflare
        if 'Verify' in driver.page_source or 'cloudflare' in driver.page_source.lower():
            print("   Cloudflare detected - waiting for manual solve...")
            time.sleep(30)  # Wait for manual checkbox click
        
        print("   Page loaded!")
        
        # Find jobs
        print("\n3. Finding jobs...")
        jobs = driver.find_elements(By.CSS_SELECTOR, '.job_seen_beacon')
        print(f"   Found {len(jobs)} jobs")
        
        if jobs:
            # Click first job
            jobs[0].click()
            human_delay(3, 5)
            driver.save_screenshot('/tmp/uc_step2.png')
        
        # Click Apply
        print("\n4. Clicking Apply...")
        try:
            apply_btn = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//button[contains(text(), 'Apply now')]")
            ))
            apply_btn.click()
            print("   Clicked!")
        except:
            print("   No Apply button found")
        
        human_delay(4, 6)
        
        # Switch to new tab if opened
        if len(driver.window_handles) > 1:
            driver.switch_to.window(driver.window_handles[-1])
            print("   Switched to application tab")
        
        driver.save_screenshot('/tmp/uc_step3.png')
        
        # Check for sign-in
        if 'sign in' in driver.page_source.lower() or 'Create an account' in driver.page_source:
            print("\n*** SIGN-IN NEEDED ***")
            print("   Please sign in manually in the browser...")
            print("   Waiting 60 seconds...")
            time.sleep(60)
        
        # Fill form
        print("\n5. Filling form...")
        for step in range(10):
            human_delay(1, 2)
            
            # Try to fill fields
            for sel, val in [
                ('input[name*="name" i]', VAULT['name']),
                ('input[type="email"]', VAULT['email']),
                ('input[type="tel"]', VAULT['phone']),
            ]:
                try:
                    fields = driver.find_elements(By.CSS_SELECTOR, sel)
                    for field in fields:
                        if field.is_displayed() and not field.get_attribute('value'):
                            field.clear()
                            field.send_keys(val)
                            print(f"   Filled: {sel[:20]}")
                except:
                    pass
            
            # Check for Submit
            try:
                submit = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit')]")
                if submit.is_displayed():
                    print(f"   SUBMIT FOUND!")
                    driver.save_screenshot('/tmp/uc_before_submit.png')
                    submit.click()
                    print("   >>> SUBMITTED! <<<")
                    break
            except:
                pass
            
            # Check for Continue
            try:
                cont = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
                if cont.is_displayed():
                    print(f"   Step {step+1}: Continue")
                    cont.click()
            except:
                print(f"   Step {step+1}: No button")
                break
        
        human_delay(3, 5)
        driver.save_screenshot('/tmp/uc_final.png')
        
        if any(x in driver.page_source.lower() for x in ['submitted', 'thank you', 'received']):
            print("\n" + "="*60)
            print("SUCCESS! APPLICATION SUBMITTED!")
            print("="*60)
        else:
            print("\nCheck /tmp/uc_*.png")
        
        print("\nBrowser staying open 60s...")
        time.sleep(60)
        
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
