#!/bin/bash
cd ~/job-hunter-system
echo "=== FRESH JOBS (last 7 days) with resumes ==="
sqlite3 data/legion.db "
SELECT j.platform, j.title, j.company, j.posted_date
FROM jobs j
WHERE j.status = 'approved' 
AND j.posted_date >= date('now', '-7 days')
AND j.job_id IN (SELECT job_id FROM jobs WHERE status IN ('approved', 'ready_for_review'))
ORDER BY j.posted_date DESC
LIMIT 20;
"

echo ""
echo "=== LinkedIn jobs with resumes ==="
sqlite3 data/legion.db "
SELECT title, company, posted_date FROM jobs 
WHERE platform='linkedin' AND status='approved'
ORDER BY posted_date DESC LIMIT 10;
"
