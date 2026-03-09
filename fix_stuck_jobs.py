#!/usr/bin/env python3
import sqlite3
import os

db_path = os.path.expanduser("~/job-hunter-system/data/legion.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Count stuck jobs
cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'submitting'")
count = cursor.fetchone()[0]
print(f"Found {count} stuck jobs in 'submitting' status")

# Show some examples
cursor.execute("SELECT id, title, company FROM jobs WHERE status = 'submitting' LIMIT 5")
print("\nExamples:")
for row in cursor.fetchall():
    print(f"  {row[0][:8]}... | {row[1][:40]} @ {row[2]}")

# Reset them to 'failed' so they can be retried
cursor.execute("""
    UPDATE jobs 
    SET status = 'failed', 
        notes = 'Reset by consolidation - was stuck in submitting'
    WHERE status = 'submitting'
""")
conn.commit()

# Verify
cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'submitting'")
remaining = cursor.fetchone()[0]
print(f"\nReset complete. Remaining stuck: {remaining}")

conn.close()
print("Done!")
