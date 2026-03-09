import imaplib
import email
from email.header import decode_header
import sys
from datetime import datetime, timedelta

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

# Search for recent emails with job-related subjects
since = (datetime.now() - timedelta(days=7)).strftime("%d-%b-%Y")

# Multiple targeted searches
searches = [
    f'(SINCE {since} SUBJECT "interview")',
    f'(SINCE {since} SUBJECT "schedule")',
    f'(SINCE {since} SUBJECT "phone screen")',
    f'(SINCE {since} SUBJECT "next steps")',
    f'(SINCE {since} SUBJECT "your application")',
    f'(SINCE {since} FROM "recruiter")',
    f'(SINCE {since} FROM "talent")',
    f'(SINCE {since} FROM "careers")',
]

skip_senders = ["noreply", "no-reply", "donotreply", "notifications", "alerts@", 
                "marketing@", "via linkedin", "credit", "smartcredit", "bureau"]

print("RECRUITER EMAILS (Last 7 Days)")
print("=" * 60)

all_nums = set()
for search in searches:
    try:
        status, messages = mail.search(None, search)
        if messages[0]:
            for num in messages[0].split():
                all_nums.add(num)
    except:
        continue

print(f"Found {len(all_nums)} potential matches, filtering...")
print()

count = 0
found = []

for num in list(all_nums)[-30:]:  # Check last 30 matches
    try:
        status, data = mail.fetch(num, "(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)] FLAGS)")
        header = data[0][1].decode('utf-8', errors='ignore')
        flags = str(data[0][0]) if data[0][0] else ""
        
        lines = header.strip().split('\n')
        from_ = ""
        subject = ""
        date_ = ""
        
        for line in lines:
            if line.lower().startswith("from:"):
                from_ = line[5:].strip()
            elif line.lower().startswith("subject:"):
                subject = line[8:].strip()
            elif line.lower().startswith("date:"):
                date_ = line[5:].strip()[:25]
        
        # Skip automated/spam
        if any(skip in from_.lower() for skip in skip_senders):
            continue
            
        is_unread = "\\Seen" not in flags
        status_mark = "[UNREAD] " if is_unread else ""
        
        found.append((date_, from_[:55], subject[:65], status_mark))
    except:
        continue

if found:
    for date_, from_, subject, status_mark in found[-15:]:  # Show last 15
        count += 1
        print(f"{count}. {status_mark}{subject}")
        print(f"   From: {from_}")
        print(f"   Date: {date_}")
        print()
else:
    print("No recruiter emails found in last 7 days.")

print("=" * 60)
print(f"Showing {count} of {len(all_nums)} job-related emails")
mail.logout()
