// Enrollments Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupFilters();
    setupActionButtons();
});

// Filter Management
function setupFilters() {
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const studentSearch = document.getElementById('studentSearch');
    
    // Course filter
    courseFilter.addEventListener('change', function() {
        filterEnrollments();
    });
    
    // Status filter
    statusFilter.addEventListener('change', function() {
        filterEnrollments();
    });
    
    // Student search
    studentSearch.addEventListener('input', function() {
        filterEnrollments();
    });
}

function filterEnrollments() {
    const courseFilter = document.getElementById('courseFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    
    const rows = document.querySelectorAll('.enrollments-table tbody tr');
    
    rows.forEach(row => {
        const course = row.querySelector('td:nth-child(2)').textContent;
        const status = row.querySelector('.status-badge').textContent.toLowerCase();
        const studentName = row.querySelector('.student-info h4').textContent.toLowerCase();
        const studentEmail = row.querySelector('.student-info p').textContent.toLowerCase();
        
        const courseMatch = !courseFilter || course.toLowerCase().includes(courseFilter);
        const statusMatch = !statusFilter || status.includes(statusFilter);
        const searchMatch = !searchTerm || 
            studentName.includes(searchTerm) || 
            studentEmail.includes(searchTerm);
        
        if (courseMatch && statusMatch && searchMatch) {
            row.style.display = '';
            row.style.animation = 'fadeIn 0.3s ease';
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const visibleRows = document.querySelectorAll('.enrollments-table tbody tr:not([style*="display: none"])');
    let noResultsMsg = document.querySelector('.no-results');
    
    if (visibleRows.length === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('tr');
            noResultsMsg.className = 'no-results';
            noResultsMsg.innerHTML = `
                <td colspan="6" style="text-align: center; padding: 40px 20px; color: #666;">
                    <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 10px; display: block;">search_off</span>
                    <h3>No enrollments found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </td>
            `;
            document.querySelector('.enrollments-table tbody').appendChild(noResultsMsg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Action Buttons
function setupActionButtons() {
    const viewButtons = document.querySelectorAll('.action-btn[title="View Profile"]');
    const messageButtons = document.querySelectorAll('.action-btn[title="Send Message"]');
    
    // View profile buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const studentName = row.querySelector('.student-info h4').textContent;
            showNotification(`Opening profile for ${studentName}`, 'info');
        });
    });
    
    // Send message buttons
    messageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const studentName = row.querySelector('.student-info h4').textContent;
            showNotification(`Opening message composer for ${studentName}`, 'info');
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
    
    .no-results td {
        background: #f8f7ff !important;
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