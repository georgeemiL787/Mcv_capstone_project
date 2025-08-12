// Analytics Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupChartControls();
    setupAnalyticsAnimations();
});

// Chart Controls
function setupChartControls() {
    const engagementTimeRange = document.getElementById('engagementTimeRange');
    const performanceMetric = document.getElementById('performanceMetric');
    
    if (engagementTimeRange) {
        engagementTimeRange.addEventListener('change', function() {
            updateEngagementChart(this.value);
        });
    }
    
    if (performanceMetric) {
        performanceMetric.addEventListener('change', function() {
            updatePerformanceChart(this.value);
        });
    }
}

function updateEngagementChart(timeRange) {
    const chartPlaceholder = document.querySelector('.chart-card:first-child .chart-placeholder');
    
    if (!chartPlaceholder) return;
    
    // Show loading state
    chartPlaceholder.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">refresh</span>
        <h4>Loading Engagement Data...</h4>
        <p>Updating data for ${getTimeRangeText(timeRange)}</p>
    `;
    
    // Simulate chart update
    setTimeout(() => {
        chartPlaceholder.innerHTML = `
            <span class="material-symbols-outlined">analytics</span>
            <h4>Engagement Chart Updated</h4>
            <p>Showing data for ${getTimeRangeText(timeRange)}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f8f7ff; border-radius: 8px; border: 1px solid #e4defe;">
                <small style="color: #666;">Interactive engagement chart would be displayed here</small>
            </div>
        `;
        
        showNotification(`Engagement chart updated for ${getTimeRangeText(timeRange)}`, 'success');
    }, 1500);
}

function updatePerformanceChart(metric) {
    const chartPlaceholder = document.querySelector('.chart-card:last-child .chart-placeholder');
    
    if (!chartPlaceholder) return;
    
    // Show loading state
    chartPlaceholder.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">refresh</span>
        <h4>Loading Performance Data...</h4>
        <p>Updating ${getMetricText(metric)} data</p>
    `;
    
    // Simulate chart update
    setTimeout(() => {
        chartPlaceholder.innerHTML = `
            <span class="material-symbols-outlined">bar_chart</span>
            <h4>Performance Chart Updated</h4>
            <p>Showing ${getMetricText(metric)} data</p>
            <div style="margin-top: 20px; padding: 15px; background: #f8f7ff; border-radius: 8px; border: 1px solid #e4defe;">
                <small style="color: #666;">Interactive performance chart would be displayed here</small>
            </div>
        `;
        
        showNotification(`Performance chart updated for ${getMetricText(metric)}`, 'success');
    }, 1500);
}

function getTimeRangeText(range) {
    switch(range) {
        case '7': return 'Last 7 days';
        case '30': return 'Last 30 days';
        case '90': return 'Last 3 months';
        default: return 'Last 30 days';
    }
}

function getMetricText(metric) {
    switch(metric) {
        case 'views': return 'Views';
        case 'completion': return 'Completion Rate';
        case 'revenue': return 'Revenue';
        default: return 'Completion Rate';
    }
}

// Analytics Animations
function setupAnalyticsAnimations() {
    // Animate overview cards on load
    const overviewCards = document.querySelectorAll('.overview-card');
    
    overviewCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'slideInFromBottom 0.6s ease forwards';
        }, index * 100);
    });
    
    // Animate insight cards on scroll
    const insightCards = document.querySelectorAll('.insight-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInFromLeft 0.5s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    insightCards.forEach(card => {
        observer.observe(card);
    });
    
    // Animate behavior cards
    const behaviorCards = document.querySelectorAll('.behavior-card');
    behaviorCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        }, index * 150);
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
    
    @keyframes slideInFromBottom {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInFromLeft {
        from {
            transform: translateX(-30px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
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
    
    .overview-card,
    .insight-card,
    .behavior-card {
        opacity: 0;
    }
    
    .overview-card.animated,
    .insight-card.animated,
    .behavior-card.animated {
        animation: slideInFromBottom 0.6s ease forwards;
    }
`;
document.head.appendChild(style);
