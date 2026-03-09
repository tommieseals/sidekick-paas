def fill_form_fields():
    # 1. Radio buttons - YES for positive, NO for negative questions
    js_radios = '''(function() {
        var clicked = 0;
        var radios = document.querySelectorAll('input[type=radio]');
        var groups = {};
        radios.forEach(r => { if (!groups[r.name]) groups[r.name] = []; groups[r.name].push(r); });
        
        Object.values(groups).forEach(function(group) {
            if (group.some(r => r.checked)) return;
            group.forEach(function(r) {
                var label = r.closest('label') ? r.closest('label').innerText : '';
                var ctx = (r.closest('fieldset') || r.closest('div') || {}).innerText || '';
                ctx = ctx.toLowerCase();
                
                if (label.trim() === 'Yes' || label.trim() === 'Yes.') {
                    if (ctx.includes('authorized') || ctx.includes('legally') || ctx.includes('willing') || 
                        ctx.includes('experience') || ctx.includes('available') || ctx.includes('commute') ||
                        ctx.includes('background') || ctx.includes('drug') || ctx.includes('citizen') ||
                        ctx.includes('eligible') || ctx.includes('able to') || ctx.includes('requirement') ||
                        ctx.includes('reliable') || ctx.includes('18 years') || ctx.includes('valid')) {
                        r.click(); clicked++;
                    }
                }
                if (label.trim() === 'No' || label.trim() === 'No.') {
                    if (ctx.includes('convicted') || ctx.includes('felony') || ctx.includes('sponsorship') || 
                        ctx.includes('visa') || ctx.includes('relative') || ctx.includes('related') ||
                        ctx.includes('disability') || ctx.includes('veteran')) {
                        r.click(); clicked++;
                    }
                }
                if (label.includes('U.S') || label.includes('Citizen')) { r.click(); clicked++; }
            });
        });
        return clicked;
    })();'''
    run_js(js_radios)
    
    # 2. Text/number inputs - React-compatible with native setter
    js_inputs = '''(function() {
        var filled = 0;
        function fillInput(input, value) {
            var ns = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            ns.call(input, value);
            input.dispatchEvent(new Event('input', {bubbles: true}));
            input.dispatchEvent(new Event('change', {bubbles: true}));
            input.dispatchEvent(new Event('blur', {bubbles: true}));
            filled++;
        }
        
        document.querySelectorAll('input[type=text], input[type=number], input[type=tel], input[type=email]').forEach(function(i) {
            if (i.value || !i.offsetParent) return;
            var ctx = (i.closest('div') || i.closest('label') || {}).innerText || '';
            var placeholder = (i.placeholder || '').toLowerCase();
            var name = (i.name || '').toLowerCase();
            var id = (i.id || '').toLowerCase();
            ctx = ctx.toLowerCase();
            var all = ctx + ' ' + placeholder + ' ' + name + ' ' + id;
            
            var val = '';
            if (all.includes('year') && (all.includes('experience') || all.includes('many'))) val = '5';
            else if (all.includes('salary') || all.includes('pay') || all.includes('rate') || all.includes('compensation') || all.includes('desired')) val = '75000';
            else if (all.includes('zip') || all.includes('postal')) val = '77095';
            else if (all.includes('city') && !all.includes('citizenship')) val = 'Houston';
            else if (all.includes('state') && !all.includes('statement')) val = 'TX';
            else if (all.includes('phone') || all.includes('mobile') || all.includes('tel')) val = '8327771234';
            else if (all.includes('email') && i.type === 'email') val = 'tommieseals7700@gmail.com';
            else if (all.includes('street') || (all.includes('address') && !all.includes('email'))) val = '16451 Dunmoor Dr';
            else if (all.includes('start') && all.includes('date')) val = 'Immediately';
            else if (all.includes('available') && all.includes('date')) val = 'Immediately';
            else if (i.type === 'number') val = '5';
            else return;
            
            fillInput(i, val);
        });
        return filled;
    })();'''
    run_js(js_inputs)
    
    # 3. Textareas - for address, cover letter, additional info
    js_textareas = '''(function() {
        var filled = 0;
        document.querySelectorAll('textarea').forEach(function(ta) {
            if (ta.value || !ta.offsetParent) return;
            var ctx = (ta.closest('div') || ta.closest('label') || {}).innerText || '';
            var placeholder = (ta.placeholder || '').toLowerCase();
            var name = (ta.name || '').toLowerCase();
            ctx = ctx.toLowerCase();
            var all = ctx + ' ' + placeholder + ' ' + name;
            
            var value = '';
            if (all.includes('address')) {
                value = '16451 Dunmoor Dr, Houston, TX 77095';
            } else if (all.includes('cover') || all.includes('letter')) {
                value = 'I am excited to apply for this position. With over 5 years of IT support experience, I am confident I can contribute effectively to your team. I am a quick learner with strong troubleshooting skills and excellent communication abilities.';
            } else if (all.includes('message') || all.includes('note') || all.includes('additional') || all.includes('comments')) {
                value = 'I am eager to contribute my skills to your team and am available to start immediately.';
            } else if (all.includes('summary') || all.includes('about')) {
                value = 'Experienced IT professional with 5+ years in technical support, systems administration, and help desk operations.';
            } else if (all.includes('why') || all.includes('interest')) {
                value = 'I am drawn to this opportunity because it aligns with my skills and career goals. I am confident I can make valuable contributions to your organization.';
            }
            
            if (value) {
                var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                ns.call(ta, value);
                ta.dispatchEvent(new Event('input', {bubbles: true}));
                ta.dispatchEvent(new Event('change', {bubbles: true}));
                ta.dispatchEvent(new Event('blur', {bubbles: true}));
                filled++;
            }
        });
        return filled;
    })();'''
    run_js(js_textareas)
    
    # 4. Selects - smart defaults based on context
    js_selects = '''(function() {
        var filled = 0;
        document.querySelectorAll('select').forEach(function(sel) {
            if (sel.value && sel.value !== '') return;
            if (!sel.offsetParent) return;
            
            var ctx = (sel.closest('div') || sel.closest('label') || {}).innerText || '';
            var name = (sel.name || '').toLowerCase();
            ctx = ctx.toLowerCase();
            var all = ctx + ' ' + name;
            var opts = Array.from(sel.options);
            
            var best = null;
            
            if (all.includes('experience') || all.includes('years')) {
                best = opts.find(o => o.text.includes('5') || o.text.includes('3-5') || o.text.includes('4'));
                if (!best) best = opts.find(o => o.text.includes('3') || o.text.includes('2-4'));
            }
            else if (all.includes('education') || all.includes('degree')) {
                best = opts.find(o => o.text.toLowerCase().includes('bachelor') || o.text.toLowerCase().includes('associate'));
                if (!best) best = opts.find(o => o.text.toLowerCase().includes('some college') || o.text.toLowerCase().includes('high school'));
            }
            else if (all.includes('state') && !all.includes('statement')) {
                best = opts.find(o => o.value === 'TX' || o.text.includes('Texas'));
            }
            else if (all.includes('country')) {
                best = opts.find(o => o.value === 'US' || o.text.includes('United States') || o.text.includes('USA'));
            }
            else if (all.includes('start') || all.includes('available') || all.includes('notice')) {
                best = opts.find(o => o.text.toLowerCase().includes('immediate') || o.text.toLowerCase().includes('now') || o.text.includes('2 week'));
            }
            else if (all.includes('employment') || all.includes('job type')) {
                best = opts.find(o => o.text.toLowerCase().includes('full') || o.text.toLowerCase().includes('permanent'));
            }
            else if (all.includes('shift')) {
                best = opts.find(o => o.text.toLowerCase().includes('day') || o.text.toLowerCase().includes('first') || o.text.toLowerCase().includes('any'));
            }
            else if (all.includes('authorized') || all.includes('eligible') || all.includes('legal') || all.includes('citizen')) {
                best = opts.find(o => o.text.toLowerCase() === 'yes' || o.value.toLowerCase() === 'yes');
            }
            else if (all.includes('sponsor') || all.includes('visa')) {
                best = opts.find(o => o.text.toLowerCase() === 'no' || o.value.toLowerCase() === 'no');
            }
            else if (all.includes('how did you') || all.includes('hear about') || all.includes('source') || all.includes('referral')) {
                best = opts.find(o => o.text.toLowerCase().includes('indeed') || o.text.toLowerCase().includes('job board') || o.text.toLowerCase().includes('online'));
            }
            
            if (!best) {
                best = opts.find(o => o.value && o.value !== '' && !o.disabled && o.value !== 'select' && !o.text.toLowerCase().includes('select'));
            }
            
            if (best) {
                sel.value = best.value;
                sel.dispatchEvent(new Event('change', {bubbles: true}));
                sel.dispatchEvent(new Event('blur', {bubbles: true}));
                filled++;
            }
        });
        return filled;
    })();'''
    run_js(js_selects)
    
    # 5. Checkboxes - consent/agreement boxes
    js_checkboxes = '''(function() {
        var clicked = 0;
        document.querySelectorAll('input[type=checkbox]').forEach(function(cb) {
            if (cb.checked || !cb.offsetParent) return;
            var ctx = (cb.closest('div') || cb.closest('label') || {}).innerText || '';
            ctx = ctx.toLowerCase();
            
            if (ctx.includes('agree') || ctx.includes('consent') || ctx.includes('acknowledge') || 
                ctx.includes('terms') || ctx.includes('certify') || ctx.includes('confirm') ||
                ctx.includes('accurate') || ctx.includes('authorization')) {
                cb.click();
                clicked++;
            }
        });
        return clicked;
    })();'''
    run_js(js_checkboxes)
