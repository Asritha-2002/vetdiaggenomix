const API_URL = '/api/admin';
const NAPI_URL = '/api';

const parseValidationError = (errorDetails) => {
    if (Array.isArray(errorDetails)) {
        return errorDetails.map(err => {
            if (err.field === 'productDetails' && err.message.includes('must be an array')) {
                return 'Product details must be provided as an array of items';
            }
            return `${err.field}: ${err.message}`;
        }).join(', ');
    }
    return errorDetails.message || 'Validation error occurred';
};

const adminApi = {
    
    // Auth
    login: async (credentials) => {
        try {
            const response = await fetch(`${NAPI_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            if (!response.ok) throw new Error('Login failed');
            return response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    // Books
    getBooks: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            
            // Add parameters to query string
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });
            
            const queryString = queryParams.toString();
            const url = queryString ? `${NAPI_URL}/books?${queryString}` : `${NAPI_URL}/books`;
            
            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
                }
            });
            if (!response.ok) throw new Error('Failed to fetch books');
            return response.json();
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    },

    getBooksWithPagination: async (params) => {
        try {
            const url = `${NAPI_URL}/books?${params.toString()}`;
            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
                }
            });
            if (!response.ok) throw new Error('Failed to fetch books');
            return response.json();
        } catch (error) {
            console.error('Error fetching books with pagination:', error);
            return {
                books: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalItems: 0,
                    hasNextPage: false,
                    hasPrevPage: false
                }
            };
        }
    },

    getBookVariants: async (productId) => {
        try {
            const response = await fetch(`${NAPI_URL}/books/${productId}/variants`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
                }
            });
            if (!response.ok) throw new Error('Failed to fetch product variants');
            return response.json();
        } catch (error) {
            console.error('Error fetching product variants:', error);
            return [];
        }
    },

    getBook: async (bookId) => {
        try {
            const response = await fetch(`${NAPI_URL}/books/${bookId}`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
                }
            });
            if (!response.ok) throw new Error('Failed to fetch book');
            return response.json();
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    },

    addBook: async (formData) => {
        try {
            // Enhanced debug logging
            console.log('Raw FormData contents:');
            for (let pair of formData.entries()) {
                console.log(`${pair[0]} (${typeof pair[1]}):`, pair[1]);
                if (pair[0] === 'productDetails') {
                    // Parse and re-stringify to ensure proper JSON format
                    const parsed = JSON.parse(pair[1]);
                    formData.set('productDetails', JSON.stringify(parsed));
                    console.log('Parsed productDetails:', parsed);
                }
            }

            const response = await fetch(`${API_URL}/books`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                if (errorResponse.error === 'Validation error') {
                    throw new Error(parseValidationError(errorResponse.details || errorResponse[0]));
                }
                throw new Error(errorResponse.message || 'Failed to add book');
            }
            return response.json();
        } catch (error) {
            if (error.name === 'SyntaxError') {
                console.error('JSON parsing error with productDetails:', error);
            }
            console.error('Error adding book:', error);
            throw error;
        }
    },

    deleteBook: async (bookId) => {
        try {
            const response = await fetch(`${API_URL}/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete book');
            return response.json();
        } catch (error) {
            console.error('Error deleting book:', error);
            throw error;
        }
    },

    updateBook: async (bookId, formData) => {
        try {
            const response = await fetch(`${API_URL}/books/${bookId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                if (errorResponse.error === 'Validation error') {
                    throw new Error(parseValidationError(errorResponse.details || errorResponse[0]));
                }
                throw new Error(errorResponse.message || 'Failed to update book');
            }
            return response.json();
        } catch (error) {
            console.error('Error updating book:', error);
            throw error;
        }
    },

    deleteBookImage: async (bookId, imageId) => {
        try {
            const response = await fetch(`${API_URL}/books/${bookId}/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete image');
            return response.json();
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    },

    deleteBookVideo: async (bookId, videoId) => {
        try {
            // Extract just the filename from the full path
            const filename = videoId.split('/').pop();
            
            console.log('Deleting video:', {
                bookId,
                filename
            });

            const response = await fetch(`${NAPI_URL}/admin/books/${bookId}/videos/${encodeURIComponent(filename)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete video');
            }

            return response.json();
        } catch (error) {
            console.error('Error deleting video:', error);
            throw error;
        }
    },

    // Orders
    getOrders: async (page = 1, limit = 50) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                throw new Error('Admin access required');
            }

            console.log('Fetching orders...');
            const response = await fetch(`${API_URL}/orders/ad?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || response.status === 403) {
                throw new Error('Admin access required');
            }

            if (!response.ok) {
                const error = await response.json();
                console.error('Server error:', error);
                throw new Error(error.message || 'Failed to fetch orders');
            }

            const data = await response.json();
            console.log('Orders fetched successfully:', data);
            return data;
        } catch (error) {
            console.error('Error in getOrders:', error);
            if (error.message === 'Admin access required') {
                // Handle unauthorized access specifically
                window.location.href = '/admin/login.html';
            }
            throw error;
        }
    },

    getOrderById: async function(orderId) {
        const response = await fetch(`${API_URL}/orders/ad/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`  // Changed to adminToken
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch order details');
        }

        return response.json();
    },


    updatePaymentStatus:async (orderId, paymentStatus) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/payment-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: paymentStatus.status, notes: paymentStatus.notes })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Server error:', error);
                throw new Error(error.message || 'Failed to update payment status');
            }

            const data = await response.json();
            console.log('Payment status updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    },

    updateOrderStatus: async (orderId, status, statusDetails = null) => {
        try {
            console.log(`Updating order ${orderId} to status: ${status}`);
            
            let requestBody = { status };
            
            // Handle different status detail types
            if (statusDetails) {
                if (status === 'shipped') {
                    requestBody.shippingDetails = statusDetails;
                } else if (status === 'cancelled') {
                    requestBody.cancellationDetails = statusDetails;
                } else if (status === 'refund-completed') {
                    requestBody.refundDetails = statusDetails;
                }
            }
            
            const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Server error:', error);
                throw new Error(error.message || 'Failed to update order status');
            }

            const data = await response.json();
            console.log('Order status updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Marketing
    getMarketingAssets: async () => {
        try {
            const response = await fetch(`${NAPI_URL}/marketing`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
                }
            });
            if (!response.ok) throw new Error('Failed to fetch marketing assets');
            return response.json();
        } catch (error) {
            console.error('Error fetching marketing assets:', error);
            return [];
        }
    },

    addMarketingAsset: async (formData) => {
        try {
            // Log FormData contents for debugging
            console.log('Marketing Asset FormData:');
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await fetch(`${NAPI_URL}/marketing`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    // Note: Don't set Content-Type here, it's set automatically for FormData
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to add marketing asset');
            }

            return response.json();
        } catch (error) {
            console.error('Error adding marketing asset:', error);
            throw error;
        }
    },

    updateMarketingAsset: async (assetId, formData) => {
        try {
            const response = await fetch(`${NAPI_URL}/marketing/${assetId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update marketing asset');
            }

            return response.json();
        } catch (error) {
            console.error('Error updating marketing asset:', error);
            throw error;
        }
    },

    deleteMarketingAsset: async (assetId) => {
        try {
            const response = await fetch(`${NAPI_URL}/marketing/${assetId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete marketing asset');
            return response.json();
        } catch (error) {
            console.error('Error deleting marketing asset:', error);
            throw error;
        }
    },

    // Stats
    getStats: async () => {
        try {
            const response = await fetch(`${API_URL}/stats`, {  // Changed from NAPI_URL to API_URL
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}` 
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch stats');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },

    // Users
    getUsers: async () => {
        try {
            const response = await fetch(`${API_URL}/users`, { // Changed from NAPI_URL to API_URL
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    // Vouchers
    getVouchers: async () => {
        try {
            const response = await fetch(`${API_URL}/vouchers`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch vouchers');
            return response.json();
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            return [];
        }
    },

    addVoucher: async (voucherData) => {
        try {
            const response = await fetch(`${API_URL}/vouchers`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voucherData)
            });
            if (!response.ok) throw new Error('Failed to add voucher');
            return response.json();
        } catch (error) {
            console.error('Error adding voucher:', error);
            throw error;
        }
    },

    updateVoucher: async (voucherId, voucherData) => {
        try {
            const response = await fetch(`${API_URL}/vouchers/${voucherId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voucherData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update voucher');
            }
            return response.json();
        } catch (error) {
            console.error('Error updating voucher:', error);
            throw error;
        }
    },    deleteVoucher: async (voucherId) => {
        try {
            const response = await fetch(`${API_URL}/vouchers/${voucherId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete voucher');
            return response.json();
        } catch (error) {
            console.error('Error deleting voucher:', error);
            throw error;
        }
    },

    toggleVoucherStatus: async (voucherId) => {
        try {
            const response = await fetch(`${API_URL}/vouchers/${voucherId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to toggle voucher status');
            }
            return response.json();
        } catch (error) {
            console.error('Error toggling voucher status:', error);
            throw error;
        }
    },

    // Additional Charges
    getCharges: async () => {
        try {
            const response = await fetch(`${API_URL}/charges`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch charges');
            return response.json();
        } catch (error) {
            console.error('Error fetching charges:', error);
            return [];
        }
    },

    addCharge: async (chargeData) => {
        try {
            const response = await fetch(`${API_URL}/charges`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chargeData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        } catch (error) {
            console.error('Error adding charge:', error);
            throw error;
        }
    },

    updateCharge: async (chargeId, chargeData) => {
        try {
            const response = await fetch(`${API_URL}/charges/${chargeId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(chargeData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            return response.json();
        } catch (error) {
            console.error('Error updating charge:', error);
            throw error;
        }
    },

    deleteCharge: async (chargeId) => {
        try {
            const response = await fetch(`${API_URL}/charges/${chargeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete charge');
            return response.json();
        } catch (error) {
            console.error('Error deleting charge:', error);
            throw error;
        }
    },

    // Shop Details
    async getShopDetails() {
        try {
            const response = await fetch(`${NAPI_URL}/admin/shop-details`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch shop details');
            return response.json();
        } catch (error) {
            console.error('Error fetching shop details:', error);
            throw error;
        }
    },

    async getShopDetail(id) {
        try {
            const response = await fetch(`${NAPI_URL}/admin/shop-details/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch shop detail');
            return response.json();
        } catch (error) {
            console.error('Error fetching shop detail:', error);
            throw error;
        }
    },

    async addShopDetail(data) {
        try {
            const response = await fetch(`${NAPI_URL}/admin/shop-details`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to add shop detail');
            return response.json();
        } catch (error) {
            console.error('Error adding shop detail:', error);
            throw error;
        }
    },

    async updateShopDetail(id, data) {
        try {
            const response = await fetch(`${NAPI_URL}/admin/shop-details/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update shop detail');
            return response.json();
        } catch (error) {
            console.error('Error updating shop detail:', error);
            throw error;
        }
    },

    async deleteShopDetail(id) {
        try {
            const response = await fetch(`${NAPI_URL}/admin/shop-details/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete shop detail');
            return response.json();
        } catch (error) {
            console.error('Error deleting shop detail:', error);
            throw error;
        }
    },

    // Other Stores
    getOtherStores: async () => {
        try {
            const response = await fetch(`${API_URL}/other-stores`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch stores');
            return response.json();
        } catch (error) {
            console.error('Error fetching stores:', error);
            return [];
        }
    },

    getOtherStoreById: async (storeId) => {
        try {
            const response = await fetch(`${API_URL}/other-stores/${storeId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch store');
            return response.json();
        } catch (error) {
            console.error('Error fetching store:', error);
            throw error;
        }
    },

    createOtherStore: async (data) => {
        try {
            const response = await fetch(`${API_URL}/other-stores`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create store');
            return response.json();
        } catch (error) {
            console.error('Error creating store:', error);
            throw error;
        }
    },

    updateOtherStore: async (storeId, data) => {
        try {
            const response = await fetch(`${API_URL}/other-stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update store');
            return response.json();
        } catch (error) {
            console.error('Error updating store:', error);
            throw error;
        }
    },

    deleteOtherStore: async (storeId) => {
        try {
            const response = await fetch(`${API_URL}/other-stores/${storeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete store');
            return response.json();
        } catch (error) {
            console.error('Error deleting store:', error);
            throw error;
        }
    }






};
