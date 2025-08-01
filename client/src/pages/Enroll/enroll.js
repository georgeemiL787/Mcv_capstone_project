// Enroll Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeEnrollPage();
});

function initializeEnrollPage() {
    // Set up event listeners
    setupPaymentOptions();
    setupCouponCode();
    setupFormValidation();
    setupFormSubmission();
    
    // Initialize pricing
    updatePricing();
}

// Payment Options Handling
function setupPaymentOptions() {
    const paymentOptions = document.querySelectorAll('input[name="paymentType"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePricing();
            updateOrderSummary();
        });
    });
}

// Coupon Code Handling
function setupCouponCode() {
    const applyCouponBtn = document.querySelector('.apply-coupon-btn');
    const couponInput = document.getElementById('couponCode');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', function() {
            applyCoupon();
        });
        
        // Allow Enter key to apply coupon
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCoupon();
            }
        });
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }
    
    // Simulate coupon validation
    const validCoupons = {
        'WELCOME10': 10,
        'STUDENT20': 20,
        'NEWUSER15': 15
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        localStorage.setItem('appliedCoupon', JSON.stringify({
            code: couponCode,
            discount: discount
        }));
        
        updatePricing();
        updateOrderSummary();
        showNotification(`Coupon applied! ${discount}% discount`, 'success');
        
        // Update coupon input styling
        couponInput.style.borderColor = '#8f7efc';
        couponInput.style.backgroundColor = 'rgba(143, 126, 252, 0.05)';
    } else {
        showNotification('Invalid coupon code', 'error');
        couponInput.style.borderColor = '#ff6b6b';
        couponInput.style.backgroundColor = 'rgba(255, 107, 107, 0.05)';
    }
}

// Pricing and Order Summary
function updatePricing() {
    const selectedPayment = document.querySelector('input[name="paymentType"]:checked');
    const basePrice = selectedPayment.value === 'premium' ? 99 : 0;
    
    // Get applied coupon
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const discountAmount = (basePrice * discount) / 100;
    const finalPrice = basePrice - discountAmount;
    
    // Update price display
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(element => {
        if (element.closest('.payment-content')) {
            element.textContent = `$${finalPrice.toFixed(2)}`;
        }
    });
    
    // Update order summary
    updateOrderSummary(basePrice, discountAmount, finalPrice);
}

function updateOrderSummary(basePrice = 99, discountAmount = 0, finalPrice = 99) {
    const summaryItems = document.querySelector('.summary-items');
    const totalPrice = document.querySelector('.total-price');
    
    if (summaryItems && totalPrice) {
        // Update course access price
        const courseAccessItem = summaryItems.querySelector('.summary-item:first-child .item-price');
        if (courseAccessItem) {
            courseAccessItem.textContent = `$${basePrice.toFixed(2)}`;
        }
        
        // Update discount
        const discountItem = summaryItems.querySelector('.summary-item.discount .item-price');
        if (discountItem) {
            discountItem.textContent = `-$${discountAmount.toFixed(2)}`;
            discountItem.parentElement.style.display = discountAmount > 0 ? 'flex' : 'none';
        }
        
        // Update total
        totalPrice.textContent = `$${finalPrice.toFixed(2)}`;
    }
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('enrollForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            if (input.classList.contains('error')) {
                clearFieldError(input);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.style.borderColor = '#ff6b6b';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '#e4defe';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('enrollForm');
    const enrollBtn = document.querySelector('.enroll-btn');
    
    if (form && enrollBtn) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
        
        enrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
}

function handleFormSubmission() {
    // Validate all required fields
    const form = document.getElementById('enrollForm');
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const enrollmentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        experience: formData.get('experience'),
        goals: formData.get('goals'),
        paymentType: document.querySelector('input[name="paymentType"]:checked').value,
        couponCode: document.getElementById('couponCode').value.trim()
    };
    
    // Show loading state
    const enrollBtn = document.querySelector('.enroll-btn');
    const originalText = enrollBtn.innerHTML;
    enrollBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Processing...';
    enrollBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        enrollBtn.innerHTML = originalText;
        enrollBtn.disabled = false;
        
        // Show success message
        showNotification('Enrollment successful! Welcome to the course!', 'success');
        
        // Redirect to dashboard or course page
        setTimeout(() => {
            window.location.href = '../Dashboard/index.html';
        }, 2000);
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="material-symbols-outlined">
            ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
        </span>
        <span>${message}</span>
        <button class="notification-close">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#ff6b6b' : '#8f7efc'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add CSS animations
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            .notification-close:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved coupon on page load
    const savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
    if (savedCoupon) {
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.value = savedCoupon.code;
            couponInput.style.borderColor = '#8f7efc';
            couponInput.style.backgroundColor = 'rgba(143, 126, 252, 0.05)';
        }
    }
}); 