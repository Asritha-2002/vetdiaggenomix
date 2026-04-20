async function updateCart() {
    try {
        console.log('Starting updateCart function');
        const cartItems = document.getElementById('cart-items');
        
        if (!cartItems) {
            console.error('Cart items container not found');
            return;
        }

        if (!auth.isAuthenticated()) {
            console.log('User not authenticated, skipping cart fetch');
            cartItems.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center p-8">
                    <i class="fas fa-shopping-bag text-red-100 text-5xl mb-4"></i>
                    <p class="text-gray-500 mb-2">Please login to view your cart</p>
                    <button onclick="toggleModal('login-modal')" class="mt-4 text-red-600 hover:text-red-700">
                        Login Now
                    </button>
                </div>`;
            return;
        }

        // Show loading state
        cartItems.innerHTML = `
            <div class="flex justify-center items-center h-48">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>`;

        // Get cart with populated book data
        const cart = await api.getCart();
        console.log('Cart data:', cart);

        if (!cart || !cart.items || !Array.isArray(cart.items)) {
            throw new Error('Invalid cart data structure');
        }

        // Update UI elements
        const headerCartCount = document.querySelector('header span#cart-count');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        const itemCount = cart.items.length;

        // Handle empty cart
        if (itemCount === 0) {
            headerCartCount.textContent = '0';
            cartCount.textContent = '0 items';
            cartTotal.textContent = '₹0.00';
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
            cartItems.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center p-8">
                    <i class="fas fa-shopping-bag text-red-100 text-5xl mb-4"></i>
                    <p class="text-gray-500 mb-2">Your cart is empty</p>
                    <p class="text-sm text-gray-400">Add items to get started</p>
                    <a href="/#products" class="mt-4 text-red-600 hover:text-red-700">
                        Continue Shopping
                    </a>
                </div>`;
            return;
        }

        // Update counts
        headerCartCount.textContent = itemCount.toString();
        cartCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

        // Enable checkout if there are items
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        // Calculate total using proper schema structure
        const total = cart.items.reduce((sum, item) => {
            return sum + (Number(item.book?.price || 0) * Number(item.quantity || 0));
        }, 0);

        cartTotal.textContent = `₹${total.toLocaleString('en-IN', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        })}`;

        // Render items
        cartItems.innerHTML = cart.items.map(item => renderCartItem(item)).join('');

    } catch (error) {
        console.error('Error in updateCart:', error);
        const cartItems = document.getElementById('cart-items');
        const headerCartCount = document.querySelector('header span#cart-count');
        
        if (headerCartCount) headerCartCount.textContent = '0';
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="flex flex-col items-center justify-center h-48 text-center">
                    <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-2"></i>
                    <p class="text-gray-500">Error loading cart</p>
                    <p class="text-sm text-red-500 mt-1">${error.message || 'Unknown error occurred'}</p>
                    <button onclick="updateCart()" class="mt-2 text-red-600 hover:text-red-700">
                        Try Again
                    </button>
                </div>`;
        }
    }
}



const renderCartItem = (item) => {
    const quantity = Number(item.quantity || 0);
    const price = Number(item.book?.price || 0);
    
    return `
        <div class="cart-item rounded-xl p-4 flex gap-4 items-center bg-white hover:shadow-md transition-all duration-300"
             data-book-id="${item.book?._id}">
            <div class="relative group">
                <img src="${item.book?.images?.[0]?.url || '/assets/default-product.png'}" 
                     alt="${item.book?.title}" 
                     class="w-20 h-24 object-cover rounded-lg shadow-sm">
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <a href="/book/${item.book?._id}" class="text-white text-sm hover:underline">View Details</a>
                </div>
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-800 truncate">${item.book?.title}</h3>
                <p class="text-red-600 font-medium mt-1" data-item-price data-price="${price}">
                    ₹${price.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </p>
                <div class="flex items-center gap-3 mt-2">
                    <div class="flex items-center border rounded-full overflow-hidden">
                        <button onclick="event.preventDefault(); updateQuantity('${item._id}', ${quantity - 1})"
                                class="px-3 py-1 hover:bg-gray-100 text-gray-600 focus:outline-none"
                                ${quantity <= 1 ? 'disabled' : ''}>
                            -
                        </button>
                        <span class="px-3 py-1 border-x text-sm font-medium" data-quantity-display>${quantity}</span>
                        <button onclick="event.preventDefault(); updateQuantity('${item._id}', ${quantity + 1})"
                                class="px-3 py-1 hover:bg-gray-100 text-gray-600 focus:outline-none"
                                ${quantity >= (item.book?.stock || 0) ? 'disabled' : ''}>
                            +
                        </button>
                    </div>
                    <p class="text-sm text-gray-500" data-item-total>
                        Total: ₹${(price * quantity).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </p>
                </div>
                ${item.book?.stock <= 5 ? `
                    <p class="text-xs text-red-500 mt-1">
                        Only ${item.book.stock} left in stock!
                    </p>
                ` : ''}
            </div>
            <button onclick="removeFromCart('${item.book?._id}')" 
                    class="p-2 hover:bg-red-50 rounded-full transition-colors group self-start"
                    title="Remove item">
                <i class="fas fa-trash text-gray-400 group-hover:text-red-600"></i>
            </button>
        </div>
    `;
};


async function updateQuantity(itemId, quantity) {
    const quantityDisplay = document.querySelector(`[data-quantity-display]`);
    const itemTotal = document.querySelector(`[data-item-total]`);
    const itemPrice = document.querySelector(`[data-item-price]`);

    if (quantityDisplay) {
        quantityDisplay.textContent = quantity;
    }

    if (itemTotal && itemPrice) {
        const price = Number(itemPrice.getAttribute('data-price'));
        itemTotal.textContent = `Total: ₹${(price * quantity).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    try {
        await api.updateCartItem(itemId, quantity);
        await updateCart();
    } catch (error) {
        console.error('Error updating cart item:', error);
        alert(error.message || 'Failed to update cart item');
    }
}

async function addToCart(bookId) {
    if (!auth.isAuthenticated()) {
        toggleModal('login-modal');
        return;
    }
    
    try {
        const button = document.querySelector(`button[onclick="addToCart('${bookId}')"]`);
        if (button) {
            button.disabled = true;
            button.innerHTML = `<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>`;
        }

        await api.addToCart(bookId);
        await updateCart();
        toggleCart();
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert(error.message || 'Failed to add item to cart');
    } finally {
        const button = document.querySelector(`button[onclick="addToCart('${bookId}')"]`);
        if (button) {
            button.disabled = false;
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add
            `;
        }
    }
}

async function removeFromCart(itemId) {
    try {
        console.log('Removing book from cart:', itemId);
        await api.removeFromCart(itemId);
        await updateCart();
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert(error.message || 'Failed to remove item');
    }
}

async function checkout() {
    window.location.href = '/checkout';
}

// Initialize cart with debug logging
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('Auth state:', auth.isAuthenticated() ? 'authenticated' : 'not authenticated');
    if (auth.isAuthenticated()) {
        console.log('Initializing cart...');
        updateCart();
    }
});

// Listen for auth state changes
window.addEventListener('auth-changed', () => {
    if (auth.isAuthenticated()) {
        updateCart();
    } else {
        // Reset cart UI when logged out
        const headerCartCount = document.querySelector('header span#cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (headerCartCount) headerCartCount.textContent = '0';
        if (cartCount) cartCount.textContent = '0 items';
        if (cartTotal) cartTotal.textContent = '₹0.00';
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-center p-8">
                    <i class="fas fa-shopping-bag text-red-100 text-5xl mb-4"></i>
                    <p class="text-gray-500 mb-2">Please login to view your cart</p>
                    <button onclick="toggleModal('login-modal')" class="mt-4 text-red-600 hover:text-red-700">
                        Login Now
                    </button>
                </div>`;
        }
    }
});
