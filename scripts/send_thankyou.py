import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

app_pass = sys.argv[1] if len(sys.argv) > 1 else ""

# Email details
sender = "tommieseals7700@gmail.com"
recipient = "pteahen@RARITYSOLUTIONS.COM"
subject = "Thank You - Project Engineer Interview"

body = """Hi Patrick,

Thank you again for taking the time to meet with me yesterday to talk about the Project Engineer role at Rarity Solutions. I really enjoyed our conversation and appreciated the chance to learn more about the team and the work you're doing.

I especially liked our discussion around automation, and how AI is starting to play a bigger role in the MSP space. It's exciting to see a company thinking ahead in those areas, and it made me even more interested in the opportunity to contribute.

I'm looking forward to the second interview next week and continuing the conversation. Please feel free to let me know if there's anything you'd like me to prepare or share beforehand.

Thanks again for your time, and I'm looking forward to speaking with you again soon.

Best,
Tommie Seals
tommieseals7700@gmail.com
618-203-0978"""

# Create message
msg = MIMEMultipart()
msg["From"] = sender
msg["To"] = recipient
msg["Subject"] = subject
msg.attach(MIMEText(body, "plain"))

# Send via Gmail SMTP
try:
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(sender, app_pass)
    server.sendmail(sender, recipient, msg.as_string())
    server.quit()
    print("Email sent successfully to", recipient)
except Exception as e:
    print("Failed to send:", e)
