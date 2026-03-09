import sqlite3
import os

os.chdir(r'C:\Users\tommi\clawd\TerminatorBot')

# Check trade_logs.db
conn = sqlite3.connect('data/trade_logs.db')
cursor = conn.cursor()

# Get tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("Tables:", tables)

# For each table, get count and sample
for table in tables:
    table_name = table[0]
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"\n{table_name}: {count} rows")
    
    cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
    rows = cursor.fetchall()
    for row in rows:
        print(f"  {row}")

conn.close()
