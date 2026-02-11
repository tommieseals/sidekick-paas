# Teams UN-Style Translator Bot

Real-time multi-language translation bot for Microsoft Teams meetings - UN simultaneous interpretation style.

## 🎯 Vision

Enable multi-language meetings where everyone hears conversations in their preferred language simultaneously, just like UN meetings with human interpreters.

## ✨ Features

### Core Capabilities
- **Multi-language support**: German, English, Spanish, French (expandable)
- **Real-time translation**: <1 second latency
- **Speaker identification**: "Klaus (German): We need analysis..."
- **Individual audio streams**: Each person hears their chosen language
- **Live captions**: Backup visual translation
- **Crosstalk handling**: Teams' built-in speaker separation

### User Experience

**Joining a meeting:**
1. Bot joins automatically (or invited)
2. Bot asks each participant: "Select your language: 🇩🇪 🇺🇸 🇪🇸 🇫🇷"
3. Participant selects preference
4. Meeting starts - everyone hears in their language!

**During meeting:**
- Klaus speaks German → Everyone else hears English/Spanish/etc.
- Sarah speaks English → Everyone else hears German/Spanish/etc.
- Real-time, continuous translation
- Visual captions show speaker + translated text

## 🏗️ Architecture

```
Teams Meeting
    ↓
┌─────────────────────────────┐
│   Teams Bot Framework       │
│  - Audio streams            │
│  - Speaker identification   │
│  - Participant management   │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│  Translation Engine         │
│  - Speech-to-Text (Whisper) │
│  - Translation (Claude)     │
│  - Text-to-Speech (11Labs)  │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│  Audio Router               │
│  - Per-participant streams  │
│  - Language-specific output │
└─────────────────────────────┘
    ↓
Individual participants hear their language
```

## 📋 Project Structure

```
teams-un-translator/
├── src/
│   ├── bot.js              # Main Teams bot
│   ├── translation-engine.js  # STT → Translation → TTS
│   ├── audio-router.js     # Per-participant routing
│   ├── language-selector.js   # UI for language selection
│   └── meeting-manager.js  # Meeting state & participants
├── config/
│   ├── teams-manifest.json # Teams app manifest
│   ├── azure-config.json   # Azure deployment config
│   └── languages.json      # Supported languages
├── tests/
│   └── e2e-test.js        # End-to-end testing
├── docs/
│   ├── SETUP.md           # Azure & Teams setup
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── ARCHITECTURE.md    # Technical details
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Microsoft Teams account
- Azure subscription (free tier works)
- Node.js 18+
- API keys: OpenAI, Anthropic, ElevenLabs

### Installation

```bash
cd /Users/tommie/clawd/projects/teams-un-translator
npm install
```

### Configuration

1. **Set up Azure Bot**
   - Create Bot resource in Azure Portal
   - Get App ID & Secret
   - Configure OAuth connection

2. **Configure API Keys**
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

3. **Deploy Bot**
   ```bash
   npm run deploy
   ```

4. **Install in Teams**
   - Upload app manifest to Teams
   - Add bot to a meeting

## 💰 Cost Estimate

Per 60-minute meeting with 4 participants, 3 languages:

- Speech-to-Text: ~$0.36 (60 min × $0.006/min)
- Translation: ~$1.80 (60 min × 3 speakers × $0.01/min)
- Text-to-Speech: ~$32.40 (60 min × 3 speakers × $0.18/min)

**Total: ~$35/meeting** (scales with # of speakers & languages)

## 🗺️ Development Roadmap

### Phase 1: Foundation (Week 1) ✓ IN PROGRESS
- [x] Project structure
- [ ] Teams bot framework
- [ ] Language selection UI
- [ ] Basic 1-language translation
- [ ] Meeting state management

### Phase 2: Multi-Language (Week 2)
- [ ] Multi-language routing
- [ ] Per-participant audio streams
- [ ] Speaker identification
- [ ] Live captions

### Phase 3: Optimization (Week 3)
- [ ] Latency optimization (<1s)
- [ ] Quality improvements
- [ ] Error handling
- [ ] Fallback mechanisms

### Phase 4: Production (Week 4)
- [ ] Azure deployment
- [ ] Teams app store submission
- [ ] Documentation
- [ ] User testing
- [ ] Performance monitoring

## 🔧 Technical Details

### Translation Pipeline

```javascript
// For each speaker utterance:
const audio = await captureAudio(speaker);
const transcript = await whisper.transcribe(audio, speaker.language);

// Translate to all other languages
for (const participant of meeting.participants) {
  if (participant.language !== speaker.language) {
    const translation = await claude.translate(
      transcript,
      speaker.language,
      participant.language
    );
    const audioOut = await elevenlabs.synthesize(
      translation,
      participant.language
    );
    await sendAudio(participant, audioOut);
  }
}
```

### Latency Budget

- Audio capture: 50-100ms
- STT (Whisper): 200-300ms
- Translation (Claude): 100-200ms
- TTS (ElevenLabs): 200-300ms
- Network: 50-100ms

**Total: 600-1000ms** (acceptable for real-time interpretation)

## 🌍 Supported Languages

### Initial Release
- 🇩🇪 German
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French

### Planned
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇯🇵 Japanese
- 🇨🇳 Mandarin
- 🇷🇺 Russian

## 📚 Documentation

- [Azure & Teams Setup](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Details](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)

## 🤝 Team

Built by Clawdbot for Rusty
Started: 2026-02-04

## 📄 License

Proprietary - Internal use only

---

**Status:** 🟡 In Development
**Next Milestone:** Teams bot framework + language selection
**ETA:** Week 1 complete by 2026-02-11
