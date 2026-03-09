#!/bin/bash
cd ~/job-hunter-system
/opt/homebrew/bin/python3 << 'PYTHON'
import redis
import json
import sqlite3

r = redis.Redis(host='100.88.105.106', port=6379, password='jQN/kqK/wdU+aP1VIWdY3WWRCbKrcxz9VMTtiI3/s0M=', decode_responses=True)
conn = sqlite3.connect('data/legion.db')
cursor = conn.cursor()

doc_keys = r.hkeys('document_packages')
print(f"Total document packages: {len(doc_keys)}")

platforms = {}
for key in doc_keys:
    cursor.execute("SELECT platform FROM jobs WHERE job_id = ?", (key,))
    row = cursor.fetchone()
    if row:
        p = row[0]
        platforms[p] = platforms.get(p, 0) + 1

print("By platform:")
for p, c in platforms.items():
    print(f"  {p}: {c}")
PYTHON
