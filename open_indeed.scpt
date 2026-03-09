tell application "Google Chrome"
    activate
    if (count of windows) = 0 then
        make new window
    end if
    tell front window
        set URL of active tab to "https://www.indeed.com/jobs?q=IT+Support&l=Remote"
    end tell
end tell
delay 3
