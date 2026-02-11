#!/usr/bin/env node
/**
 * Live Translation Service
 * Handles real-time speech translation pipeline
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class TranslationService {
  constructor(config = {}) {
    this.config = {
      sttProvider: config.sttProvider || 'openai-whisper',
      ttsProvider: config.ttsProvider || 'elevenlabs',
      translationProvider: config.translationProvider || 'claude',
      whisperApiKey: config.whisperApiKey || process.env.OPENAI_API_KEY,
      elevenLabsApiKey: config.elevenLabsApiKey || process.env.ELEVENLABS_API_KEY,
      claudeApiKey: config.claudeApiKey || process.env.ANTHROPIC_API_KEY,
      ...config
    };

    this.languagePairs = config.languagePairs || {
      'de-en': { from: 'German', to: 'English', fromCode: 'de', toCode: 'en' },
      'en-de': { from: 'English', to: 'German', fromCode: 'en', toCode: 'de' },
      'es-en': { from: 'Spanish', to: 'English', fromCode: 'es', toCode: 'en' },
      'en-es': { from: 'English', to: 'Spanish', fromCode: 'en', toCode: 'es' }
    };
  }

  /**
   * Translate audio file
   * @param {string} audioPath - Path to audio file
   * @param {string} fromLang - Source language code (e.g., 'es')
   * @param {string} toLang - Target language code (e.g., 'en')
   * @returns {Promise<{text: string, translation: string, audioPath: string}>}
   */
  async translateAudio(audioPath, fromLang, toLang) {
    try {
      // Step 1: Speech-to-Text
      const transcript = await this.speechToText(audioPath, fromLang);
      if (!transcript || transcript.trim().length === 0) {
        throw new Error('No speech detected in audio');
      }

      // Step 2: Translate text
      const translation = await this.translateText(transcript, fromLang, toLang);

      // Step 3: Text-to-Speech
      const outputAudioPath = await this.textToSpeech(translation, toLang);

      return {
        originalText: transcript,
        translatedText: translation,
        audioPath: outputAudioPath
      };
    } catch (error) {
      console.error('[TranslationService] Error:', error);
      throw error;
    }
  }

  /**
   * Speech-to-Text using Whisper API
   */
  async speechToText(audioPath, language) {
    const FormData = require('form-data');
    const axios = require('axios');
    
    const form = new FormData();
    form.append('file', await fs.readFile(audioPath), {
      filename: path.basename(audioPath),
      contentType: 'audio/wav'
    });
    form.append('model', 'whisper-1');
    if (language) {
      form.append('language', language);
    }

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${this.config.whisperApiKey}`
        }
      }
    );

    return response.data.text;
  }

  /**
   * Translate text using Claude/GPT
   */
  async translateText(text, fromLang, toLang) {
    const axios = require('axios');
    
    const pairKey = `${fromLang}-${toLang}`;
    const pair = this.languagePairs[pairKey];
    
    if (!pair) {
      throw new Error(`Unsupported language pair: ${pairKey}`);
    }

    const prompt = `Translate the following ${pair.from} text to ${pair.to}. 
Provide ONLY the translation, no explanations or notes.
Maintain the same tone, formality, and speaking style.

Text: "${text}"

Translation:`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      },
      {
        headers: {
          'x-api-key': this.config.claudeApiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    return response.data.content[0].text.trim();
  }

  /**
   * Text-to-Speech using ElevenLabs
   */
  async textToSpeech(text, language) {
    const axios = require('axios');
    const outputPath = `/tmp/tts_${Date.now()}.mp3`;

    // Default voice IDs (you should configure these properly)
    const voiceIds = {
      'en': 'EXAVITQu4vr4xnSDxMaL', // Sarah (English)
      'de': 'IKne3meq5aSn9XLyUdCD', // Daniel (German)
      'es': 'onwK4e9ZLuTAKqWW03F9' // Spanish voice
    };

    const voiceId = voiceIds[language] || voiceIds['en'];

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.config.elevenLabsApiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    await fs.writeFile(outputPath, response.data);
    return outputPath;
  }

  /**
   * Stream-based translation (for real-time)
   * This is a placeholder for future streaming implementation
   */
  async streamTranslate(audioStream, fromLang, toLang, onChunk) {
    // TODO: Implement streaming translation
    // This would require:
    // 1. Streaming STT (Deepgram or streaming Whisper)
    // 2. Chunk-based translation
    // 3. Streaming TTS
    throw new Error('Streaming translation not yet implemented');
  }
}

module.exports = TranslationService;

// CLI usage
if (require.main === module) {
  const [,, audioPath, fromLang, toLang] = process.argv;
  
  if (!audioPath || !fromLang || !toLang) {
    console.error('Usage: node translation-service.js <audio-file> <from-lang> <to-lang>');
    console.error('Example: node translation-service.js audio.wav es en');
    process.exit(1);
  }

  const service = new TranslationService();
  
  service.translateAudio(audioPath, fromLang, toLang)
    .then(result => {
      console.log('Original:', result.originalText);
      console.log('Translation:', result.translatedText);
      console.log('Audio saved to:', result.audioPath);
    })
    .catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
}
