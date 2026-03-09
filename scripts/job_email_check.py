import imaplib
import email
from email.header import decode_header
import sys

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

# Get ALL unread
status, messages = mail.search(None, "UNSEEN")

# Keywords that indicate a REAL recruiter/HR email needing reply
reply_keywords = ["interview", "schedule", "call", "speak with you", "discuss", 
                  "phone screen", "next steps", "follow up", "your application",
                  "team would like", "review your", "regarding your", "interested in",
                  "opportunity to", "position at", "role at", "reach out"]

# Skip these automated sources
skip_senders = ["noreply", "no-reply", "donotreply", "notifications@", "alerts@", 
                "marketing@", "jobs@alerts", "via linkedin", "invitations@linkedin",
                "messages-noreply@linkedin", "newsletters@", "hello@", "news@"]

print("RECRUITER EMAILS NEEDING YOUR REPLY")
print("=" * 55)
count = 0
found = []

if messages[0]:
    nums = messages[0].split()[-50:]  # Check last 50 unread
    
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
            
            # Skip automated senders
            if any(skip in from_.lower() for skip in skip_senders):
                continue
            
            # Check for reply-worthy content
            text = subject.lower()
            if any(kw in text for kw in reply_keywords):
                found.append((date_, from_[:55], subject[:70]))
        except:
            continue

if found:
    for date_, from_, subject in found:
        count += 1
        print(f"{count}. {subject}")
        print(f"   From: {from_}")
        print(f"   Date: {date_}")
        print()
else:
    print("No recruiter emails requiring immediate reply found.")
    print()

print("=" * 55)
print(f"Total needing reply: {count}")

# Also show total unread count
total_unread = len(messages[0].split()) if messages[0] else 0
print(f"Total unread in inbox: {total_unread}")
mail.logout()
