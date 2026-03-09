import pyautogui
import time

# Close DevTools first
pyautogui.press('f12')
time.sleep(1)

# Take fresh screenshot
screenshot = pyautogui.screenshot()
screenshot.save('C:/Users/tommi/Desktop/fresh.png')

# Now the Easy Apply button should be around x=756, y=527 based on original layout
# But let me look for a blue button in the right area

# Click at where the Easy Apply button should be
# From the DevTools screenshot, it was around x=522 (compressed)
# When expanded, multiply by ~1.4 = about 730
pyautogui.click(755, 525)
time.sleep(4)

screenshot2 = pyautogui.screenshot()
screenshot2.save('C:/Users/tommi/Desktop/after_attempt.png')
print('Done')
