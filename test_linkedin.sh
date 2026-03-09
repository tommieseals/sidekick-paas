#!/bin/bash
# Test LinkedIn job detection

osascript << 'EOF'
tell application "Safari"
    set jsResult to do JavaScript "
        // Count job cards
        var jobCards = document.querySelectorAll('.jobs-search-results__list-item, .job-card-container, [data-job-id]');
        var easyApply = document.querySelectorAll('[aria-label*=\"Easy Apply\"], .jobs-apply-button--top-card');
        'Job cards: ' + jobCards.length + ', Easy Apply buttons: ' + easyApply.length;
    " in document 1
    return jsResult
end tell
EOF
