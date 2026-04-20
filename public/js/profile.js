let activeTab = 'profile';


if(!localStorage.getItem('token')) {
    window.location.href = '/';
}

async function initProfile() {
    if (!auth.isAuthenticated()) {
        window.location.href = '/';
        return;
    }

    setupTabEvents();
    await loadProfile();
    await loadOrders();
    await loadFavorites();
}

function setupTabEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submit handlers
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    document.getElementById('password-form').addEventListener('submit', handlePasswordUpdate);
}

function switchTab(tabName) {
    activeTab = tabName;
    
    // Update button states
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('bg-red-600', 'text-white');
            btn.classList.remove('hover:bg-gray-100');
        } else {
            btn.classList.remove('bg-red-600', 'text-white');
            btn.classList.add('hover:bg-gray-100');
        }
    });

    // Show active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('hidden', content.id !== `${tabName}-tab`);
    });
}

async function loadProfile() {
    try {
        const profile = await api.getProfile();
        const form = document.getElementById('profile-form');
        
        form.elements.name.value = profile.name;
        form.elements.email.value = profile.email;
        
        // Get default address or first address from addresses array
        const defaultAddress = profile.addresses?.find(addr => addr.isDefault) || profile.addresses?.[0];
        
        if (defaultAddress) {
            form.elements.street.value = defaultAddress.street || '';
            form.elements.city.value = defaultAddress.city || '';
            form.elements.state.value = defaultAddress.state || '';
            form.elements.zipCode.value = defaultAddress.zipCode || '';
            form.elements.country.value = defaultAddress.country || '';
            form.elements.contactNumber.value = defaultAddress.contactNumber || ''; // Add this line
        }

        // Load preferences if they exist
        if (profile.preferences) {
            document.querySelector('input[name="newsletter"]').checked = profile.preferences.newsletter;
            document.querySelector('input[name="orderUpdates"]').checked = profile.preferences.orderUpdates;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function loadOrders() {
    try {
        const orders = await api.getOrders();
        const container = document.getElementById('orders-list');
        
        if (!orders || !Array.isArray(orders)) {
            throw new Error('Invalid orders data received');
        }
        
        container.innerHTML = orders.map(order => `
            <div class="border rounded-lg p-6 space-y-4">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-semibold">Order #${order._id}</p>
                        <p class="text-sm text-gray-500">
                            ${new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>

                <div class="space-y-4">
                    ${(order.items || []).map(item => {
                        if (!item) return '';
                        const book = item.book || {};
                        // Update default image path and handle errors properly
                        const imageUrl = book.images?.[0]?.url || '/assets/default-book.jpg';
                        const title = book.title || 'Book not available';
                        const price = typeof item.price === 'number' ? item.price : 0;
                        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
                        
                        return `
                            <div class="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
                                <img src="${imageUrl}" 
                                     alt="${title}"
                                     class="w-16 h-20 object-cover rounded"
                                     onerror="if(this.src!=='/assets/default-book.jpg') this.src='/assets/default-book.jpg';">
                                <div class="flex-1">
                                    <p class="font-medium">${title}</p>
                                    <p class="text-sm text-gray-600">Quantity: ${quantity}</p>
                                    <p class="text-sm font-medium">₹${(price * quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${renderTrackingInfo(order)}
                ${renderOrderSummary(order)}
            </div>
        `).join('') || '<p class="text-gray-500 text-center py-8">No orders found</p>';
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-list').innerHTML = 
            '<p class="text-red-500 text-center py-8">Failed to load orders</p>';
    }
}

function renderTrackingInfo(order) {
    if (!order.shipping?.deliveryPartner) return '';
    
    const partner = order.shipping.deliveryPartner;
    const currentStatus = partner.trackingUpdates?.[partner.trackingUpdates.length - 1];

    return `
        <div class="border-t pt-4">
            <h4 class="font-medium mb-2">Delivery Status</h4>
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-medium">${partner.name}</p>
                        <p class="text-sm text-gray-600">Tracking ID: ${partner.trackingId}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium ${getStatusColor(currentStatus?.status || 'pending')}">
                            ${formatTrackingStatus(currentStatus?.status)}
                        </p>
                        ${partner.estimatedDelivery ? `
                            <p class="text-xs text-gray-500">Expected by ${new Date(partner.estimatedDelivery).toLocaleDateString()}</p>
                        ` : ''}
                    </div>
                </div>

                ${renderTrackingTimeline(partner.trackingUpdates)}
            </div>
        </div>
    `;
}

function renderTrackingTimeline(updates) {
    if (!updates?.length) return '';

    return `
        <div class="mt-4 space-y-3">
            ${updates.map((update, index) => `
                <div class="flex gap-3 text-sm ${index !== updates.length - 1 ? 'border-l-2 border-gray-200 pb-3 ml-2' : ''}">
                    <div class="w-32 text-gray-500 flex-shrink-0">
                        ${new Date(update.timestamp).toLocaleString()}
                    </div>
                    <div>
                        <p class="font-medium">${formatTrackingStatus(update.status)}</p>
                        ${update.location ? `<p class="text-gray-600">${update.location}</p>` : ''}
                        ${update.description ? `<p class="text-gray-600">${update.description}</p>` : ''}
                    </div>
                </div>
            `).reverse().join('')}
        </div>
    `;
}

function renderOrderSummary(order) {
    return `
        <div class="border-t pt-4">
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span>₹${order.charges.subtotal}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">GST</span>
                    <span>₹${order.charges.gst}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Delivery Charges</span>
                    <span>₹${order.charges.deliveryCharge}</span>
                </div>
                ${order.appliedVoucher ? `
                    <div class="flex justify-between text-red-600">
                        <span>Discount</span>
                        <span>-₹${order.appliedVoucher.discount}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹${order.totalAmount}</span>
                </div>
            </div>
        </div>
    `;
}

function formatTrackingStatus(status) {
    if (!status) return 'Pending';
    return status.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

async function loadFavorites() {
   return 0;
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    try {
        const formData = new FormData(e.target);

        // Validate contact number
        const contactNumber = formData.get('contactNumber');
        if (!contactNumber) {
            alerts.showMainAlert('Contact number is required', 'error');
            return;
        }

        const addressData = {
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country'),
            contactNumber: contactNumber
        };

        // Validate required fields
        for (const [key, value] of Object.entries(addressData)) {
            if (!value) {
                alerts.showMainAlert(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`, 'error');
                return;
            }
        }

        // First update the user's name
        await api.updateProfile({
            name: formData.get('name')
        });

        // Then handle address update
        const addresses = await api.getAddresses();
        if (addresses.length === 0) {
            // If no addresses exist, create new default address
            await api.addAddress({
                ...addressData,
                label: 'Default',
                isDefault: true
            });
        } else {
            // Update the default address
            const defaultAddress = addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                await api.updateAddress(defaultAddress._id, {
                    ...addressData,
                    isDefault: true
                });
            } else {
                // If no default address, update the first one
                await api.updateAddress(addresses[0]._id, {
                    ...addressData,
                    isDefault: true
                });
            }
        }

        alerts.showMainAlert('Profile updated successfully', 'success');
        await loadProfile(); // Reload the profile to show updated data
    } catch (error) {
        alerts.showMainAlert(error.message || 'Failed to update profile', 'error');
    }
}

async function handlePasswordUpdate(e) {
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        await api.updatePassword({
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword')
        });
        alerts.showMainAlert('Password updated successfully', 'success');
        e.target.reset();
    } catch (error) {
        alerts.showMainAlert(error.message || 'Failed to update password', 'error');
    }
}

async function removeFromFavorites(bookId) {
    try {
        await api.toggleFavorite(bookId);
        await loadFavorites();
        alerts.showSideAlert('Removed from favorites', 'info');
    } catch (error) {
        alerts.showSideAlert(error.message || 'Failed to remove from favorites', 'error');
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'shipped': return 'bg-purple-100 text-purple-800';
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

document.addEventListener('DOMContentLoaded', initProfile);
