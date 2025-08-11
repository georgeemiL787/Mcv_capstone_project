// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to switch between sections
    function switchSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav items
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked nav item
        const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
            
            // Update URL hash
            window.location.hash = sectionId;
        });
    });

    // Handle URL hash on page load
    function handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash && document.getElementById(hash)) {
            switchSection(hash);
        } else {
            // Default to overview if no valid hash
            switchSection('overview');
        }
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle initial load
    handleHashChange();

    // XP Progress Animation
    function animateXPProgress() {
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const targetWidth = xpFill.style.width;
            xpFill.style.width = '0%';
            
            setTimeout(() => {
                xpFill.style.width = targetWidth;
            }, 500);
        }
    }

    // Stats Counter Animation
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-content h3');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Progress Circle Animation
    function animateProgressCircle() {
        const progressCircle = document.querySelector('.circle-progress');
        if (progressCircle) {
            const progress = parseInt(progressCircle.getAttribute('data-progress'));
            const degrees = (progress / 100) * 360;
            
            progressCircle.style.background = `conic-gradient(
                #8f7efc ${degrees}deg,
                #e4defe ${degrees}deg
            )`;
        }
    }

    // Quick Actions Setup
    function setupQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                
                switch(action) {
                    case 'start-course':
                        showNotification('Starting new course...', 'success');
                        break;
                    case 'take-quiz':
                        showNotification('Opening quiz...', 'info');
                        break;
                    case 'view-progress':
                        showNotification('Loading progress...', 'info');
                        break;
                    case 'get-help':
                        showNotification('Opening help center...', 'info');
                        break;
                }
            });
        });
    }

    // Course Cards Setup
    function setupCourseCards() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const continueBtn = card.querySelector('.continue-btn');
            const certificateBtn = card.querySelector('.certificate-btn');
            
            if (continueBtn) {
                continueBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const courseId = this.getAttribute('data-course-id');
                    showNotification(`Continuing course ${courseId}...`, 'success');
                });
            }
            
            if (certificateBtn) {
                certificateBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const courseId = this.getAttribute('data-course-id');
                    showNotification(`Downloading certificate for course ${courseId}...`, 'success');
                });
            }
        });
    }

    // Reminder Actions Setup
    function setupReminderActions() {
        const reminderActions = document.querySelectorAll('.reminder-action');
        
        reminderActions.forEach(action => {
            action.addEventListener('click', function(e) {
                e.preventDefault();
                const reminderId = this.getAttribute('data-reminder-id');
                const actionType = this.getAttribute('data-action');
                
                if (actionType === 'dismiss') {
                    this.closest('.reminder-item').style.display = 'none';
                    showNotification('Reminder dismissed', 'info');
                } else if (actionType === 'snooze') {
                    showNotification('Reminder snoozed for 1 hour', 'info');
                }
            });
        });
    }

    // Achievement Cards Setup
    function setupAchievementCards() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        achievementCards.forEach(card => {
            card.addEventListener('click', function() {
                const achievementName = this.querySelector('h3').textContent;
                const isEarned = this.classList.contains('earned');
                
                if (isEarned) {
                    showNotification(`Achievement: ${achievementName}`, 'success');
                } else {
                    showNotification(`Locked: ${achievementName}`, 'warning');
                }
            });
        });
    }

    // Skill Nodes Setup
    function setupSkillNodes() {
        const skillNodes = document.querySelectorAll('.skill-node');
        
        skillNodes.forEach(node => {
            node.addEventListener('click', function() {
                const skillName = this.querySelector('h3').textContent;
                const isCompleted = this.classList.contains('completed');
                const isActive = this.classList.contains('active');
                
                if (isCompleted) {
                    showNotification(`Skill completed: ${skillName}`, 'success');
                } else if (isActive) {
                    showNotification(`Starting: ${skillName}`, 'info');
                } else {
                    showNotification(`Skill locked: ${skillName}`, 'warning');
                }
            });
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #e4defe;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(143, 126, 252, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // Progress Bars Animation
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    }

    // Hover Effects
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.stat-card, .course-card, .achievement-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Keyboard Navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close any open modals or notifications
                const notifications = document.querySelectorAll('.notification');
                notifications.forEach(notification => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                });
            }
        });
    }

    // Auto Refresh (optional)
    function setupAutoRefresh() {
        // Refresh dashboard data every 5 minutes
        setInterval(() => {
            // This would typically make an AJAX call to refresh data
            console.log('Refreshing dashboard data...');
        }, 300000);
    }

    // Initialize all functionality
    function init() {
        animateXPProgress();
        animateStats();
        animateProgressCircle();
        setupQuickActions();
        setupCourseCards();
        setupReminderActions();
        setupAchievementCards();
        setupSkillNodes();
        animateProgressBars();
        setupHoverEffects();
        setupKeyboardNavigation();
        setupAutoRefresh();
    }

    // Start the dashboard
    init();
}); 