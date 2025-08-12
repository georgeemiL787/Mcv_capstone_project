// Settings Page JavaScript for MVC

document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings functionality
    initializeSettings();
});

function initializeSettings() {
    // Setup tab navigation
    setupTabNavigation();
    
    // Setup form handling
    setupFormHandling();
    
    // Setup toggle switches
    setupToggleSwitches();
    
    // Load saved settings from localStorage
    loadSavedSettings();
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.settings-tab');
    const tabPanels = document.querySelectorAll('.settings-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Save active tab to localStorage
            localStorage.setItem('activeSettingsTab', targetTab);
        });
    });
}

function setupFormHandling() {
    const profileForm = document.querySelector('.settings-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileSettings();
        });
    }
    
    // Setup cancel button
    const cancelBtn = document.querySelector('.form-actions .secondary-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            resetProfileForm();
        });
    }
}

function setupToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.notification-item, .privacy-item').querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '_');
            const isEnabled = this.checked;
            
            // Save setting to localStorage
            saveToggleSetting(settingName, isEnabled);
            
            // Show notification
            showNotification(`Setting "${settingName}" ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
        });
    });
}

function saveProfileSettings() {
    const formData = new FormData(document.querySelector('.settings-form'));
    const profileData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        bio: formData.get('bio'),
        specialization: formData.get('specialization')
    };
    
    // Save to localStorage (in real app, this would be sent to server)
    localStorage.setItem('profileSettings', JSON.stringify(profileData));
    
    showNotification('Profile settings saved successfully!', 'success');
    
    // TODO: Send data to server via AJAX
    console.log('Saving profile settings:', profileData);
}

function resetProfileForm() {
    const form = document.querySelector('.settings-form');
    if (form) {
        form.reset();
        showNotification('Form reset to previous values', 'info');
    }
}

function saveToggleSetting(settingName, isEnabled) {
    const currentSettings = JSON.parse(localStorage.getItem('toggleSettings') || '{}');
    currentSettings[settingName] = isEnabled;
    localStorage.setItem('toggleSettings', JSON.stringify(currentSettings));
    
    console.log(`Setting ${settingName} saved:`, isEnabled);
}

function loadSavedSettings() {
    // Load active tab
    const activeTab = localStorage.getItem('activeSettingsTab');
    if (activeTab) {
        const tabButton = document.querySelector(`[data-tab="${activeTab}"]`);
        if (tabButton) {
            tabButton.click();
        }
    }
    
    // Load profile settings
    const profileSettings = localStorage.getItem('profileSettings');
    if (profileSettings) {
        const data = JSON.parse(profileSettings);
        Object.keys(data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
    
    // Load toggle settings
    const toggleSettings = JSON.parse(localStorage.getItem('toggleSettings') || '{}');
    Object.keys(toggleSettings).forEach(settingName => {
        const toggle = findToggleBySettingName(settingName);
        if (toggle) {
            toggle.checked = toggleSettings[settingName];
        }
    });
}

function findToggleBySettingName(settingName) {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    for (let toggle of toggleSwitches) {
        const item = toggle.closest('.notification-item, .privacy-item');
        const title = item.querySelector('h4').textContent.toLowerCase().replace(/\s+/g, '_');
        if (title === settingName) {
            return toggle;
        }
    }
    return null;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="material-symbols-outlined">${getNotificationIcon(type)}</span>
        <div class="notification-content">
            <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <p>${message}</p>
        </div>
    `;
    
    // Add to page
    const container = document.getElementById('notification-container') || createNotificationContainer();
    container.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check_circle';
        case 'error': return 'error';
        case 'info': return 'info';
        default: return 'info';
    }
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    `;
    document.body.appendChild(container);
    return container;
}

// Security settings functions
function enableTwoFactorAuth() {
    showNotification('Two-factor authentication setup initiated', 'info');
    // TODO: Implement 2FA setup flow
}

function changePassword() {
    showNotification('Password change functionality will be implemented', 'info');
    // TODO: Implement password change modal
}

function viewLoginHistory() {
    showNotification('Login history will be displayed', 'info');
    // TODO: Implement login history view
}

// Billing settings functions
function updatePaymentMethod() {
    showNotification('Payment method update functionality will be implemented', 'info');
    // TODO: Implement payment method update
}

function changePayoutSchedule() {
    showNotification('Payout schedule change functionality will be implemented', 'info');
    // TODO: Implement payout schedule change
}

function updateTaxInfo() {
    showNotification('Tax information update functionality will be implemented', 'info');
    // TODO: Implement tax info update
}
