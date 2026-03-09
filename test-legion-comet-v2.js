// Test Legion + Comet MCP v2 - Fixed prompt submission
const CDP = require('chrome-remote-interface');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function test() {
  console.log('=== LEGION + COMET TEST v2 ===\n');
  
  const targets = await CDP.List({ port: 9222 });
  
  // Find main page and sidecar
  const mainPage = targets.find(t => 
    t.type === 'page' && 
    t.url.includes('linkedin.com')
  ) || targets.find(t => 
    t.type === 'page' && 
    !t.url.includes('sidecar') && 
    t.url.includes('newtab')
  );
  
  const sidecar = targets.find(t => 
    t.type === 'page' && 
    t.url.includes('sidecar')
  );
  
  if (!mainPage || !sidecar) {
    console.log('Missing page or sidecar');
    return;
  }
  
  // Connect to main page
  console.log('1. Connecting to main page:', mainPage.url);
  const mainClient = await CDP({ target: mainPage.id, port: 9222 });
  await mainClient.Page.enable();
  await mainClient.Runtime.enable();
  
  // If not on LinkedIn, navigate there
  if (!mainPage.url.includes('linkedin.com')) {
    console.log('   Navigating to LinkedIn...');
    await mainClient.Page.navigate({ 
      url: 'https://www.linkedin.com/jobs/search/?keywords=help%20desk&location=Houston%2C%20Texas&f_AL=true' 
    });
    await mainClient.Page.loadEventFired();
    await sleep(3000);
  }
  
  // Take screenshot
  const { data: ss1 } = await mainClient.Page.captureScreenshot({ format: 'png' });
  require('fs').writeFileSync('C:/Users/tommi/clawd/linkedin-v2.png', Buffer.from(ss1, 'base64'));
  console.log('   Screenshot: linkedin-v2.png');
  
  // Connect to sidecar
  console.log('\n2. Connecting to Perplexity sidecar...');
  const sidecarClient = await CDP({ target: sidecar.id, port: 9222 });
  await sidecarClient.Runtime.enable();
  
  // Use execCommand to properly insert text (like comet-mcp does)
  const prompt = 'Click the Easy Apply button on the first job listing visible on the LinkedIn page, then fill out the application form and submit it.';
  
  console.log('   Sending prompt to Perplexity...');
  const insertResult = await sidecarClient.Runtime.evaluate({
    expression: `
      (() => {
        const el = document.querySelector('[contenteditable="true"]');
        if (el) {
          el.focus();
          document.execCommand('selectAll', false, null);
          document.execCommand('insertText', false, ${JSON.stringify(prompt)});
          return { success: true, method: 'execCommand' };
        }
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.focus();
          textarea.value = ${JSON.stringify(prompt)};
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          return { success: true, method: 'textarea' };
        }
        return { success: false };
      })()
    `,
    returnByValue: true
  });
  console.log('   Insert result:', insertResult.result.value);
  
  // Wait for React to process
  await sleep(500);
  
  // Submit with Enter key
  console.log('   Pressing Enter to submit...');
  await sidecarClient.Runtime.evaluate({
    expression: `
      (() => {
        const el = document.querySelector('[contenteditable="true"]') || document.querySelector('textarea');
        if (el) el.focus();
      })()
    `
  });
  
  await sidecarClient.Input.dispatchKeyEvent({ 
    type: 'keyDown', 
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13
  });
  await sidecarClient.Input.dispatchKeyEvent({ 
    type: 'keyUp', 
    key: 'Enter',
    code: 'Enter',
    windowsVirtualKeyCode: 13,
    nativeVirtualKeyCode: 13
  });
  
  console.log('\n3. Waiting for Perplexity to respond...');
  
  // Poll for status
  for (let i = 0; i < 10; i++) {
    await sleep(2000);
    
    const status = await sidecarClient.Runtime.evaluate({
      expression: `
        (() => {
          const body = document.body.innerText;
          const hasStop = !!document.querySelector('button[aria-label*="Stop"]');
          const hasWorking = body.includes('Working') || body.includes('Clicking') || 
                            body.includes('Navigating') || body.includes('Searching');
          const hasCompleted = body.includes('Finished') || body.includes('steps completed');
          const inputEl = document.querySelector('[contenteditable="true"]');
          const inputEmpty = inputEl && inputEl.innerText.trim().length < 5;
          
          return { 
            hasStop, 
            hasWorking, 
            hasCompleted,
            inputEmpty,
            preview: body.substring(0, 300)
          };
        })()
      `,
      returnByValue: true
    });
    
    const s = status.result.value;
    console.log(`   [${i+1}] Working: ${s.hasWorking}, Stop btn: ${s.hasStop}, Complete: ${s.hasCompleted}, Input empty: ${s.inputEmpty}`);
    
    if (s.hasCompleted || (s.inputEmpty && !s.hasWorking && !s.hasStop)) {
      console.log('\n   Response preview:', s.preview);
      break;
    }
    
    if (s.hasWorking || s.hasStop) {
      console.log('   Perplexity is working...');
    }
  }
  
  // Final screenshot
  const { data: ss2 } = await mainClient.Page.captureScreenshot({ format: 'png' });
  require('fs').writeFileSync('C:/Users/tommi/clawd/linkedin-v2-final.png', Buffer.from(ss2, 'base64'));
  console.log('\n   Final screenshot: linkedin-v2-final.png');
  
  await mainClient.close();
  await sidecarClient.close();
  console.log('\n=== TEST COMPLETE ===');
}

test().catch(console.error);
