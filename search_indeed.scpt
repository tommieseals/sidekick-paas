on run argv
    set searchQuery to item 1 of argv
    set encodedQuery to my replaceText(searchQuery, " ", "+")
    set searchURL to "https://www.indeed.com/jobs?q=" & encodedQuery & "&fromage=3"
    
    tell application "Safari"
        activate
        set URL of front document to searchURL
    end tell
    
    delay 5
    
    tell application "Safari"
        tell front document
            set pageSource to do JavaScript "document.body.innerText"
        end tell
    end tell
    
    -- Count jobs and Easy Apply
    tell application "Safari"
        set result to do JavaScript "
            var jobs = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li');
            var easyCount = 0;
            jobs.forEach(function(j) {
                if ((j.innerText || '').toLowerCase().includes('easily apply')) easyCount++;
            });
            'Total: ' + jobs.length + ', Easy Apply: ' + easyCount;
        " in front document
    end tell
    
    return result
end run

on replaceText(theText, searchStr, replaceStr)
    set AppleScript's text item delimiters to searchStr
    set theItems to text items of theText
    set AppleScript's text item delimiters to replaceStr
    set theText to theItems as text
    set AppleScript's text item delimiters to ""
    return theText
end replaceText
