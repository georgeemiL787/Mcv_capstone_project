// Instructor Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeInstructorDashboard();
});

function initializeInstructorDashboard() {
    setupNavigation();
    setupEventListeners();
    loadDashboardData();
    setupCharts();
}

// Navigation Setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    setupCourseActions();
    setupEnrollmentFilters();
    setupDiscussionFilters();
    setupSettingsForm();
    setupQuizActions();
}

// Course Management
function setupCourseActions() {
    // Edit course buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('h3').textContent;
            showNotification(`Editing course: ${courseTitle}`, 'info');
        });
    });
    
    // Delete course buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('h3').textContent;
            
            if (confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
                courseCard.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    courseCard.remove();
                    showNotification(`Course "${courseTitle}" deleted successfully`, 'success');
                }, 300);
            }
        });
    });
    
    // Course action buttons
    const courseActionButtons = document.querySelectorAll('.course-actions .secondary-btn');
    courseActionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('h3').textContent;
            
            if (action === 'Edit Course') {
                showNotification(`Opening editor for: ${courseTitle}`, 'info');
            } else if (action === 'View Analytics') {
                showNotification(`Loading analytics for: ${courseTitle}`, 'info');
                // Switch to analytics section
                document.querySelector('[data-section="analytics"]').click();
            }
        });
    });
}

// Enrollment Management
function setupEnrollmentFilters() {
    const courseFilter = document.querySelector('.enrollments-filters select:first-child');
    const statusFilter = document.querySelector('.enrollments-filters select:last-child');
    const searchInput = document.querySelector('.enrollments-filters .search-input');
    
    if (courseFilter) {
        courseFilter.addEventListener('change', filterEnrollments);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEnrollments);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterEnrollments);
    }
    
    // Action buttons in enrollment table
    const actionButtons = document.querySelectorAll('.enrollments-table .action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('.material-symbols-outlined').textContent;
            const row = this.closest('tr');
            const studentName = row.querySelector('.student-info h4').textContent;
            
            if (action === 'visibility') {
                showNotification(`Viewing profile for: ${studentName}`, 'info');
            } else if (action === 'message') {
                showNotification(`Opening chat with: ${studentName}`, 'info');
            }
        });
    });
}

function filterEnrollments() {
    const courseFilter = document.querySelector('.enrollments-filters select:first-child').value;
    const statusFilter = document.querySelector('.enrollments-filters select:last-child').value;
    const searchTerm = document.querySelector('.enrollments-filters .search-input').value.toLowerCase();
    
    const rows = document.querySelectorAll('.enrollments-table tbody tr');
    
    rows.forEach(row => {
        const course = row.cells[1].textContent;
        const status = row.querySelector('.status-badge').textContent;
        const studentName = row.querySelector('.student-info h4').textContent.toLowerCase();
        const studentEmail = row.querySelector('.student-info p').textContent.toLowerCase();
        
        const courseMatch = courseFilter === 'All Courses' || course === courseFilter;
        const statusMatch = statusFilter === 'All Students' || status === statusFilter;
        const searchMatch = studentName.includes(searchTerm) || studentEmail.includes(searchTerm);
        
        if (courseMatch && statusMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Discussion Management
function setupDiscussionFilters() {
    const filterButtons = document.querySelectorAll('.discussions-filters .filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter discussions
            filterDiscussions(this.textContent.trim());
        });
    });
    
    // Discussion action buttons
    const discussionButtons = document.querySelectorAll('.discussion-actions .primary-btn, .discussion-actions .secondary-btn');
    discussionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const discussionItem = this.closest('.discussion-item');
            const questionTitle = discussionItem.querySelector('h4').textContent;
            
            if (action === 'Answer') {
                showNotification(`Opening answer form for: ${questionTitle}`, 'info');
            } else if (action === 'View Answer') {
                showNotification(`Loading answer for: ${questionTitle}`, 'info');
            } else if (action === 'Add Comment') {
                showNotification(`Opening comment form for: ${questionTitle}`, 'info');
            } else if (action === 'View Course') {
                showNotification(`Navigating to course for: ${questionTitle}`, 'info');
            }
        });
    });
}

function filterDiscussions(filterType) {
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    discussionItems.forEach(item => {
        const status = item.querySelector('.discussion-status').textContent;
        
        if (filterType === 'All Questions') {
            item.style.display = '';
        } else if (filterType === 'Unanswered' && status === 'Unanswered') {
            item.style.display = '';
        } else if (filterType === 'My Responses' && status === 'Answered') {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Quiz Management
function setupQuizActions() {
    const quizButtons = document.querySelectorAll('.quiz-actions .primary-btn, .quiz-actions .secondary-btn');
    
    quizButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const quizCard = this.closest('.quiz-card');
            const quizTitle = quizCard.querySelector('h3').textContent;
            
            if (action === 'Edit Quiz') {
                showNotification(`Opening quiz editor for: ${quizTitle}`, 'info');
            } else if (action === 'View Results') {
                showNotification(`Loading results for: ${quizTitle}`, 'info');
            } else if (action === 'Enable AI Auto-Quiz') {
                showNotification(`Enabling AI auto-quiz for: ${quizTitle}`, 'success');
                this.textContent = 'AI Auto-Quiz Enabled';
                this.style.background = '#4CAF50';
                this.style.borderColor = '#4CAF50';
            }
        });
    });
}

// Settings Management
function setupSettingsForm() {
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const settingsData = {
                displayName: formData.get('displayName') || this.querySelector('input[type="text"]').value,
                bio: formData.get('bio') || this.querySelector('textarea').value,
                email: formData.get('email') || this.querySelector('input[type="email"]').value
            };
            
            // Simulate saving settings
            showNotification('Settings saved successfully!', 'success');
            console.log('Settings Data:', settingsData);
        });
    }
    
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-item').querySelector('h4').textContent;
            const isEnabled = this.checked;
            
            showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
        });
    });
}

// Data Loading
function loadDashboardData() {
    // Simulate loading dashboard data
    updateStats();
    updateRecentActivity();
}

function updateStats() {
    // Animate stats on load
    const statNumbers = document.querySelectorAll('.stat-content h3');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
        
        if (finalValue.includes('$')) {
            animateCurrency(stat, numericValue);
        } else {
            animateNumber(stat, numericValue);
        }
    });
}

function animateNumber(element, finalValue) {
    let currentValue = 0;
    const increment = finalValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, 20);
}

function animateCurrency(element, finalValue) {
    let currentValue = 0;
    const increment = finalValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        element.textContent = `$${Math.floor(currentValue).toLocaleString()}`;
    }, 20);
}

function updateRecentActivity() {
    // Simulate real-time updates
    setInterval(() => {
        const enrollmentItems = document.querySelectorAll('.enrollment-item');
        if (enrollmentItems.length > 0) {
            const randomItem = enrollmentItems[Math.floor(Math.random() * enrollmentItems.length)];
            randomItem.style.background = 'rgba(143, 126, 252, 0.1)';
            setTimeout(() => {
                randomItem.style.background = 'rgba(143, 126, 252, 0.05)';
            }, 1000);
        }
    }, 5000);
}

// Charts Setup
function setupCharts() {
    // Revenue Chart (placeholder)
    const revenueChart = document.getElementById('revenueChart');
    if (revenueChart) {
        // Placeholder for chart library integration
        revenueChart.style.background = 'rgba(143, 126, 252, 0.05)';
        revenueChart.innerHTML = '<p>Revenue Chart - Chart.js integration required</p>';
    }
    
    // Dropoff Chart (placeholder)
    const dropoffChart = document.getElementById('dropoffChart');
    if (dropoffChart) {
        // Placeholder for chart library integration
        dropoffChart.style.background = 'rgba(143, 126, 252, 0.05)';
        dropoffChart.innerHTML = '<p>Dropoff Analysis Chart - Chart.js integration required</p>';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info';
    let title = 'Information';
    
    switch (type) {
        case 'success':
            icon = 'check_circle';
            title = 'Success';
            break;
        case 'error':
            icon = 'error';
            title = 'Error';
            break;
        case 'info':
            icon = 'info';
            title = 'Information';
            break;
    }
    
    notification.innerHTML = `
        <span class="material-symbols-outlined">${icon}</span>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined">close</span>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #333;
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-content h4 {
        margin: 0 0 4px 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: #333446;
    }
    
    .notification-content p {
        margin: 0;
        font-size: 0.85rem;
        color: #666;
    }
`;
document.head.appendChild(style); 