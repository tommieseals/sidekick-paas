#!/bin/bash
cd ~/job-hunter-system
echo "=== Approving recent LinkedIn jobs ==="
sqlite3 data/legion.db "UPDATE jobs SET status='approved' WHERE platform='linkedin' AND discovered_at > '2026-02-27' AND status IN ('ready_for_review', 'discovered', 'qualified');"
echo "Updated LinkedIn jobs to approved"

echo ""
echo "=== Recent approved jobs ==="
sqlite3 data/legion.db "SELECT title, company, platform FROM jobs WHERE status='approved' AND discovered_at > '2026-02-27' LIMIT 10;"
