const CDP = require('chrome-remote-interface');

(async () => {
  const targets = await CDP.List({ port: 9222 });
  console.log('Targets found:', targets.length);
  
  // List all pages
  const pages = targets.filter(t => t.type === 'page');
  console.log('\nPages:');
  pages.forEach(p => console.log(' -', p.title, '|', p.url.substring(0, 60)));
  
  // Find LinkedIn page
  const linkedin = pages.find(p => p.url.includes('linkedin.com'));
  if (linkedin) {
    console.log('\nConnecting to LinkedIn page...');
    const client = await CDP({ target: linkedin.id, port: 9222 });
    await client.Page.enable();
    await client.Runtime.enable();
    
    // Check current URL
    const urlResult = await client.Runtime.evaluate({ expression: 'window.location.href' });
    console.log('URL:', urlResult.result.value);
    
    // Try to find and click Easy Apply button
    const clickResult = await client.Runtime.evaluate({
      expression: `
        (() => {
          const btn = document.querySelector('button.jobs-apply-button') || 
                     document.querySelector('button[aria-label*="Easy Apply"]') ||
                     Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Easy Apply'));
          if (btn) {
            btn.click();
            return 'Clicked Easy Apply';
          }
          return 'Easy Apply button not found - buttons: ' + Array.from(document.querySelectorAll('button')).map(b => b.innerText.substring(0,20)).join(', ');
        })()
      `,
      returnByValue: true
    });
    console.log('Result:', clickResult.result.value);
    
    // Wait and take screenshot
    await new Promise(r => setTimeout(r, 2000));
    const { data } = await client.Page.captureScreenshot({ format: 'png' });
    require('fs').writeFileSync('easy-apply-result.png', Buffer.from(data, 'base64'));
    console.log('Screenshot saved');
    
    await client.close();
  } else {
    console.log('LinkedIn page not found');
  }
})();
