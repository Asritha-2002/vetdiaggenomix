async function loadLayoutComponents() {
    try {
        // Load header
        const headerResponse = await fetch('/components/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerHtml;

        // Load cart sidebar
        const cartResponse = await fetch('/components/cart-sidebar.html');
        const cartHtml = await cartResponse.text();
        document.getElementById('cart-placeholder').innerHTML = cartHtml;

        // Initialize auth state
        if (auth.isAuthenticated()) {
            updateAuthUI();
            updateCart();
        }
    } catch (error) {
        console.error('Error loading layout components:', error);
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', loadLayoutComponents);
