// Revenue Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupChartControls();
    setupRevenueAnimations();
});

// Chart Controls
function setupChartControls() {
    const timeRangeSelect = document.getElementById('timeRange');
    
    timeRangeSelect.addEventListener('change', function() {
        const selectedRange = this.value;
        updateChart(selectedRange);
    });
}

function updateChart(timeRange) {
    const chartContainer = document.querySelector('.chart-container');
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    
    // Show loading state
    chartPlaceholder.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">refresh</span>
        <h4>Loading Chart Data...</h4>
        <p>Updating revenue data for ${getTimeRangeText(timeRange)}</p>
    `;
    
    // Simulate chart update
    setTimeout(() => {
        chartPlaceholder.innerHTML = `
            <span class="material-symbols-outlined">analytics</span>
            <h4>Revenue Chart Updated</h4>
            <p>Showing data for ${getTimeRangeText(timeRange)}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f8f7ff; border-radius: 8px; border: 1px solid #e4defe;">
                <small style="color: #666;">Chart data would be displayed here with interactive elements</small>
            </div>
        `;
        
        showNotification(`Chart updated for ${getTimeRangeText(timeRange)}`, 'success');
    }, 1500);
}

function getTimeRangeText(range) {
    switch(range) {
        case '7': return 'Last 7 days';
        case '30': return 'Last 30 days';
        case '90': return 'Last 3 months';
        case '365': return 'Last year';
        default: return 'Last 30 days';
    }
}

// Revenue Animations
function setupRevenueAnimations() {
    // Animate stat numbers on load
    const statNumbers = document.querySelectorAll('.stat-content h3');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isCurrency = finalValue.includes('$');
        const isPercentage = finalValue.includes('%');
        
        // Extract numeric value
        let numericValue = parseFloat(finalValue.replace(/[$,%]/g, ''));
        let currentValue = 0;
        
        // Animate the number
        const animateNumber = () => {
            if (currentValue < numericValue) {
                currentValue += Math.ceil(numericValue / 50);
                if (currentValue > numericValue) currentValue = numericValue;
                
                let displayValue = currentValue;
                if (isCurrency) {
                    displayValue = '$' + currentValue.toLocaleString();
                } else if (isPercentage) {
                    displayValue = currentValue + '%';
                } else {
                    displayValue = currentValue.toLocaleString();
                }
                
                stat.textContent = displayValue;
                
                if (currentValue < numericValue) {
                    requestAnimationFrame(animateNumber);
                }
            }
        };
        
        // Start animation after a small delay
        setTimeout(animateNumber, 200);
    });
    
    // Animate course items on scroll
    const courseItems = document.querySelectorAll('.course-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromRight 0.5s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    courseItems.forEach(item => {
        observer.observe(item);
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
    
    @keyframes slideInFromRight {
        from {
            transform: translateX(50px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
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
    
    .course-item {
        opacity: 0;
        transform: translateX(50px);
    }
    
    .course-item.animated {
        animation: slideInFromRight 0.5s ease forwards;
    }
`;
document.head.appendChild(style); 