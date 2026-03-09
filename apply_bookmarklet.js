// PASTE THIS INTO CHROME CONSOLE (F12 -> Console) ON THE APPLICATION PAGE
// It will fill the form with your info

(function() {
    const VAULT = {
        name: "Tommie Seals",
        firstName: "Tommie", 
        lastName: "Seals",
        email: "tommieseals7700@gmail.com",
        phone: "618-203-0978"
    };
    
    // Fill all input fields
    function fillField(selectors, value) {
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.offsetParent !== null) {
                el.value = value;
                el.dispatchEvent(new Event('input', {bubbles: true}));
                el.dispatchEvent(new Event('change', {bubbles: true}));
                console.log('Filled:', sel);
                return true;
            }
        }
        return false;
    }
    
    // Try to fill common fields
    fillField(['input[name*="name" i]', 'input[id*="name" i]'], VAULT.name);
    fillField(['input[name*="firstName" i]', 'input[id*="first" i]'], VAULT.firstName);
    fillField(['input[name*="lastName" i]', 'input[id*="last" i]'], VAULT.lastName);
    fillField(['input[name*="email" i]', 'input[type="email"]', 'input[id*="email" i]'], VAULT.email);
    fillField(['input[name*="phone" i]', 'input[type="tel"]', 'input[id*="phone" i]'], VAULT.phone);
    
    console.log('Form filled! Click Continue or Submit manually.');
    alert('Form filled! Click Continue or Submit.');
})();
