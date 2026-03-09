import imaplib
import email
from email.header import decode_header
import sys
import re

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

status, messages = mail.search(None, '(FROM "RESICENTRAL")')

if messages[0]:
    for num in messages[0].split()[-3:]:  # Last 3
        status, data = mail.fetch(num, "(RFC822)")
        msg = email.message_from_bytes(data[0][1])
        
        subject = decode_header(msg["Subject"])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode('utf-8', errors='ignore')
        
        from_ = msg.get("From", "")
        date_ = msg.get("Date", "")[:25]
        
        body = ""
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/html":
                    try:
                        html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                        body = re.sub('<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
                        body = re.sub('<[^>]+>', ' ', body)
                        body = re.sub(r'\s+', ' ', body)
                    except:
                        pass
                    break
        
        print(f"FROM: {from_}")
        print(f"SUBJECT: {subject}")
        print(f"DATE: {date_}")
        print("-" * 50)
        print(body.strip()[:1500])
        print()

mail.logout()
