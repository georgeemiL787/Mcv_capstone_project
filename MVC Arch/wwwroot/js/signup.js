// Signup Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const userTypeOptions = document.querySelectorAll('input[name="userType"]');
    
    // Form validation
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Submit form
                this.submit();
            }
        });
    }
    
    // Password confirmation validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
    
    // User type selection enhancement
    userTypeOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateUserTypeSelection();
        });
    });
    
    // Social login buttons
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
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
    initializeForm();
});

function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked');
    const terms = document.querySelector('input[name="terms"]').checked;
    
    let isValid = true;
    
    // Clear previous error messages
    clearErrors();
    
    // Validate first name
    if (!firstName) {
        showError('firstName', 'First name is required');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName) {
        showError('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate user type
    if (!userType) {
        showError('userType', 'Please select an account type');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError('password', 'Password must be at least 8 characters long');
        isValid = false;
    }
    
    // Validate password confirmation
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms
    if (!terms) {
        showError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordField = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordField.style.borderColor = '#e74c3c';
        showError('confirmPassword', 'Passwords do not match');
    } else {
        confirmPasswordField.style.borderColor = '#8f7efc';
        clearError('confirmPassword');
    }
}

function updateUserTypeSelection() {
    const selectedType = document.querySelector('input[name="userType"]:checked');
    const userTypeCards = document.querySelectorAll('.user-type-card');
    
    userTypeCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    if (selectedType) {
        const selectedCard = selectedType.closest('.user-type-option').querySelector('.user-type-card');
        selectedCard.classList.add('selected');
    }
}

function handleSocialLogin(provider) {
    // Show loading state
    const btn = document.querySelector(`.${provider}-btn`);
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
        // window.location.href = `/auth/${provider}`;
    }, 2000);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    
    // Insert error message after the field
    if (fieldId === 'userType') {
        const userTypeSection = document.querySelector('.user-type-selection');
        userTypeSection.appendChild(errorDiv);
    } else if (fieldId === 'terms') {
        const termsSection = document.querySelector('.form-options');
        termsSection.appendChild(errorDiv);
    } else {
        field.parentNode.appendChild(errorDiv);
    }
    
    // Add error styling to field
    field.style.borderColor = '#e74c3c';
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorMessage = field.parentNode.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }
    
    field.style.borderColor = '';
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
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
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function initializeForm() {
    // Add password strength indicator
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrengthIndicator(strength);
        });
    }
    
    // Add real-time validation
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
}

function updatePasswordStrengthIndicator(strength) {
    let strengthIndicator = document.getElementById('password-strength');
    
    if (!strengthIndicator) {
        strengthIndicator = document.createElement('div');
        strengthIndicator.id = 'password-strength';
        strengthIndicator.style.cssText = `
            margin-top: 5px;
            font-size: 0.8rem;
            font-weight: 500;
        `;
        
        const passwordField = document.getElementById('password');
        passwordField.parentNode.appendChild(strengthIndicator);
    }
    
    const colors = {
        weak: '#e74c3c',
        medium: '#f39c12',
        strong: '#27ae60'
    };
    
    const messages = {
        weak: 'Weak password',
        medium: 'Medium strength password',
        strong: 'Strong password'
    };
    
    strengthIndicator.textContent = messages[strength];
    strengthIndicator.style.color = colors[strength];
}

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    // Clear previous error
    clearError(fieldId);
    
    // Validate based on field type
    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                showError(fieldId, 'This field is required');
            }
            break;
        case 'email':
            if (!value) {
                showError(fieldId, 'Email is required');
            } else if (!isValidEmail(value)) {
                showError(fieldId, 'Please enter a valid email address');
            }
            break;
        case 'password':
            if (!value) {
                showError(fieldId, 'Password is required');
            } else if (value.length < 8) {
                showError(fieldId, 'Password must be at least 8 characters long');
            }
            break;
    }
}
