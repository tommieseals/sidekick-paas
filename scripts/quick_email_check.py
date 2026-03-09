import imaplib
import email
from email.header import decode_header
import sys

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

# Get ALL unread (not date filtered - faster)
status, messages = mail.search(None, "UNSEEN")

job_keywords = ["interview", "application", "position", "opportunity", "recruiter", 
                "hiring", "candidate", "schedule", "offer", "next step", "follow up",
                "request technology", "robert half", "jobot", "indeed", "linkedin",
                "phone screen", "technical", "regarding your", "team would like", 
                "apex", "teksystems", "randstad", "insight global"]

print("JOB EMAILS NEEDING REPLIES")
print("=" * 55)
count = 0
found = []

if messages[0]:
    nums = messages[0].split()[-25:]  # Only check last 25 unread
    print(f"Checking {len(nums)} most recent unread emails...")
    print()
    
    for num in nums:
        try:
            status, data = mail.fetch(num, "(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)])")
            header = data[0][1].decode('utf-8', errors='ignore')
            
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
                    date_ = line[5:].strip()[:20]
            
            text = (subject + from_).lower()
            if any(kw in text for kw in job_keywords):
                skip_list = ["noreply", "no-reply", "donotreply", "notifications@", "alerts@", "marketing@"]
                if not any(skip in from_.lower() for skip in skip_list):
                    found.append((date_, from_[:55], subject[:65]))
        except Exception as e:
            continue

for date_, from_, subject in found:
    count += 1
    print(f"{count}. {subject}")
    print(f"   From: {from_}")
    print(f"   Date: {date_}")
    print()

print("=" * 55)
print(f"Total job emails needing reply: {count}")
mail.logout()
