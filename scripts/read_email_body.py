import imaplib
import email
from email.header import decode_header
import sys
from datetime import datetime, timedelta
import re

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

since = (datetime.now() - timedelta(days=7)).strftime("%d-%b-%Y")

# Search for key emails
searches = [
    f'(SINCE {since} FROM "meneses")',
    f'(SINCE {since} FROM "adp.com" SUBJECT "application")',
    f'(SINCE {since} FROM "rarity")',
    f'(SINCE {since} SUBJECT "interview" NOT FROM "linkedin")',
]

print("EMAILS NEEDING ACTION - DETAILS")
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

count = 0
for num in list(all_nums):
    try:
        status, data = mail.fetch(num, "(RFC822)")
        msg = email.message_from_bytes(data[0][1])
        
        subject = decode_header(msg["Subject"])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode('utf-8', errors='ignore')
        
        from_ = msg.get("From", "")
        date_ = msg.get("Date", "")[:25]
        
        # Get body
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    break
                elif part.get_content_type() == "text/html" and not body:
                    html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                    body = re.sub('<[^<]+?>', ' ', html)
        else:
            body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
        
        # Clean and truncate body
        body = ' '.join(body.split())[:500]
        
        count += 1
        print(f"\n--- EMAIL {count} ---")
        print(f"From: {from_[:60]}")
        print(f"Subject: {str(subject)[:70]}")
        print(f"Date: {date_}")
        print(f"Preview: {body[:300]}...")
        print()
        
    except Exception as e:
        continue

print("=" * 60)
mail.logout()
