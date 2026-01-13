// ===== Login JavaScript =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    initializeParticles();
    initializeRippleEffects();
    initializeFormValidation();
    initializePasswordToggle();
    initializeSocialLogin();
});

// ===== Initialize Login Functions =====
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
}

// ===== Handle Login =====
function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('remember').checked;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate login API call
    setTimeout(() => {
        // Demo credentials check
        if (checkDemoCredentials(email, password)) {
            // Successful login
            hideLoading();
            handleSuccessfulLogin(email, rememberMe);
        } else {
            // Failed login
            hideLoading();
            showError('password', 'Invalid email or password');
            shakeForm();
        }
    }, 2000);
}

// ===== Demo Credentials =====
function checkDemoCredentials(email, password) {
    const demoAccounts = [
        { email: 'admin@h4khex.com', password: 'admin123', role: 'admin' },
        { email: 'user@h4khex.com', password: 'user123', role: 'user' }
    ];
    
    return demoAccounts.find(account => 
        account.email === email && account.password === password
    );
}

// ===== Successful Login =====
function handleSuccessfulLogin(email, rememberMe) {
    // Store login data
    const loginData = {
        email: email,
        timestamp: new Date().toISOString(),
        role: checkDemoCredentials(email, 'dummy').role
    };
    
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
    }
    
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userData', JSON.stringify(loginData));
    
    // Show success message
    showNotification('Login successful! Redirecting...', 'success');
    
    // Redirect based on role
    setTimeout(() => {
        if (loginData.role === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 1500);
}

// ===== Form Validation =====
function initializeFormValidation() {
    const inputs = document.querySelectorAll('.input-wrapper input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this.id);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    
    clearError(fieldName);
    
    switch(fieldName) {
        case 'email':
            if (!value) {
                showError(fieldName, 'Email is required');
                return false;
            }
            if (!validateEmail(value)) {
                showError(fieldName, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'password':
            if (!value) {
                showError(fieldName, 'Password is required');
                return false;
            }
            if (value.length < 6) {
                showError(fieldName, 'Password must be at least 6 characters');
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

// ===== Error Handling =====
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper');
    
    field.classList.add('input-error');
    field.classList.remove('input-success');
    
    // Remove existing error message
    const existingError = wrapper.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    wrapper.appendChild(errorDiv);
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const wrapper = field.closest('.input-wrapper');
    const errorMessage = wrapper.querySelector('.error-message');
    
    field.classList.remove('input-error');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add('input-success');
}

// ===== Password Toggle =====
function initializePasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    toggleBtn?.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Change icon
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
}

// ===== Social Login =====
function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            showNotification(`${platform} login coming soon!`, 'info');
        });
    });
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
        
        // Random color from palette
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

// ===== Loading States =====
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    
    // Disable form inputs
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input, button');
    inputs.forEach(input => input.disabled = true);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('active');
    
    // Enable form inputs
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input, button');
    inputs.forEach(input => input.disabled = false);
}

// ===== Shake Animation =====
function shakeForm() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
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

// ===== Auto-fill Handling =====
function handleAutoFill() {
    // Check for auto-filled values
    setTimeout(() => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        if (email.value) {
            validateField(email);
        }
        
        if (password.value) {
            validateField(password);
        }
    }, 100);
}

// ===== Remember Me Functionality =====
function handleRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    if (rememberMe && userEmail) {
        document.getElementById('email').value = userEmail;
        document.getElementById('remember').checked = true;
        validateField(document.getElementById('email'));
    }
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(e) {
    // Enter key to submit form
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        handleLogin();
    }
    
    // Tab navigation
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll('input, button');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey && currentIndex === 0) {
            e.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
        } else if (!e.shiftKey && currentIndex === focusableElements.length - 1) {
            e.preventDefault();
            focusableElements[0].focus();
        }
    }
});

// ===== Focus Management =====
function initializeFocusManagement() {
    // Focus first input on load
    setTimeout(() => {
        const emailInput = document.getElementById('email');
        if (emailInput && !emailInput.value) {
            emailInput.focus();
        }
    }, 300);
}

// ===== Performance Optimization =====
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

// Debounced validation
const debouncedValidation = debounce((field) => {
    validateField(field);
}, 300);

// ===== Error Recovery =====
function initializeErrorRecovery() {
    // Clear errors on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('input-error')) {
                clearError(this.id);
            }
        });
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
    handleRememberMe();
    handleAutoFill();
    initializeFocusManagement();
    initializeErrorRecovery();
});

// ===== Security Features =====
function initializeSecurityFeatures() {
    // Prevent password copying
    const passwordInput = document.getElementById('password');
    passwordInput?.addEventListener('copy', function(e) {
        e.preventDefault();
        showNotification('Copying password is disabled for security', 'warning');
    });
    
    // Clear session on page unload
    window.addEventListener('beforeunload', function() {
        if (!sessionStorage.getItem('isLoggedIn')) {
            sessionStorage.clear();
        }
    });
}

// Call security features
initializeSecurityFeatures();