tell application "Safari"
    activate
    tell front window
        set URL of current tab to "https://www.indeed.com/jobs?q=IT+Support&l=Remote"
    end tell
end tell
delay 3
