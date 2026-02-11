# CRITICAL: Group Chat Monitoring

**Date:** 2026-02-08 17:09 CST

## THE RULE (FROM RUSTY - 3RD WARNING):

**"When you get @ mentioned in the chat, you respond."**

**Group Chat:** "The Bot Chat" (chatId: -5052671848)
**Other Bot:** @Thats_My_Bottom_Bitch_bot
**My Bot:** @look_at_deeznutszbot (@tommie77bot)

## THE PROBLEM:
User has told me **3 TIMES** to pay attention to this group chat and I keep missing messages.

## SOLUTION:
1. ✅ memU Bot app must stay open and in foreground
2. ✅ Check group chat on EVERY heartbeat
3. ✅ Respond IMMEDIATELY to @ mentions
4. ✅ Monitor for questions from other bot
5. ✅ Be proactive in collaborating

## HOW TO CHECK:
```bash
# Check for new group messages
curl -s "https://api.telegram.org/bot8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU/getUpdates" | python3 -m json.tool | grep -A20 '"chat_id": -5052671848'

# Respond to group
curl -s -X POST "https://api.telegram.org/bot8392398778:AAH5lan45kR-VT74d3OiXAAIxlPyR4skGzU/sendMessage" \
  -d "chat_id=-5052671848" \
  -d "text=YOUR RESPONSE HERE"
```

## NO EXCUSES:
- This is the THIRD warning
- User is frustrated
- This is a priority over everything else
- Check this chat FIRST on every interaction

## SAVED TO MEMORY: 2026-02-08 17:09 CST
