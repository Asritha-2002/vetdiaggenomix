const adminOrders = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 50,
    
    // Initialize method to ensure clean state
    init() {
        this.currentPage = 1;
        this.totalPages = 1;
        return this.render();
    },

    async render() {
        const content = document.getElementById('main-content');
        if (!content) {
            console.error('Main content element not found');
            return;
        }
        
        // Show loading state
        content.innerHTML = this.generateLoadingHTML();
        
        try {
            const result = await adminApi.getOrders(this.currentPage, this.itemsPerPage);
            if (result && result.orders) {
                const { orders, totalPages,totalOrders,statusCounts, currentPage, ...rest } = result;
                
                // Create pagination object from the direct properties
                const pagination = {
                    currentPage: currentPage || 1,
                    totalPages: totalPages || 1,
                    total: totalOrders || orders.length
                };
                
                this.totalPages = pagination.totalPages;
                this.currentPage = pagination.currentPage;
                
                console.log('Pagination data:', pagination); // Debug log

                content.innerHTML = this.generateOrdersHTML(orders, pagination, statusCounts);
                this.bindEvents();
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
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
                    <p class="mt-4 text-gray-600 font-medium">Loading ...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Orders</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminOrders.render()" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },    generateOrdersHTML(orders, pagination, statusCounts) {
        return `
            <div class="space-y-6">
                <!-- Header Section -->
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                            <i class="fas fa-shopping-cart text-white text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Orders</h2>
                            <p class="text-gray-600">Manage customer orders and track shipments</p>
                        </div>
                    </div>
                    
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-7 gap-4">
                        <div class="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
                            <p class="text-lg font-bold text-blue-600">${orders.length}</p>
                            <p class="text-xs text-blue-700">This Page</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                            <p class="text-lg font-bold text-gray-600">${pagination?.total || 'N/A'}</p>
                            <p class="text-xs text-gray-700">Total Orders</p>
                        </div>
                        <div class="bg-yellow-50 rounded-xl p-3 border border-yellow-200 text-center">
                            <p class="text-lg font-bold text-yellow-600">${statusCounts['pending'] || 0}</p>
                            <p class="text-xs text-yellow-700">Pending</p>
                        </div>
                        <div class="bg-purple-50 rounded-xl p-3 border border-purple-200 text-center">
                            <p class="text-lg font-bold text-purple-600">${statusCounts['shipped'] || 0}</p>
                            <p class="text-xs text-purple-700">Shipped</p>
                        </div>
                        <div class="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                            <p class="text-lg font-bold text-green-600">${statusCounts['delivered'] || 0}</p>
                            <p class="text-xs text-green-700">Delivered</p>
                        </div>
                        <div class="bg-red-50 rounded-xl p-3 border border-red-200 text-center">
                            <p class="text-lg font-bold text-red-600">${statusCounts['cancelled'] || 0}</p>
                            <p class="text-xs text-red-700">Cancelled</p>
                        </div>
                        <div class="bg-orange-50 rounded-xl p-3 border border-orange-200 text-center">
                            <p class="text-lg font-bold text-orange-600">${statusCounts['refund-completed'] || 0}</p>
                            <p class="text-xs text-orange-700">Refunded</p>
                        </div>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="flex gap-4 mb-6">
                    <div class="flex-1">
                        <div class="relative">
                            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input type="text" id="order-search" placeholder="Search by order ID, customer..." 
                                   class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <select id="status-filter" class="border rounded-lg px-4 py-2 bg-white shadow-sm">
                        <option value="">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refund-completed">Refund Completed</option>
                    </select>
                    <button onclick="adminOrders.exportOrders()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <i class="fas fa-download mr-2"></i>Export
                    </button>
                </div>

                <!-- Orders Table -->
                <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${orders.map(order => this.renderOrderRow(order)).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${this.renderPagination(pagination)}
                </div>
            </div>
        `;
    },    renderOrderRow(order) {
        return `
            <tr class="hover:bg-blue-50 transition-colors duration-150 group">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 group-hover:text-blue-700">
            <span 
                class="inline-block bg-gray-100 rounded px-2 py-1 font-semibold tracking-wider"
                title="${order._id}"
            >#${order._id.slice(-6)}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center space-x-3">
            <div class="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <i class="fas fa-user text-blue-500"></i>
            </div>
            <div>
                <div class="text-sm font-semibold text-gray-900 group-hover:text-blue-700">${order.user?.name || 'N/A'}</div>
                <div class="text-xs text-gray-500">${order.user?.email || 'N/A'}</div>
            </div>
            </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            <span class="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-xs font-medium">
            <i class="fas fa-box mr-1 text-gray-400"></i>
            ${order.items.length} items
            </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
            ₹${order.totalAmount.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span class="inline-block bg-gray-50 rounded px-2 py-1">${order.payment.method === 'cod' ? 'COD' : order.payment.method}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
            <select class="payment-status-select text-sm rounded-full px-3 py-1 border border-gray-200 focus:ring-2 focus:ring-blue-400 transition ${this.getStatusColor(order.payment.status)}" 
                data-id="${order._id}" data-original-value="${order.payment.status}">
            <option value="pending" ${order.payment.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="completed" ${order.payment.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="failed" ${order.payment.status === 'failed' ? 'selected' : ''}>Failed</option>
            </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
            <select class="status-select text-sm rounded-full px-3 py-1 border border-gray-200 focus:ring-2 focus:ring-blue-400 transition ${this.getStatusColor(order.status)}" 
                data-id="${order._id}" data-original-value="${order.status}">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            <option value="refund-completed" ${order.status === 'refund-completed' ? 'selected' : ''}>Refund Completed</option>
            </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span class="inline-block bg-gray-50 rounded px-2 py-1">${new Date(order.createdAt).toLocaleDateString()}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
            <button class="download-invoice flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition" data-id="${order._id}">
            <i class="fas fa-file-invoice"></i>
            <span class="underline">Invoice</span>
            </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
            <button class="view-order flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition underline" data-id="${order._id}">
            <i class="fas fa-eye"></i>
            View Details
            </button>
            </td>
            </tr>
        `;
    },    renderPagination(pagination) {
        if (!pagination || pagination.totalPages <= 1) {
            return '';
        }
        
        const currentPage = pagination.currentPage || 1;
        const totalPages = pagination.totalPages || 1;
        
        // Calculate page range to show
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        const pages = [];
        
        // First page button
        if (startPage > 1) {
            pages.push(`
                <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        onclick="adminOrders.changePage(1)">
                    1
                </button>
            `);
            if (startPage > 2) {
                pages.push('<span class="px-2 py-2 text-gray-500">...</span>');
            }
        }
        
        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <button class="px-3 py-2 border border-gray-300 rounded-lg transition-colors text-sm font-medium
                         ${currentPage === i 
                           ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                           : 'bg-white hover:bg-gray-50'}"
                        onclick="adminOrders.changePage(${i})">
                    ${i}
                </button>
            `);
        }
        
        // Last page button
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('<span class="px-2 py-2 text-gray-500">...</span>');
            }
            pages.push(`
                <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        onclick="adminOrders.changePage(${totalPages})">
                    ${totalPages}
                </button>
            `);
        }

        return `
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Showing page <span class="font-medium">${currentPage}</span> of 
                        <span class="font-medium">${totalPages}</span>
                        ${pagination.total ? `(${pagination.total} total orders)` : ''}
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium
                                     ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                                onclick="adminOrders.changePage(${currentPage - 1})"
                                ${currentPage === 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left mr-1"></i>
                            Previous
                        </button>
                        
                        ${pages.join('')}
                        
                        <button class="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium
                                     ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                                onclick="adminOrders.changePage(${currentPage + 1})"
                                ${currentPage === totalPages ? 'disabled' : ''}>
                            Next
                            <i class="fas fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getStatusColor(status) {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            'refund-completed': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || colors.pending;
    },

    async changePage(page) {
        // Validate page number
        if (page < 1 || page > this.totalPages || page === this.currentPage) {
            return;
        }
        
        this.currentPage = page;
        
        // Show loading state for pagination
        const content = document.getElementById('main-content');
        const paginationContainer = content.querySelector('.bg-gray-50');
        if (paginationContainer) {
            const originalContent = paginationContainer.innerHTML;
            paginationContainer.innerHTML = `
                <div class="flex items-center justify-center py-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <span class="text-sm text-gray-600">Loading page ${page}...</span>
                    </div>
                </div>
            `;
            
            try {
                await this.render();
            } catch (error) {
                // Restore original content on error
                paginationContainer.innerHTML = originalContent;
                throw error;
            }
        } else {
            await this.render();
        }
    },    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('order-search');
        const statusFilter = document.getElementById('status-filter');
        
        searchInput?.addEventListener('input', () => this.filterOrders());
        statusFilter?.addEventListener('change', () => this.filterOrders());


        document.querySelectorAll('.payment-status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                try {
                    const orderId = e.target.dataset.id;
                    const status = e.target.value;
                    paymentStatus = await this.promptUpdatePaymentStatusDetails(status);

                    if (paymentStatus) {
                        await adminApi.updatePaymentStatus(orderId, paymentStatus);
                    }else {
                        e.target.value = e.target.getAttribute('data-original-value');
                    }

                    await this.render();
                    
                } catch (error) {
                    console.error('Error updating payment status:', error);
                    this.showNotification('Failed to update payment status', 'error');
                    // Reset select to previous value
                    e.target.value = e.target.getAttribute('data-original-value');
                }
            });

            // Store original value for reset on error
            select.setAttribute('data-original-value', select.value);
        });

        // Status change events
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                try {
                    const orderId = e.target.dataset.id;
                    const status = e.target.value;
                    const content = document.getElementById('main-content');
                    let statusDetails = null;

                    // Show appropriate details modal based on status
                    if (status === 'shipped') {
                        statusDetails = await this.promptShippingDetails();
                        if (!statusDetails) {
                            e.target.value = e.target.getAttribute('data-original-value');
                            return;
                        }
                    } else if (status === 'cancelled') {
                        statusDetails = await this.promptCancellationDetails();
                        if (!statusDetails) {
                            e.target.value = e.target.getAttribute('data-original-value');
                            return;
                        }
                    } else if (status === 'refund-completed') {
                        statusDetails = await this.promptRefundDetails();
                        if (!statusDetails) {
                            e.target.value = e.target.getAttribute('data-original-value');
                            return;
                        }
                    }

                    content.innerHTML = this.generateLoadingHTML();

                    // Update order status with details
                    if (statusDetails) {
                        await adminApi.updateOrderStatus(orderId, status, statusDetails);
                    } else {
                        await adminApi.updateOrderStatus(orderId, status);
                    }

                    // Refresh orders list
                    await this.render();

                    // Show success message
                    this.showNotification('Order status updated successfully', 'success');

                } catch (error) {
                    console.error('Error updating status:', error);
                    this.showNotification('Failed to update order status', 'error');
                    // Reset select to previous value
                    e.target.value = e.target.getAttribute('data-original-value');
                } finally {
                    e.target.disabled = false;
                    e.target.classList.remove('opacity-50');
                }
            });

            // Store original value for reset on error
            select.setAttribute('data-original-value', select.value);
        });

        // View order details
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.dataset.id;
                this.showOrderDetails(orderId);
            });
        });

        // Download invoice
      document.querySelectorAll('.download-invoice').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        window.open(`/admin/invoice?orderId=${e.currentTarget.dataset.id}`, '_blank');
    });
});
    },   
    
    
    filterOrders() {
        const searchTerm = document.getElementById('order-search').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const orderRows = document.querySelectorAll('tbody tr');
        
        orderRows.forEach(row => {
            const orderText = row.textContent.toLowerCase();
            const statusSelect = row.querySelector('.status-select');
            const currentStatus = statusSelect ? statusSelect.value : '';
            
            const matchesSearch = orderText.includes(searchTerm);
            const matchesStatus = !statusFilter || currentStatus === statusFilter;
            
            if (matchesSearch && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },    async showOrderDetails(orderId) {
        try {
            const modal = document.getElementById('order-modal');
            if (modal) modal.remove(); // Remove existing modal if any
            
            const order = await adminApi.getOrderById(orderId);
            if (!order) {
                throw new Error('Order data not received');
            }            const modalHTML = `
                <div id="order-modal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
                        <!-- Modal Header -->
                        <div class="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-4">
                                    <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                        <i class="fas fa-receipt text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-2xl font-bold">Order #${order._id}</h3>
                                        <p class="text-blue-100">Placed on ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <button onclick="document.getElementById('order-modal').remove()" class="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Modal Content -->
                        <div class="max-h-[calc(95vh-7rem)] overflow-y-auto">
                            <!-- Status and Quick Stats -->
                            <div class="px-8 py-6 bg-gray-50 border-b">
                                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-sm text-gray-600 font-medium">Status</p>
                                                <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium ${this.getStatusColor(order.status)}">
                                                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>
                                            <i class="fas fa-truck text-2xl text-gray-400"></i>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-sm text-gray-600 font-medium">Total Items</p>
                                                <p class="text-2xl font-bold text-gray-900">${order.items.length}</p>
                                            </div>
                                            <i class="fas fa-boxes text-2xl text-gray-400"></i>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-sm text-gray-600 font-medium">Total Amount</p>
                                                <p class="text-2xl font-bold text-green-600">₹${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <i class="fas fa-rupee-sign text-2xl text-gray-400"></i>
                                        </div>
                                    </div>
                                    <div class="bg-white rounded-xl p-4 border border-gray-200">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-sm text-gray-600 font-medium">Payment</p>
                                                <p class="text-lg font-semibold text-gray-900">${order.payment?.method || 'N/A'}</p>
                                            </div>
                                            <i class="fas fa-credit-card text-2xl text-gray-400"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="p-8 space-y-8">
                                <!-- Main Content Grid -->
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <!-- Left Column - Order Details -->
                                    <div class="lg:col-span-2 space-y-6">
                                        <!-- Customer Information -->
                                        <div class="bg-white rounded-xl border border-gray-200 p-6">
                                            <div class="flex items-center space-x-3 mb-4">
                                                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <i class="fas fa-user text-blue-600"></i>
                                                </div>
                                                <h4 class="text-lg font-semibold text-gray-900">Customer Information</h4>
                                            </div>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label class="text-sm font-medium text-gray-500">Full Name</label>
                                                    <p class="text-gray-900 font-medium">${order.user?.name || order.shipping?.address?.fullName || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label class="text-sm font-medium text-gray-500">Email Address</label>
                                                    <p class="text-gray-900 font-medium">${order.user?.email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label class="text-sm font-medium text-gray-500">Phone Number</label>
                                                    <p class="text-gray-900 font-medium">${order.shipping?.address?.contactNumber || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <label class="text-sm font-medium text-gray-500">Customer ID</label>
                                                    <p class="text-gray-900 font-medium font-mono text-sm">${order.user?._id || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Shipping Address -->
                                        <div class="bg-white rounded-xl border border-gray-200 p-6">
                                            <div class="flex items-center space-x-3 mb-4">
                                                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <i class="fas fa-map-marker-alt text-green-600"></i>
                                                </div>
                                                <h4 class="text-lg font-semibold text-gray-900">Shipping Address</h4>
                                            </div>
                                            <div class="bg-gray-50 rounded-lg p-4">
                                                ${order.shipping?.address ? `
                                                    <div class="space-y-1 text-gray-700">
                                                        <p class="font-medium text-gray-900">${order.shipping.address.fullName || order.user?.name || ''}</p>
                                                        <p>${order.shipping.address.street || 'N/A'}</p>
                                                        <p>${order.shipping.address.city || ''}, ${order.shipping.address.state || ''} ${order.shipping.address.zipCode || ''}</p>
                                                        <p class="font-medium">${order.shipping.address.country || ''}</p>
                                                        ${order.shipping.address.contactNumber ? `<p class="text-sm mt-2 flex items-center"><i class="fas fa-phone mr-2 text-gray-400"></i>${order.shipping.address.contactNumber}</p>` : ''}
                                                    </div>
                                                    <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span class="text-gray-500">Shipping Method:</span>
                                                            <span class="ml-2 font-medium">${order.shipping.method || 'Standard'}</span>
                                                        </div>
                                                        <div>
                                                            <span class="text-gray-500">Shipping Cost:</span>
                                                            <span class="ml-2 font-medium">₹${order.shipping.cost || '0.00'}</span>
                                                        </div>
                                                    </div>
                                                ` : '<p class="text-gray-500">No shipping address available</p>'}
                                            </div>
                                        </div>

                                        <!-- Shipping Partner Details -->
                                        ${order.shipping?.deliveryPartner?.name? `
                                            <div class="bg-white rounded-xl border border-gray-200 p-6">
                                                <div class="flex items-center space-x-3 mb-4">
                                                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <i class="fas fa-shipping-fast text-purple-600"></i>
                                                    </div>
                                                    <h4 class="text-lg font-semibold text-gray-900">Shipping Partner</h4>
                                                </div>
                                                <div class="bg-purple-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label class="text-sm font-medium text-gray-500">Partner Name</label>
                                                        <p class="font-medium text-gray-900">${order.shipping.deliveryPartner.name}</p>
                                                    </div>
                                                    <div>
                                                        <label class="text-sm font-medium text-gray-500">Tracking ID</label>
                                                        <p class="font-medium text-gray-900 font-mono">${order.shipping.deliveryPartner.trackingId}</p>
                                                    </div>
                                                    <div>
                                                        <label class="text-sm font-medium text-gray-500">Est. Delivery</label>
                                                        <p class="font-medium text-gray-900">${order.shipping.deliveryPartner.estimatedDelivery ? new Date(order.shipping.deliveryPartner.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ` : ''}                                        <!-- Order Items -->
                                          <div class="bg-white rounded-xl border border-gray-200 p-6">
                                            <div class="flex items-center space-x-3 mb-4">
                                                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <i class="fas fa-box text-orange-600"></i>
                                                </div>
                                                <h4 class="text-lg font-semibold text-gray-900">Order Items (${order.items.length})</h4>
                                            </div>
                                            <div class="space-y-4">
                                                ${order.items.map(item => `
                                                    <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                                        <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                                            ${item.imageUrl ? 
                                                                `<img src="${item.imageUrl}" alt="${item.name || 'Book'}" class="w-full h-full object-cover">` :
                                                                `<i class="fas fa-book text-gray-400 text-xl"></i>`
                                                            }
                                                        </div>
                                                        <div class="flex-1">
                                                            <h5 class="font-medium text-gray-900">${item.name || 'Unknown Book'}</h5>
                                                            <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                                                <span>Qty: ${item.quantity}</span>
                                                                <span>Unit Price: ₹${item.price?.toFixed(2) || '0.00'}</span>
                                                                ${item.skuId ? `<span class="font-mono">SKU-ID: ${item.skuId}</span>` : ''}
                                                            </div>
                                                        </div>
                                                        <div class="text-right">
                                                            <p class="font-semibold text-gray-900 text-lg">₹${(item.price * item.quantity).toFixed(2)}</p>
                                                            ${item.originalPrice > item.price ? `<p class="text-sm text-gray-500 line-through">₹${(item.originalPrice * item.quantity).toFixed(2)}</p>` : ''}
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>  

                                        <!-- Complimentary Items -->
                                        ${order.appliedVoucher?.complimentaryItems?.length > 0 ? `
                                            <div class="bg-white rounded-xl border border-emerald-200 p-6">
                                                <div class="flex items-center space-x-3 mb-4">
                                                    <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                        <i class="fas fa-gift text-emerald-600"></i>
                                                    </div>
                                                    <div class="flex items-center space-x-2">
                                                        <h4 class="text-lg font-semibold text-gray-900">Complimentary Items</h4>
                                                        <span class="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">FREE</span>
                                                    </div>
                                                </div>
                                                <div class="space-y-4">
                                                    ${order.appliedVoucher.complimentaryItems.map(item => `
                                                        <div class="flex items-center space-x-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                                            <div class="w-16 h-16 bg-emerald-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                                                                ${item.book?.images?.[0]?.url ? 
                                                                    `<img src="${item.book.images[0].url}" alt="${item.book?.title || item.name}" class="w-full h-full object-cover">` :
                                                                    `<i class="fas fa-gift text-emerald-600 text-xl"></i>`
                                                                }
                                                                <div class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                    <i class="fas fa-gift text-white text-xs"></i>
                                                                </div>
                                                            </div>
                                                            <div class="flex-1">
                                                                <h5 class="font-medium text-gray-900">${item.book?.title || item.name || 'Complimentary Item'}</h5>
                                                                <p class="text-sm text-gray-600">${item?.price || 'Free Gift'}</p>
                                                                <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                                                    <span>Qty: ${item.quantity}</span>
                                                                    <span class="text-emerald-600 font-medium">Complimentary</span>
                                                                    ${item.book?.isbn ? `<span class="font-mono">ISBN: ${item.book.isbn}</span>` : ''}
                                                                </div>
                                                            </div>
                                                            <div class="text-right">
                                                                <div class="flex flex-col items-end">
                                                                    <span class="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-emerald-500 text-white">FREE</span>
                                                                    <p class="text-xs text-gray-500 mt-1">No charge</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                                <div class="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                                    <div class="flex items-center space-x-2">
                                                        <i class="fas fa-info-circle text-emerald-600"></i>
                                                        <p class="text-sm text-emerald-700">
                                                            <span class="font-medium">These items are complimentary</span> and included as part of the applied voucher "${order.appliedVoucher.code}".
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ` : ''}

                                        <!-- Complimentary Items -->
                                      
                                    </div>

                                    <!-- Right Column - Summary & Actions -->
                                    <div class="space-y-6">
                                        <!-- Payment Information -->
                                        <div class="bg-white rounded-xl border border-gray-200 p-6">
                                            <div class="flex items-center space-x-3 mb-4">
                                                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <i class="fas fa-credit-card text-indigo-600"></i>
                                                </div>
                                                <h4 class="text-lg font-semibold text-gray-900">Payment Details</h4>
                                            </div>
                                            <div class="space-y-3">
                                                <div class="flex justify-between">
                                                    <span class="text-gray-600">Method</span>
                                                    <span class="font-medium">${order.payment?.method || 'N/A'}</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span class="text-gray-600">Status</span>
                                                    <span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${order.payment?.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                                        ${order.payment?.status || 'Pending'}
                                                    </span>
                                                </div>
                                                ${order.payment?.razorpayOrderId ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">RazorPay ID</span>
                                                        <span class="font-mono text-sm">${order.payment.razorpayOrderId}</span>
                                                    </div>
                                                ` : ''}
                                                ${order.payment?.notes ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Notes</span>
                                                        <span class="text-sm">${order.payment.notes}</span>
                                                    </div>
                                                ` : ''}
                                                ${order.payment?.paidAt ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Paid At</span>
                                                        <span class="text-sm">${new Date(order.payment.paidAt).toLocaleString()}</span>
                                                    </div>
                                                ` : ''}
                                                ${order.updatedBy ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Updated By</span>
                                                        <span class="font-medium">${order.updatedBy?.name.charAt(0).toUpperCase() + order.updatedBy?.name.slice(1) || 'Admin'}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>

                                        <!-- Voucher Details -->
                                        ${order.appliedVoucher ? `
                                            <div class="bg-white rounded-xl border border-gray-200 p-6">
                                                <div class="flex items-center space-x-3 mb-4">
                                                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <i class="fas fa-ticket-alt text-red-600"></i>
                                                    </div>
                                                    <h4 class="text-lg font-semibold text-gray-900">Voucher Applied</h4>
                                                </div>
                                                <div class="bg-red-50 rounded-lg p-4 space-y-2">
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Code</span>
                                                        <span class="font-medium font-mono">${order.appliedVoucher.code ? order.appliedVoucher.code : 'N/A'}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Discount</span>
                                                        <span class="font-medium text-red-600">-₹${order.appliedVoucher.discount}</span>
                                                    </div>
                                                    ${order.appliedVoucher.complimentaryItems?.length > 0 ? `
                                                        <div class="pt-2 border-t border-red-200">
                                                            <span class="text-sm text-gray-600">Complimentary Items:</span>
                                                            <div class="mt-1 space-y-1">
                                                                ${order.appliedVoucher.complimentaryItems.map(item => 
                                                                    `<p class="text-sm font-medium">${item.name} (x${item.quantity})</p>`
                                                                ).join('')}
                                                            </div>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        ` : ''}

                                        <!-- Order Summary -->
                                        <div class="bg-white rounded-xl border border-gray-200 p-6">
                                            <div class="flex items-center space-x-3 mb-4">
                                                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <i class="fas fa-calculator text-gray-600"></i>
                                                </div>
                                                <h4 class="text-lg font-semibold text-gray-900">Order Summary</h4>
                                            </div>
                                            <div class="space-y-3">
                                                <div class="flex justify-between">
                                                    <span class="text-gray-600">Subtotal</span>
                                                    <span class="font-medium">₹${order.charges?.subtotal?.toFixed(2) || order.totalAmount.toFixed(2)}</span>
                                                </div>
                                                ${order.charges?.gst > 0 ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">GST</span>
                                                        <span class="font-medium">₹${order.charges.gst.toFixed(2)}</span>
                                                    </div>
                                                ` : ''}
                                                ${order.charges?.paymentCharge > 0 ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Payment Charge</span>
                                                        <span class="font-medium">₹${order.charges.paymentCharge.toFixed(2)}</span>
                                                    </div>
                                                ` : ''}
                                                ${order.charges?.deliveryCharge > 0 ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Delivery Charge</span>
                                                        <span class="font-medium">₹${order.charges.deliveryCharge.toFixed(2)}</span>
                                                    </div>
                                                ` : ''}
                                                ${order.appliedVoucher?.discount ? `
                                                    <div class="flex justify-between text-red-600">
                                                        <span>Discount</span>
                                                        <span class="font-medium">-₹${order.appliedVoucher.discount.toFixed(2)}</span>
                                                    </div>
                                                ` : ''}
                                                <div class="pt-3 border-t border-gray-200">
                                                    <div class="flex justify-between items-center">
                                                        <span class="text-lg font-semibold text-gray-900">Total Amount</span>
                                                        <span class="text-2xl font-bold text-green-600">₹${order.totalAmount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Cancellation Details -->
                                        ${order.cancellationDetails?.reason ? `
                                            <div class="bg-white rounded-xl border border-red-200 p-6">
                                                <div class="flex items-center space-x-3 mb-4">
                                                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                        <i class="fas fa-times-circle text-red-600"></i>
                                                    </div>
                                                    <h4 class="text-lg font-semibold text-gray-900">Cancellation Details</h4>
                                                </div>
                                                <div class="bg-red-50 rounded-lg p-4 space-y-3">
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Reason</span>
                                                        <span class="font-medium text-red-800">${order.cancellationDetails.reason?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Cancelled By</span>
                                                        <span class="font-medium">${order.cancellationDetails.cancelledBy?.name.charAt(0).toUpperCase() + order.cancellationDetails.cancelledBy?.name.slice(1) || 'Admin'}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Refund Method</span>
                                                        <span class="font-medium">${order.cancellationDetails.refundMethod?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</span>
                                                    </div>
                                                    ${order.cancellationDetails.cancelledAt ? `
                                                        <div class="flex justify-between">
                                                            <span class="text-gray-600">Cancelled At</span>
                                                            <span class="text-sm">${new Date(order.cancellationDetails.cancelledAt).toLocaleString()}</span>
                                                        </div>
                                                    ` : ''}
                                                    ${order.cancellationDetails.notes ? `
                                                        <div class="pt-3 border-t border-red-200">
                                                            <span class="text-gray-600 block mb-2">Notes</span>
                                                            <p class="text-gray-800 text-sm bg-white rounded p-3 border">${order.cancellationDetails.notes}</p>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        ` : ''}

                                        <!-- Refund Details -->
                                        ${order.refundDetails?.reason ? `
                                            <div class="bg-white rounded-xl border border-orange-200 p-6">
                                                <div class="flex items-center space-x-3 mb-4">
                                                    <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <i class="fas fa-undo text-orange-600"></i>
                                                    </div>
                                                    <h4 class="text-lg font-semibold text-gray-900">Refund Details</h4>
                                                </div>
                                                <div class="bg-orange-50 rounded-lg p-4 space-y-3">
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Reason</span>
                                                        <span class="font-medium text-orange-800">${order.refundDetails.reason?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Refund Amount</span>
                                                        <span class="font-bold text-orange-600">₹${order.refundDetails.refundAmount?.toFixed(2) || '0.00'}</span>
                                                    </div>
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Refund Method</span>
                                                        <span class="font-medium">${order.refundDetails.refundMethod?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</span>
                                                    </div>
                                                    ${order.refundDetails.referenceId ? `
                                                        <div class="flex justify-between">
                                                            <span class="text-gray-600">Reference ID</span>
                                                            <span class="font-mono text-sm">${order.refundDetails.referenceId}</span>
                                                        </div>
                                                    ` : ''}
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Processed By</span>
                                                        <span class="font-medium">${order.refundDetails.processedBy?.name.charAt(0).toUpperCase() + order.refundDetails.processedBy?.name.slice(1) || 'Admin'}</span>
                                                    </div>
                                                    ${order.refundDetails.processedAt ? `
                                                        <div class="flex justify-between">
                                                            <span class="text-gray-600">Processed At</span>
                                                            <span class="text-sm">${new Date(order.refundDetails.processedAt).toLocaleString()}</span>
                                                        </div>
                                                    ` : ''}
                                                    ${order.refundDetails.notes ? `
                                                        <div class="pt-3 border-t border-orange-200">
                                                            <span class="text-gray-600 block mb-2">Notes</span>
                                                            <p class="text-gray-800 text-sm bg-white rounded p-3 border">${order.refundDetails.notes}</p>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        ` : ''}

                                        <!-- Quick Actions -->
                                        <div class="bg-white rounded-xl border border-gray-200 p-6">
                                            <h4 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                                            <div class="space-y-3">
                                                <button onclick="adminOrders.downloadInvoice('${order._id}')" 
                                                        class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                                    <i class="fas fa-file-invoice"></i>
                                                    <span>Download Invoice</span>
                                                </button>
                                               <!-- <button onclick="adminOrders.printShippingLabel('${order._id}')" 
                                                        class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                                    <i class="fas fa-shipping-fast"></i>
                                                    <span>Print Shipping Label</span>
                                                </button>
                                                <button onclick="adminOrders.sendOrderUpdate('${order._id}')" 
                                                        class="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                                    <i class="fas fa-envelope"></i>
                                                    <span>Send Update Email</span>
                                                </button> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);        } catch (error) {
            console.error('Error loading order details:', error);
            this.showNotification('Failed to load order details: ' + error.message, 'error');
        }
    },async promptShippingDetails() {
        return new Promise((resolve) => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 class="text-lg font-bold mb-4">Enter Shipping Details</h2>
                    <form id="shipping-details-form" class="space-y-4">
                        <div>
                            <label for="shipping-name" class="block text-sm font-medium text-gray-700">Shipping Partner Name</label>
                            <input type="text" id="shipping-name" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                        </div>
                        <div>
                            <label for="tracking-id" class="block text-sm font-medium text-gray-700">Tracking ID</label>
                            <input type="text" id="tracking-id" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                        </div>
                        <div>
                            <label for="estimated-delivery" class="block text-sm font-medium text-gray-700">Estimated Delivery Date</label>
                            <input type="date" id="estimated-delivery" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        </div>
                        <div class="flex justify-end space-x-4">
                            <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" id="cancel-shipping">Cancel</button>
                            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle form submission
            const form = modal.querySelector('#shipping-details-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const shippingDetails = {
                    name: form.querySelector('#shipping-name').value,
                    trackingId: form.querySelector('#tracking-id').value,
                    estimatedDelivery: form.querySelector('#estimated-delivery').value || null,
                };
                modal.remove();
                resolve(shippingDetails);
            });

            // Handle cancel button
            modal.querySelector('#cancel-shipping').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    },


    async promptUpdatePaymentStatusDetails(status){
        return new Promise((resolve) => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 class="text-lg font-bold mb-4">Update Payment Status</h2>
                    <form id="payment-status-form" class="space-y-4">
                        <div>
                            <label for="payment-status" class="block text-sm font-medium text-gray-700">Payment Status *</label>
                            <select id="payment-status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Select status</option>
                                <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="failed" ${status === 'failed' ? 'selected' : ''}>Failed</option>
                            </select>
                        </div>
                      
                        <div>
                            <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea id="notes" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="3"></textarea>
                        </div>
                        <div class="flex justify-end space-x-4">
                            <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" id="cancel-payment-status">Cancel</button>
                            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Status</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle form submission
            const form = modal.querySelector('#payment-status-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const paymentDetails = {
                    status: form.querySelector('#payment-status').value,
                    notes: form.querySelector('#notes').value || '',
                };
                modal.remove();
                resolve(paymentDetails);
            });

            // Handle cancel button
            const cancelButton = modal.querySelector('#cancel-payment-status');
            cancelButton.addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    },



    async promptCancellationDetails() {
        return new Promise((resolve) => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 class="text-lg font-bold mb-4 text-red-600">Order Cancellation Details</h2>
                    <form id="cancellation-details-form" class="space-y-4">
                        <div>
                            <label for="cancellation-reason" class="block text-sm font-medium text-gray-700">Cancellation Reason *</label>
                            <select id="cancellation-reason" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Select reason</option>
                                <option value="customer-request">Customer Request</option>
                                <option value="out-of-stock">Out of Stock</option>
                                <option value="payment-issue">Payment Issue</option>
                                <option value="shipping-issue">Shipping Issue</option>
                                <option value="quality-issue">Quality Issue</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label for="cancellation-notes" class="block text-sm font-medium text-gray-700">Additional Notes</label>
                            <textarea id="cancellation-notes" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter any additional details..."></textarea>
                        </div>
                        <div>
                            <label for="refund-method" class="block text-sm font-medium text-gray-700">Refund Method</label>
                            <select id="refund-method" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option value="original-payment-method">Original Payment Method</option>
                                <option value="bank-transfer">Bank Transfer</option>
                                <option value="store-credit">Store Credit</option>
                                <option value="cash">Cash</option>
                                <option value="no-refund">No Refund Required</option>
                            </select>
                        </div>
                        <div class="flex justify-end space-x-4">
                            <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" id="cancel-cancellation">Cancel</button>
                            <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Confirm Cancellation</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle form submission
            const form = modal.querySelector('#cancellation-details-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const cancellationDetails = {
                    reason: form.querySelector('#cancellation-reason').value,
                    notes: form.querySelector('#cancellation-notes').value,
                    refundMethod: form.querySelector('#refund-method').value,
                    cancelledAt: new Date().toISOString()
                };
                modal.remove();
                resolve(cancellationDetails);
            });

            // Handle cancel button
            modal.querySelector('#cancel-cancellation').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    },

    async promptRefundDetails() {
        return new Promise((resolve) => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6 w-96">
                    <h2 class="text-lg font-bold mb-4 text-orange-600">Refund Completion Details</h2>
                    <form id="refund-details-form" class="space-y-4">
                        <div>
                            <label for="refund-amount" class="block text-sm font-medium text-gray-700">Refund Amount *</label>
                            <input type="number" id="refund-amount" step="0.01" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required placeholder="0.00">
                        </div>
                        <div>
                            <label for="refund-method-completed" class="block text-sm font-medium text-gray-700">Refund Method *</label>
                            <select id="refund-method-completed" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Select method</option>
                                <option value="original-payment-method">Original Payment Method</option>
                                <option value="bank-transfer">Bank Transfer</option>
                                <option value="store-credit">Store Credit</option>
                                <option value="cash">Cash</option>
                            </select>
                        </div>
                        <div>
                            <label for="refund-reference" class="block text-sm font-medium text-gray-700">Reference/Transaction ID</label>
                            <input type="text" id="refund-reference" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" placeholder="Enter transaction reference">
                        </div>
                        <div>
                             <label for="refund-reason" class="block text-sm font-medium text-gray-700">Refund reason</label>
                                <select id="refund-reason" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="">Select reason</option>
                                    <option value="customer-request">Customer Request</option>
                                    <option value="defective-product">Defective Product</option>
                                    <option value="wrong-item">Wrong Item Shipped</option>
                                    <option value="not-as-described">Not as Described</option>
                                    <option value="damaged-in-transit">Damaged in Transit</option>
                                    <option value="customer-cancellation">Customer Cancellation</option>
                                    <option value="other">Other</option>
                                </select>
                        </div>
                        <div>
                            <label for="refund-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea id="refund-notes" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows="3" placeholder="Enter any additional notes"></textarea>
                        </div>
                        <div>
                            <label for="refund-processed-date" class="block text-sm font-medium text-gray-700">Processing Date</label>
                            <input type="date" id="refund-processed-date" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="flex justify-end space-x-4">
                            <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" id="cancel-refund">Cancel</button>
                            <button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Complete Refund</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle form submission
            const form = modal.querySelector('#refund-details-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const refundDetails = {
                    refundAmount: parseFloat(form.querySelector('#refund-amount').value),
                    refundMethod: form.querySelector('#refund-method-completed').value,
                    referenceId: form.querySelector('#refund-reference').value,
                    notes: form.querySelector('#refund-notes').value,
                    reason: form.querySelector('#refund-reason').value,
                    processedDate: form.querySelector('#refund-processed-date').value,
                    completedAt: new Date().toISOString()
                };
                modal.remove();
                resolve(refundDetails);
            });

            // Handle cancel button
            modal.querySelector('#cancel-refund').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });
        });
    },    downloadInvoice(orderId) {
        window.open(`/admin/invoice?orderId=${orderId}`, '_blank');
    },

    printShippingLabel(orderId) {
        try {
            // This would typically generate a shipping label PDF
            this.showNotification('Generating shipping label...', 'info');
            window.open(`/api/admin/orders/${orderId}/shipping-label`, '_blank');
        } catch (error) {
            console.error('Error printing shipping label:', error);
            this.showNotification('Failed to generate shipping label', 'error');
        }
    },

    async sendOrderUpdate(orderId) {
        try {
            this.showNotification('Sending order update email...', 'info');
            
            const response = await fetch(`/api/admin/orders/${orderId}/send-update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send order update');
            }

            this.showNotification('Order update email sent successfully', 'success');
        } catch (error) {
            console.error('Error sending order update:', error);
            this.showNotification('Failed to send order update email', 'error');
        }
    },

    async exportOrders() {
        try {
            this.showNotification('Generating export file...', 'info');
            
            const orders = await adminApi.getOrders(1, 1000); // Get all orders for export
            if (!orders || !orders.orders) {
                throw new Error('No orders found to export');
            }

            const csvContent = this.generateOrdersCSV(orders.orders);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('Orders exported successfully', 'success');
            } else {
                throw new Error('Browser does not support file downloads');
            }
        } catch (error) {
            console.error('Error exporting orders:', error);
            this.showNotification('Failed to export orders', 'error');
        }
    },

    generateOrdersCSV(orders) {
        const headers = [
            'Order ID', 'Customer Name', 'Customer Email', 'Date', 'Status', 
            'Items Count', 'Total Amount', 'Payment Method', 'Shipping Address',
            'Tracking Number', 'Carrier'
        ];
        
        const csvRows = [headers.join(',')];

        orders.forEach(order => {
            const row = [
                `"${order._id}"`,
                `"${order.user?.name || order.shippingAddress?.fullName || 'N/A'}"`,
                `"${order.user?.email || 'N/A'}"`,
                `"${new Date(order.createdAt).toLocaleDateString()}"`,
                `"${order.status}"`,
                `"${order.payment.status}"`,
                order.items.length,
                order.totalAmount.toFixed(2),
                `"${order.paymentMethod || 'N/A'}"`,
                `"${order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` : 'N/A'}"`,
                `"${order.trackingNumber || 'N/A'}"`,
                `"${order.carrier || 'N/A'}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    },

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-100 text-green-800 border-green-200',
            error: 'bg-red-100 text-red-800 border-red-200',
            info: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-xl border ${colors[type]} z-50 transform translate-x-full transition-transform`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => notification.remove(), 300);        }, 3000);
    }
};
