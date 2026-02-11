#!/usr/bin/env node
/**
 * German Translation Test
 * Quick test of German ↔ English translation
 */

const TranslationService = require('./translation-service');

async function testGerman() {
  console.log('🇩🇪 ↔️ 🇺🇸 German Translation Test\n');
  
  const service = new TranslationService({
    claudeApiKey: process.env.ANTHROPIC_API_KEY
  });

  const testPhrases = [
    { text: 'Guten Tag, wie geht es Ihnen?', from: 'de', to: 'en', note: 'Formal greeting' },
    { text: 'Hello, how are you?', from: 'en', to: 'de', note: 'Response' },
    { text: 'Wo ist der nächste Bahnhof?', from: 'de', to: 'en', note: 'Asking directions' },
    { text: 'I would like to order a coffee', from: 'en', to: 'de', note: 'Ordering' },
    { text: 'Können Sie mir helfen?', from: 'de', to: 'en', note: 'Asking for help' },
    { text: 'What time is it?', from: 'en', to: 'de', note: 'Time question' }
  ];

  console.log('Testing translation quality...\n');
  console.log('━'.repeat(70));

  for (const phrase of testPhrases) {
    try {
      const translation = await service.translateText(phrase.text, phrase.from, phrase.to);
      
      const fromFlag = phrase.from === 'de' ? '🇩🇪' : '🇺🇸';
      const toFlag = phrase.to === 'de' ? '🇩🇪' : '🇺🇸';
      
      console.log(`\n${phrase.note}:`);
      console.log(`${fromFlag} "${phrase.text}"`);
      console.log(`${toFlag} "${translation}"`);
    } catch (error) {
      console.error(`\n❌ Error translating "${phrase.text}": ${error.message}`);
      if (error.response) {
        console.error('Response:', error.response.status, error.response.statusText);
      }
    }
  }

  console.log('\n' + '━'.repeat(70));
  console.log('\n✅ Translation test complete!');
  console.log('\n📞 Ready for phone integration:');
  console.log('   US Number:     +1 618-203-0978 (German → English)');
  console.log('   German Number: +49 173 3824235 (English → German)');
  console.log('\n💡 Next: Record a German audio file to test full pipeline');
  console.log('   node translation-service.js your-german-audio.wav de en');
}

// Run test
testGerman().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error('\n🔧 Check that ANTHROPIC_API_KEY is set');
  process.exit(1);
});
