#!/bin/bash
cd ~/job-hunter-system
echo "=== Approved Jobs by Platform ==="
sqlite3 data/legion.db "SELECT platform, COUNT(*) FROM jobs WHERE status='approved' GROUP BY platform;"
echo ""
echo "=== Jobs with Document Packages by Platform ==="
sqlite3 data/legion.db "SELECT j.platform, COUNT(*) FROM jobs j WHERE j.job_id IN (SELECT DISTINCT job_id FROM jobs WHERE status IN ('approved', 'ready_for_review')) GROUP BY j.platform;"
