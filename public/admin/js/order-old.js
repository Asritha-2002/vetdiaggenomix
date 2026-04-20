const adminOrders = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 50,

    async render() {
        const content = document.getElementById('main-content');
        if (!content) {
            console.error('Main content container not found');
            return;
        }
        
        try {
            const response = await adminApi.getOrders(this.currentPage, this.itemsPerPage);
            console.log('Fetched orders:', response);
            
            if (!response || !response.orders || !Array.isArray(response.orders)) {
                throw new Error('Invalid orders data received');
            }

            this.totalPages = Math.ceil(response.total / this.itemsPerPage);

            content.innerHTML = `
                <div class="space-y-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Orders</h2>
                        <div class="flex gap-4">
                            <select id="status-filter" class="border rounded-lg px-4 py-2 bg-white shadow-sm">
                                <option value="">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${response.orders.map(order => this.renderOrderRow(order)).join('')}
                                </tbody>
                            </table>
                        </div>
                        ${this.renderPagination()}
                    </div>
                </div>
            `;

            this.bindEvents();
        } catch (error) {
            console.error('Error rendering orders:', error);
            content.innerHTML = '<div class="text-red-500">Error loading orders</div>';
        }
    },

    async showOrderDetails(orderId) {
        try {
            const modal = document.getElementById('order-modal');
            const detailsContainer = document.getElementById('order-details');
            
            if (!modal || !detailsContainer) {
                console.error('Modal elements not found. Modal:', modal, 'Details container:', detailsContainer);
                throw new Error('Modal elements not found. Please check the HTML structure.');
            }

            const order = await adminApi.getOrderById(orderId);
            if (!order) {
                throw new Error('Order data not received');
            }

            detailsContainer.innerHTML = `
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h4 class="font-medium text-gray-700">Order Information</h4>
                        <p class="mt-2">Order ID: ${order._id}</p>
                        <p class="text-gray-600">Date: ${new Date(order.createdAt).toLocaleString()}</p>
                        <p class="text-gray-600">Status: <span class="font-medium">${order.status}</span></p>
                        <p class="text-gray-600">Source: ${order.orderDetails?.source || 'N/A'}</p>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-700">Payment Details</h4>
                        <p class="mt-2">Method: ${order.payment?.method || 'N/A'}</p>
                        <p class="text-gray-600">Status: ${order.payment?.status || 'N/A'}</p>
                        <p class="text-gray-600">RazorPay ID: ${order.payment?.razorpayOrderId || 'N/A'}</p>
                        <p class="text-gray-600">Paid At: ${order.payment?.paidAt ? new Date(order.payment.paidAt).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-gray-50 p-3 rounded">
                        <h4 class="font-medium text-gray-700 mb-4">Shipping Address</h4>
                        <p>${order.shipping?.address?.street || 'N/A'}</p>
                        <p>${order.shipping?.address?.city || ''}, ${order.shipping?.address?.state || ''}</p>
                        <p>${order.shipping?.address?.zipCode || ''}</p>
                        <p>${order.shipping?.address?.country || ''}</p>
                        <p>Phone: ${order.shipping?.address?.contactNumber || 'N/A'}</p>
                        <p>Method: ${order.shipping?.method || 'N/A'}</p>
                        <p>Cost: ₹${order.shipping?.cost || 'N/A'}</p>
                         <p class="text-gray-600">Shipping Partner: ${order.shipping?.deliveryPartner?.name || 'N/A'}</p>
                        <p class="text-gray-600">Tracking ID: ${order.shipping?.deliveryPartner?.trackingId || 'N/A'}</p>
                        <p class="text-gray-600">Estimated Delivery: ${order.shipping?.deliveryPartner?.estimatedDelivery ? new Date(order.shipping.deliveryPartner.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded">
                        <h4 class="font-medium text-gray-700 mb-4">Voucher Details</h4>
                        ${order.appliedVoucher ? `
                            <p>Voucher Code: ${order.appliedVoucher.code || 'N/A'}</p>
                            <p>Discount: ₹${order.appliedVoucher.discount || 'N/A'}</p>
                            <p>Complimentary Items: ${order.appliedVoucher.complimentaryItems?.map(item => `${item.name || 'Unknown Book'} (x${item.quantity})`).join(', ') || 'N/A'}</p>
                        ` : '<p>No voucher applied</p>'}


                       
                    </div>

                </div>



                <div class="mb-6">
                    <h4 class="font-medium text-gray-700 mb-4">Order Items</h4>
                    <div class="divide-y">
                        ${order.items.map(item => `
                            <div class="py-3 flex justify-between items-center">
                                <div>
                                    <p class="font-medium">${item.book?.title || 'Unknown Book'}</p>
                                    <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
                                    <p class="text-sm text-gray-600">Price: ₹${item.price}</p>
                                </div>
                                <p class="font-medium">₹${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="border-t pt-4">
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span>₹${order.charges.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">GST</span>
                            <span>₹${order.charges.gst.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Payment Charge</span>
                            <span>₹${order.charges.paymentCharge.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Delivery Charge</span>
                            <span>₹${order.charges.deliveryCharge.toFixed(2)}</span>
                        </div>
                        ${order.appliedVoucher?.discount ? `
                            <div class="flex justify-between text-red-600">
                                <span>Discount</span>
                                <span>-₹${order.appliedVoucher.discount.toFixed(2)}</span>
                            </div>
                        ` : ''}
                        <div class="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>₹${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;

            

            // Show modal
            modal.classList.remove('hidden');

        } catch (error) {
            console.error('Error loading order details:', error);
            alert('Failed to load order details: ' + error.message);
        }
    },

    renderOrderRow(order) {
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm">#${order._id.slice(-6)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div>
                            <div class="text-sm font-medium text-gray-900">${order.user?.name || 'N/A'}</div>
                            <div class="text-sm text-gray-500">${order.user?.email || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.items.length} items
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹${order.totalAmount.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <select class="status-select text-sm rounded-full px-3 py-1 ${this.getStatusColor(order.status)}" 
                            data-id="${order._id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="download-invoice text-green-600 hover:text-green-800" data-id="${order._id}">
                        <i class="fas fa-file-invoice"></i> Invoice
                    </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="view-order text-blue-600 hover:text-blue-800" data-id="${order._id}">
                        View Details
                    </button>
                </td>
            </tr>
        `;
    },

    getStatusColor(status) {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800'
        };
        return colors[status] || colors.pending;
    },

    renderPagination() {
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            pages.push(`
                <button class="px-3 py-2 ${this.currentPage === i ? 'bg-blue-500 text-white' : 'bg-white'} 
                         border rounded hover:bg-blue-100"
                        onclick="adminOrders.changePage(${i})">
                    ${i}
                </button>
            `);
        }

        return `
            <div class="flex justify-center gap-2 mt-4">
                <button class="px-3 py-2 bg-white border rounded hover:bg-gray-100 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick="adminOrders.changePage(${this.currentPage - 1})"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
                ${pages.join('')}
                <button class="px-3 py-2 bg-white border rounded hover:bg-gray-100 ${this.currentPage === this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                        onclick="adminOrders.changePage(${this.currentPage + 1})"
                        ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                    Next
                </button>
            </div>
        `;
    },

    async changePage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        await this.render();
    },

    bindEvents() {
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                try {
                    const orderId = e.target.dataset.id;
                    const status = e.target.value;

                    // Show shipping details modal only for 'shipped' status
                    if (status === 'shipped') {
                        const shippingDetails = await this.promptShippingDetails();
                        if (!shippingDetails) {
                            e.target.value = e.target.getAttribute('data-original-value');
                            return;
                        }

                        // Update shipping details in the backend
                        await adminApi.updateOrderStatus(orderId, status, shippingDetails);
                    } else {
                        // Update status without shipping details
                        await adminApi.updateOrderStatus(orderId, status);
                    }

                    // Refresh orders list
                    await this.render();

                    // Show success message
                    const toast = document.createElement('div');
                    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
                    toast.textContent = 'Order status updated successfully';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 3000);

                } catch (error) {
                    console.error('Error updating status:', error);
                    alert('Failed to update order status');
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

        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = e.target.dataset.id;
                this.showOrderDetails(orderId);
            });
        });

        document.querySelectorAll('.download-invoice').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                window.open(`/admin/invoice?orderId=${e.target.dataset.id}`, '_blank');

            });
        });
    },

    async promptShippingDetails() {
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
    }
};
