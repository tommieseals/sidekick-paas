tell application "Safari"
    activate
    delay 1
    
    -- Open Indeed jobs page
    if (count of windows) = 0 then
        make new document
    end if
    
    set URL of front document to "https://www.indeed.com/jobs?q=IT+Support&l=Remote"
end tell

delay 5
