#!/bin/bash
# Gather Project Legion audit data

cd ~/job-hunter-system

echo "=== SUBMITTED JOB ==="
sqlite3 data/legion.db "SELECT job_id, title, company, platform, url FROM jobs WHERE status='submitted';"

echo ""
echo "=== JOBS STUCK IN SUBMITTING ==="
sqlite3 data/legion.db "SELECT title, company, platform FROM jobs WHERE status='submitting' LIMIT 10;"

echo ""
echo "=== RECENT ERRORS (worker log) ==="
grep -i "error\|fail\|timeout" ~/job-hunter-system/logs/worker-main.log 2>/dev/null | tail -10

echo ""
echo "=== SAFARI/APPLESCRIPT SUBMISSION (project-legion-rusty-fix) ==="
cat ~/project-legion-rusty-fix/Project-Legion/applications.log 2>/dev/null | grep -E "SUBMITTED|SUCCESS" | tail -10

echo ""  
echo "=== ZIPRECRUITER STATUS ==="
tail -20 ~/project-legion-rusty-fix/Project-Legion/ziprecruiter.log 2>/dev/null

echo ""
echo "=== INDEED DAEMON STATUS ==="
tail -20 ~/project-legion-rusty-fix/Project-Legion/applications.log 2>/dev/null | tail -15

echo ""
echo "=== DISCOVERY STATUS ==="
sqlite3 data/legion.db "SELECT platform, COUNT(*), MAX(discovered_at) as latest FROM jobs WHERE discovered_at > datetime('now', '-7 days') GROUP BY platform;"
