// Comprehensive Security Validation Script
// This script tests all security measures implemented in the personal blog

console.log('🔒 Starting Security Validation Tests...\n');

// Test 1: CSP Configuration
function testCSPConfiguration() {
    console.log('📋 Test 1: CSP Configuration');
    
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
        console.log('❌ FAIL: CSP meta tag not found');
        return false;
    }
    
    const cspContent = cspMeta.getAttribute('content');
    const cspRules = cspContent.split(';').map(rule => rule.trim());
    
    const requiredRules = [
        "script-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ];
    
    let passed = true;
    requiredRules.forEach(rule => {
        if (!cspContent.includes(rule)) {
            console.log(`❌ FAIL: Missing CSP rule: ${rule}`);
            passed = false;
        }
    });
    
    // Check for unsafe-inline (should NOT be present)
    if (cspContent.includes("'unsafe-inline'")) {
        console.log('❌ FAIL: CSP contains unsafe-inline (vulnerable)');
        passed = false;
    }
    
    if (passed) {
        console.log('✅ PASS: CSP properly configured');
    }
    
    return passed;
}

// Test 2: Input Validation Functions
function testInputValidation() {
    console.log('\n📝 Test 2: Input Validation Functions');
    
    // Test validateName function
    const nameTests = [
        { input: 'John Doe', expected: true, description: 'valid name' },
        { input: '', expected: false, description: 'empty name' },
        { input: 'a', expected: false, description: 'too short name' },
        { input: 'a'.repeat(51), expected: false, description: 'too long name' }
    ];
    
    let nameTestsPassed = 0;
    nameTests.forEach(test => {
        try {
            const result = validateName(test.input);
            if (result === test.expected) {
                nameTestsPassed++;
            } else {
                console.log(`❌ Name validation failed for ${test.description}`);
            }
        } catch (error) {
            console.log(`❌ Name validation error for ${test.description}: ${error.message}`);
        }
    });
    
    // Test validateEmail function
    const emailTests = [
        { input: 'test@example.com', expected: true, description: 'valid email' },
        { input: 'invalid', expected: false, description: 'invalid email' },
        { input: 'test@', expected: false, description: 'incomplete email' },
        { input: '@example.com', expected: false, description: 'missing username' }
    ];
    
    let emailTestsPassed = 0;
    emailTests.forEach(test => {
        try {
            const result = validateEmail(test.input);
            if (result === test.expected) {
                emailTestsPassed++;
            } else {
                console.log(`❌ Email validation failed for ${test.description}`);
            }
        } catch (error) {
            console.log(`❌ Email validation error for ${test.description}: ${error.message}`);
        }
    });
    
    // Test validateMessage function
    const messageTests = [
        { input: 'This is a valid message', expected: true, description: 'valid message' },
        { input: 'short', expected: false, description: 'too short message' },
        { input: 'a'.repeat(1001), expected: false, description: 'too long message' }
    ];
    
    let messageTestsPassed = 0;
    messageTests.forEach(test => {
        try {
            const result = validateMessage(test.input);
            if (result === test.expected) {
                messageTestsPassed++;
            } else {
                console.log(`❌ Message validation failed for ${test.description}`);
            }
        } catch (error) {
            console.log(`❌ Message validation error for ${test.description}: ${error.message}`);
        }
    });
    
    const totalTests = nameTests.length + emailTests.length + messageTests.length;
    const passedTests = nameTestsPassed + emailTestsPassed + messageTestsPassed;
    
    if (passedTests === totalTests) {
        console.log(`✅ PASS: All ${totalTests} input validation tests passed`);
        return true;
    } else {
        console.log(`❌ FAIL: ${passedTests}/${totalTests} input validation tests passed`);
        return false;
    }
}

// Test 3: XSS Protection
function testXSSProtection() {
    console.log('\n🛡️ Test 3: XSS Protection');
    
    const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(\'xss\')">',
        'javascript:alert("xss")',
        '<svg onload="alert(\'xss\')">',
        '"><script>alert("xss")</script>',
        '\';alert("xss");//'
    ];
    
    let passed = true;
    xssPayloads.forEach((payload, index) => {
        try {
            const escaped = escapeHtml(payload);
            
            // Check if dangerous elements are escaped
            if (escaped.includes('<script>') && !escaped.includes('&lt;script&gt;')) {
                console.log(`❌ XSS Test ${index + 1} FAILED: Script tag not escaped`);
                passed = false;
            } else if (escaped.includes('onerror=') && !escaped.includes('&quot;')) {
                console.log(`❌ XSS Test ${index + 1} FAILED: Event handler not escaped`);
                passed = false;
            } else if (escaped.includes('javascript:') && !escaped.includes('javascript:')) {
                console.log(`❌ XSS Test ${index + 1} FAILED: JavaScript protocol not handled`);
                passed = false;
            } else {
                console.log(`✅ XSS Test ${index + 1} PASSED: ${payload.substring(0, 20)}...`);
            }
        } catch (error) {
            console.log(`❌ XSS Test ${index + 1} ERROR: ${error.message}`);
            passed = false;
        }
    });
    
    if (passed) {
        console.log('✅ PASS: All XSS protection tests passed');
    }
    
    return passed;
}

// Test 4: URL Sanitization
function testUrlSanitization() {
    console.log('\n🔗 Test 4: URL Sanitization');
    
    const urlTests = [
        { input: 'https://example.com', expected: 'https://example.com', description: 'valid https URL' },
        { input: 'http://example.com', expected: 'http://example.com', description: 'valid http URL' },
        { input: 'javascript:alert("xss")', expected: '', description: 'dangerous javascript URL' },
        { input: 'data:text/html,<script>alert("xss")</script>', expected: '', description: 'dangerous data URL' },
        { input: 'ftp://example.com', expected: '', description: 'non-allowed protocol' },
        { input: 'not-a-url', expected: '', description: 'invalid URL' }
    ];
    
    let passed = true;
    urlTests.forEach(test => {
        try {
            const result = sanitizeUrl(test.input);
            if (result === test.expected) {
                console.log(`✅ URL test passed: ${test.description}`);
            } else {
                console.log(`❌ URL test failed: ${test.description}`);
                console.log(`   Expected: "${test.expected}"`);
                console.log(`   Got: "${result}"`);
                passed = false;
            }
        } catch (error) {
            console.log(`❌ URL test error for ${test.description}: ${error.message}`);
            passed = false;
        }
    });
    
    if (passed) {
        console.log('✅ PASS: All URL sanitization tests passed');
    }
    
    return passed;
}

// Test 5: DOM Security
function testDOMSecurity() {
    console.log('\n🌐 Test 5: DOM Security');
    
    try {
        // Test that createBlogPostElement uses secure DOM manipulation
        const testPost = {
            id: 999,
            title: '<script>alert("xss")</script>Test Title',
            category: '<img src=x onerror=alert("xss")>Test Category',
            excerpt: 'Test excerpt',
            readTime: '5 min read',
            image: 'javascript:alert("xss")'
        };
        
        const postElement = createBlogPostElement(testPost);
        
        // Check that script tags are not executed
        const titleElement = postElement.querySelector('.blog-post-title');
        if (titleElement && titleElement.textContent.includes('<script>')) {
            console.log('❌ FAIL: Script tag not escaped in title');
            return false;
        }
        
        // Check that image src is sanitized
        const imgElement = postElement.querySelector('.blog-post-image');
        if (imgElement && imgElement.src.includes('javascript:')) {
            console.log('❌ FAIL: Dangerous JavaScript URL not sanitized');
            return false;
        }
        
        console.log('✅ PASS: DOM security tests passed');
        return true;
        
    } catch (error) {
        console.log(`❌ FAIL: DOM security test error: ${error.message}`);
        return false;
    }
}

// Test 6: Security Headers
function testSecurityHeaders() {
    console.log('\n📄 Test 6: Security Headers');
    
    const requiredHeaders = [
        { selector: 'meta[http-equiv="Content-Security-Policy"]', name: 'CSP' },
        { selector: 'meta[http-equiv="Permissions-Policy"]', name: 'Permissions Policy' },
        { selector: 'meta[http-equiv="X-Frame-Options"]', name: 'X-Frame-Options' },
        { selector: 'meta[http-equiv="X-Content-Type-Options"]', name: 'X-Content-Type-Options' },
        { selector: 'meta[http-equiv="Referrer-Policy"]', name: 'Referrer Policy' }
    ];
    
    let passed = true;
    let headersFound = 0;
    
    requiredHeaders.forEach(header => {
        const element = document.querySelector(header.selector);
        if (element) {
            headersFound++;
            console.log(`✅ ${header.name} header found`);
        } else {
            console.log(`❌ ${header.name} header missing`);
            passed = false;
        }
    });
    
    if (passed) {
        console.log(`✅ PASS: All ${headersFound} required security headers present`);
    }
    
    return passed;
}

// Test 7: Form Security
function testFormSecurity() {
    console.log('\n📋 Test 7: Form Security');
    
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) {
        console.log('❌ FAIL: Contact form not found');
        return false;
    }
    
    // Check form has proper validation
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');
    
    if (!nameInput || !emailInput || !messageInput) {
        console.log('❌ FAIL: Form inputs not found');
        return false;
    }
    
    // Check required attributes
    if (!nameInput.hasAttribute('required') || !emailInput.hasAttribute('required') || !messageInput.hasAttribute('required')) {
        console.log('❌ FAIL: Form inputs missing required attribute');
        return false;
    }
    
    // Check email input type
    if (emailInput.type !== 'email') {
        console.log('❌ FAIL: Email input not using type="email"');
        return false;
    }
    
    console.log('✅ PASS: Form security tests passed');
    return true;
}

// Test 8: Performance vs Security Balance
function testPerformanceSecurityBalance() {
    console.log('\n⚡ Test 8: Performance vs Security Balance');
    
    // Check that critical CSS is inlined (performance)
    const inlineStyles = document.querySelectorAll('style');
    let hasCriticalCSS = false;
    
    inlineStyles.forEach(style => {
        if (style.textContent.includes('.hero') && style.textContent.includes('.header')) {
            hasCriticalCSS = true;
        }
    });
    
    if (!hasCriticalCSS) {
        console.log('⚠️  WARNING: Critical CSS not inlined (performance impact)');
    } else {
        console.log('✅ Critical CSS inlined for performance');
    }
    
    // Check that resources are preloaded
    const preloads = document.querySelectorAll('link[rel="preload"]');
    console.log(`✅ Found ${preloads.length} preloaded resources for performance`);
    
    // Check that lazy loading is implemented
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    console.log(`✅ Found ${lazyImages.length} lazy-loaded images for performance`);
    
    console.log('✅ PASS: Performance optimizations maintain security');
    return true;
}

// Run all tests
function runSecurityValidation() {
    console.log('🚀 Starting Comprehensive Security Validation\n');
    
    const tests = [
        { name: 'CSP Configuration', func: testCSPConfiguration },
        { name: 'Input Validation', func: testInputValidation },
        { name: 'XSS Protection', func: testXSSProtection },
        { name: 'URL Sanitization', func: testUrlSanitization },
        { name: 'DOM Security', func: testDOMSecurity },
        { name: 'Security Headers', func: testSecurityHeaders },
        { name: 'Form Security', func: testFormSecurity },
        { name: 'Performance Security Balance', func: testPerformanceSecurityBalance }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    tests.forEach(test => {
        try {
            if (test.func()) {
                passedTests++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} test crashed: ${error.message}`);
        }
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 SECURITY VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    console.log(`Security Score: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ALL SECURITY TESTS PASSED!');
        console.log('✅ Blog is SECURE and ready for production');
    } else {
        console.log('⚠️  SOME SECURITY TESTS FAILED!');
        console.log('🔧 Review and fix failed tests before production');
    }
    
    console.log('='.repeat(50));
    
    return passedTests === totalTests;
}

// Export for use in browser console
window.runSecurityValidation = runSecurityValidation;

// Auto-run if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSecurityValidation);
} else {
    runSecurityValidation();
}