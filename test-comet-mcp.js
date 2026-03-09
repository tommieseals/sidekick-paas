// Quick test of comet-mcp CDP connection
const CDP = require('chrome-remote-interface');

async function test() {
  console.log('Connecting to Comet...');
  
  // Get list of targets
  const targets = await CDP.List({ port: 9222 });
  console.log(`Found ${targets.length} targets`);
  
  // Find a page target (not iframe/worker)
  const pageTarget = targets.find(t => t.type === 'page' && !t.url.includes('newtab'));
  
  if (!pageTarget) {
    // Use first page
    const anyPage = targets.find(t => t.type === 'page');
    if (anyPage) {
      console.log('Connecting to:', anyPage.url);
      const client = await CDP({ target: anyPage.id, port: 9222 });
      
      // Navigate to Perplexity
      await client.Page.enable();
      console.log('Navigating to Perplexity...');
      await client.Page.navigate({ url: 'https://www.perplexity.ai/' });
      await client.Page.loadEventFired();
      console.log('Loaded Perplexity!');
      
      // Wait a bit
      await new Promise(r => setTimeout(r, 2000));
      
      // Get current URL
      const { result } = await client.Runtime.evaluate({ expression: 'window.location.href' });
      console.log('Current URL:', result.value);
      
      await client.close();
      console.log('Test complete!');
    }
  } else {
    console.log('Found page:', pageTarget.url);
  }
}

test().catch(console.error);
