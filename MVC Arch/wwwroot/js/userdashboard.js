// User Dashboard Views JavaScript - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Dashboard functionality
    initDashboard();
});

function initDashboard() {
    // Roadmap functionality
    initRoadmap();
    
    // XP and gamification
    initXPSystem();
    
    // Quick actions
    initQuickActions();
    
    // Insights and recommendations
    initInsights();
    
    // Reminders and deadlines
    initReminders();
    
    // Course suggestions
    initSuggestions();
    
    // Learning statistics
    initStatistics();
    
    // Real-time updates
    initRealTimeUpdates();
    
    // Add floating particles for visual appeal
    addFloatingParticles();
}

function initRoadmap() {
    const roadmapNodes = document.querySelectorAll('.roadmap-node');
    
    roadmapNodes.forEach(node => {
        // Add click event to show skill details
        node.addEventListener('click', function() {
            const skill = this.dataset.skill;
            const status = this.classList.contains('completed') ? 'completed' : 
                          this.classList.contains('current') ? 'current' : 'upcoming';
            showSkillDetails(skill, status);
        });
        
        // Add hover effects
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 30px rgba(143, 126, 252, 0.15)';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(143, 126, 252, 0.1)';
        });
        
        // Animate progress bars on load
        const progressFill = node.querySelector('.progress-fill');
        if (progressFill) {
            const width = progressFill.style.width;
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = width;
            }, 500);
        }
    });
    
    // Edit roadmap button functionality
    const editRoadmapBtn = document.querySelector('.edit-roadmap-btn');
    if (editRoadmapBtn) {
        editRoadmapBtn.addEventListener('click', showRoadmapEditor);
    }
}

function showSkillDetails(skill, status) {
    // Create modal for skill details
    const modal = document.createElement('div');
    modal.className = 'skill-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${skill.charAt(0).toUpperCase() + skill.slice(1)} Details</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="skill-status ${status}">
                    <span class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <div class="skill-info">
                    <h4>Current Progress</h4>
                    <div class="skill-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${status === 'completed' ? '100' : status === 'current' ? '75' : '0'}%"></div>
                        </div>
                        <span class="progress-text">${status === 'completed' ? '100%' : status === 'current' ? '75%' : '0%'} Complete</span>
                    </div>
                </div>
                <div class="skill-actions">
                    <button class="btn-primary">Continue Learning</button>
                    <button class="btn-secondary">View Resources</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .skill-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .modal-header h3 {
            color: #333446;
            margin: 0;
            font-family: 'Josefin Sans', sans-serif;
        }
        .close-modal {
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        .skill-status {
            margin-bottom: 20px;
        }
        .status-badge {
            background: ${status === 'completed' ? '#4CAF50' : status === 'current' ? '#8f7efc' : '#FF9800'};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        .skill-progress {
            margin: 20px 0;
        }
        .progress-bar {
            width: 100%;
            height: 12px;
            background: rgba(228, 222, 254, 0.3);
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #8f7efc, #7a6bfc);
            border-radius: 6px;
            transition: width 0.8s ease;
        }
        .progress-text {
            color: #666;
            font-size: 0.9rem;
        }
        .skill-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
        .btn-secondary {
            background: rgba(143, 126, 252, 0.1);
            border: 1px solid rgba(143, 126, 252, 0.3);
            color: #8f7efc;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Source Sans 3', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .btn-secondary:hover {
            background: rgba(143, 126, 252, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showRoadmapEditor() {
    // Create roadmap editor modal
    const modal = document.createElement('div');
    modal.className = 'roadmap-editor-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Learning Roadmap</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p>Customize your learning path by adding, removing, or reordering skills.</p>
                <div class="roadmap-editor">
                    <div class="skill-item" draggable="true">
                        <span class="drag-handle">⋮⋮</span>
                        <span class="skill-name">HTML & CSS</span>
                        <select class="skill-status">
                            <option value="completed">Completed</option>
                            <option value="current">Current</option>
                            <option value="upcoming">Upcoming</option>
                        </select>
                    </div>
                    <div class="skill-item" draggable="true">
                        <span class="drag-handle">⋮⋮</span>
                        <span class="skill-name">JavaScript</span>
                        <select class="skill-status">
                            <option value="completed">Completed</option>
                            <option value="current" selected>Current</option>
                            <option value="upcoming">Upcoming</option>
                        </select>
                    </div>
                    <div class="skill-item" draggable="true">
                        <span class="drag-handle">⋮⋮</span>
                        <span class="skill-name">React</span>
                        <select class="skill-status">
                            <option value="completed">Completed</option>
                            <option value="current">Current</option>
                            <option value="upcoming" selected>Upcoming</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-primary">Save Changes</button>
                    <button class="btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .roadmap-editor-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .roadmap-editor {
            margin: 20px 0;
        }
        .skill-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: rgba(143, 126, 252, 0.05);
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: move;
        }
        .drag-handle {
            color: #8f7efc;
            font-size: 18px;
            cursor: move;
        }
        .skill-name {
            flex: 1;
            font-weight: 600;
            color: #333446;
        }
        .skill-status {
            padding: 5px 10px;
            border: 1px solid rgba(143, 126, 252, 0.3);
            border-radius: 6px;
            background: white;
        }
        .modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 25px;
        }
    `;
    document.head.appendChild(style);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Initialize drag and drop
    initDragAndDrop();
}

function initDragAndDrop() {
    const skillItems = document.querySelectorAll('.skill-item');
    let draggedItem = null;
    
    skillItems.forEach(item => {
        item.addEventListener('dragstart', function() {
            draggedItem = this;
            this.style.opacity = '0.5';
        });
        
        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
            draggedItem = null;
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedItem !== this) {
                const allItems = [...skillItems];
                const draggedIndex = allItems.indexOf(draggedItem);
                const droppedIndex = allItems.indexOf(this);
                
                if (draggedIndex < droppedIndex) {
                    this.parentNode.insertBefore(draggedItem, this.nextSibling);
                } else {
                    this.parentNode.insertBefore(draggedItem, this);
                }
            }
        });
    });
}

function initXPSystem() {
    // Animate XP progress bar
    const xpFill = document.querySelector('.xp-fill');
    if (xpFill) {
        const targetWidth = xpFill.style.width;
        xpFill.style.width = '0%';
        
        setTimeout(() => {
            xpFill.style.width = targetWidth;
        }, 1000);
    }
    
    // Update XP display
    function updateXP() {
        const currentXP = document.querySelector('.current-xp');
        const nextLevel = document.querySelector('.next-level');
        
        if (currentXP && nextLevel) {
            // Simulate XP gain
            let xp = 1250;
            const interval = setInterval(() => {
                xp += Math.floor(Math.random() * 10) + 1;
                currentXP.textContent = `${xp.toLocaleString()} XP`;
                
                if (xp >= 2000) {
                    clearInterval(interval);
                    showLevelUpAnimation();
                }
            }, 3000);
        }
    }
    
    // Start XP updates after a delay
    setTimeout(updateXP, 2000);
}

function showLevelUpAnimation() {
    // Create level up notification
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="material-symbols-outlined">🎉</span>
            <h3>Level Up!</h3>
            <p>Congratulations! You've reached Level 9!</p>
            <div class="level-up-rewards">
                <div class="reward">
                    <span class="material-symbols-outlined">emoji_events</span>
                    <span>New Achievement Unlocked</span>
                </div>
                <div class="reward">
                    <span class="material-symbols-outlined">card_membership</span>
                    <span>Certificate Available</span>
                </div>
            </div>
        </div>
    `;
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .level-up-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #8f7efc, #7a6bfc);
            color: white;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 10px 40px rgba(143, 126, 252, 0.3);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
            max-width: 350px;
        }
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
        .notification-content {
            text-align: center;
        }
        .notification-content h3 {
            margin: 15px 0 10px 0;
            font-family: 'Josefin Sans', sans-serif;
        }
        .notification-content p {
            margin: 0 0 20px 0;
            opacity: 0.9;
        }
        .level-up-rewards {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .reward {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 8px;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
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
    `;
    document.head.appendChild(slideOutStyle);
}

function initQuickActions() {
    console.log('Initializing quick actions...');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    console.log('Found quick action buttons:', quickActionBtns.length);
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.getAttribute('data-action');
            console.log('Button clicked with action:', action);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Navigate to appropriate route
            switch(action) {
                case 'quiz':
                    console.log('Navigating to AI Quiz...');
                    window.location.href = '/QuizCenter';
                    break;
                case 'profile':
                    console.log('Navigating to Profile...');
                    window.location.href = '/Profile';
                    break;
                default:
                    console.log('Unknown action:', action);
            }
        });
    });
}



function initInsights() {
    const insightCards = document.querySelectorAll('.insight-card');
    
    insightCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.classList.contains('strength') ? 'strength' : 
                        this.classList.contains('improvement') ? 'improvement' : 'recommendation';
            showInsightDetails(type);
        });
    });
}

function showInsightDetails(type) {
    const insights = {
        strength: {
            title: 'Your Learning Strengths',
            description: 'Areas where you excel and can leverage for faster progress',
            details: [
                'Strong problem-solving skills',
                'Excellent code organization',
                'Great debugging abilities',
                'Consistent learning habits'
            ]
        },
        improvement: {
            title: 'Areas for Improvement',
            description: 'Focus on these areas to accelerate your learning',
            details: [
                'Advanced JavaScript concepts',
                'Async programming patterns',
                'Testing and debugging practices',
                'Performance optimization'
            ]
        },
        recommendation: {
            title: 'Personalized Recommendations',
            description: 'AI-powered suggestions based on your learning pattern',
            details: [
                'Complete JavaScript ES6+ course',
                'Practice with real-world projects',
                'Join coding challenges',
                'Review fundamentals regularly'
            ]
        }
    };
    
    const insight = insights[type];
    
    // Create insight details modal
    const modal = document.createElement('div');
    modal.className = 'insight-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${insight.title}</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p class="insight-description">${insight.description}</p>
                <div class="insight-details">
                    ${insight.details.map(detail => `
                        <div class="detail-item">
                            <span class="material-symbols-outlined">check_circle</span>
                            <span>${detail}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="insight-actions">
                    <button class="btn-primary">Create Action Plan</button>
                    <button class="btn-secondary">Learn More</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .insight-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .insight-description {
            color: #666;
            margin-bottom: 25px;
            font-size: 1rem;
        }
        .insight-details {
            margin-bottom: 25px;
        }
        .detail-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            color: #333446;
        }
        .detail-item .material-symbols-outlined {
            color: #4CAF50;
        }
        .insight-actions {
            display: flex;
            gap: 15px;
        }
    `;
    document.head.appendChild(style);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function initReminders() {
    const reminderItems = document.querySelectorAll('.reminder-item');
    const addReminderBtn = document.querySelector('.add-reminder-btn');
    
    reminderItems.forEach(item => {
        const viewBtn = item.querySelector('.reminder-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function() {
                const reminderTitle = item.querySelector('h4').textContent;
                showReminderDetails(reminderTitle);
            });
        }
    });
    
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', showAddReminderModal);
    }
}

function showReminderDetails(title) {
    const modal = document.createElement('div');
    modal.className = 'reminder-details-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="reminder-info">
                    <p><strong>Due Date:</strong> ${title.includes('JavaScript') ? '2 days' : title.includes('React') ? '5 days' : 'Tomorrow'}</p>
                    <p><strong>Priority:</strong> ${title.includes('JavaScript') ? 'High' : 'Medium'}</p>
                    <p><strong>Description:</strong> Complete the assigned project/quiz according to the requirements.</p>
                </div>
                <div class="reminder-actions">
                    <button class="btn-primary">Mark Complete</button>
                    <button class="btn-secondary">Snooze</button>
                    <button class="btn-secondary">Edit</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .reminder-details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .reminder-info {
            margin-bottom: 25px;
        }
        .reminder-info p {
            margin: 10px 0;
            color: #333446;
        }
        .reminder-actions {
            display: flex;
            gap: 15px;
        }
    `;
    document.head.appendChild(style);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showAddReminderModal() {
    const modal = document.createElement('div');
    modal.className = 'add-reminder-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Reminder</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form class="reminder-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" placeholder="Enter reminder title" required>
                    </div>
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select required>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea placeholder="Enter reminder description" rows="3"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Add Reminder</button>
                        <button type="button" class="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .add-reminder-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .reminder-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .form-group label {
            font-weight: 600;
            color: #333446;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 12px;
            border: 1px solid rgba(143, 126, 252, 0.3);
            border-radius: 8px;
            font-family: 'Source Sans 3', sans-serif;
        }
        .form-actions {
            display: flex;
            gap: 15px;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Handle form submission
    const form = modal.querySelector('.reminder-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        alert('Reminder added successfully!');
        document.body.removeChild(modal);
    });
}

function initSuggestions() {
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    
    suggestionCards.forEach(card => {
        const startBtn = card.querySelector('.btn-primary');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                const courseTitle = card.querySelector('h4').textContent;
                showCourseEnrollment(courseTitle);
            });
        }
    });
    
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            window.location.href = '/Courses';
        });
    }
}

function showCourseEnrollment(courseTitle) {
    const modal = document.createElement('div');
    modal.className = 'course-enrollment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Enroll in ${courseTitle}</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="course-preview">
                    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop" alt="${courseTitle}">
                    <div class="course-details">
                        <h4>${courseTitle}</h4>
                        <p>Master the fundamentals and advanced concepts</p>
                        <div class="course-meta">
                            <span>8 weeks</span>
                            <span>4.8★</span>
                            <span>Intermediate</span>
                        </div>
                    </div>
                </div>
                <div class="enrollment-actions">
                    <button class="btn-primary">Start Learning Now</button>
                    <button class="btn-secondary">Add to Wishlist</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .course-enrollment-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .course-preview {
            display: flex;
            gap: 20px;
            margin-bottom: 25px;
        }
        .course-preview img {
            width: 120px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
        }
        .course-details h4 {
            margin: 0 0 8px 0;
            color: #333446;
        }
        .course-details p {
            margin: 0 0 15px 0;
            color: #666;
            font-size: 0.9rem;
        }
        .course-meta {
            display: flex;
            gap: 15px;
            font-size: 0.8rem;
            color: #8f7efc;
        }
        .enrollment-actions {
            display: flex;
            gap: 15px;
        }
    `;
    document.head.appendChild(style);
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function initStatistics() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        // Animate stat numbers
        const statNumber = card.querySelector('h3');
        if (statNumber) {
            animateStatNumber(statNumber);
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(143, 126, 252, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(143, 126, 252, 0.1)';
        });
    });
}

function animateStatNumber(element) {
    const finalValue = parseFloat(element.textContent);
    const duration = 2000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = finalValue * progress;
        element.textContent = currentValue.toFixed(1);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = finalValue;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function initRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        // Update learning streak
        const streakElement = document.querySelector('.achievement:first-child span:last-child');
        if (streakElement && streakElement.textContent.includes('Day Streak')) {
            const currentStreak = parseInt(streakElement.textContent.match(/\d+/)[0]);
            if (Math.random() > 0.7) { // 30% chance to increase streak
                streakElement.textContent = `${currentStreak + 1} Day Streak`;
            }
        }
        
        // Update XP progress
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const currentWidth = parseFloat(xpFill.style.width);
            if (currentWidth < 100 && Math.random() > 0.8) { // 20% chance to gain XP
                const newWidth = Math.min(currentWidth + Math.random() * 2, 100);
                xpFill.style.width = newWidth + '%';
            }
        }
    }, 10000); // Update every 10 seconds
}

function addFloatingParticles() {
    // Create floating particles for visual appeal
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(143, 126, 252, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: float-particle ${10 + Math.random() * 20}s linear infinite;
        `;
        
        document.body.appendChild(particle);
    }
    
    // Add particle animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Utility function for smooth scrolling
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for potential external use
window.UserDashboard = {
    initDashboard,
    showSkillDetails,
    showRoadmapEditor,
    showInsightDetails,
    showReminderDetails,
    showAddReminderModal,
    showCourseEnrollment,
    smoothScrollTo
};
