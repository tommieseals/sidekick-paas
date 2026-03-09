import pyautogui
import time

# Press F12 to open DevTools
pyautogui.press('f12')
time.sleep(2)

# Take screenshot to see DevTools
screenshot = pyautogui.screenshot()
screenshot.save('C:/Users/tommi/Desktop/devtools.png')
print('DevTools opened')
