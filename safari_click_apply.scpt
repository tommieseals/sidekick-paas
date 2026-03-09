tell application "Safari"
    activate
    delay 1
    
    -- Navigate to IT Support jobs
    set URL of front document to "https://www.indeed.com/jobs?q=IT+Support&l=Remote"
    delay 5
    
    -- Click on first job with Easy Apply
    do JavaScript "
        var jobs = document.querySelectorAll('.job_seen_beacon');
        for (var job of jobs) {
            if (job.innerText.toLowerCase().includes('easily apply')) {
                job.click();
                break;
            }
        }
    " in front document
    
    delay 3
    
    -- Click Apply Now button
    do JavaScript "
        var applyBtn = document.querySelector('button[class*=\"apply\"]') || 
                       document.querySelector('button:contains(\"Apply now\")') ||
                       Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Apply'));
        if (applyBtn) applyBtn.click();
    " in front document
    
end tell
