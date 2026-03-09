#!/usr/bin/env python3
"""Fix to inject interceptor BEFORE page loads using add_init_script"""

path = '/Users/administrator/job-hunter-system/worker/tools/indeed_ultra_stealth.py'

with open(path, 'r') as f:
    content = f.read()

# Find the setup method and add init script injection
old_setup_end = '''        logger.info(f"Indeed Ultra: Browser initialized (WebRTC blocked, real profile: {self.use_real_profile})")'''

new_setup_end = '''        logger.info(f"Indeed Ultra: Browser initialized (WebRTC blocked, real profile: {self.use_real_profile})")
        
        # Add Turnstile interceptor script to run before any page loads
        await self.page.add_init_script("""
            window.__turnstileParams = null;
            window.__tsCallback = null;
            
            Object.defineProperty(window, 'turnstile', {
                configurable: true,
                set: function(val) {
                    const originalRender = val.render;
                    val.render = function(container, options) {
                        window.__turnstileParams = {
                            sitekey: options.sitekey,
                            action: options.action || null,
                            cData: options.cData || null,
                            chlPageData: options.chlPageData || null
                        };
                        window.__tsCallback = options.callback;
                        console.log('🎯 Turnstile intercepted:', JSON.stringify(window.__turnstileParams));
                        return originalRender.call(val, container, options);
                    };
                    Object.defineProperty(window, 'turnstile', {value: val, writable: true});
                }
            });
        """)'''

if old_setup_end in content:
    content = content.replace(old_setup_end, new_setup_end)
    with open(path, 'w') as f:
        f.write(content)
    print("✅ Added init script to setup!")
else:
    print("❌ Could not find setup end marker")
