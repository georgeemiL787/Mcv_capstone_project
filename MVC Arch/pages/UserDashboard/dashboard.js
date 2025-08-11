// User Dashboard JavaScript - Interactive Features

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
    
    // Statistics and animations
    initStatistics();
    
    // Real-time updates
    initRealTimeUpdates();
}

function initRoadmap() {
    const roadmapNodes = document.querySelectorAll('.roadmap-node');
    
    roadmapNodes.forEach((node, index) => {
        // Add entrance animation
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            node.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
        }, index * 200);
        
        node.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            const isCompleted = this.classList.contains('completed');
            const isCurrent = this.classList.contains('current');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            if (isCompleted) {
                showSkillDetails(skill, 'completed');
            } else if (isCurrent) {
                showSkillDetails(skill, 'current');
            } else {
                showSkillDetails(skill, 'upcoming');
            }
        });
        
        // Enhanced hover effects
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Add glow effect
            const icon = this.querySelector('.node-icon');
            if (icon) {
                icon.style.filter = 'brightness(1.1)';
            }
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // Remove glow effect
            const icon = this.querySelector('.node-icon');
            if (icon) {
                icon.style.filter = 'brightness(1)';
            }
        });
        
        // Add progress animation on load
        const progressFill = node.querySelector('.progress-fill');
        if (progressFill) {
            const width = progressFill.style.width;
            progressFill.style.width = '0%';
            
            setTimeout(() => {
                progressFill.style.width = width;
            }, 500 + index * 200);
        }
    });
    
    // Edit roadmap button
    const editRoadmapBtn = document.querySelector('.edit-roadmap-btn');
    if (editRoadmapBtn) {
        editRoadmapBtn.addEventListener('click', function() {
            showRoadmapEditor();
        });
    }
    
    // Add floating particles effect
    addFloatingParticles();
}

function addFloatingParticles() {
    const roadmapSection = document.querySelector('.roadmap-section');
    if (!roadmapSection) return;
    
    // Create floating particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, #8f7efc, #7a6afc);
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
            z-index: 1;
            animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        roadmapSection.appendChild(particle);
    }
    
    // Add floating animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.6;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.3;
            }
        }
    `;
    document.head.appendChild(style);
}

function showSkillDetails(skill, status) {
    const skillNames = {
        'html-css': 'HTML & CSS',
        'javascript': 'JavaScript',
        'react': 'React',
        'nodejs': 'Node.js',
        'database': 'Database'
    };
    
    const skillName = skillNames[skill] || skill;
    
    // Create modal for skill details
    const modal = document.createElement('div');
    modal.className = 'skill-modal';
    modal.innerHTML = `
        <div class="skill-modal-content">
            <div class="skill-modal-header">
                <h3>${skillName}</h3>
                <button class="close-modal">×</button>
            </div>
            <div class="skill-modal-body">
                <div class="skill-status ${status}">
                    <span class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <div class="skill-progress">
                    <h4>Progress</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${status === 'completed' ? '100' : status === 'current' ? '75' : '0'}%"></div>
                    </div>
                    <p>${status === 'completed' ? '100% Complete' : status === 'current' ? '75% Complete' : '0% Complete'}</p>
                </div>
                <div class="skill-actions">
                    ${status === 'completed' ? 
                        '<button class="btn-primary">View Certificate</button>' :
                        status === 'current' ?
                        '<button class="btn-primary">Continue Learning</button>' :
                        '<button class="btn-primary">Start Learning</button>'
                    }
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .skill-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .skill-modal-content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(139, 126, 252, 0.1);
            border: 2px solid #e4defe;
        }
        .skill-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .skill-modal-header h3 {
            color: #333446;
            margin: 0;
            font-family: "Josefin Sans", sans-serif;
            font-weight: 600;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            color: #666;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .skill-status {
            margin-bottom: 20px;
        }
        .status-badge {
            background: linear-gradient(135deg, #8f7efc 0%, #7a6afc 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        .skill-status.completed .status-badge {
            background: linear-gradient(135deg, #4CAF50, #45a049);
        }
        .skill-progress h4 {
            color: #333446;
            margin: 0 0 10px 0;
            font-family: "Josefin Sans", sans-serif;
            font-weight: 600;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #f0eeff;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #8f7efc 0%, #7a6afc 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .skill-actions {
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showRoadmapEditor() {
    console.log('Opening roadmap editor...');
    // Here you would typically open a roadmap editor modal
    alert('Roadmap editor functionality would be implemented here');
}

function initXPSystem() {
    const xpFill = document.querySelector('.xp-fill');
    const currentXP = document.querySelector('.current-xp');
    const nextLevel = document.querySelector('.next-level');
    
    // Simulate XP gain
    let currentXPValue = 1250;
    const maxXP = 2000;
    
    function updateXP() {
        const progress = (currentXPValue / maxXP) * 100;
        xpFill.style.width = progress + '%';
        currentXP.textContent = currentXPValue.toLocaleString() + ' XP';
        nextLevel.textContent = (maxXP - currentXPValue) + ' XP to Level 9';
        
        // Add level up animation if needed
        if (currentXPValue >= maxXP) {
            showLevelUpAnimation();
        }
    }
    
    // Simulate XP gain every 30 seconds
    setInterval(() => {
        if (currentXPValue < maxXP) {
            currentXPValue += Math.floor(Math.random() * 10) + 5;
            updateXP();
        }
    }, 30000);
    
    // Add click effect to XP bar
    xpFill.addEventListener('click', function() {
        this.style.transform = 'scaleY(1.2)';
        setTimeout(() => {
            this.style.transform = 'scaleY(1)';
        }, 200);
    });
}

function showLevelUpAnimation() {
    const levelUpModal = document.createElement('div');
    levelUpModal.className = 'level-up-modal';
    levelUpModal.innerHTML = `
        <div class="level-up-content">
            <div class="level-up-icon">
                <span class="material-symbols-outlined">emoji_events</span>
            </div>
            <h2>Level Up! 🎉</h2>
            <p>Congratulations! You've reached Level 9!</p>
            <button class="btn-primary">Continue</button>
        </div>
    `;
    
    document.body.appendChild(levelUpModal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .level-up-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .level-up-content {
            background: white;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(139, 126, 252, 0.1);
            border: 2px solid #e4defe;
            animation: scaleIn 0.3s ease;
        }
        .level-up-icon {
            font-size: 4rem;
            color: #FFD700;
            margin-bottom: 20px;
        }
        .level-up-content h2 {
            color: #333446;
            margin: 0 0 10px 0;
            font-family: "Josefin Sans", sans-serif;
            font-weight: 600;
        }
        .level-up-content p {
            color: #666;
            margin: 0 0 20px 0;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes scaleIn {
            from { transform: scale(0.8); }
            to { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(levelUpModal)) {
            document.body.removeChild(levelUpModal);
        }
    }, 3000);
    
    // Click to close
    levelUpModal.addEventListener('click', () => {
        document.body.removeChild(levelUpModal);
    });
}

function initQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            switch(action) {
                case 'AI Quiz':
                    console.log('Opening AI Quiz...');
                    // Navigate to AI Quiz
                    break;
                case 'Certificates':
                    console.log('Opening Certificates...');
                    // Navigate to Certificates
                    break;
                case 'Profile':
                    console.log('Opening Profile...');
                    // Navigate to Profile
                    break;
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function initInsights() {
    const insightCards = document.querySelectorAll('.insight-card');
    
    insightCards.forEach(card => {
        card.addEventListener('click', function() {
            const insightType = this.classList.contains('strength') ? 'strength' : 
                              this.classList.contains('improvement') ? 'improvement' : 'recommendation';
            
            showInsightDetails(insightType);
        });
    });
}

function showInsightDetails(type) {
    const insights = {
        strength: {
            title: 'Your Strengths',
            description: 'Areas where you excel and show strong performance',
            items: ['Problem Solving - Excellent', 'Code Organization - Great', 'Debugging Skills - Strong']
        },
        improvement: {
            title: 'Areas to Improve',
            description: 'Focus areas for better learning outcomes',
            items: ['Advanced JavaScript Concepts', 'Async Programming', 'Testing Practices']
        },
        recommendation: {
            title: 'Recommended Next',
            description: 'Personalized recommendations based on your progress',
            items: ['Complete JavaScript Course', 'Focus on ES6+ features', 'Practice async programming']
        }
    };
    
    const insight = insights[type];
    
    // Create detailed insight modal
    const modal = document.createElement('div');
    modal.className = 'insight-modal';
    modal.innerHTML = `
        <div class="insight-modal-content">
            <h3>${insight.title}</h3>
            <p>${insight.description}</p>
            <ul>
                ${insight.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <button class="btn-primary">Take Action</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles and event listeners (similar to other modals)
    // ... (modal styling and event handling)
}

function initReminders() {
    const reminderItems = document.querySelectorAll('.reminder-item');
    const addReminderBtn = document.querySelector('.add-reminder-btn');
    
    reminderItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const time = this.querySelector('p').textContent;
            
            console.log(`Opening reminder: ${title} - ${time}`);
        });
    });
    
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', function() {
            showAddReminderModal();
        });
    }
}

function showAddReminderModal() {
    const modal = document.createElement('div');
    modal.className = 'reminder-modal';
    modal.innerHTML = `
        <div class="reminder-modal-content">
            <h3>Add New Reminder</h3>
            <form>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" placeholder="Enter reminder title">
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="datetime-local">
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Add Reminder</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal functionality
    modal.querySelector('.btn-secondary').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Reminder added successfully');
        document.body.removeChild(modal);
    });
}

function initSuggestions() {
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const viewAllBtn = document.querySelector('.view-all-btn');
    
    suggestionCards.forEach(card => {
        const startBtn = card.querySelector('.btn-primary');
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const courseTitle = card.querySelector('h4').textContent;
            console.log(`Starting course: ${courseTitle}`);
            
            // Add loading effect
            this.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Loading...';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = 'Start Learning';
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            console.log('Viewing all course suggestions');
        });
    }
}

function initStatistics() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Animate statistics on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatCard(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statCards.forEach(card => {
        observer.observe(card);
    });
}

function animateStatCard(card) {
    const number = card.querySelector('h3');
    const finalValue = parseInt(number.textContent);
    let currentValue = 0;
    
    const increment = finalValue / 20;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        number.textContent = currentValue.toFixed(1);
    }, 50);
}

function initRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        // Update XP progress
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            const currentWidth = parseInt(xpFill.style.width) || 75;
            const newWidth = Math.min(currentWidth + Math.random() * 0.5, 100);
            xpFill.style.width = newWidth + '%';
        }
        
        // Update roadmap progress
        const currentNode = document.querySelector('.roadmap-node.current .progress-fill');
        if (currentNode) {
            const currentWidth = parseInt(currentNode.style.width) || 75;
            const newWidth = Math.min(currentWidth + Math.random() * 0.3, 100);
            currentNode.style.width = newWidth + '%';
            
            // Update progress text
            const progressText = currentNode.closest('.roadmap-node').querySelector('p');
            if (progressText) {
                progressText.textContent = Math.round(newWidth) + '% Complete';
            }
        }
    }, 10000); // Update every 10 seconds
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key to close any open modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.skill-modal, .insight-modal, .reminder-modal, .level-up-modal');
        modals.forEach(modal => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });
    }
});

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Export functions for potential external use
window.Dashboard = {
    initDashboard,
    showSkillDetails,
    showLevelUpAnimation,
    smoothScrollTo
}; 