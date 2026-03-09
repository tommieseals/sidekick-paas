from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

# Connect to existing Chrome via remote debugging
# First need to restart Chrome with debugging enabled
# For now, start a fresh instance with debugger

chrome_options = Options()
chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")

try:
    driver = webdriver.Chrome(options=chrome_options)
    print("Connected to Chrome!")
    print("Current URL:", driver.current_url)
    print("Title:", driver.title)
    
    # Find Easy Apply button
    easy_apply = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".jobs-apply-button, button[aria-label*='Easy Apply']"))
    )
    print("Found Easy Apply button!")
    easy_apply.click()
    print("Clicked!")
    time.sleep(5)
    driver.save_screenshot("C:/Users/tommi/Desktop/selenium_result.png")
    print("Screenshot saved")
    
except Exception as e:
    print(f"Error: {e}")
    print("Make sure Chrome is running with --remote-debugging-port=9222")
