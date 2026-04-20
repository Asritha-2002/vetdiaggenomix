async function initOrderConfirmation() {
    if (!auth.isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const paymentId = params.get('paymentId');

    if (!orderId) {
        window.location.href = '/';
        return;
    }

    try {
        const order = await api.getOrder(orderId);
        displayOrderDetails(order, paymentId);
    } catch (error) {
        console.error('Error fetching order:', error);
        alert('Failed to load order details');
    }
}

function displayOrderDetails(order, paymentId) {
    // Order status and basic details
    const statusElement = document.getElementById('order-status');
    statusElement.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    statusElement.className = `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`;

    document.getElementById('order-id').textContent = `#${order._id.slice(-6)}`;
    document.getElementById('order-date').textContent = new Date(order.createdAt).toLocaleString();
    document.getElementById('payment-id').textContent = order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.razorpayOrderId;
    // Order items with enhanced layout
    const itemsContainer = document.getElementById('order-items');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="py-4 first:pt-0 last:pb-0">
            <div class="flex gap-4">
                <img src="${item.book.images[0]?.url || '/placeholder.jpg'}" 
                     alt="${item.book.title}"
                     class="w-20 h-24 object-cover rounded-lg shrink-0">
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 truncate">${item.book.title}</h3>
                    <p class="text-gray-500 mt-1">Quantity: ${item.quantity}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <p class="text-red-600 font-medium">₹${(item.price * item.quantity).toFixed(2)}</p>
                        ${item.price !== item.book.originalPrice ? 
                            `<p class="text-gray-400 line-through text-sm">₹${(item.book.originalPrice * item.quantity).toFixed(2)}</p>` 
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Delivery address with better formatting
    const address = order.shipping.address;
    document.getElementById('delivery-address').innerHTML = `
        <p class="font-medium text-gray-900">${address.name || ''}</p>
        <p>${address.street}</p>
        <p>${address.city}, ${address.state} ${address.zipCode}</p>
        <p>${address.country}</p>
        <p class="mt-2">
            <span class="inline-flex items-center text-gray-500">
                <i class="fas fa-phone mr-2"></i>
                ${address.contactNumber}
            </span>
        </p>
    `;

    // Order summary
    document.getElementById('subtotal').textContent = `₹${order.charges.subtotal.toFixed(2)}`;
    document.getElementById('tax-details').innerHTML = `
        <div class="flex justify-between">
            <span>GST</span>
            <span>₹${order.charges.gst.toFixed(2)}</span>
        </div>
    `;
    document.getElementById('payment-charge').textContent = `₹${order.charges.paymentCharge.toFixed(2)}`;
    document.getElementById('delivery-charge').textContent = `₹${order.charges.deliveryCharge.toFixed(2)}`;
    document.getElementById('discount').textContent = `-₹${(order.appliedVoucher?.discount || 0).toFixed(2)}`;
    document.getElementById('total').textContent = `₹${order.totalAmount.toFixed(2)}`;
}

function getStatusColor(status) {
    switch(status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'shipped':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

document.addEventListener('DOMContentLoaded', initOrderConfirmation);
