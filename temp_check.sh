#!/bin/bash
cd ~/job-hunter-system
echo "=== SUBMITTED ===" 
sqlite3 data/legion.db "SELECT title, company FROM jobs WHERE status='submitted'"
echo "=== SUBMITTING ===" 
sqlite3 data/legion.db "SELECT title, company FROM jobs WHERE status='submitting'"
