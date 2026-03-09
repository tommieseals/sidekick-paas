import imaplib
import email
from email.header import decode_header
import sys

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select('"[Gmail]/Sent Mail"')

# Search for emails to Patrick
status, messages = mail.search(None, 'TO "pteahen"')

print("SENT EMAILS TO PATRICK TEAHEN:")
print("=" * 50)

if messages[0]:
    for num in messages[0].split():
        status, data = mail.fetch(num, "(BODY.PEEK[HEADER.FIELDS (TO SUBJECT DATE)])")
        header = data[0][1].decode("utf-8", errors="ignore")
        print(header)
        print("-" * 50)
else:
    print("No emails found to pteahen@raritysolutions.com")

mail.logout()
