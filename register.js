// ===== Registration JavaScript =====
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistration();
    initializeParticles();
    initializeRippleEffects();
    initializeFormSteps();
    initializeValidation();
    initializePasswordStrength();
    initializeUsernameCheck();
    initializeVerification();
});

// ===== Registration State =====
let registrationState = {
    currentStep: 1,
    totalSteps: 3,
    formData: {},
    verificationCode: '',
    timerInterval: null,
    isSubmitting: false
};

// ===== Initialize Registration =====
function initializeRegistration() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });
}

// ===== Form Steps Management =====
function initializeFormSteps() {
    // Next buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            validateAndNext(step);
        });
    });
    
    // Previous buttons
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            goToStep(step - 1);
        });
    });
}

function validateAndNext(currentStep) {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        goToStep(currentStep + 1);
    }
}

function goToStep(stepNumber) {
    // Hide current step
    document.querySelector(`.form-step[data-step="${registrationState.currentStep}"]`).classList.remove('active');
    
    // Remove active class from current progress step
    document.querySelector(`.step[data-step="${registrationState.currentStep}"]`).classList.remove('active');
    
    // Show new step
    document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Add active class to new progress step
    const newProgressStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
    newProgressStep.classList.add('active');
    
    // Mark previous steps as completed
    for (let i = 1; i < stepNumber; i++) {
        document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
    }
    
    registrationState.currentStep = stepNumber;
    
    // Special handling for step 3 (verification)
    if (stepNumber === 3) {
        generateVerificationCode();
        startTimer();
        updateVerificationEmail();
    }
}

function validateStep(stepNumber) {
    let isValid = true;
    const step = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const inputs = step.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Special validations
    if (stepNumber === 2) {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (getPasswordStrength(password) < 3) {
            showError('password', 'Password is too weak');
            isValid = false;
        }
    }
    
    return isValid;
}

function saveStepData(stepNumber) {
    const step = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const inputs = step.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if (input.name) {
            registrationState.formData[input.name] = input.value;
        }
    });
}

// ===== Field Validation =====
function initializeValidation() {
    const inputs = document.querySelectorAll('.input-wrapper input, .select-wrapper select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this.id);
            
            // Real-time validation for specific fields
            if (this.id === 'email') {
                validateEmailRealtime(this.value);
            } else if (this.id === 'username') {
                checkUsernameAvailability(this.value);
            } else if (this.id === 'password') {
                updatePasswordStrength(this.value);
            } else if (this.id === 'confirmPassword') {
                validatePasswordMatch(this.value);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    
    clearError(fieldName);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showError(fieldName, `${field.placeholder || fieldName} is required`);
        return false;
    }
    
    // Specific field validations
    switch(fieldName) {
        case 'email':
            if (!validateEmail(value)) {
                showError(fieldName, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'username':
            if (value.length < 3) {
                showError(fieldName, 'Username must be at least 3 characters');
                return false;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                showError(fieldName, 'Username can only contain letters, numbers, and underscores');
                return false;
            }
            break;
            
        case 'password':
            if (value.length < 8) {
                showError(fieldName, 'Password must be at least 8 characters');
                return false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (value !== password) {
                showError(fieldName, 'Passwords do not match');
                return false;
            }
            break;
            
        case 'firstName':
        case 'lastName':
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                showError(fieldName, 'Name can only contain letters');
                return false;
            }
            break;
            
        case 'phone':
            if (value && !validatePhone(value)) {
                showError(fieldName, 'Please enter a valid phone number');
                return false;
            }
            break;
    }
    
    showSuccess(fieldName);
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validateEmailRealtime(email) {
    if (email && validateEmail(email)) {
        // Simulate email availability check
        setTimeout(() => {
            // For demo purposes, assume email is available
            showSuccess('email');
        }, 500);
    }
}

// ===== Password Strength =====
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    passwordInput?.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
}

function updatePasswordStrength(password) {
    const strength = getPasswordStrength(password);
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthFill || !strengthText) return;
    
    strengthFill.style.width = `${strength * 33.33}%`;
    
    switch(strength) {
        case 1:
            strengthFill.className = 'strength-fill strength-weak';
            strengthText.className = 'strength-text strength-weak';
            strengthText.textContent = 'Weak';
            break;
        case 2:
            strengthFill.className = 'strength-fill strength-medium';
            strengthText.className = 'strength-text strength-medium';
            strengthText.textContent = 'Medium';
            break;
        case 3:
            strengthFill.className = 'strength-fill strength-strong';
            strengthText.className = 'strength-text strength-strong';
            strengthText.textContent = 'Strong';
            break;
        default:
            strengthFill.className = 'strength-fill';
            strengthText.className = 'strength-text';
            strengthText.textContent = 'Very Weak';
            break;
    }
}

function getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return Math.min(strength, 3);
}

function validatePasswordMatch(confirmPassword) {
    const password = document.getElementById('password').value;
    if (confirmPassword && confirmPassword === password) {
        showSuccess('confirmPassword');
    }
}

// ===== Username Availability =====
function initializeUsernameCheck() {
    const usernameInput = document.getElementById('username');
    let checkTimeout;
    
    usernameInput?.addEventListener('input', function() {
        clearTimeout(checkTimeout);
        const username = this.value.trim();
        
        if (username.length >= 3) {
            checkTimeout = setTimeout(() => {
                checkUsernameAvailability(username);
            }, 1000);
        }
    });
}

function checkUsernameAvailability(username) {
    const availability = document.querySelector('.availability');
    if (!availability) return;
    
    // Simulate API call
    availability.textContent = 'Checking...';
    availability.className = 'availability';
    
    setTimeout(() => {
        // For demo purposes, assume username is available
        const isAvailable = !['admin', 'root', 'user'].includes(username.toLowerCase());
        
        if (isAvailable) {
            availability.textContent = '✓ Available';
            availability.className = 'availability available';
            showSuccess('username');
        } else {
            availability.textContent = '✗ Not available';
            availability.className = 'availability unavailable';
            showError('username', 'Username is already taken');
        }
    }, 1000);
}

// ===== Verification System =====
function initializeVerification() {
    // Resend code button
    document.getElementById('resendCode')?.addEventListener('click', function() {
        resendVerificationCode();
    });
}

function generateVerificationCode() {
    // Generate 6-digit code
    registrationState.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Verification Code:', registrationState.verificationCode); // For demo purposes
}

function updateVerificationEmail() {
    const emailElement = document.getElementById('verificationEmail');
    if (emailElement) {
        emailElement.textContent = registrationState.formData.email;
    }
}

function startTimer() {
    let timeLeft = 120; // 2 minutes
    const timerElement = document.getElementById('timer');
    const resendBtn = document.getElementById('resendCode');
    
    if (registrationState.timerInterval) {
        clearInterval(registrationState.timerInterval);
    }
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(registrationState.timerInterval);
            resendBtn.disabled = false;
            resendBtn.textContent = 'Resend Code';
        } else {
            resendBtn.disabled = true;
            resendBtn.textContent = 'Resend Code';
        }
        
        timeLeft--;
    }
    
    updateTimer();
    registrationState.timerInterval = setInterval(updateTimer, 1000);
}

function resendVerificationCode() {
    generateVerificationCode();
    startTimer();
    showNotification('New verification code sent!', 'success');
}

// ===== Handle Registration =====
function handleRegistration() {
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
        completeRegistration();
    }, 3000);
}

function completeRegistration() {
    // Create user object
    const userData = {
        ...registrationState.formData,
        id: generateUserId(),
        createdAt: new Date().toISOString(),
        newsletter: document.getElementById('newsletter').checked,
        verified: true
    };
    
    // Store user data (in real app, this would be sent to server)
    localStorage.setItem('userData', JSON.stringify(userData));
    
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
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== Error Handling =====
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
    
    field.classList.add('input-error');
    field.classList.remove('input-success');
    
    const errorMessage = wrapper.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
    
    field.classList.remove('input-error');
    
    const errorMessage = wrapper.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add('input-success');
}

// ===== Loading States =====
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('active');
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
}

// ===== Particles System =====
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        const colors = ['#00bfff', '#7f00ff', '#00ffff', '#00ff88'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

// ===== Ripple Effects =====
function initializeRippleEffects() {
    const buttons = document.querySelectorAll('.ripple');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

function createRipple(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== Social Registration =====
function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            showNotification(`${platform} registration coming soon!`, 'info');
        });
    });
}

// ===== Notification System =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    if (type === 'success') {
        notification.style.background = 'rgba(0, 255, 136, 0.2)';
        notification.style.borderColor = 'rgba(0, 255, 136, 0.3)';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 71, 87, 0.2)';
        notification.style.borderColor = 'rgba(255, 71, 87, 0.3)';
    } else {
        notification.style.background = 'rgba(0, 191, 255, 0.2)';
        notification.style.borderColor = 'rgba(0, 191, 255, 0.3)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(e) {
    // Enter key navigation
    if (e.key === 'Enter') {
        const activeStep = document.querySelector('.form-step.active');
        const nextBtn = activeStep?.querySelector('.next-btn');
        const submitBtn = activeStep?.querySelector('.submit-btn');
        
        if (submitBtn) {
            handleRegistration();
        } else if (nextBtn) {
            validateAndNext(registrationState.currentStep);
        }
    }
    
    // Escape to go back
    if (e.key === 'Escape' && registrationState.currentStep > 1) {
        goToStep(registrationState.currentStep - 1);
    }
});

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
    // Focus first input
    setTimeout(() => {
        const firstInput = document.querySelector('.form-step.active input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
});