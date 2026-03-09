import imaplib
import email
from email.header import decode_header
import sys
from datetime import datetime, timedelta

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""
mail = imaplib.IMAP4_SSL("imap.gmail.com")
mail.login("tommieseals7700@gmail.com", app_pass)
mail.select('"[Gmail]/Sent Mail"')

# Get emails sent today
today = datetime.now().strftime("%d-%b-%Y")
status, messages = mail.search(None, f'(SINCE {today})')

print("EMAILS SENT TODAY:")
print("=" * 50)

if messages[0]:
    for num in messages[0].split():
        status, data = mail.fetch(num, "(BODY.PEEK[HEADER.FIELDS (TO SUBJECT DATE)])")
        header = data[0][1].decode("utf-8", errors="ignore")
        print(header)
        print("-" * 30)
else:
    print("No emails sent today.")

mail.logout()
