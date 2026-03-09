#!/bin/bash
# Navigate Safari to Indeed with good search terms and test

osascript << 'EOF'
tell application "Safari"
    activate
    -- Navigate to Indeed with good search
    set URL of document 1 to "https://www.indeed.com/jobs?q=systems+administrator&l=Remote&fromage=3&sc=0kf%3Aattr(DSQF7)%3B"
end tell
EOF

echo "Safari navigating to Indeed (Systems Administrator, Remote, Easy Apply filter)..."
sleep 8

# Test if we can find jobs
osascript << 'JSEOF'
tell application "Safari"
    set jsResult to do JavaScript "
        var jobs = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li, [data-jk]');
        var count = jobs.length;
        var easyApply = 0;
        jobs.forEach(function(j) {
            if (j.innerText.includes('Easily apply') || j.innerText.includes('Easy Apply')) easyApply++;
        });
        'Total jobs: ' + count + ', Easy Apply: ' + easyApply;
    " in document 1
    return jsResult
end tell
JSEOF
