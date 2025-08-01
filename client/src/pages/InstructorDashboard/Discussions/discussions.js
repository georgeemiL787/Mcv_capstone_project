// Discussions Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupFilters();
    setupDiscussionActions();
});

// Filter Management
function setupFilters() {
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const questionSearch = document.getElementById('questionSearch');
    
    // Course filter
    courseFilter.addEventListener('change', function() {
        filterDiscussions();
    });
    
    // Status filter
    statusFilter.addEventListener('change', function() {
        filterDiscussions();
    });
    
    // Question search
    questionSearch.addEventListener('input', function() {
        filterDiscussions();
    });
}

function filterDiscussions() {
    const courseFilter = document.getElementById('courseFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('questionSearch').value.toLowerCase();
    
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    discussionItems.forEach(item => {
        const course = item.querySelector('.course-tag').textContent;
        const status = item.querySelector('.status-badge').textContent.toLowerCase();
        const questionTitle = item.querySelector('.question-content h3').textContent.toLowerCase();
        const questionContent = item.querySelector('.question-content p').textContent.toLowerCase();
        
        const courseMatch = !courseFilter || course.toLowerCase().includes(courseFilter);
        const statusMatch = !statusFilter || status.includes(statusFilter);
        const searchMatch = !searchTerm || 
            questionTitle.includes(searchTerm) || 
            questionContent.includes(searchTerm);
        
        if (courseMatch && statusMatch && searchMatch) {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.3s ease';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const visibleItems = document.querySelectorAll('.discussion-item:not([style*="display: none"])');
    let noResultsMsg = document.querySelector('.no-results');
    
    if (visibleItems.length === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #666;">
                    <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 10px; display: block;">forum</span>
                    <h3>No discussions found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            document.querySelector('.discussions-list').appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Discussion Actions
function setupDiscussionActions() {
    const markAnsweredButtons = document.querySelectorAll('.action-btn[title="Mark as Answered"]');
    const replyButtons = document.querySelectorAll('.action-btn[title="Reply"]');
    const viewButtons = document.querySelectorAll('.action-btn[title="View Reply"], .action-btn[title="View Thread"]');
    
    // Mark as answered buttons
    markAnsweredButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const discussionItem = this.closest('.discussion-item');
            const questionTitle = discussionItem.querySelector('.question-content h3').textContent;
            
            if (confirm(`Mark "${questionTitle}" as answered?`)) {
                discussionItem.classList.remove('unanswered');
                discussionItem.classList.add('answered');
                
                const statusBadge = discussionItem.querySelector('.status-badge');
                statusBadge.textContent = 'Answered';
                statusBadge.className = 'status-badge answered';
                
                // Update action buttons
                const actions = discussionItem.querySelector('.discussion-actions');
                actions.innerHTML = `
                    <button class="action-btn" title="View Reply">
                        <span class="material-symbols-outlined">visibility</span>
                    </button>
                    <button class="action-btn" title="Reply">
                        <span class="material-symbols-outlined">reply</span>
                    </button>
                `;
                
                // Re-setup action buttons for this item
                setupDiscussionActions();
                
                showNotification(`Question marked as answered`, 'success');
            }
        });
    });
    
    // Reply buttons
    replyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const discussionItem = this.closest('.discussion-item');
            const questionTitle = discussionItem.querySelector('.question-content h3').textContent;
            const studentName = discussionItem.querySelector('.student-info h4').textContent;
            
            showNotification(`Opening reply composer for ${studentName}'s question`, 'info');
            
            // Simulate opening reply form
            setTimeout(() => {
                showNotification(`Reply form opened for: ${questionTitle}`, 'success');
            }, 1000);
        });
    });
    
    // View buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const discussionItem = this.closest('.discussion-item');
            const questionTitle = discussionItem.querySelector('.question-content h3').textContent;
            
            showNotification(`Opening full discussion thread for: ${questionTitle}`, 'info');
        });
    });
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
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
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
    
    .no-results {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(143, 126, 252, 0.1);
        border: 1px solid #e4defe;
    }
    
    .no-results .material-symbols-outlined {
        color: #8f7efc;
    }
    
    .no-results h3 {
        margin: 0 0 8px 0;
        color: #333446;
        font-family: 'Josefin Sans', sans-serif;
    }
    
    .no-results p {
        margin: 0;
        color: #666;
    }
`;
document.head.appendChild(style); 