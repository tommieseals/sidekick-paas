#!/bin/bash
cd ~/job-hunter-system
echo "=== Jobs discovered in last hour ==="
sqlite3 data/legion.db "SELECT COUNT(*) FROM jobs WHERE discovered_at > datetime('now', '-1 hour');"
echo ""
echo "=== Latest discovered jobs ==="
sqlite3 data/legion.db "SELECT title, company, platform, discovered_at FROM jobs ORDER BY discovered_at DESC LIMIT 5;"
