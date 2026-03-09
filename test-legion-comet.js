// Test Legion + Comet MCP integration
const CDP = require('chrome-remote-interface');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function test() {
  console.log('=== LEGION + COMET TEST ===\n');
  
  // Get targets
  const targets = await CDP.List({ port: 9222 });
  console.log(`Found ${targets.length} targets`);
  
  // Find main page (not sidecar)
  let mainPage = targets.find(t => 
    t.type === 'page' && 
    !t.url.includes('sidecar') && 
    !t.url.includes('chrome://') &&
    !t.url.includes('chrome-extension')
  );
  
  // If no suitable page, use first page
  if (!mainPage) {
    mainPage = targets.find(t => t.type === 'page' && t.url.includes('newtab'));
  }
  
  if (!mainPage) {
    console.log('No suitable page found');
    return;
  }
  
  console.log('Using page:', mainPage.url);
  const client = await CDP({ target: mainPage.id, port: 9222 });
  
  await client.Page.enable();
  await client.Runtime.enable();
  await client.DOM.enable();
  
  // Navigate to LinkedIn Jobs
  console.log('\n1. Navigating to LinkedIn Jobs...');
  await client.Page.navigate({ url: 'https://www.linkedin.com/jobs/search/?keywords=help%20desk&location=Houston%2C%20Texas' });
  await client.Page.loadEventFired();
  console.log('LinkedIn loaded!');
  
  await sleep(3000);
  
  // Take screenshot
  const { data: screenshot } = await client.Page.captureScreenshot({ format: 'png' });
  require('fs').writeFileSync('C:/Users/tommi/clawd/linkedin-test.png', Buffer.from(screenshot, 'base64'));
  console.log('Screenshot saved to linkedin-test.png');
  
  // Check if logged in
  const { result: urlResult } = await client.Runtime.evaluate({ 
    expression: 'window.location.href' 
  });
  console.log('Current URL:', urlResult.value);
  
  // Now find Perplexity sidecar
  console.log('\n2. Finding Perplexity sidecar...');
  const sidecarTarget = targets.find(t => 
    t.type === 'page' && t.url.includes('sidecar')
  );
  
  if (sidecarTarget) {
    console.log('Found sidecar:', sidecarTarget.url);
    const sidecarClient = await CDP({ target: sidecarTarget.id, port: 9222 });
    await sidecarClient.Runtime.enable();
    
    // Type in the sidecar input
    console.log('\n3. Sending command to Perplexity...');
    const typeResult = await sidecarClient.Runtime.evaluate({
      expression: `
        (() => {
          const el = document.querySelector('[contenteditable="true"]') || document.querySelector('textarea');
          if (el) {
            el.focus();
            el.innerText = 'Apply to the first Help Desk job on this LinkedIn page. Fill out any required fields.';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            return 'Text entered';
          }
          return 'No input found';
        })()
      `,
      returnByValue: true
    });
    console.log('Type result:', typeResult.result.value);
    
    // Press Enter to submit
    await sleep(500);
    await sidecarClient.Input.dispatchKeyEvent({ type: 'keyDown', key: 'Enter' });
    await sidecarClient.Input.dispatchKeyEvent({ type: 'keyUp', key: 'Enter' });
    console.log('Sent Enter key');
    
    // Wait and check status
    await sleep(5000);
    
    const statusResult = await sidecarClient.Runtime.evaluate({
      expression: `
        (() => {
          const body = document.body.innerText;
          const hasWorking = body.includes('Working') || body.includes('Searching');
          const hasStop = document.querySelector('button[aria-label*="Stop"]');
          return { hasWorking, hasStop: !!hasStop, bodyPreview: body.substring(0, 500) };
        })()
      `,
      returnByValue: true
    });
    console.log('\nStatus:', JSON.stringify(statusResult.result.value, null, 2));
    
    await sidecarClient.close();
  } else {
    console.log('No sidecar found');
  }
  
  await client.close();
  console.log('\n=== TEST COMPLETE ===');
}

test().catch(console.error);
