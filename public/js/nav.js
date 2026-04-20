
// Auth functions
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('hidden');
}

function switchModal(closeId, openId) {
    toggleModal(closeId);
    toggleModal(openId);
}

// Cart functions
function toggleCart() {
    const cart = document.getElementById('cart-sidebar');
    cart.classList.toggle('translate-x-full');
}

async function updateCart() {
    try {
        
        const cartData = await api.getCart();
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const headerCartCount = document.querySelector('header span#cart-count');
        const cartTotal = document.getElementById('cart-total');

        if (!cartData || !cartData.items) {
            cartCount.textContent = '0 items';
            headerCartCount.textContent = '0';
            cartTotal.textContent = '₹0.00';
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
            return;
        }

        const itemCount = cartData.items.length;
        cartCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
        headerCartCount.textContent = itemCount.toString();
        cartTotal.textContent = `₹${cartData.items.reduce((total, item) => 
            total + (item.book.price * item.quantity), 0).toFixed(2)}`;

        cartItemsContainer.innerHTML = cartData.items.map(item => `
            <div class="flex gap-4 mb-4">
                <img src="${item.book.images[0]? item.book.images[0].url : '/assets/default-product.png'}" 
                     alt="${item.book.title}" class="w-24 h-32 object-cover rounded-lg"/>
                <div class="flex-1">
                    <h3 class="font-medium">${item.book.title}</h3>
                    <p class="text-gray-600">₹${item.book.price}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="updateQuantity('${item._id}', ${item.quantity - 1})" class="text-gray-500">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item._id}', ${item.quantity + 1})" class="text-gray-500">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item._id}')" class="text-red-600">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}


async function updateQuantity(id, quantity) {
    try {
        if (quantity < 1) {
            await removeFromCart(id);
        } else {
            await api.updateCartItem(id, { quantity });
            await updateCart();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity. Please try again.');
    }
}
async function checkout() {
    window.location.href = '/checkout';
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    
    if (auth.isAuthenticated()) {
        updateCart();
    }

    // Setup form handlers
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await auth.login(Object.fromEntries(new FormData(e.target)));
            toggleModal('login-modal');
            updateCart();
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await auth.signup(Object.fromEntries(new FormData(e.target)));
            toggleModal('signup-modal');
            updateCart();
        } catch (error) {
            alert(error.message);
        }
    });
});