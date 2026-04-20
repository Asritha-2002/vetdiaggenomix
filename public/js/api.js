const API_URL = '/api';

const api = {
    // Auth APIs
    register: async (userData) => {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    signup: async (userData) => {
        const response = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (response.status === 400) {
            const error = await response.json();
            if (error.message && error.message.includes("duplicate key error collection")) {
                alerts.showMainAlert('Email already exists. Please use a different email.', 'error');
                return;
            }
            alerts.showMainAlert('Invalid data. Please check your input.', 'error');
            return;
        }
        if (response.status === 200 || response.status === 201) {
            alerts.showMainAlert('Registration successful! Please check your email for verification.', 'success', 5000);
            return;
        }
        if (response.status === 500) {
            alerts.showMainAlert('Server error. Please try again later.', 'error');
            return;
        }
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (response.status === 400) {
            const error = await response.json();
            if (error.message === "Please verify your email first") {
                alerts.showMainAlert('Please check your email and verify your account before logging in!', 'error', 5000);
                return;
            }
            alerts.showMainAlert('Invalid email or password. Please try again.', 'error');
            return;
        }

        if (response.status === 200 ){
            alerts.showMainAlert('Login successful!', 'success', 5000);
            return response.json();
        }

        return response.json();
    },

    // Book APIs
    getBooks: async (params = {}) => {
        try {
            const query = new URLSearchParams(params).toString();
            const response = await fetch(`${API_URL}/books?${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            return {
                books: data,
                totalPages: Math.ceil(data.length / params.limit || 12)
            };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    getBookDetails: async (id) => {
        const response = await fetch(`${API_URL}/books/${id}`);
        return response.json();
    },

    getProducts: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();
            // Add filters to query params
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value);
                }
            });

            const response = await fetch(`${API_URL}/books/products?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    getCategoryImage: async (cat) => {
        const response = await fetch(`${API_URL}/books/category-image/${cat}`);
        if (!response.ok) {
            throw new Error('Failed to fetch category image');
        }
        return response.json();
    },

    getMostViewed: async () => {
        const response = await fetch(`${API_URL}/books/most-viewed`);
        return response.json();
    },

    getBestsellers: async () => {
        const response = await fetch(`${API_URL}/books/bestsellers`);
        return response.json();
    },

    // Cart APIs
    getCart: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    addToCart: async (bookId, quantity = 1) => {
        const response = await fetch('/api/users/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`

             },
            body: JSON.stringify({ bookId, quantity })
        });

        if (response.status === 401) {
            toggleModal('login-modal');
            return;
        }
        if (response.status === 200) {
            if (!isCartOpen()) {
                toggleCart();
            }
            return;
        }


        return response.json();
    },

    updateCartItem: async (itemId, quantity) => {
        const response = await fetch(`/api/users/cart/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity: quantity.quantity })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update cart');
        }
        
        return response.json();
    },

    async removeFromCart(itemId) {
        const response = await fetch(`/api/users/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to remove item from cart');
        }
        
        return response.json();
    },

    // Order APIs
    createOrder: async (orderData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders/create-cod-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        return response;
    },

    getOrders: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    async getOrder(orderId) {
        
        const response = await fetch(`/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch order details');
        }

        return response.json();
    },

    async calculateOrderTotals(data) {
        try {
            const response = await fetch(`${API_URL}/orders/calculate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to calculate order totals');
            return response.json();
        } catch (error) {
            console.error('Error calculating order totals:', error);
            throw error;
        }
    },

    async validateVoucher(code, cartData) {
        try {
            if (!code || !cartData) {
                throw new Error('Invalid voucher data');
            }

            const response = await fetch(`${API_URL}/vouchers/${code}/validate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    items: cartData.items?.map(item => ({
                        book: item.book._id,
                        quantity: item.quantity
                    })),
                    subtotal: cartData.subtotal
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Invalid voucher code');
            }

            return response.json();
        } catch (error) {
            console.error('Error validating voucher:', error);
            throw error;
        }
    },

    async getAvailableVouchers() {
        try {
            const response = await fetch(`${API_URL}/vouchers/available`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch vouchers');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            return [];
        }
    },

    // User Profile APIs
    getProfile: async () => {
        if (!localStorage.getItem('token') || localStorage.getItem('token') === 'undefined') {
            console.log('No token found, redirecting to login');
            alerts.showMainAlert('Please check your email and verify your account before placing an order!', 'warning');
            return;
        }
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    updateProfile: async (userData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    

    updatePassword: async (passwords) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/password`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwords)
        });
        return response.json();
    },

    forgotPassword: async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send reset link');
        }
        
        return response.json();
    },

    resetPassword: async (token, password) => {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }
        
        return response.json();
    },

    async updateEmailPreferences(preferences) {
        try {
            const response = await fetch(`${API_URL}/users/preferences`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferences)
            });
            if (!response.ok) throw new Error('Failed to update preferences');
            return response.json();
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    },

    // Address APIs
    getAddresses: async () => {
        try {
            const response = await fetch(`${API_URL}/users/addresses`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch addresses');
            return response.json();
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    },

    addAddress: async (addressData) => {
        try {
            const response = await fetch(`${API_URL}/users/addresses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
            if (!response.ok) throw new Error('Failed to add address');
            return response.json();
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    updateAddress: async (addressId, addressData) => {
        try {
            const response = await fetch(`${API_URL}/users/addresses/${addressId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
            if (!response.ok) throw new Error('Failed to update address');
            return response.json();
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    setDefaultAddress: async (addressId) => {
        try {
            const response = await fetch(`${API_URL}/users/addresses/${addressId}/default`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to set default address');
            return response.json();
        } catch (error) {
            console.error('Error setting default address:', error);
            throw error;
        }
    },

    // Favorites APIs 
    getFavorites: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    toggleFavorite: async (bookId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/favorites/${bookId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    // Get marketing assets by type
    getMarketingAssets: async (type) => {
        try {
            const url = `${API_URL}/marketing${type ? '/active/' + type : ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch marketing assets');
            }
            const data = await response.json();
            // For banner type, we want to ensure we always return an array
            return Array.isArray(data) ? data : [data];
        } catch (error) {
            console.error('Error fetching marketing assets:', error);
            return [];
        }
    },

    getCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/books/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
    getCategoryBooks: async (categoryId) => {
        const response = await fetch(`${API_URL}/books/categories/${categoryId}/books`);
        return response.json();
    },
    getBookById: async (id) => {
        const response = await fetch(`${API_URL}/books/${id}`);
        return response.json();
    },

    async getRelatedProducts(category, currentProductId) {
        try {
            const response = await fetch(`/api/books?category=${category}&exclude=${currentProductId}&limit=4`);
            if (!response.ok) throw new Error('Failed to fetch related products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching related products:', error);
            return [];
        }
    },

    async getProductVouchers(productId) {
        try {
            const response = await fetch(`${API_URL}/vouchers/product/${productId}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch vouchers');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            return []; // Return empty array instead of throwing error
        }
    },

    // Charges APIs
    async getCharges() {
        try {
            const response = await fetch(`${API_URL}/charges`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch charges');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching charges:', error);
            throw error;
        }
    },

    async getStoreConfig(category = null) {
        try {
            const url = category ? 
                `${API_URL}/shop-details/cat/${category}` :
                `${API_URL}/store-config`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch store configuration');
            }
            const data = await response.json();
            return data.details || data; // Handle both formats
        } catch (error) {
            console.error('Error fetching store config:', error);
            throw error;
        }
    },

    async getAdminOrders(status = '') {
        const response = await fetch(`${API_URL}/admin/orders${status ? `?status=${status}` : ''}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch orders');
        }

        return response.json();
    },

    async updateOrderStatus(orderId, status) {
        const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update order status');
        }

        return response.json();
    },

    async forgotPassword(email) {
        const response = await fetch('/api/users/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send reset link');
        }
        
        return response.json();
    },

    async resetPassword(token, password) {
        const response = await fetch('/api/users/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }
        
        return response.json();
    },

    async verifyEmail(token) {
        const response = await fetch('/api/users/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to verify email');
        }
        
        return response.json();
    }
};
