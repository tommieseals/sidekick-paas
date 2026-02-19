#!/usr/bin/env python3
"""Fix all fromisoformat calls to handle Z suffix"""

with open('src/analyzer.py', 'r') as f:
    content = f.read()

# Create a helper function to use instead of direct fromisoformat
helper_func = '''
def parse_iso_timestamp(value: str) -> datetime:
    """Parse ISO format timestamp, handling Z suffix."""
    if not value:
        return datetime.now()
    try:
        # Handle Z suffix and other timezone formats
        clean = value.replace("Z", "+00:00")
        return datetime.fromisoformat(clean)
    except Exception:
        # Fallback: try without timezone
        try:
            return datetime.fromisoformat(value.rstrip("Z"))
        except Exception:
            return datetime.now()

'''

# Insert after imports
import_end = content.find('\n\n# Model pricing')
if import_end == -1:
    import_end = content.find('\nMODEL_PRICING')

# Add helper function after imports
content = content[:import_end] + '\n' + helper_func + content[import_end:]

# Now replace problematic fromisoformat calls

# Fix in parse_openai_export
old1 = '''timestamp=datetime.fromisoformat(
                    entry.get("timestamp", entry.get("created_at", ""))
                ),'''
new1 = '''timestamp=parse_iso_timestamp(
                    entry.get("timestamp", entry.get("created_at", ""))
                ),'''
content = content.replace(old1, new1)

# Fix in parse_anthropic_export
old2 = 'timestamp=datetime.fromisoformat(entry.get("created_at", "")),'
new2 = 'timestamp=parse_iso_timestamp(entry.get("created_at", "")),'
content = content.replace(old2, new2)

# Fix in parse_csv_logs (line 294 area)
old3 = '''timestamp=datetime.fromisoformat(timestamp) if timestamp else datetime.now(),'''
new3 = '''timestamp=parse_iso_timestamp(timestamp),'''
content = content.replace(old3, new3)

# Fix in parse_timestamp - simplify to use helper
old4 = '''def parse_timestamp(entry: dict) -> datetime:
    """Parse timestamp from various formats"""
    timestamp_fields = ["timestamp", "created_at", "time", "date", "datetime"]

    for field_name in timestamp_fields:
        if field_name in entry:
            value = entry[field_name]
            if isinstance(value, (int, float)):
                return datetime.fromtimestamp(value)
            elif isinstance(value, str):
                try:
                    return datetime.fromisoformat(value.replace("Z", "+00:00"))
                except Exception:
                    pass

    return datetime.now()'''

new4 = '''def parse_timestamp(entry: dict) -> datetime:
    """Parse timestamp from various formats"""
    timestamp_fields = ["timestamp", "created_at", "time", "date", "datetime"]

    for field_name in timestamp_fields:
        if field_name in entry:
            value = entry[field_name]
            if isinstance(value, (int, float)):
                return datetime.fromtimestamp(value)
            elif isinstance(value, str):
                result = parse_iso_timestamp(value)
                if result != datetime.now():
                    return result

    return datetime.now()'''

content = content.replace(old4, new4)

with open('src/analyzer.py', 'w') as f:
    f.write(content)

print("Fixed all fromisoformat calls in src/analyzer.py")
