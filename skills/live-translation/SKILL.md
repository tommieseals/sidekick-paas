# Live Translation Skill

Real-time phone translation service - converts conversations between languages in real-time.

## Features

- **Bidirectional Translation**: Both parties hear in their preferred language
- **Multiple Language Support**: Spanish ↔ English (expandable)
- **Real-time Processing**: Low-latency STT → Translation → TTS pipeline
- **Smart Context**: Uses LLM for context-aware, natural translations
- **Voice Cloning**: Maintains natural speaking voice characteristics

## Architecture

```
Caller (Lang A)  →  STT  →  Translation  →  TTS (Lang B)  →  Listener
                       ↓                        ↑
                    Claude/GPT             ElevenLabs
                       ↑                        ↓
Listener (Lang B)  ←  TTS  ←  Translation  ←  STT  ←  Caller
```

## Usage

### Via Phone Call

1. **Direct Translation Number**:
   ```
   Call the translation service number
   → Select language pair
   → Enter target number
   → Conversation auto-translated
   ```

2. **Inbound Translation**:
   ```
   Give callers a translation-enabled number
   → They speak their language
   → You hear in English
   → You respond in English
   → They hear in their language
   ```

### Via Clawdbot Command

```
/translate call +1234567890 spanish-to-english
```

## Configuration

Set in `clawdbot.json` under `skills.entries.live-translation`:

```json
{
  "skills": {
    "entries": {
      "live-translation": {
        "enabled": true,
        "config": {
          "defaultLanguagePair": "es-en",
          "provider": {
            "stt": "openai-whisper",
            "translation": "claude",
            "tts": "elevenlabs"
          },
          "languages": {
            "es": {
              "name": "Spanish",
              "voice": "ElevenLabs Spanish voice ID",
              "whisperLang": "es"
            },
            "en": {
              "name": "English", 
              "voice": "ElevenLabs English voice ID",
              "whisperLang": "en"
            }
          }
        }
      }
    }
  }
}
```

## Requirements

- Voice-call plugin configured (Telnyx/Twilio)
- OpenAI Whisper API key (or openai-whisper-api skill)
- ElevenLabs API key
- Claude/GPT API key

## Cost Estimate

Per minute of translated call:
- Phone: ~$0.01-0.02
- STT: ~$0.006
- Translation: ~$0.01-0.02  
- TTS: ~$0.15-0.30
**Total: ~$0.18-0.35/minute**

## Technical Details

### Translation Pipeline

1. **Audio Capture** - Receive audio stream from phone
2. **STT Processing** - Convert to text (streaming or chunked)
3. **Translation** - LLM-based context-aware translation
4. **TTS Generation** - Natural voice synthesis
5. **Audio Playback** - Stream back to caller

### Latency Optimization

- **Chunk-based processing** - Don't wait for full sentences
- **Streaming TTS** - Start playback before complete
- **Smart buffering** - Balance quality vs speed
- **Parallel processing** - Both directions simultaneously

### Language Detection

Auto-detect spoken language when not specified:
```javascript
const detectedLang = await detectLanguage(audioChunk);
```

## Roadmap

- [x] Basic Spanish ↔ English
- [ ] Add more language pairs
- [ ] Conference call support (3+ people)
- [ ] Real-time transcript saving
- [ ] Custom voice cloning per user
- [ ] Mobile app integration

## Support

Built by Clawdbot for Rusty (2026-02-04)
