#!/usr/bin/env python3
from datetime import datetime
import sys

value = "2024-01-15T09:00:00Z"
fixed = value.replace("Z", "+00:00")
print(f"Original: {value}")
print(f"Fixed: {fixed}")
print(f"Python version: {sys.version}")

try:
    dt = datetime.fromisoformat(fixed)
    print(f"Parsed: {dt}")
except Exception as e:
    print(f"Error: {e}")
    # Try without timezone
    try:
        dt = datetime.fromisoformat(value.rstrip("Z"))
        print(f"Parsed without TZ: {dt}")
    except Exception as e2:
        print(f"Error2: {e2}")
