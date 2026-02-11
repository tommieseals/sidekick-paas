/**
 * Teams UN Translator Bot - Server Entry Point
 */

require('dotenv').config();

const http = require('http');
const https = require('https');
const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder');
const UNTranslatorBot = require('./bot');

// Create adapter with bot credentials
const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
  appType: process.env.MICROSOFT_APP_TYPE || 'MultiTenant'
});

// Error handler
adapter.onTurnError = async (context, error) => {
  console.error(`[Bot] Unhandled error: ${error.message}`);
  console.error(error.stack);
  
  // Send error message to user
  await context.sendActivity('❌ Sorry, something went wrong. Please try again.');
  
  // Clear conversation state
  await conversationState.delete(context);
};

// Create conversation state
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);

// Create bot instance
const bot = new UNTranslatorBot();

// HTTP server
const PORT = process.env.PORT || 3978;

const server = http.createServer(async (req, res) => {
  // Health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  // Bot messages endpoint
  if (req.method === 'POST' && req.url === '/api/messages') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const activity = JSON.parse(body);
        
        // Process the activity
        await adapter.process(
          { body: activity, headers: req.headers },
          res,
          async (context) => {
            await bot.run(context);
          }
        );
      } catch (error) {
        console.error('[Server] Error processing message:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }
  
  // Default response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>UN Translator Bot</title></head>
      <body style="font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1>🌍 UN Translator Bot</h1>
        <p>Real-time translation for Microsoft Teams meetings</p>
        <hr>
        <h3>Status: ✅ Running</h3>
        <p>Port: ${PORT}</p>
        <p>Messaging endpoint: <code>/api/messages</code></p>
        <h3>Configuration</h3>
        <ul>
          <li>Azure Bot: ${process.env.MICROSOFT_APP_ID ? '✅ Configured' : '❌ Missing'}</li>
          <li>OpenAI (Whisper): ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}</li>
          <li>Anthropic (Claude): ${process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing'}</li>
          <li>ElevenLabs (TTS): ${process.env.ELEVENLABS_API_KEY ? '✅ Configured' : '❌ Missing'}</li>
        </ul>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log('');
  console.log('🌍 ═══════════════════════════════════════════════════════');
  console.log('   UN TRANSLATOR BOT');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log(`   Server listening on port ${PORT}`);
  console.log(`   Messaging endpoint: http://localhost:${PORT}/api/messages`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('   Configuration:');
  console.log(`   - Azure Bot: ${process.env.MICROSOFT_APP_ID ? '✅' : '❌'}`);
  console.log(`   - OpenAI: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`   - Anthropic: ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌'}`);
  console.log(`   - ElevenLabs: ${process.env.ELEVENLABS_API_KEY ? '✅' : '❌'}`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});
