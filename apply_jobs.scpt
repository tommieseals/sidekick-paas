-- PROJECT LEGION - Apply to Easy Apply jobs
property totalApps : 0

on run
    set searches to {"IT Support Remote", "Systems Administrator Houston", "Technical Support Specialist"}
    
    repeat with searchTerm in searches
        log "=== Search: " & searchTerm & " ==="
        set apps to applyToSearch(searchTerm)
        set totalApps to totalApps + apps
    end repeat
    
    return "LEGION COMPLETE: " & totalApps & " applications submitted"
end run

on applyToSearch(searchTerm)
    set appCount to 0
    set encodedQuery to my replaceText(searchTerm, " ", "+")
    set searchURL to "https://www.indeed.com/jobs?q=" & encodedQuery & "&fromage=3"
    
    tell application "Safari"
        activate
        set URL of front document to searchURL
    end tell
    
    delay 6
    
    -- Find and click Easy Apply jobs
    repeat with jobIdx from 0 to 4
        tell application "Safari"
            -- Check if job at index has Easy Apply
            set checkJS to "
                var jobs = document.querySelectorAll('.job_seen_beacon, [data-jk]');
                var job = jobs[" & jobIdx & "];
                if (job && job.innerText.toLowerCase().includes('easily apply')) {
                    var link = job.querySelector('a[data-jk], h2 a, .jobTitle a');
                    if (link) { link.click(); 'clicked'; } else 'no-link';
                } else 'no-easy';
            "
            set clickResult to do JavaScript checkJS in front document
        end tell
        
        if clickResult is "clicked" then
            log "Job " & jobIdx & ": Found Easy Apply, clicking..."
            delay 3
            
            -- Try to apply
            tell application "Safari"
                -- Look for apply button
                set applyJS to "
                    var btn = document.querySelector('button[id*=\"apply\"], button[aria-label*=\"Apply\"], .ia-IndeedApplyButton, [data-testid=\"apply-button\"]');
                    if (!btn) {
                        var btns = document.querySelectorAll('button');
                        for (var b of btns) {
                            if (b.innerText.toLowerCase().includes('apply')) { btn = b; break; }
                        }
                    }
                    if (btn) { btn.click(); 'applied'; } else 'no-button';
                "
                set applyResult to do JavaScript applyJS in front document
            end tell
            
            if applyResult is "applied" then
                log "  Clicked apply button!"
                delay 2
                
                -- Fill fields if present
                tell application "Safari"
                    do JavaScript "
                        // Fill address
                        document.querySelectorAll('input').forEach(function(i) {
                            var n = (i.name || i.placeholder || i.ariaLabel || '').toLowerCase();
                            if (n.includes('address') || n.includes('street')) {
                                i.value = '16451 Dunmoor Houston TX 77095';
                                i.dispatchEvent(new Event('input', {bubbles:true}));
                            }
                            if (n.includes('salary') || n.includes('pay') || n.includes('wage')) {
                                i.value = '75000';
                                i.dispatchEvent(new Event('input', {bubbles:true}));
                            }
                            if (n.includes('phone') && !i.value) {
                                i.value = '7138675309';
                                i.dispatchEvent(new Event('input', {bubbles:true}));
                            }
                        });
                    " in front document
                end tell
                delay 1
                
                -- Submit/Continue
                tell application "Safari"
                    do JavaScript "
                        var btns = document.querySelectorAll('button');
                        for (var b of btns) {
                            var t = (b.innerText || '').toLowerCase();
                            if (t.includes('submit') || t.includes('continue') || t.includes('next')) {
                                b.click(); break;
                            }
                        }
                    " in front document
                end tell
                
                set appCount to appCount + 1
                log "  Application #" & appCount & " submitted!"
                delay 2
            end if
            
            -- Go back to search
            tell application "Safari"
                do JavaScript "history.back();" in front document
            end tell
            delay 3
        end if
    end repeat
    
    return appCount
end applyToSearch

on replaceText(theText, searchStr, replaceStr)
    set AppleScript's text item delimiters to searchStr
    set theItems to text items of theText
    set AppleScript's text item delimiters to replaceStr
    set theText to theItems as text
    set AppleScript's text item delimiters to ""
    return theText
end replaceText
