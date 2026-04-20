const adminOtherStores = {
    stores: [],
    currentPage: 1,
    itemsPerPage: 12,

    async render() {
        const content = document.getElementById('main-content');
        
        try {
            content.innerHTML = this.generateLoadingHTML();
            const stores = await adminApi.getOtherStores();
            
            this.stores = stores || [];
            content.innerHTML = this.generateStoresHTML();
            this.bindEvents();
            this.animateElements();
        } catch (error) {
            console.error('Error rendering stores:', error);
            content.innerHTML = this.generateErrorHTML(error.message);
        }
    },

    generateLoadingHTML() {
        return `
            <div class="flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <p class="mt-4 text-gray-600 font-medium">Loading other stores...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Other Stores</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminOtherStores.render()" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },

    generateStoresHTML() {
        return `
            <div class="space-y-8">
                <!-- Header Section -->
                <div class="glass-morphism rounded-3xl p-8 border border-white/20">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                                <i class="fas fa-store text-white text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-800">Other Stores</h1>
                                <p class="text-gray-600 mt-1">Manage partner stores and retail locations</p>
                            </div>
                        </div>
                        
                        <!-- Stats Cards -->
                        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-blue-600">${this.stores.length}</p>
                                    <p class="text-sm text-blue-700">Total Stores</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-green-600">${this.stores.filter(s => s.type === 'online').length}</p>
                                    <p class="text-sm text-green-700">Online</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-purple-600">${this.stores.filter(s => s.type === 'offline').length}</p>
                                    <p class="text-sm text-purple-700">Offline</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions Bar -->
                <div class="glass-morphism rounded-3xl p-6 border border-white/20">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div class="flex-1 max-w-md">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-search text-gray-400"></i>
                                </div>
                                <input type="text" id="store-search" placeholder="Search stores..." 
                                       class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">
                            <select id="type-filter" class="px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                <option value="">All Types</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                            
                            <button id="add-store-btn" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all transform hover:scale-105">
                                <i class="fas fa-plus mr-2"></i>
                                Add Store
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stores Grid -->
                <div class="glass-morphism rounded-3xl border border-white/20 overflow-hidden">
                    <div class="overflow-x-auto max-h-[calc(100vh-22rem)] scroll-smooth">
                        <div id="stores-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            ${this.stores.map(store => this.renderStoreCard(store)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStoreCard(store) {
        const typeIcons = {
            online: 'fas fa-globe text-blue-500',
            offline: 'fas fa-building text-green-500'
        };

        const typeColors = {
            online: 'bg-blue-50 text-blue-700 border-blue-200',
            offline: 'bg-green-50 text-green-700 border-green-200'
        };

        // Extract details based on store type
        let storeDetails = '';
        if (store.type === 'online' && store.onlineDetails) {
            storeDetails = `
                ${store.onlineDetails.ecommerceName ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-store mr-2 text-gray-500"></i>
                        <span class="truncate">${store.onlineDetails.ecommerceName}</span>
                    </div>
                ` : ''}
                ${store.onlineDetails.link ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-link mr-2 text-gray-500"></i>
                        <a href="${store.onlineDetails.link}" target="_blank" class="text-emerald-600 hover:text-emerald-700 truncate">
                            Visit Store
                        </a>
                    </div>
                ` : ''}
                ${store.onlineDetails.joinedOn ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-calendar mr-2 text-gray-500"></i>
                        <span>Joined: ${new Date(store.onlineDetails.joinedOn).toLocaleDateString()}</span>
                    </div>
                ` : ''}
            `;
        } else if (store.type === 'offline' && store.offlineDetails) {
            storeDetails = `
                ${store.offlineDetails.address ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-map-marker-alt mr-2 text-gray-500"></i>
                        <span class="truncate">${store.offlineDetails.address}</span>
                    </div>
                ` : ''}
                ${store.offlineDetails.contactNumber ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-phone mr-2 text-gray-500"></i>
                        <span>${store.offlineDetails.contactNumber}</span>
                    </div>
                ` : ''}
                ${store.offlineDetails.openingHours ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-clock mr-2 text-gray-500"></i>
                        <span class="truncate">${store.offlineDetails.openingHours}</span>
                    </div>
                ` : ''}
                ${store.offlineDetails.mapsLink ? `
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-map mr-2 text-gray-500"></i>
                        <a href="${store.offlineDetails.mapsLink}" target="_blank" class="text-emerald-600 hover:text-emerald-700 truncate">
                            View on Maps
                        </a>
                    </div>
                ` : ''}
            `;
        }

        return `
            <div class="store-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100" data-store-id="${store._id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-start space-x-3">
                        <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center">
                            <i class="${typeIcons[store.type] || typeIcons.online}"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-gray-900 text-lg truncate">${store.name}</h3>
                            <div class="flex items-center space-x-2 mt-1">
                                <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${typeColors[store.type] || typeColors.online}">
                                    ${(store.type || 'online').toUpperCase()}
                                </span>
                                <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${store.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}">
                                    ${store.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button onclick="adminOtherStores.editStore('${store._id}')" 
                                class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminOtherStores.deleteStore('${store._id}')" 
                                class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="space-y-3">
                    ${storeDetails}
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span class="text-xs text-gray-500">
                        Created ${new Date(store.createdAt).toLocaleDateString()}
                    </span>
                    <button onclick="adminOtherStores.viewStore('${store._id}')" 
                            class="px-3 py-1 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Add store button
        document.getElementById('add-store-btn')?.addEventListener('click', () => {
            this.showStoreModal();
        });

        // Search functionality
        const searchInput = document.getElementById('store-search');
        const typeFilter = document.getElementById('type-filter');
        
        searchInput?.addEventListener('input', () => this.filterStores());
        typeFilter?.addEventListener('change', () => this.filterStores());
    },

    filterStores() {
        const searchTerm = document.getElementById('store-search').value.toLowerCase();
        const typeFilter = document.getElementById('type-filter').value;
        const storeCards = document.querySelectorAll('.store-card');
        
        storeCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const storeId = card.dataset.storeId;
            const store = this.stores.find(s => s._id === storeId);
            
            const matchesSearch = cardText.includes(searchTerm);
            const matchesType = !typeFilter || store?.type === typeFilter;
            
            if (matchesSearch && matchesType) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    },

    async editStore(storeId) {
        try {
            const store = this.stores.find(s => s._id === storeId);
            if (!store) {
                this.showNotification('Store not found', 'error');
                return;
            }
            this.showStoreModal(store);
        } catch (error) {
            console.error('Error editing store:', error);
            this.showNotification('Failed to load store for editing', 'error');
        }
    },

    async deleteStore(storeId) {
        if (!confirm('Are you sure you want to delete this store?')) {
            return;
        }

        try {
            await adminApi.deleteOtherStore(storeId);
            this.showNotification('Store deleted successfully', 'success');
            await this.render();
        } catch (error) {
            console.error('Error deleting store:', error);
            this.showNotification('Failed to delete store', 'error');
        }
    },

    viewStore(storeId) {
        const store = this.stores.find(s => s._id === storeId);
        if (!store) {
            this.showNotification('Store not found', 'error');
            return;
        }
        
        this.showStoreDetailsModal(store);
    },

    showStoreModal(store = null) {
        const storeName = store?.name || '';
        const storeType = store?.type || '';
        const isActive = store?.isActive !== undefined ? store.isActive : true;
        
        // Extract details based on store type
        let onlineDetails = {
            ecommerceName: '',
            link: '',
            joinedOn: ''
        };
        let offlineDetails = {
            address: '',
            mapsLink: '',
            contactNumber: '',
            openingHours: ''
        };

        if (store) {
            if (store.type === 'online' && store.onlineDetails) {
                onlineDetails = {
                    ecommerceName: store.onlineDetails.ecommerceName || '',
                    link: store.onlineDetails.link || '',
                    joinedOn: store.onlineDetails.joinedOn ? new Date(store.onlineDetails.joinedOn).toISOString().split('T')[0] : ''
                };
            } else if (store.type === 'offline' && store.offlineDetails) {
                offlineDetails = {
                    address: store.offlineDetails.address || '',
                    mapsLink: store.offlineDetails.mapsLink || '',
                    contactNumber: store.offlineDetails.contactNumber || '',
                    openingHours: store.offlineDetails.openingHours || ''
                };
            }
        }
        
        const modalHTML = `
            <div id="store-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-morphism w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 max-h-[90vh] flex flex-col">
                    <div class="px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-white/20">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold text-gray-800">${store ? 'Edit' : 'Add'} Store</h3>
                            <button onclick="this.closest('#store-modal').remove()" class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-6">
                        <form id="store-form" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                    <input type="text" name="name" required value="${storeName}"
                                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                           placeholder="Enter store name">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Store Type</label>
                                    <select name="type" id="store-type" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                        <option value="">Select Type</option>
                                        <option value="online" ${storeType === 'online' ? 'selected' : ''}>Online Store</option>
                                        <option value="offline" ${storeType === 'offline' ? 'selected' : ''}>Offline Store</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select name="isActive" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                    <option value="true" ${isActive ? 'selected' : ''}>Active</option>
                                    <option value="false" ${!isActive ? 'selected' : ''}>Inactive</option>
                                </select>
                            </div>
                            
                            <!-- Online Store Fields -->
                            <div id="online-fields" class="space-y-4" style="display: ${storeType === 'online' ? 'block' : 'none'}">
                                <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Online Store Details</h4>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">E-commerce Platform</label>
                                        <input type="text" name="ecommerceName" value="${onlineDetails.ecommerceName}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                               placeholder="e.g., Amazon, Flipkart, Shopify">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                                        <input type="date" name="joinedOn" value="${onlineDetails.joinedOn}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Store Link</label>
                                    <input type="url" name="link" value="${onlineDetails.link}"
                                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                           placeholder="https://example-store.com">
                                </div>
                            </div>
                            
                            <!-- Offline Store Fields -->
                            <div id="offline-fields" class="space-y-4" style="display: ${storeType === 'offline' ? 'block' : 'none'}">
                                <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Offline Store Details</h4>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <textarea name="address" rows="3"
                                              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                              placeholder="Enter store address...">${offlineDetails.address}</textarea>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                        <input type="tel" name="contactNumber" value="${offlineDetails.contactNumber}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                               placeholder="+91 98765 43210">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
                                        <input type="text" name="openingHours" value="${offlineDetails.openingHours}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                               placeholder="Mon - Fri : 9AM - 6PM">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Google Maps Link</label>
                                    <input type="url" name="mapsLink" value="${offlineDetails.mapsLink}"
                                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                           placeholder="https://maps.google.com/...">
                                </div>
                            </div>
                            
                            <div class="flex space-x-3 pt-4">
                                <button type="button" onclick="this.closest('#store-modal').remove()" 
                                        class="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                    Cancel
                                </button>
                                <button type="submit"
                                        class="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-medium">
                                    ${store ? 'Update' : 'Add'} Store
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Handle store type change
        document.getElementById('store-type').addEventListener('change', (e) => {
            const selectedType = e.target.value;
            const onlineFields = document.getElementById('online-fields');
            const offlineFields = document.getElementById('offline-fields');
            
            if (selectedType === 'online') {
                onlineFields.style.display = 'block';
                offlineFields.style.display = 'none';
            } else if (selectedType === 'offline') {
                onlineFields.style.display = 'none';
                offlineFields.style.display = 'block';
            } else {
                onlineFields.style.display = 'none';
                offlineFields.style.display = 'none';
            }
        });

        // Handle form submission
        document.getElementById('store-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = store ? 'Updating...' : 'Adding...';
                
                const formData = new FormData(e.target);
                const storeType = formData.get('type');
                
                const data = {
                    name: formData.get('name'),
                    type: storeType,
                    isActive: formData.get('isActive') === 'true'
                };

                // Add type-specific details
                if (storeType === 'online') {
                    data.onlineDetails = {
                        ecommerceName: formData.get('ecommerceName') || '',
                        link: formData.get('link') || '',
                        joinedOn: formData.get('joinedOn') || null
                    };
                } else if (storeType === 'offline') {
                    data.offlineDetails = {
                        address: formData.get('address') || '',
                        mapsLink: formData.get('mapsLink') || '',
                        contactNumber: formData.get('contactNumber') || '',
                        openingHours: formData.get('openingHours') || ''
                    };
                }

                if (store) {
                    await adminApi.updateOtherStore(store._id, data);
                    this.showNotification('Store updated successfully', 'success');
                } else {
                    await adminApi.createOtherStore(data);
                    this.showNotification('Store added successfully', 'success');
                }
                
                document.getElementById('store-modal').remove();
                await this.render();
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification(error.message || `Failed to ${store ? 'update' : 'add'} store`, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    },

    showStoreDetailsModal(store) {
        // Prepare details based on store type
        let typeSpecificDetails = '';
        
        if (store.type === 'online' && store.onlineDetails) {
            typeSpecificDetails = `
                ${store.onlineDetails.ecommerceName ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">E-commerce Platform</label>
                        <p class="text-gray-900 font-medium">${store.onlineDetails.ecommerceName}</p>
                    </div>
                ` : ''}
                
                ${store.onlineDetails.link ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">Store Link</label>
                        <p class="text-gray-900">
                            <a href="${store.onlineDetails.link}" target="_blank" class="text-emerald-600 hover:text-emerald-700 break-all">
                                ${store.onlineDetails.link}
                            </a>
                        </p>
                    </div>
                ` : ''}
                
                ${store.onlineDetails.joinedOn ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">Joined Date</label>
                        <p class="text-gray-900">${new Date(store.onlineDetails.joinedOn).toLocaleDateString()}</p>
                    </div>
                ` : ''}
            `;
        } else if (store.type === 'offline' && store.offlineDetails) {
            typeSpecificDetails = `
                ${store.offlineDetails.address ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">Address</label>
                        <p class="text-gray-900">${store.offlineDetails.address}</p>
                    </div>
                ` : ''}
                
                ${store.offlineDetails.contactNumber ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">Contact Number</label>
                        <p class="text-gray-900">${store.offlineDetails.contactNumber}</p>
                    </div>
                ` : ''}
                
                ${store.offlineDetails.openingHours ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">Opening Hours</label>
                        <p class="text-gray-900">${store.offlineDetails.openingHours}</p>
                    </div>
                ` : ''}
                
                ${store.offlineDetails.mapsLink ? `
                    <div>
                        <label class="text-sm font-medium text-gray-500">Google Maps</label>
                        <p class="text-gray-900">
                            <a href="${store.offlineDetails.mapsLink}" target="_blank" class="text-emerald-600 hover:text-emerald-700">
                                View on Maps
                            </a>
                        </p>
                    </div>
                ` : ''}
            `;
        }

        const modalHTML = `
            <div id="store-details-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-morphism w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <div class="px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-white/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                                    <i class="fas fa-${store.type === 'online' ? 'globe' : 'building'} text-emerald-600"></i>
                                </div>
                                <div>
                                    <h3 class="text-xl font-bold text-gray-800">${store.name}</h3>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${store.type === 'online' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}">
                                            ${store.type.toUpperCase()}
                                        </span>
                                        <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${store.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}">
                                            ${store.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="this.closest('#store-details-modal').remove()" class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-6 space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Store Type</label>
                                    <p class="text-gray-900 font-medium">${store.type.toUpperCase()} Store</p>
                                </div>
                                
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Status</label>
                                    <p class="text-gray-900 font-medium">${store.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                                
                                <div>
                                    <label class="text-sm font-medium text-gray-500">Created</label>
                                    <p class="text-gray-900">${new Date(store.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                                ${store.updatedAt ? `
                                    <div>
                                        <label class="text-sm font-medium text-gray-500">Last Updated</label>
                                        <p class="text-gray-900">${new Date(store.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                ` : ''}
                            </div>
                            
                            <div class="space-y-4">
                                ${typeSpecificDetails}
                            </div>
                        </div>
                        
                        <div class="flex space-x-3 pt-4 border-t border-gray-200">
                            <button onclick="adminOtherStores.editStore('${store._id}'); this.closest('#store-details-modal').remove();" 
                                    class="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-medium">
                                <i class="fas fa-edit mr-2"></i>
                                Edit Store
                            </button>
                            <button onclick="this.closest('#store-details-modal').remove()" 
                                    class="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
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
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    animateElements() {
        const cards = document.querySelectorAll('.store-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
};
