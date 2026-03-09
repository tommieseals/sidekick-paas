import sqlite3

conn = sqlite3.connect("/Users/administrator/job-hunter-system/data/legion.db")
c = conn.cursor()

# Get schema
c.execute("PRAGMA table_info(jobs)")
cols = [r[1] for r in c.fetchall()]
print("Columns:", cols)

# Show status counts
c.execute("SELECT status, COUNT(*) FROM jobs GROUP BY status")
print("\nJob statuses:", c.fetchall())

# Find primary key and show latest
pk = cols[0]  # Usually first column is primary key
c.execute(f"SELECT * FROM jobs LIMIT 3")
print("\nSample rows:")
for r in c.fetchall():
    print(r)

conn.close()
