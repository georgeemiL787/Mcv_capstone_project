// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const teamMembers = document.querySelectorAll('.team-member');
    
    // Form handling
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
    
    // Team member interactions
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            showMemberDetails(this);
        });
        
        // Add hover effects
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize contact page
    initializeContactPage();
});

function handleContactFormSubmission() {
    const form = document.querySelector('.contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Validate form
    if (!validateContactForm(firstName, lastName, email, subject, message)) {
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending Message...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Add success animation
        form.classList.add('success');
        setTimeout(() => {
            form.classList.remove('success');
        }, 2000);
    }, 2000);
}

function validateContactForm(firstName, lastName, email, subject, message) {
    let isValid = true;
    
    // Clear previous errors
    clearContactErrors();
    
    // Validate first name
    if (!firstName || firstName.trim() === '') {
        showContactError('firstName', 'First name is required');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName || lastName.trim() === '') {
        showContactError('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email || email.trim() === '') {
        showContactError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showContactError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!subject || subject.trim() === '') {
        showContactError('subject', 'Subject is required');
        isValid = false;
    }
    
    // Validate message
    if (!message || message.trim() === '') {
        showContactError('message', 'Message is required');
        isValid = false;
    } else if (message.trim().length < 10) {
        showContactError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showContactError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'contact-error-message';
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

function clearContactErrors() {
    const errorMessages = document.querySelectorAll('.contact-error-message');
    errorMessages.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('.contact-form input, .contact-form textarea');
    fields.forEach(field => {
        field.style.borderColor = '';
    });
}

function showMemberDetails(memberElement) {
    const memberName = memberElement.querySelector('h3').textContent;
    const memberRole = memberElement.querySelector('.member-role').textContent;
    const memberDescription = memberElement.querySelector('.member-description').textContent;
    const memberSkills = Array.from(memberElement.querySelectorAll('.skill-tag')).map(tag => tag.textContent);
    const memberContact = memberElement.querySelector('.member-contact').innerHTML;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'member-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${memberName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="member-info-modal">
                    <p class="member-role-modal">${memberRole}</p>
                    <p class="member-description-modal">${memberDescription}</p>
                    
                    <div class="member-skills-modal">
                        <h4>Skills & Expertise</h4>
                        <div class="skills-tags">
                            ${memberSkills.map(skill => `<span class="skill-tag-modal">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="member-contact-modal">
                        <h4>Contact Information</h4>
                        ${memberContact}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .member-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            z-index: 1001;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 2px solid #e4defe;
            background: linear-gradient(135deg, #f8f7ff 0%, #f0eeff 100%);
        }
        
        .modal-header h2 {
            margin: 0;
            color: #333446;
            font-family: "Josefin Sans", sans-serif;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #666;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            background: #f0eeff;
            color: #333446;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .member-role-modal {
            color: #8f7efc;
            font-weight: 600;
            font-size: 1.1rem;
            margin: 0 0 15px 0;
        }
        
        .member-description-modal {
            color: #666;
            line-height: 1.6;
            margin: 0 0 20px 0;
        }
        
        .member-skills-modal h4,
        .member-contact-modal h4 {
            color: #333446;
            margin: 0 0 10px 0;
            font-family: "Josefin Sans", sans-serif;
        }
        
        .skills-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .skill-tag-modal {
            background: rgba(143, 126, 252, 0.1);
            color: #8f7efc;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .member-contact-modal .contact-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #8f7efc;
            text-decoration: none;
            margin: 8px 0;
            transition: color 0.2s ease;
        }
        
        .member-contact-modal .contact-link:hover {
            color: #7a6afc;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease;
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Add to page
    document.body.appendChild(modal);
    
    // Handle modal close
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    overlay.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        modal.remove();
    }, 300);
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
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

function initializeContactPage() {
    // Add real-time validation
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        // Add focus effects
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
    });
    
    // Add character counter for message
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.addEventListener('input', function() {
            updateCharacterCount(this);
        });
    }
    
    // Add smooth scrolling for contact links
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function validateContactField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    // Clear previous error
    const existingError = field.parentNode.querySelector('.contact-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate based on field type
    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                showContactError(fieldId, 'This field is required');
            } else {
                field.style.borderColor = '#8f7efc';
            }
            break;
        case 'email':
            if (!value) {
                showContactError(fieldId, 'Email is required');
            } else if (!isValidEmail(value)) {
                showContactError(fieldId, 'Please enter a valid email address');
            } else {
                field.style.borderColor = '#8f7efc';
            }
            break;
        case 'subject':
            if (!value) {
                showContactError(fieldId, 'Subject is required');
            } else {
                field.style.borderColor = '#8f7efc';
            }
            break;
        case 'message':
            if (!value) {
                showContactError(fieldId, 'Message is required');
            } else if (value.length < 10) {
                showContactError(fieldId, 'Message must be at least 10 characters long');
            } else {
                field.style.borderColor = '#8f7efc';
            }
            break;
    }
}

function updateCharacterCount(textarea) {
    const currentCount = textarea.value.length;
    const minLength = 10;
    const maxLength = 1000;
    
    let counter = document.getElementById('message-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.id = 'message-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: #666;
            text-align: right;
            margin-top: 5px;
        `;
        textarea.parentNode.appendChild(counter);
    }
    
    let color = '#666';
    if (currentCount < minLength) {
        color = '#e74c3c';
    } else if (currentCount > maxLength * 0.8) {
        color = '#f39c12';
    } else {
        color = '#27ae60';
    }
    
    counter.style.color = color;
    counter.textContent = `${currentCount}/${maxLength} characters`;
    
    // Add visual feedback
    if (currentCount >= minLength) {
        textarea.style.borderColor = '#8f7efc';
    } else {
        textarea.style.borderColor = '#e74c3c';
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
    
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: #8f7efc;
        box-shadow: 0 0 0 3px rgba(143, 126, 252, 0.1);
    }
    
    .contact-form.success {
        animation: successPulse 0.5s ease;
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(spinnerStyle);
