// Inject BEFORE page loads to intercept turnstile.render()
window.__turnstileParams = null;
window.__turnstileCallback = null;

const checkInterval = setInterval(() => {
    if (window.turnstile) {
        clearInterval(checkInterval);
        const originalRender = window.turnstile.render;
        
        window.turnstile.render = function(container, options) {
            // Capture the parameters we need for 2Captcha
            window.__turnstileParams = {
                sitekey: options.sitekey,
                action: options.action || null,
                cData: options.cData || null,
                chlPageData: options.chlPageData || null,
                pageurl: window.location.href
            };
            
            // Store callback for later
            window.__turnstileCallback = options.callback;
            
            console.log('🎯 Turnstile params captured:', JSON.stringify(window.__turnstileParams));
            
            // Don't actually render - we'll solve via 2Captcha
            return 'intercepted';
        };
        
        console.log('✅ Turnstile interceptor installed');
    }
}, 10);

// Timeout after 30 seconds
setTimeout(() => clearInterval(checkInterval), 30000);
