/**
 * Translation Engine
 * Handles STT → Translation → TTS pipeline
 */

const axios = require('axios');
const FormData = require('form-data');

class TranslationEngine {
  constructor(config = {}) {
    this.config = {
      whisperApiKey: config.whisperApiKey || process.env.OPENAI_API_KEY,
      claudeApiKey: config.claudeApiKey || process.env.ANTHROPIC_API_KEY,
      elevenLabsApiKey: config.elevenLabsApiKey || process.env.ELEVENLABS_API_KEY,
      ...config
    };
    
    // Voice IDs per language
    this.voices = {
      'de': 'IKne3meq5aSn9XLyUdCD', // Daniel (German)
      'en': 'EXAVITQu4vr4xnSDxMaL', // Sarah (English)
      'es': 'onwK4e9ZLuTAKqWW03F9', // Spanish
      'fr': 'zrHiDhphv9ZnVXBqCLjz' // French
    };
    
    // Language pairs
    this.languagePairs = {
      'de-en': { from: 'German', to: 'English' },
      'en-de': { from: 'English', to: 'German' },
      'de-es': { from: 'German', to: 'Spanish' },
      'es-de': { from: 'Spanish', to: 'German' },
      'de-fr': { from: 'German', to: 'French' },
      'fr-de': { from: 'French', to: 'German' },
      'en-es': { from: 'English', to: 'Spanish' },
      'es-en': { from: 'Spanish', to: 'English' },
      'en-fr': { from: 'English', to: 'French' },
      'fr-en': { from: 'French', to: 'English' },
      'es-fr': { from: 'Spanish', to: 'French' },
      'fr-es': { from: 'French', to: 'Spanish' }
    };
  }
  
  /**
   * Transcribe audio to text
   * @param {Buffer} audioBuffer - Audio data
   * @param {string} language - Source language code
   * @returns {Promise<string>} Transcribed text
   */
  async transcribe(audioBuffer, language) {
    try {
      const form = new FormData();
      form.append('file', audioBuffer, {
        filename: 'audio.wav',
        contentType: 'audio/wav'
      });
      form.append('model', 'whisper-1');
      form.append('language', language);
      
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${this.config.whisperApiKey}`
          },
          timeout: 10000
        }
      );
      
      return response.data.text;
    } catch (error) {
      console.error('[TranslationEngine] Transcription error:', error.message);
      throw error;
    }
  }
  
  /**
   * Translate text
   * @param {string} text - Text to translate
   * @param {string} fromLang - Source language
   * @param {string} toLang - Target language
   * @returns {Promise<string>} Translated text
   */
  async translate(text, fromLang, toLang) {
    try {
      const pairKey = `${fromLang}-${toLang}`;
      const pair = this.languagePairs[pairKey];
      
      if (!pair) {
        throw new Error(`Unsupported language pair: ${pairKey}`);
      }
      
      const prompt = `Translate the following ${pair.from} text to ${pair.to}. 
Provide ONLY the translation, no explanations or notes.
Maintain the same tone, formality, and speaking style.
This is for real-time interpretation, so be natural and conversational.

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
          },
          timeout: 5000
        }
      );
      
      return response.data.content[0].text.trim();
    } catch (error) {
      console.error('[TranslationEngine] Translation error:', error.message);
      throw error;
    }
  }
  
  /**
   * Synthesize text to speech
   * @param {string} text - Text to synthesize
   * @param {string} language - Target language
   * @returns {Promise<Buffer>} Audio buffer
   */
  async synthesize(text, language) {
    try {
      const voiceId = this.voices[language] || this.voices['en'];
      
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.config.elevenLabsApiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer',
          timeout: 10000
        }
      );
      
      return Buffer.from(response.data);
    } catch (error) {
      console.error('[TranslationEngine] Synthesis error:', error.message);
      throw error;
    }
  }
  
  /**
   * Full translation pipeline
   * @param {Buffer} audioBuffer - Input audio
   * @param {string} fromLang - Source language
   * @param {string} toLang - Target language
   * @returns {Promise<{transcript: string, translation: string, audio: Buffer}>}
   */
  async translateAudio(audioBuffer, fromLang, toLang) {
    // Transcribe
    const transcript = await this.transcribe(audioBuffer, fromLang);
    if (!transcript || transcript.trim().length === 0) {
      throw new Error('No speech detected');
    }
    
    // Translate
    const translation = await this.translate(transcript, fromLang, toLang);
    
    // Synthesize
    const audio = await this.synthesize(translation, toLang);
    
    return {
      transcript,
      translation,
      audio
    };
  }
}

module.exports = TranslationEngine;
