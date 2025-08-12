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
    // The navigation is handled by MVC routing, so we just need to ensure
    // the active state is properly set based on the current page
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
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
                // Navigate to analytics page
                window.location.href = '/InstructorDashboard/Analytics';
            }
        });
    });
}

// Enrollment Management
function setupEnrollmentFilters() {
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('studentSearch');
    
    if (courseFilter) {
        courseFilter.addEventListener('change', filterEnrollments);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEnrollments);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterEnrollments);
    }
}

function filterEnrollments() {
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('studentSearch');
    
    if (!courseFilter || !statusFilter || !searchInput) return;
    
    const selectedCourse = courseFilter.value;
    const selectedStatus = statusFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const rows = document.querySelectorAll('.enrollments-table tbody tr');
    
    rows.forEach(row => {
        const course = row.cells[1].textContent;
        const status = row.querySelector('.status-badge').textContent;
        const studentName = row.querySelector('.student-info h4').textContent.toLowerCase();
        const studentEmail = row.querySelector('.student-info p').textContent.toLowerCase();
        
        const courseMatch = !selectedCourse || course === selectedCourse;
        const statusMatch = !selectedStatus || status === selectedStatus;
        const searchMatch = !searchTerm || studentName.includes(searchTerm) || studentEmail.includes(searchTerm);
        
        if (courseMatch && statusMatch && searchMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Discussion Management
function setupDiscussionFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('questionSearch');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterDiscussions(this.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterDiscussions('', this.value);
        });
    }
}

function filterDiscussions(filterType, searchTerm = '') {
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    discussionItems.forEach(item => {
        const status = item.querySelector('.status-badge').textContent.toLowerCase();
        const question = item.querySelector('.question-content h3').textContent.toLowerCase();
        const content = item.querySelector('.question-content p').textContent.toLowerCase();
        
        const statusMatch = !filterType || status === filterType.toLowerCase();
        const searchMatch = !searchTerm || question.includes(searchTerm.toLowerCase()) || content.includes(searchTerm.toLowerCase());
        
        if (statusMatch && searchMatch) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Quiz Management
function setupQuizActions() {
    const quizCards = document.querySelectorAll('.quiz-card');
    
    quizCards.forEach(card => {
        const viewBtn = card.querySelector('.view-btn');
        const editBtn = card.querySelector('.edit-btn');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                const quizTitle = card.querySelector('h3').textContent;
                showNotification(`Viewing quiz: ${quizTitle}`, 'info');
            });
        }
        
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const quizTitle = card.querySelector('h3').textContent;
                showNotification(`Editing quiz: ${quizTitle}`, 'info');
            });
        }
    });
}

// Settings Management
function setupSettingsForm() {
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Settings saved successfully!', 'success');
        });
    }
    
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.getAttribute('data-setting');
            const isEnabled = this.checked;
            showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
        });
    });
}

// Dashboard Data Loading
function loadDashboardData() {
    // Simulate loading dashboard data
    setTimeout(() => {
        updateStats();
        updateRecentActivity();
    }, 500);
}

function updateStats() {
    // Animate stat numbers
    const statNumbers = document.querySelectorAll('.stat-content h3, .stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue.includes('$')) {
            animateCurrency(stat, finalValue);
        } else if (finalValue.includes(',')) {
            animateNumber(stat, finalValue);
        }
    });
}

function animateNumber(element, finalValue) {
    const numericValue = parseInt(finalValue.replace(/,/g, ''));
    let currentValue = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, 20);
}

function animateCurrency(element, finalValue) {
    const numericValue = parseFloat(finalValue.replace(/[$,]/g, ''));
    let currentValue = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        element.textContent = `$${currentValue.toFixed(2)}`;
    }, 20);
}

function updateRecentActivity() {
    // Update recent enrollments
    const enrollmentItems = document.querySelectorAll('.enrollment-item');
    enrollmentItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 100);
    });
    
    // Update recent reviews
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            item.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 100);
    });
}

// Charts Setup
function setupCharts() {
    // Initialize chart placeholders
    const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
    chartPlaceholders.forEach(placeholder => {
        if (placeholder.classList.contains('small')) {
            placeholder.style.height = '150px';
        } else {
            placeholder.style.height = '300px';
        }
    });
    
    // Chart controls
    const timeRangeSelects = document.querySelectorAll('#timeRange, #engagementTimeRange');
    timeRangeSelects.forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                showNotification(`Chart updated for ${this.options[this.selectedIndex].text}`, 'info');
            });
        }
    });
    
    const performanceSelects = document.querySelectorAll('#performanceMetric');
    performanceSelects.forEach(select => {
        if (select) {
            select.addEventListener('change', function() {
                showNotification(`Performance metric changed to ${this.options[this.selectedIndex].text}`, 'info');
            });
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${getNotificationIcon(type)}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border: 1px solid #e4defe;
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '<span class="material-symbols-outlined" style="color: #4caf50;">check_circle</span>';
        case 'error':
            return '<span class="material-symbols-outlined" style="color: #f44336;">error</span>';
        case 'warning':
            return '<span class="material-symbols-outlined" style="color: #ff9800;">warning</span>';
        default:
            return '<span class="material-symbols-outlined" style="color: #8f7efc;">info</span>';
    }
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
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
    }
    
    .notification-icon {
        display: flex;
        align-items: center;
    }
    
    .notification-message {
        flex: 1;
        color: #333446;
        font-family: 'Source Sans 3', sans-serif;
        font-size: 0.95rem;
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
        background: #f8f7ff;
        color: #8f7efc;
    }
    
    .notification-close .material-symbols-outlined {
        font-size: 18px;
    }
`;
document.head.appendChild(style); 