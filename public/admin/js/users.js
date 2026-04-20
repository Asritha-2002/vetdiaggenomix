const adminUsers = {
    async render() {
        const content = document.getElementById('main-content');
        
        // Show loading state
        content.innerHTML = this.generateLoadingHTML();
        
        try {
            const users = await adminApi.getUsers();
            content.innerHTML = this.generateUsersHTML(users);
            this.bindEvents();
            this.animateElements();
        } catch (error) {
            console.error('Error loading users:', error);
            content.innerHTML = this.generateErrorHTML(error.message);
        }
    },

    generateLoadingHTML() {
        return `
            <div class="flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <p class="mt-4 text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        `;
    },

    generateErrorHTML(errorMessage) {
        return `
            <div class="text-center py-16">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Users</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminUsers.render()" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },

    generateUsersHTML(users) {
        return `
            <div class="space-y-8">
                <!-- Header Section -->
                <div class="glass-morphism rounded-3xl p-8 border border-white/20">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <i class="fas fa-users text-white text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
                                <p class="text-gray-600 mt-1">Manage registered users and their activities</p>
                            </div>
                        </div>
                        
                        <!-- Stats Cards -->
                        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-green-600">${users.length}</p>
                                    <p class="text-sm text-green-700">Total Users</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-blue-600">${users.filter(u => u.isActive).length}</p>
                                    <p class="text-sm text-blue-700">Active Users</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-purple-600">${users.filter(u => u.orderCount > 0).length}</p>
                                    <p class="text-sm text-purple-700">With Orders</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="glass-morphism rounded-3xl p-6 border border-white/20">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div class="flex-1 max-w-md">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-search text-gray-400"></i>
                                </div>
                                <input type="text" id="user-search" placeholder="Search users..." 
                                       class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <select id="status-filter" class="px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Users</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                            
                            <button onclick="adminUsers.exportUsers()" class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                                <i class="fas fa-download mr-2"></i>
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Users Grid -->
                <div class="glass-morphism rounded-3xl border border-white/20 overflow-hidden">
                    <div class="overflow-x-auto max-h-[calc(100vh-20rem)] scroll-smooth">
                        <div id="users-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                            ${users.map(user => this.renderUserCard(user)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderUserCard(user) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const joinDate = new Date(user.createdAt).toLocaleDateString();
        const orderCount = user.orderCount || 0;
        
        return `
            <div class="user-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" data-user-id="${user._id}">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="relative">
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                            ${initials}
                        </div>
                        <!-- <div class="absolute -bottom-1 -right-1 w-6 h-6 ${user.isActive ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white flex items-center justify-center">
                            <i class="fas ${user.isActive ? 'fa-check' : 'fa-pause'} text-white text-xs"></i>
                        </div> -->
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-gray-900 truncate">${user.name}</h3>
                        <p class="text-sm text-gray-500 truncate">${user.email}</p>
                       <!-- <div class="flex items-center mt-1">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                ${user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div> -->
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Orders</span>
                        <span class="font-semibold text-blue-600">${orderCount}</span>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Joined</span>
                        <span class="text-sm text-gray-800">${joinDate}</span>
                    </div>
                    
                    <div class="pt-4 border-t border-gray-100">
                        <div class="flex space-x-2">
                            <button onclick="adminUsers.viewUserDetails('${user._id}')" 
                                    class="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                                <i class="fas fa-eye mr-1"></i>
                                View Details
                            </button>
                            ${orderCount > 0 ? `
                                <button onclick="adminUsers.viewUserOrders('${user._id}')" 
                                        class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('user-search');
        const statusFilter = document.getElementById('status-filter');
        
        searchInput?.addEventListener('input', () => this.filterUsers());
        statusFilter?.addEventListener('change', () => this.filterUsers());
    },

    filterUsers() {
        const searchTerm = document.getElementById('user-search').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const userCards = document.querySelectorAll('.user-card');
        
        userCards.forEach(card => {
            const userId = card.dataset.userId;
            const name = card.querySelector('h3').textContent.toLowerCase();
            const email = card.querySelector('p').textContent.toLowerCase();
            const isActive = card.querySelector('.bg-green-100') !== null;
            
            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
            const matchesStatus = !statusFilter || 
                                (statusFilter === 'active' && isActive) || 
                                (statusFilter === 'inactive' && !isActive);
            
            if (matchesSearch && matchesStatus) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    },

    async viewUserDetails(userId) {
        try {
            // In a real implementation, you'd fetch detailed user data
            const users = await adminApi.getUsers();
            const user = users.find(u => u._id === userId);
            
            if (!user) {
                alert('User not found');
                return;
            }
            
            this.showUserModal(user);
        } catch (error) {
            console.error('Error fetching user details:', error);
            alert('Error loading user details');
        }
    },

    async viewUserOrders(userId) {
        try {
            // Fetch user's orders - you'll need to implement this endpoint
            const response = await fetch(`/api/admin/users/${userId}/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user orders');
            }
            
            const orders = await response.json();
            this.showUserOrdersModal(userId, orders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            alert('Error loading user orders');
        }
    },

    showUserModal(user) {
        const modalHTML = `
            <div id="user-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-morphism w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <!-- Modal Header -->
                    <div class="px-8 py-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                    ${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-800">${user.name}</h3>
                                    <p class="text-gray-600">${user.email}</p>
                                </div>
                            </div>
                            <button onclick="this.closest('#user-modal').remove()" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Modal Content -->
                    <div class="p-8 space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-4">
                              <!--  <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                        ${user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div> -->

                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Total Orders</label>
                                    <p class="text-lg font-semibold text-gray-900">${user.orderCount || 0}</p>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                                    <p class="text-gray-900">${new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                              <!--  <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Activity</label>
                                    <p class="text-gray-900">${user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</p>
                                </div> -->
                            </div>
                        </div>
                        
                        ${(user.orderCount || 0) > 0 ? `
                            <div class="pt-6 border-t border-gray-200">
                                <button onclick="adminUsers.viewUserOrders('${user._id}')" 
                                        class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                                    <i class="fas fa-shopping-cart mr-2"></i>
                                    View User Orders
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    showUserOrdersModal(userId, orders) {
        const modalHTML = `
            <div id="user-orders-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="glass-morphism w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
                <!-- Modal Header -->
                <div class="px-8 py-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
                <div class="flex items-center justify-between">
                    <div>
                    <h3 class="text-2xl font-bold text-gray-800">User Orders</h3>
                    <p class="text-gray-600">${orders.length} orders found</p>
                    </div>
                    <button onclick="this.closest('#user-orders-modal').remove()" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                    <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
                </div>
                
                <!-- Modal Content -->
                <div class="max-h-[calc(100vh-12rem)] overflow-y-auto p-8">
                <div class="space-y-4">
                    ${orders.map(order => `
                    <div class="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                        <div>
                            <h4 class="font-semibold text-gray-900">#${order._id.slice(-6)}</h4>
                            <p class="text-sm text-gray-500">${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div class="text-right flex flex-col items-end space-y-2">
                            <p class="font-semibold text-lg text-gray-900">₹${order.totalAmount.toFixed(2)}</p>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${this.getOrderStatusColor(order.status)}">
                            ${order.status.toUpperCase()}
                            </span>
                            <button onclick="adminOrders.showOrderDetails('${order._id}')" class="mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 text-xs font-medium shadow transition-all">
                            View Order Details
                            </button>
                        </div>
                        </div>
                        <div class="space-y-2">
                        <p class="text-sm text-gray-600">${order.items.length} items</p>
                        <div class="flex flex-wrap gap-2">
                            ${order.items.slice(0, 3).map(item => `
                            <span class="inline-flex items-center px-2 py-1 rounded-lg bg-gray-100 text-xs text-gray-700">
                                ${item.book?.title || 'Unknown Item'} × ${item.quantity}
                            </span>
                            `).join('')}
                            ${order.items.length > 3 ? `<span class="text-xs text-gray-500">+${order.items.length - 3} more</span>` : ''}
                        </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
                </div>
                <!-- Bottom right corner styling -->
                <div class="absolute bottom-4 right-6">
                <button onclick="document.getElementById('user-orders-modal').remove()" class="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2">
                    <i class="fas fa-times"></i>
                    <span>Close</span>
                </button>
                </div>
            </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    getOrderStatusColor(status) {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || colors.pending;
    },

    exportUsers() {
        // Implement CSV export functionality
        console.log('Export users functionality would be implemented here');
        alert('Export functionality coming soon!');
    },

    animateElements() {
        const cards = document.querySelectorAll('.user-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
};
