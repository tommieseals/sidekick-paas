import imaplib
import email
from email.header import decode_header
import sys
import re

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select("INBOX")

# Search for the specific emails
searches = [
    '(FROM "meneses" SUBJECT "regarding")',
    '(FROM "resicentral" SUBJECT "update")',
]

print("=" * 60)
print("FULL EMAIL CONTENTS")
print("=" * 60)

for search in searches:
    try:
        status, messages = mail.search(None, search)
        if messages[0]:
            for num in messages[0].split():
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
                            try:
                                body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                            except:
                                pass
                            break
                        elif part.get_content_type() == "text/html" and not body:
                            try:
                                html = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                                # Strip HTML tags
                                body = re.sub('<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
                                body = re.sub('<[^>]+>', ' ', body)
                                body = re.sub(r'\s+', ' ', body)
                            except:
                                pass
                else:
                    try:
                        body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')
                    except:
                        pass
                
                print(f"\n{'='*60}")
                print(f"FROM: {from_}")
                print(f"SUBJECT: {subject}")
                print(f"DATE: {date_}")
                print("-" * 60)
                # Clean up body and print
                body = body.strip()[:1500]
                print(body)
                print()
    except Exception as e:
        print(f"Error: {e}")

mail.logout()
