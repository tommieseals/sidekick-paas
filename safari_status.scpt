tell application "Safari"
    set winCount to count of windows
    if winCount > 0 then
        set winName to name of front window
        set winURL to URL of front document
        return "Windows: " & winCount & ", Front: " & winName & ", URL: " & winURL
    else
        return "No Safari windows open"
    end if
end tell
