# Teams UN Translator - Quick Start

## 🚀 Project Started: 2026-02-04

**Goal:** Build UN-style simultaneous translation for Microsoft Teams meetings.

## ✅ What's Built (Week 1 - Day 1)

### Core Infrastructure
- ✅ Project structure created
- ✅ Teams bot framework (`src/bot.js`)
- ✅ Translation engine (`src/translation-engine.js`)
- ✅ Audio router (`src/audio-router.js`)
- ✅ Meeting manager (`src/meeting-manager.js`)
- ✅ Complete documentation
- ✅ Dependencies installed

### Features Implemented
- ✅ Language selection UI (adaptive cards)
- ✅ Multi-language support (German, English, Spanish, French)
- ✅ Translation pipeline (Whisper → Claude → ElevenLabs)
- ✅ Per-participant audio routing
- ✅ Meeting state management
- ✅ Commands (/status, /help)

## 📊 Architecture

```
Teams Meeting
    ↓
Teams Bot (bot.js)
    ↓
Translation Engine (STT → Translation → TTS)
    ↓
Audio Router (per-participant streams)
    ↓
Participants hear their chosen language
```

## 🎯 Next Steps

### Immediate (This Week)
1. **Azure Setup** (1-2 hours)
   - Create Azure Bot resource
   - Get credentials
   - Configure Teams channel

2. **Local Testing** (2-3 hours)
   - Set up .env with API keys
   - Run bot locally with ngrok
   - Test in Teams meeting

3. **Audio Integration** (2-3 days)
   - Integrate Teams real-time media
   - Test audio routing
   - Optimize latency

### Week 2
- Multi-language routing polish
- Production deployment
- Performance optimization

### Week 3
- Extended language support
- Advanced features
- User testing

## 💻 Development

### Install Dependencies
```bash
cd /Users/tommie/clawd/projects/teams-un-translator
npm install
```

### Configure
```bash
cp .env.example .env
# Edit .env with your credentials
```

### Run Locally
```bash
npm start
```

### Test
```bash
npm test
```

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[docs/SETUP.md](docs/SETUP.md)** - Complete Azure & Teams setup
- **.env.example** - Environment variable template

## 🔑 Required API Keys

1. **Azure Bot** - Free tier available
   - Microsoft App ID
   - Microsoft App Password

2. **OpenAI** - For Whisper STT
   - Get at: https://platform.openai.com/api-keys
   - Cost: ~$0.006/minute

3. **Anthropic** - For Claude translation
   - Get at: https://console.anthropic.com/
   - Cost: ~$0.01-0.02/translation

4. **ElevenLabs** - For TTS
   - Get at: https://elevenlabs.io/
   - Cost: ~$0.18/minute

**Total cost: ~$0.20/minute per speaker**

## 🎯 Timeline

- **Week 1:** Foundation + Azure setup ← YOU ARE HERE
- **Week 2:** Audio integration + testing
- **Week 3:** Optimization + polish
- **Week 4:** Production deployment

## 📞 Your Numbers (for phone translation)

These are configured in the separate phone translation project:
- US: +1 618-203-0978
- Germany: +49 173 3824235

This Teams bot is for **in-meeting translation** (different from phone calls).

## 🤝 Support

Built by Clawdbot for Rusty
Questions? Check:
- docs/SETUP.md for detailed setup
- Bot logs for errors
- Azure Portal for bot status

---

**Status:** 🟢 Foundation Complete
**Next:** Azure setup + local testing
**ETA:** Ready for first test meeting by end of week
