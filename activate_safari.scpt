tell application "Safari"
    activate
    delay 1
    if (count of windows) = 0 then
        make new document
    end if
    delay 1
end tell

tell application "System Events"
    tell process "Safari"
        set frontmost to true
    end tell
end tell

delay 1
return "Safari activated"
