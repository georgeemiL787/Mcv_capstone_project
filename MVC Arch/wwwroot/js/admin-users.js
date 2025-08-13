// Admin Users Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Users JavaScript loaded');
    
    let currentPage = 1;
    let currentFilters = {
        searchTerm: '',
        roleFilter: '',
        statusFilter: ''
    };

    // Initialize the page
    initializeUsersPage();

    function initializeUsersPage() {
        console.log('Initializing users page...');
        loadUsers();
        setupEventListeners();
    }

    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Search functionality
        const searchInput = document.getElementById('user-search');
        const searchBtn = document.getElementById('search-btn');
        
        console.log('Search input found:', searchInput);
        console.log('Search button found:', searchBtn);
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                currentFilters.searchTerm = this.value;
                currentPage = 1;
                loadUsers();
            }, 500));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                currentFilters.searchTerm = searchInput.value;
                currentPage = 1;
                loadUsers();
            });
        }

        // Filter controls
        const roleFilter = document.getElementById('role-filter');
        const statusFilter = document.getElementById('status-filter');
        
        console.log('Role filter found:', roleFilter);
        console.log('Status filter found:', statusFilter);
        
        if (roleFilter) {
            roleFilter.addEventListener('change', function() {
                currentFilters.roleFilter = this.value;
                currentPage = 1;
                loadUsers();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                currentFilters.statusFilter = this.value;
                currentPage = 1;
                loadUsers();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        console.log('Refresh button found:', refreshBtn);
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                console.log('Refresh button clicked');
                loadUsers();
            });
        }

        // Pagination
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('page-number')) {
                currentPage = parseInt(e.target.dataset.page);
                loadUsers();
            } else if (e.target.id === 'prev-page') {
                if (currentPage > 1) {
                    currentPage--;
                    loadUsers();
                }
            } else if (e.target.id === 'next-page') {
                currentPage++;
                loadUsers();
            }
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    async function loadUsers() {
        console.log('Loading users...');
        const tableBody = document.getElementById('users-table-body');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noUsersMessage = document.getElementById('no-users-message');
        const paginationContainer = document.getElementById('pagination-container');

        console.log('Table body found:', tableBody);
        console.log('Loading indicator found:', loadingIndicator);
        console.log('No users message found:', noUsersMessage);
        console.log('Pagination container found:', paginationContainer);

        if (!tableBody) {
            console.error('Table body not found!');
            return;
        }

        // Show loading
        tableBody.innerHTML = '';
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (noUsersMessage) noUsersMessage.style.display = 'none';
        if (paginationContainer) paginationContainer.style.display = 'none';

        try {
            const params = new URLSearchParams({
                searchTerm: currentFilters.searchTerm,
                roleFilter: currentFilters.roleFilter,
                statusFilter: currentFilters.statusFilter,
                page: currentPage,
                pageSize: 20
            });

            console.log('Fetching users with params:', params.toString());
            const response = await fetch(`/AdminPanel/GetUsers?${params}`);
            const data = await response.json();

            console.log('Users response:', data);

            if (data.success) {
                displayUsers(data.data);
                updatePagination(data);
                if (paginationContainer) paginationContainer.style.display = 'block';
            } else {
                showError('Failed to load users: ' + data.message);
                if (noUsersMessage) noUsersMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error loading users:', error);
            showError('An error occurred while loading users');
            if (noUsersMessage) noUsersMessage.style.display = 'block';
        } finally {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }
    }

    function displayUsers(users) {
        const tableBody = document.getElementById('users-table-body');
        if (!tableBody) return;

        if (users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <p style="color: var(--text-secondary); margin: 0;">No users found matching your criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.firstName.charAt(0).toUpperCase()}</div>
                        <div class="user-details">
                            <h4>${user.firstName} ${user.lastName}</h4>
                            <span>ID: ${user.id}</span>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <div class="role-badge ${user.roles[0]?.toLowerCase() || 'unknown'}">
                        ${user.roles[0] || 'No Role'}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${user.accountStatus.toLowerCase()}">${user.accountStatus}</span>
                    ${user.isBanned ? `
                        <div class="ban-info">
                            <p class="ban-reason">Reason: ${user.banReason || 'No reason provided'}</p>
                            <p class="ban-details">Banned by: ${user.bannedByAdmin || 'Unknown'} on ${formatDate(user.bannedAt)}</p>
                        </div>
                    ` : ''}
                </td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>${formatDate(user.lastLogin)}</td>
                <td>
                    <div class="user-actions">
                        ${user.isBanned ? 
                            `<button class="btn btn-success btn-small" onclick="unbanUser(${user.id})">
                                <i class="fas fa-user-check"></i> Unban
                            </button>` :
                            `<button class="btn btn-danger btn-small" onclick="banUser(${user.id})">
                                <i class="fas fa-user-slash"></i> Ban
                            </button>`
                        }
                        <button class="btn btn-secondary btn-small" onclick="updateUserStatus(${user.id})">
                            <i class="fas fa-edit"></i> Status
                        </button>
                        <button class="btn btn-primary btn-small" onclick="viewUserDetails(${user.id})">
                            <i class="fas fa-eye"></i> Details
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function updatePagination(data) {
        const paginationContainer = document.getElementById('pagination-container');
        const paginationInfo = document.getElementById('pagination-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('page-numbers');

        if (!paginationContainer || !paginationInfo || !prevBtn || !nextBtn || !pageNumbers) return;

        // Pagination info
        const startItem = ((data.currentPage - 1) * data.pageSize) + 1;
        const endItem = Math.min(data.currentPage * data.pageSize, data.totalCount);
        paginationInfo.textContent = `Showing ${startItem} to ${endItem} of ${data.totalCount} users`;

        // Previous/Next buttons
        prevBtn.disabled = data.currentPage <= 1;
        nextBtn.disabled = data.currentPage >= data.totalPages;

        // Page numbers
        pageNumbers.innerHTML = '';
        const startPage = Math.max(1, data.currentPage - 2);
        const endPage = Math.min(data.totalPages, data.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('span');
            pageBtn.className = `page-number ${i === data.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            pageNumbers.appendChild(pageBtn);
        }
    }

    // User Actions
    window.banUser = function(userId) {
        const modal = document.getElementById('ban-user-modal');
        const reasonInput = document.getElementById('ban-reason');
        const confirmBtn = document.getElementById('confirm-ban');

        if (modal) {
            modal.style.display = 'block';
            reasonInput.value = '';
            
            // Store the userId for the confirm button
            confirmBtn.dataset.userId = userId;
            
            // Remove any existing event listeners by cloning the button
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            newConfirmBtn.onclick = async function() {
                const reason = reasonInput.value.trim();
                if (!reason) {
                    showError('Please provide a reason for banning this user');
                    return;
                }

                try {
                    const response = await fetch('/AdminPanel/BanUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, reason })
                    });

                    const result = await response.json();
                    if (result.success) {
                        showSuccess('User banned successfully');
                        closeModal('ban-user-modal');
                        loadUsers(); // Refresh the users list
                    } else {
                        showError('Failed to ban user: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error banning user:', error);
                    showError('An error occurred while banning the user');
                }
            };
        }
    };

    window.unbanUser = function(userId) {
        const modal = document.getElementById('unban-user-modal');
        const reasonInput = document.getElementById('unban-reason');
        const confirmBtn = document.getElementById('confirm-unban');

        if (modal) {
            modal.style.display = 'block';
            reasonInput.value = '';
            
            // Store the userId for the confirm button
            confirmBtn.dataset.userId = userId;
            
            // Remove any existing event listeners by cloning the button
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            
            newConfirmBtn.onclick = async function() {
                const reason = reasonInput.value.trim();

                try {
                    const response = await fetch('/AdminPanel/UnbanUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId, reason })
                    });

                    const result = await response.json();
                    if (result.success) {
                        showSuccess('User unbanned successfully');
                        closeModal('unban-user-modal');
                        loadUsers(); // Refresh the users list
                    } else {
                        showError('Failed to unban user: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error unbanning user:', error);
                    showError('An error occurred while unbanning the user');
                }
            };
        }
    };

    window.updateUserStatus = function(userId) {
        const newStatus = prompt('Enter new status (Active, Inactive, Banned):');
        if (!newStatus) return;

        const validStatuses = ['Active', 'Inactive', 'Banned'];
        if (!validStatuses.includes(newStatus)) {
            showError('Invalid status. Please use: Active, Inactive, or Banned');
            return;
        }

        updateUserStatusAsync(userId, newStatus);
    };

    async function updateUserStatusAsync(userId, newStatus) {
        try {
            const response = await fetch('/AdminPanel/UpdateUserStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newStatus })
            });

            const result = await response.json();
            if (result.success) {
                showSuccess('User status updated successfully');
                loadUsers();
            } else {
                showError('Failed to update user status: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            showError('An error occurred while updating user status');
        }
    }

    window.viewUserDetails = function(userId) {
        // This would open a modal with detailed user information
        // For now, just show an alert
        showNotification(`Viewing details for user ID: ${userId}`, 'info');
    };

    // Utility Functions
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Notification Functions
    function showSuccess(message) {
        showNotification(message, 'success');
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Modal functions
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };
});
