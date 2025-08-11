// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const instructorBtn = document.querySelector('.instructor-btn');
    
    // Form validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                // Submit form
                this.submit();
            }
        });
    }
    
    // Instructor login button
    if (instructorBtn) {
        instructorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleInstructorLogin();
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.google');
    const facebookBtn = document.querySelector('.facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('google');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('facebook');
        });
    }
    
    // Initialize form
    initializeLoginForm();
});

function validateLoginForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;
    
    let isValid = true;
    
    // Clear previous error messages
    clearLoginErrors();
    
    // Validate email
    if (!email) {
        showLoginError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showLoginError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showLoginError('password', 'Password is required');
        isValid = false;
    }
    
    if (isValid) {
        // Show loading state
        showLoginLoading();
        
        // Simulate login process
        setTimeout(() => {
            hideLoginLoading();
            showNotification('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/Dashboard';
            }, 1000);
        }, 2000);
    }
    
    return isValid;
}

function handleInstructorLogin() {
    const instructorBtn = document.querySelector('.instructor-btn');
    const originalText = instructorBtn.innerHTML;
    
    // Show loading state
    instructorBtn.innerHTML = '<span class="loading-spinner"></span> Connecting...';
    instructorBtn.disabled = true;
    
    // Simulate instructor login process
    setTimeout(() => {
        // Reset button
        instructorBtn.innerHTML = originalText;
        instructorBtn.disabled = false;
        
        // Show success message
        showNotification('Instructor access granted!', 'success');
        
        // Redirect to instructor dashboard
        setTimeout(() => {
            window.location.href = '/InstructorDashboard';
        }, 1000);
    }, 2000);
}

function handleSocialLogin(provider) {
    // Show loading state
    const btn = document.querySelector(`.${provider}`);
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="loading-spinner"></span> Connecting to ${provider}...`;
    btn.disabled = true;
    
    // Simulate social login process
    setTimeout(() => {
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Show success message
        showNotification(`Successfully connected to ${provider}!`, 'success');
        
        // Redirect or handle login
        setTimeout(() => {
            window.location.href = '/Dashboard';
        }, 1000);
    }, 2000);
}

function showLoginError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease;
    `;
    
    // Insert error message after the field
    field.parentNode.appendChild(errorDiv);
    
    // Add error styling to field
    field.style.borderColor = '#e74c3c';
    
    // Add shake animation
    field.classList.add('shake');
    setTimeout(() => {
        field.classList.remove('shake');
    }, 500);
}

function clearLoginErrors() {
    const errorMessages = document.querySelectorAll('.login-error-message');
    errorMessages.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('input');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

function showLoginLoading() {
    const submitBtn = document.querySelector('.login-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Signing In...';
    submitBtn.disabled = true;
    
    // Store original text for restoration
    submitBtn.dataset.originalText = originalText;
}

function hideLoginLoading() {
    const submitBtn = document.querySelector('.login-btn');
    const originalText = submitBtn.dataset.originalText || 'Sign In';
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .shake {
            animation: shake 0.5s ease;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function initializeLoginForm() {
    // Add real-time validation
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateLoginField(this);
        });
    }
    
    if (passwordField) {
        passwordField.addEventListener('blur', function() {
            validateLoginField(this);
        });
    }
    
    // Add enter key support
    const inputs = document.querySelectorAll('.login-form input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.login-btn').click();
            }
        });
    });
    
    // Add focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
    });
}

function validateLoginField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    // Clear previous error
    const existingError = field.parentNode.querySelector('.login-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate based on field type
    switch (fieldId) {
        case 'email':
            if (!value) {
                showLoginError(fieldId, 'Email is required');
            } else if (!isValidEmail(value)) {
                showLoginError(fieldId, 'Please enter a valid email address');
            } else {
                field.style.borderColor = '#8f7efc';
            }
            break;
        case 'password':
            if (!value) {
                showLoginError(fieldId, 'Password is required');
            } else {
                field.style.borderColor = '#8f7efc';
            }
            break;
    }
}

// Add loading spinner styles
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .form-group.focused label {
        color: #8f7efc;
        transform: translateY(-20px) scale(0.8);
    }
    
    .form-group.focused input {
        border-color: #8f7efc;
        box-shadow: 0 0 0 3px rgba(143, 126, 252, 0.1);
    }
`;
document.head.appendChild(spinnerStyle);
