let cartItems = [];
let appliedVoucher = null;
let orderTotals = null;
let selectedDelivery = null;
let selectedPayment = null;
let selectedComplimentaryItems = [];
function showLoader() {
    document.getElementById('page-loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('page-loader').style.display = 'none';
}
async function initCheckout() {
    if (!auth.isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    await loadCart();
    await loadAvailableVouchers();
    await loadDeliveryOptions();
    await loadPaymentOptions();
    await calculateTotals();
    await loadSavedAddresses();
    loadSavedAddress();
}

async function loadAvailableVouchers() {
    try {
        const vouchers = await api.getAvailableVouchers();
        displayAvailableVouchers(vouchers);
    } catch (error) {
        console.error('Error loading vouchers:', error);
        const container = document.getElementById('available-vouchers');
        container.innerHTML = '<p class="text-red-500">Failed to load vouchers</p>';
    }
}

function displayAvailableVouchers(vouchers) {
    const container = document.getElementById('available-vouchers');
    if (!container) return;

    if (!vouchers.length) {
        container.innerHTML = '<p class="text-gray-500">No vouchers available</p>';
        return;
    }

    container.innerHTML = vouchers.map(voucher => `
        <div class="flex items-center justify-between p-3 border rounded-lg mb-2 hover:bg-gray-50">
            <div>
                <span class="font-medium">${voucher.code}</span>
                <p class="text-sm text-gray-600">
                    ${getVoucherDescription(voucher)}
                </p>
                <p class="text-xs text-gray-500">
                    ${getVoucherRestrictions(voucher)}
                </p>
            </div>
            <button onclick="applyVoucherCode('${voucher.code}')" 
                    class="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50">
                Apply
            </button>
        </div>
    `).join('');
}

function getVoucherDescription(voucher) {
    switch (voucher.type) {
        case 'percentage':
            return `${voucher.value}% off${voucher.maxDiscount ? ' up to ₹' + voucher.maxDiscount : ''}`;
        case 'fixed':
            return `₹${voucher.value} off your order`;
        case 'complimentary':
            return `Get ${voucher.complimentaryConfig.quantity} free item(s) between ₹${voucher.complimentaryConfig.minPrice} - ₹${voucher.complimentaryConfig.maxPrice}`;
        default:
            return '';
    }
}

function getVoucherRestrictions(voucher) {
    const restrictions = [];
    if (voucher.minPurchase > 0) {
        restrictions.push(`Min. order: ₹${voucher.minPurchase}`);
    }
    if (voucher.maxUses) {
        restrictions.push(`Limited uses: ${voucher.maxUses - voucher.usedCount}`);
    }
    if (voucher.expiryDate) {
        const expiry = new Date(voucher.expiryDate);
        restrictions.push(`Expires: ${expiry.toLocaleDateString()}`);
    }
    return restrictions.join(' • ');
}

async function applyVoucherCode(code) {
    document.getElementById('voucher-code').value = code;
    await applyVoucher();
}

async function loadCart() {
    try {
        const cart = await api.getCart();
        cartItems = cart.items;
        renderCartItems();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    container.innerHTML = cartItems.map(item => {
        const originalPrice = item.book.price * item.quantity;
        let discountedPrice = originalPrice;
        let discountBadge = '';

        // Check if product-specific voucher is applied
        if (appliedVoucher && appliedVoucher.applicationType === 'product'
            && appliedVoucher.productId === item.book._id) {
            if (appliedVoucher.type === 'percentage') {
                discountedPrice = originalPrice * (1 - appliedVoucher.value / 100);
            } else if (appliedVoucher.type === 'fixed') {
                discountedPrice = Math.max(0, originalPrice - appliedVoucher.value);
            }
            discountBadge = `<span class="text-xs text-red-600 ml-2">
                ${appliedVoucher.type === 'percentage' ? `-${appliedVoucher.value}%` : `-₹${appliedVoucher.value}`}
            </span>`;
        }

        return `
            <div class="bg-white p-4 rounded-lg shadow-md flex gap-4">
                <img src="${item.book.images[0]?.url || '/placeholder.jpg'}" 
                     alt="${item.book.title}"
                     class="w-24 h-24 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold">${item.book.title}</h4>
                    <p class="text-gray-600">Quantity: ${item.quantity}</p>
                    <div class="flex items-center">
                        <p class="text-red-600 font-semibold">₹${discountedPrice.toFixed(2)}</p>
                        ${originalPrice !== discountedPrice ?
                `<p class="text-gray-400 line-through ml-2">₹${originalPrice.toFixed(2)}</p>` : ''}
                        ${discountBadge}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function calculateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
    const discount = calculateVoucherDiscount();
    const gstcharges = await api.getStoreConfig('FINALCHARGES') || [];
    const gst = gstcharges.reduce((total, charge) => {
        const percentage = parseFloat(charge.value.replace('%', '')) / 100;
        return total + (subtotal * percentage);
    }, 0);

    orderTotals = {
        subtotal,
        discount,
        charges: {
            gst,
            paymentCharge: selectedPayment?.value || 0,
            deliveryCharge: selectedDelivery?.value || 0
        },
        totalAmount: subtotal + gst + 
            (selectedPayment?.value || 0) + 
            (selectedDelivery?.value || 0) - 
            discount
    };

    updateTotalsDisplay();
}

function updateTotalsDisplay() {
    if (!orderTotals) return;

    document.getElementById('subtotal').textContent = `₹${orderTotals.subtotal.toFixed(2)}`;
    document.getElementById('tax').innerHTML = `
         <div class="flex justify-between">
                            <span>GST</span>
                            <span>₹${orderTotals.charges.gst.toFixed(2)}</span>
                        </div>
    `;

    document.getElementById('payment-charge').textContent = `₹${orderTotals.charges.paymentCharge.toFixed(2)}`;
    document.getElementById('delivery-charge').textContent = `₹${orderTotals.charges.deliveryCharge.toFixed(2)}`;
    document.getElementById('discount').textContent = `-₹${orderTotals.discount.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${orderTotals.totalAmount.toFixed(2)}`;
}

async function applyVoucher() {
    const code = document.getElementById('voucher-code').value.trim();
    
    if (!code) {
        showVoucherMessage('Please enter a voucher code', 'error');
        return;
    }

    try {
        // If there's already an applied voucher, clear it first
        if (appliedVoucher) {
            await clearVoucher(false); // Pass false to prevent showing "removed" message
        }

        const cartData = {
            items: cartItems.map(item => ({
                book: item.book._id,
                quantity: item.quantity
            })),
            subtotal: calculateSubtotal()
        };

        const voucherResult = await api.validateVoucher(code, cartData);
        appliedVoucher = voucherResult;
        displayVoucherDetails(voucherResult);
        await calculateTotals();
        showVoucherMessage('Voucher applied successfully!', 'success');
        renderCartItems();

    } catch (error) {
        showVoucherMessage(error.message || 'Invalid voucher code', 'error');
        appliedVoucher = null;
        await calculateTotals();
    }
}

async function clearVoucher(showMessage = true) {
    appliedVoucher = null;
    document.getElementById('voucher-code').value = '';
    displayVoucherDetails(null);
    await calculateTotals();
    renderCartItems();
    if (showMessage) {
        showVoucherMessage('Voucher removed', 'info');
    }
}

function displayVoucherDetails(voucher) {
    const detailsEl = document.getElementById('voucher-details');
    if (!detailsEl) return;

    if (!voucher) {
        detailsEl.innerHTML = '';
        selectedComplimentaryItems = [];
        return;
    }

    const details = getVoucherDescription(voucher);
    const restrictions = getVoucherRestrictions(voucher);

    detailsEl.innerHTML = `
        <div class="p-3 bg-green-50 rounded-lg relative">
            <div class="pr-8">
                <p class="text-green-700 font-medium">${details}</p>
                ${restrictions ? `<p class="text-sm text-green-600 mt-1">${restrictions}</p>` : ''}
                ${voucher.type === 'complimentary' ? `
                    <div class="mt-3">
                        <button onclick="showComplimentaryItemSelector()" 
                                class="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Select Free Items (${selectedComplimentaryItems.length}/${voucher.complimentaryConfig.quantity})
                        </button>
                        <div id="selected-items" class="mt-2">
                            ${renderSelectedComplimentaryItems()}
                        </div>
                    </div>
                ` : ''}
            </div>
            <button onclick="clearVoucher()" 
                    class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear voucher">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

async function showComplimentaryItemSelector() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.id = 'complimentary-modal';

    const { minPrice, maxPrice, quantity } = appliedVoucher.complimentaryConfig;
    const remaining = quantity - selectedComplimentaryItems.length;

    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] flex flex-col relative mx-4">
            <div class="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                    <h3 class="text-xl font-bold text-gray-800">Select Your Free Items</h3>
                    <p class="text-sm text-gray-600 mt-1">Choose ${remaining} item(s) between ₹${minPrice} - ₹${maxPrice}</p>
                </div>
                <button onclick="closeComplimentaryModal()" 
                        class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <i class="fas fa-times text-gray-400 hover:text-red-600"></i>
                </button>
            </div>
            
            <div class="mb-4 relative">
                <input type="text" 
                       id="item-search" 
                       placeholder="Search items..." 
                       class="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div id="eligible-items" class="flex-1 overflow-y-auto min-h-[300px] relative">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
            </div>

            <div class="flex justify-between items-center mt-6 pt-4 border-t">
                <p class="text-sm text-gray-600">
                    <span class="font-medium">${selectedComplimentaryItems.length}</span> of 
                    <span id="mdquantity" class="font-medium">${quantity}</span> items selected
                </p>
                <button onclick="closeComplimentaryModal()" 
                        class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Done
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadEligibleItems(minPrice, maxPrice);
}

async function loadEligibleItems(minPrice, maxPrice) {
    try {
        const response = await api.getBooks({ minPrice, maxPrice, inStock: true });
        const books = Array.isArray(response.books) ? response.books : [];
        
        const container = document.getElementById('eligible-items');
        if (!books.length) {
            container.innerHTML = `
                <div class="text-center p-8">
                    <i class="fas fa-box-open text-gray-300 text-4xl mb-4"></i>
                    <p class="text-gray-500">No eligible items found in this price range.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
                ${books.filter(book => book.stock > 0).map(book => `
                    <div class="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow ${
                        selectedComplimentaryItems.some(item => item._id === book._id) ? 'bg-green-50 border-green-200' : 'bg-white'
                    }">
                        <img src="${book.images?.[0]?.url || '/assets/default-product.png'}" 
                             class="w-20 h-28 object-cover rounded-md shadow-sm" 
                             alt="${book.title}">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-medium text-gray-900 truncate mb-1">${book.title}</h4>
                            <p class="text-red-600 font-medium mb-2">₹${book.price.toFixed(2)}</p>
                            <button onclick="toggleComplimentaryItem(${JSON.stringify({
                                _id: book._id,
                                title: book.title,
                                price: book.price,
                                image: book.images?.[0]?.url
                            }).replace(/"/g, '&quot;')})"
                                    class="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedComplimentaryItems.some(item => item._id === book._id)
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }">
                                ${selectedComplimentaryItems.some(item => item._id === book._id)
                                    ? '<i class="fas fa-times mr-2"></i>Remove'
                                    : '<i class="fas fa-plus mr-2"></i>Select'}
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add search functionality
        document.getElementById('item-search')?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('#eligible-items > div > div').forEach(item => {
                const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
                item.style.display = title.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    } catch (error) {
        console.error('Error loading eligible items:', error);
        const container = document.getElementById('eligible-items');
        if (container) {
            container.innerHTML = `
                <div class="text-center p-8">
                    <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <p class="text-red-500 mb-4">Failed to load items</p>
                    <button onclick="loadEligibleItems(${minPrice}, ${maxPrice})" 
                            class="text-red-600 hover:text-red-700 font-medium">
                            <i class="fas fa-redo mr-2"></i>Try Again
                    </button>
                </div>
            `;
        }
    }
}

function toggleComplimentaryItem(book) {
    const maxItems = appliedVoucher.complimentaryConfig.quantity;
    const existingIndex = selectedComplimentaryItems.findIndex(item => item._id === book._id);
    
    if (existingIndex >= 0) {
        selectedComplimentaryItems.splice(existingIndex, 1);
    } else {
        const totalQuantity = selectedComplimentaryItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (totalQuantity < maxItems) {
            selectedComplimentaryItems.push({ ...book, quantity: 1 });
        } else {
            alert(`You can only select total ${maxItems} free item(s)`);
            return;
        }
    }
    
    updateComplimentaryUI();
    updateComplimentaryButtonCount(); // Add this line
}

// Add this new function
function updateComplimentaryButtonCount() {
    const totalQuantity = selectedComplimentaryItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const maxItems = appliedVoucher?.complimentaryConfig?.quantity || 0;
    
    const selectButton = document.querySelector('button[onclick="showComplimentaryItemSelector()"]');
    if (selectButton) {
        selectButton.innerHTML = `Select Free Items (${totalQuantity}/${maxItems})`;
    }
}

function updateComplimentaryUI() {
    // Update modal count
    const totalQuantity = selectedComplimentaryItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const quantity = appliedVoucher.complimentaryConfig.quantity;
    
    const countDisplay = document.querySelector('#complimentary-modal .text-sm.text-gray-600');
    if (countDisplay) {
        countDisplay.innerHTML = `
            <span class="font-medium">${totalQuantity}</span> of 
            <span class="font-medium">${quantity}</span> items selected
        `;
    }

    // Update main voucher display
    const selectedItemsDiv = document.getElementById('selected-items');
    if (selectedItemsDiv) {
        selectedItemsDiv.innerHTML = renderSelectedComplimentaryItems();
    }

    // Update the select button count
    updateComplimentaryButtonCount();

    // Refresh eligible items display
    loadEligibleItems(
        appliedVoucher.complimentaryConfig.minPrice,
        appliedVoucher.complimentaryConfig.maxPrice
    );
}

function updateItemQuantity(itemId, newQuantity) {
    const totalOtherQuantity = selectedComplimentaryItems
        .filter(item => item._id !== itemId)
        .reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const maxItems = appliedVoucher.complimentaryConfig.quantity;
    
    if (totalOtherQuantity + newQuantity > maxItems) {
        alert(`Total quantity cannot exceed ${maxItems}`);
        // Reset the select element to previous value
        const selectElement = event.target;
        const item = selectedComplimentaryItems.find(item => item._id === itemId);
        if (item && selectElement) {
            selectElement.value = item.quantity;
        }
        return;
    }

    const item = selectedComplimentaryItems.find(item => item._id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateComplimentaryUI();
    }
}

function renderSelectedComplimentaryItems() {
    if (!selectedComplimentaryItems.length) return '';
    
    return `
        <div class="space-y-2">
            ${selectedComplimentaryItems.map(item => `
                <div class="flex items-center justify-between gap-2 p-2 bg-green-50 rounded">
                    <div class="flex items-center gap-2 flex-1">
                        <img src="${item.image || '/assets/default-product.png'}" 
                             class="w-8 h-8 object-cover rounded" 
                             alt="${item.title}">
                        <span class="text-sm text-gray-600 flex-1">${item.title}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <select onchange="updateItemQuantity('${item._id}', parseInt(this.value))"
                                class="border rounded px-2 py-1 text-sm">
                            ${Array.from({length: appliedVoucher.complimentaryConfig.quantity}, (_, i) => i + 1).map(num => `
                                <option value="${num}" ${item.quantity === num ? 'selected' : ''}>
                                    ${num}
                                </option>
                            `).join('')}
                        </select>
                        <button onclick="toggleComplimentaryItem(${JSON.stringify(item).replace(/"/g, '&quot;')})"
                                class="text-red-500 hover:text-red-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function closeComplimentaryModal() {
    document.getElementById('complimentary-modal')?.remove();
}

async function loadSavedAddresses() {
    try {
        const addresses = await api.getAddresses();
        const select = document.getElementById('saved-addresses');

        addresses.forEach(addr => {
            const option = document.createElement('option');
            option.value = addr._id;
            option.textContent = `${addr.label}: ${addr.street}, ${addr.city}`;
            if (addr.isDefault) {
                option.selected = true;
                fillAddressForm(addr);
            }
            select.appendChild(option);
        });

        // Add event listener for address selection
        select.addEventListener('change', async (e) => {
            if (!e.target.value) {
                document.getElementById('shipping-form').reset();
                return;
            }
            const addresses = await api.getAddresses();
            const selectedAddress = addresses.find(addr => addr._id === e.target.value);
            if (selectedAddress) {
                fillAddressForm(selectedAddress);
            }
        });
    } catch (error) {
        console.error('Error loading addresses:', error);
    }
}

function fillAddressForm(address) {
    const form = document.getElementById('shipping-form');
    form.elements.street.value = address.street || '';
    form.elements.city.value = address.city || '';
    form.elements.state.value = address.state || '';
    form.elements.zipCode.value = address.zipCode || '';
    form.elements.country.value = address.country || '';
    form.elements.contactNumber.value = address.contactNumber || '';
}

function validateShippingForm() {
    const form = document.getElementById('shipping-form');
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country', 'contactNumber'];

    for (const field of requiredFields) {
        const input = form.elements[field];
        if (!input || !input.value.trim()) {
            return false;
        }
    }
    return true;
}


async function placeOrder()
{
   if (!selectedDelivery) {
        alert('Please select a delivery method');
        return;
    }

    if(!selectedPayment) {
        alert('Please select a payment method');
        return;
    }

    if (!validateShippingForm()) {
        alert('Please fill in all required shipping fields');
        return;
    }

    // Proceed with order placement
    if (selectedPayment?.name.toLowerCase() === 'razorpay') {
        await placeRazorpayOrder();
    } else {
        await placeCodOrder();
    }
}


async function placeRazorpayOrder() {
    
    const shippingAddress = getShippingAddress();

    try {
        // Save address if checkbox is checked
        if (document.getElementById('save-address').checked) {
            await api.addAddress({
                label: 'Shipping Address',
                ...shippingAddress
            });
        }
        showLoader();

        const response = await fetch('/api/orders/create-pay-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                shippingAddress,
                paymentMethod: selectedPayment?.name || 'razorpay',
                shippingMethod: selectedDelivery?.name || 'standard',
                charges: {
                    subtotal: orderTotals.subtotal,
                    gst: orderTotals.charges.gst,
                    paymentCharge: selectedPayment?.value || 0,
                    deliveryCharge: selectedDelivery?.value || 0,
                    totalAmount: orderTotals.totalAmount
                },
                ...(appliedVoucher && {
                    appliedVoucher: {
                        id: appliedVoucher._id,
                        code: appliedVoucher.code,
                        discountType: appliedVoucher.type,
                        discount: orderTotals.discount,
                        complimentaryItems: selectedComplimentaryItems.map(item => ({
                            bookId: item._id,
                            name: item.title,
                            price: item.price,
                            quantity: item.quantity || 1
                        }))
                    }
                })
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        console.log('Razorpay Order Details:', data);
        const { razorpayOrder } = data;
        hideLoader();

        const options = {
            key: razorpayOrder.key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: razorpayOrder.companyName || 'Your Company Name',
            image: razorpayOrder.companyLogo || 'https://example.com/logo.png',
            description: razorpayOrder.description || 'Your Order Description', 
            order_id: razorpayOrder.id,
            // payment_capture: 1,
            handler: async function (response) {
                showLoader();
                try {
                    window.location.href = `/order-confirmation.html?orderId=${data.order._id}&paymentId=${response.razorpay_payment_id}`;
                } catch (error) {
                    hideLoader();
                    alert('Payment verification failed. Please contact support.');
                }
            },
            prefill: {
                name: shippingAddress.name || '',
                contact: shippingAddress.contactNumber || '',
            },
            theme: {
                color: '#dc2626'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (error) {
        hideLoader();
        alert(error.message || 'Failed to create order');
    }
}



async function placeCodOrder() {
    showLoader();
    try {
        const shippingAddress = getShippingAddress();
        const response = await api.createOrder({
            shippingAddress,
            paymentMethod: 'cod',
            shippingMethod: selectedDelivery?.name || 'standard',
            charges: {
                subtotal: orderTotals.subtotal,
                gst: orderTotals.charges.gst,
                paymentCharge: selectedPayment?.value || 0,
                deliveryCharge: selectedDelivery?.value || 0,
                totalAmount: orderTotals.totalAmount
            },
            ...(appliedVoucher && {
                appliedVoucher: {
                    id: appliedVoucher._id,
                    code: appliedVoucher.code,
                    discountType: appliedVoucher.type,
                    discount: orderTotals.discount,
                    complimentaryItems: selectedComplimentaryItems.map(item => ({
                        bookId: item._id,
                        name: item.title,
                        price: item.price,
                        quantity: item.quantity || 1
                    }))
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        console.log('COD Order Details:', data);
        hideLoader();

        window.location.href = `/order-confirmation.html?orderId=${data._id}`;
    } catch (error) {
        hideLoader();
        alert(error.message || 'Failed to create order');
    }
}


async function loadDeliveryOptions() {
    try {
        const deliveryOptions = await api.getStoreConfig('DELIVERY');
        const container = document.getElementById('delivery-options');
        if (!deliveryOptions.length) {
            container.innerHTML = '<p class="text-red-500">No delivery options available</p>';
            return;
        }

        container.innerHTML = deliveryOptions.map(option => `
            <div class="flex items-center">
                <input type="radio" name="delivery" id="delivery-${option._id}" 
                       value="${option._id}" class="mr-3"
                       onchange="updateDeliveryMethod('${option._id}', ${option.value}, '${option.name}')">
                <label for="delivery-${option._id}">
                    <span class="font-medium">${option.name}</span>
                    <span class="text-sm text-gray-500 ml-2">₹${option.value}</span>
                </label>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading delivery options:', error);
        document.getElementById('delivery-options').innerHTML =
            '<p class="text-red-500">Failed to load delivery options</p>';
    }
}

async function loadPaymentOptions() {
    try {
        const paymentOptions = await api.getStoreConfig('PAYMENTTYPE');
        const container = document.getElementById('payment-options');
        if (!paymentOptions.length) {
            container.innerHTML = '<p class="text-red-500">No payment options available</p>';
            return;
        }

        container.innerHTML = paymentOptions.map(option => `
            <div class="flex items-center">
                <input type="radio" name="payment" id="payment-${option._id}" 
                       value="${option._id}" class="mr-3"
                       onchange="updatePaymentMethod('${option._id}', ${option.value}, '${option.name}')">
                <label for="payment-${option._id}">
                    <span class="font-medium">${option.name}</span>
                    <span class="text-sm text-gray-500 ml-2">₹${option.value}</span>
                </label>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading payment options:', error);
        document.getElementById('payment-options').innerHTML =
            '<p class="text-red-500">Failed to load payment options</p>';
    }
}

function updateDeliveryMethod(id, value, name) {
    selectedDelivery = { id, value, name };
    calculateTotals();
}

function updatePaymentMethod(id, value, name) {
    selectedPayment = { id, value, name };
    calculateTotals();
}

function getShippingAddress() {
    const form = document.getElementById('shipping-form');
    const formData = new FormData(form);
    
    return {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country'),
        contactNumber: formData.get('contactNumber')
    };
}

function loadSavedAddress() {
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const form = document.getElementById('shipping-form');
    Object.entries(savedAddress).forEach(([key, value]) => {
        const input = form.elements[key];
        if (input) input.value = value;
    });
}

function showVoucherMessage(message, type = 'success') {
    const messageEl = document.getElementById('voucher-message');
    if (!messageEl) return;

    const colors = {
        success: 'text-green-600',
        error: 'text-red-600',
        info: 'text-gray-600'
    };

    messageEl.innerHTML = `<p class="${colors[type]} text-sm">${message}</p>`;
    setTimeout(() => {
        messageEl.innerHTML = '';
    }, 3000);
}

function calculateSubtotal() {
    return cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
}

function calculateVoucherDiscount() {
    if (!appliedVoucher) return 0;

    switch (appliedVoucher.type) {
        case 'percentage': {
            const baseDiscount = (orderTotals.subtotal * appliedVoucher.value) / 100;
            return appliedVoucher.maxDiscount ? 
                Math.min(baseDiscount, appliedVoucher.maxDiscount) : baseDiscount;
        }
        case 'fixed':
            return Math.min(appliedVoucher.value, orderTotals.subtotal);
        case 'complimentary':
            // Handle complimentary items separately
            return 0;
        default:
            return 0;
    }
}

document.addEventListener('DOMContentLoaded', initCheckout);
