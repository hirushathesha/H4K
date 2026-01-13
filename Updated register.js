// ===== Email Integration =====
// Add this at the top of your register.js file
const { emailService } = typeof module !== 'undefined' && module.exports ? 
    require('./email-service.js') : { emailService: new EmailService() };

// Modify the generateVerificationCode function
function generateVerificationCode() {
    // Generate 6-digit code
    registrationState.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send email with the code
    sendVerificationEmail();
    
    console.log('Verification Code:', registrationState.verificationCode); // For demo purposes
}

function sendVerificationEmail() {
    const email = registrationState.formData.email;
    const name = registrationState.formData.firstName || 'User';
    const code = registrationState.verificationCode;
    
    // Check rate limit
    if (!emailService.checkRateLimit(email)) {
        showNotification('Too many requests. Please try again later.', 'error');
        return;
    }
    
    // Show sending status
    showNotification('Sending verification code...', 'info');
    
    // Try to send email using available methods
    sendEmailWithFallback(email, name, code);
}

function sendEmailWithFallback(email, name, code) {
    // Method 1: EmailJS (Frontend)
    emailService.sendVerificationCodeEmailJS(email, name, code)
        .then(result => {
            if (result.success) {
                showNotification('Verification code sent to your email!', 'success');
            } else {
                // Fallback to method 2
                return emailService.sendVerificationCodeSMTP(email, name, code);
            }
        })
        .then(result => {
            if (result && !result.success) {
                // Method 3: Simulate email sending (for demo)
                simulateEmailSending(email, name, code);
            }
        })
        .catch(error => {
            console.error('Email sending failed:', error);
            simulateEmailSending(email, name, code);
        });
}

function simulateEmailSending(email, name, code) {
    // Simulate email sending for demo purposes
    setTimeout(() => {
        showNotification(`Verification code sent to ${email}!`, 'success');
        
        // In a real implementation, you would show this in the UI
        console.log(`Email sent to: ${email}`);
        console.log(`Verification code: ${code}`);
        console.log(`Email content:`, emailService.generateEmailHTML('verification', { name, code }));
    }, 1500);
}

// ===== Enhanced Registration Process =====
function completeRegistration() {
    // Validate final step
    if (!validateStep(3)) {
        return;
    }
    
    // Verify code
    const enteredCode = document.getElementById('verificationCode').value;
    if (enteredCode !== registrationState.verificationCode) {
        showError('verificationCode', 'Invalid verification code');
        return;
    }
    
    // Check terms acceptance
    if (!document.getElementById('terms').checked) {
        showError('terms', 'You must accept the terms and conditions');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate registration API call
    setTimeout(() => {
        // Create user object
        const userData = {
            ...registrationState.formData,
            id: generateUserId(),
            createdAt: new Date().toISOString(),
            newsletter: document.getElementById('newsletter').checked,
            verified: true,
            verificationCode: registrationState.verificationCode,
            verificationTimestamp: new Date().toISOString()
        };
        
        // Store user data
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Clear rate limit for this email
        emailService.clearRateLimit(registrationState.formData.email);
        
        hideLoading();
        
        // Show success message
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Auto-login
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Redirect
        setTimeout(() => {
            window.location.href = checkDemoCredentials(userData.email, 'dummy') ? 'dashboard.html' : 'index.html';
        }, 2000);
    }, 3000);
}