# Azure & Teams Setup Guide

## Prerequisites

- Microsoft Teams account
- Azure subscription ([free tier](https://azure.microsoft.com/free/))
- Node.js 18+
- npm or yarn

## Step 1: Create Azure Bot Resource

### 1.1 Azure Portal Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Azure Bot"
4. Click "Create"

**Configuration:**
- **Bot handle:** `teams-un-translator` (or your preferred name)
- **Subscription:** Your subscription
- **Resource group:** Create new or use existing
- **Pricing tier:** F0 (Free) for testing, S1 for production
- **Creation type:** "Create new Microsoft App ID"

5. Click "Review + Create"
6. Wait for deployment to complete

### 1.2 Get Bot Credentials

1. Go to your bot resource
2. Click "Configuration" in left menu
3. Copy **Microsoft App ID**
4. Click "Manage" next to Microsoft App ID
5. Go to "Certificates & secrets"
6. Click "New client secret"
7. Copy the **secret value** (you only see this once!)

Save these:
```
MICROSOFT_APP_ID=<your-app-id>
MICROSOFT_APP_PASSWORD=<your-secret>
```

## Step 2: Configure Bot Endpoint

### 2.1 Deploy Bot (or Use ngrok for testing)

**For testing (ngrok):**
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com

# Run bot locally
npm start

# In another terminal, expose it
ngrok http 3978

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**For production:**
- Deploy to Azure App Service, AWS, or your server
- Ensure HTTPS is enabled
- Get your public URL

### 2.2 Set Messaging Endpoint

1. Go to your Azure Bot resource
2. Click "Configuration"
3. Set **Messaging endpoint:** `https://YOUR-URL/api/messages`
4. Click "Apply"

## Step 3: Enable Teams Channel

1. In Azure Bot resource, click "Channels"
2. Click "Microsoft Teams" icon
3. Enable "Microsoft Teams" channel
4. Accept terms
5. Click "Apply"

## Step 4: Configure API Keys

### 4.1 Get API Keys

You need:
- **OpenAI API Key** (for Whisper STT): https://platform.openai.com/api-keys
- **Anthropic API Key** (for Claude translation): https://console.anthropic.com/
- **ElevenLabs API Key** (for TTS): https://elevenlabs.io/app/settings/api-keys

### 4.2 Create .env File

```bash
cd /Users/tommie/clawd/projects/teams-un-translator
cp .env.example .env
```

Edit `.env`:
```env
# Azure Bot
MICROSOFT_APP_ID=your-app-id
MICROSOFT_APP_PASSWORD=your-app-password
MICROSOFT_APP_TYPE=MultiTenant

# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=sk_...

# Bot Settings
PORT=3978
NODE_ENV=development
```

## Step 5: Create Teams App Manifest

### 5.1 Generate Manifest

Create `manifest.json`:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
  "manifestVersion": "1.16",
  "version": "0.1.0",
  "id": "YOUR-MICROSOFT-APP-ID",
  "packageName": "com.clawdbot.teams-translator",
  "developer": {
    "name": "Your Company",
    "websiteUrl": "https://yourcompany.com",
    "privacyUrl": "https://yourcompany.com/privacy",
    "termsOfUseUrl": "https://yourcompany.com/terms"
  },
  "name": {
    "short": "UN Translator",
    "full": "UN-Style Real-Time Translation Bot"
  },
  "description": {
    "short": "Real-time translation for multilingual meetings",
    "full": "Provides UN-style simultaneous interpretation for Teams meetings in multiple languages"
  },
  "icons": {
    "outline": "outline.png",
    "color": "color.png"
  },
  "accentColor": "#0078D4",
  "bots": [
    {
      "botId": "YOUR-MICROSOFT-APP-ID",
      "scopes": [
        "team",
        "personal",
        "groupchat"
      ],
      "supportsFiles": false,
      "isNotificationOnly": false
    }
  ],
  "permissions": [
    "identity",
    "messageTeamMembers"
  ],
  "validDomains": [
    "YOUR-DOMAIN.ngrok.io"
  ],
  "webApplicationInfo": {
    "id": "YOUR-MICROSOFT-APP-ID",
    "resource": "https://YOUR-DOMAIN.ngrok.io"
  }
}
```

### 5.2 Create App Package

1. Create icon images:
   - `color.png`: 192×192px color icon
   - `outline.png`: 32×32px white outline icon

2. Package files:
```bash
zip -r teams-app.zip manifest.json color.png outline.png
```

## Step 6: Install in Teams

### 6.1 Upload App

1. Open Microsoft Teams
2. Click "Apps" in left sidebar
3. Click "Manage your apps" (bottom left)
4. Click "Upload an app"
5. Click "Upload a custom app"
6. Select `teams-app.zip`
7. Click "Add"

### 6.2 Add to Meeting

**Option A: Add to specific meeting**
1. Go to a Teams meeting
2. Click "..." (More options)
3. Click "Add an app"
4. Search for "UN Translator"
5. Click "Add"

**Option B: Add to team**
1. Go to a Team
2. Click "..." next to team name
3. Click "Manage team"
4. Click "Apps" tab
5. Click "More apps"
6. Find "UN Translator"
7. Click "Add"

## Step 7: Test

### 7.1 Start Bot Locally

```bash
npm install
npm start
```

You should see:
```
[Bot] Server listening on port 3978
[Bot] Ready to receive messages
```

### 7.2 Test in Teams

1. Create a test meeting
2. Invite the bot
3. Bot should send language selection card
4. Select a language
5. Start talking - check logs for translation activity

## Troubleshooting

### Bot not responding
- Check ngrok is running
- Verify messaging endpoint in Azure
- Check bot credentials in .env
- Look at bot logs for errors

### Audio not working
- Verify Teams meeting has started
- Check bot has access to meeting audio
- Verify API keys are valid
- Check network connectivity

### Translation errors
- Verify all API keys are set
- Check API rate limits
- Verify language codes are correct
- Look at TranslationEngine logs

## Production Deployment

For production, deploy to:
- **Azure App Service** (recommended for Azure bot)
- **AWS EC2 / Lambda**
- **Your own server**

Requirements:
- HTTPS endpoint
- Persistent storage (Redis/database for meeting state)
- High availability (99.9%+ uptime)
- Monitoring & logging

## Next Steps

- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Details](ARCHITECTURE.md)
- [API Reference](API.md)

## Support

Issues? Check:
- Azure Bot logs in Azure Portal
- Bot application logs
- Teams app troubleshooting tools
