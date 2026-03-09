import imaplib
import email
from email.header import decode_header
from datetime import datetime, timedelta
import sys

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

since = (datetime.now() - timedelta(days=14)).strftime("%d-%b-%Y")
status, messages = mail.search(None, f"(UNSEEN SINCE {since})")

job_keywords = ["interview", "application", "position", "opportunity", "recruiter", 
                "hiring", "candidate", "schedule", "offer", "next steps", "follow up",
                "request technology", "robert half", "jobot", "indeed", "linkedin",
                "phone screen", "technical", "regarding your", "team would like", "apex", "teksystems"]

print("JOB EMAILS NEEDING REPLIES")
print("=" * 55)
count = 0

if messages[0]:
    for num in messages[0].split():
        try:
            status, data = mail.fetch(num, "(RFC822)")
            msg = email.message_from_bytes(data[0][1])
            
            subject_raw = decode_header(msg["Subject"])[0]
            subject = subject_raw[0]
            if isinstance(subject, bytes):
                subject = subject.decode(subject_raw[1] or "utf-8", errors="ignore")
            
            from_ = msg.get("From", "")
            date_ = msg.get("Date", "")[:22]
            
            text = (str(subject) + from_).lower()
            if any(kw in text for kw in job_keywords):
                skip_list = ["noreply", "no-reply", "donotreply", "notifications", "alerts@"]
                if not any(skip in from_.lower() for skip in skip_list):
                    count += 1
                    print()
                    print(f"{count}. {str(subject)[:70]}")
                    print(f"   From: {from_[:60]}")
                    print(f"   Date: {date_}")
        except Exception as e:
            continue

print()
print("=" * 55)
print(f"Total needing reply: {count}")
mail.logout()
