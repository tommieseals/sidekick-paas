#!/usr/bin/env node
/**
 * Live Translation Demo
 * Quick test of the translation pipeline
 */

const TranslationService = require('./translation-service');
const fs = require('fs').promises;

async function demo() {
  console.log('🌍 Live Translation Demo\n');
  
  const service = new TranslationService({
    whisperApiKey: process.env.OPENAI_API_KEY,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_KEY,
    claudeApiKey: process.env.ANTHROPIC_API_KEY
  });

  // Demo 1: Text-only translation
  console.log('📝 Demo 1: Text Translation');
  console.log('----------------------------');
  
  const testPhrases = [
    { text: 'Hola, ¿cómo estás?', from: 'es', to: 'en' },
    { text: 'Hello, how are you?', from: 'en', to: 'es' },
    { text: '¿Dónde está el baño?', from: 'es', to: 'en' },
    { text: 'I would like to order food', from: 'en', to: 'es' }
  ];

  for (const phrase of testPhrases) {
    try {
      const translation = await service.translateText(phrase.text, phrase.from, phrase.to);
      console.log(`\n${phrase.from.toUpperCase()}: "${phrase.text}"`);
      console.log(`${phrase.to.toUpperCase()}: "${translation}"`);
    } catch (error) {
      console.error(`Error translating: ${error.message}`);
    }
  }

  console.log('\n\n✅ Text translation working!');
  console.log('\n📞 Next Steps:');
  console.log('1. Create test audio file to demo full pipeline');
  console.log('2. Integrate with voice-call plugin');
  console.log('3. Set up phone number for live testing');
  
  console.log('\n💡 To test with audio:');
  console.log('   Record a WAV file and run:');
  console.log('   node translation-service.js your-audio.wav es en');
}

// Run demo
demo().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});
