const adminShopDetails = {
    details: [],
    currentPage: 1,
    itemsPerPage: 10,
    changeEnabled: localStorage.getItem('shopDetailsChangeEnabled') === 'true',


    async render() {
        console.log(localStorage.getItem('shopDetailsChangeEnabled') === 'true');
        const content = document.getElementById('main-content');
        try {
            content.innerHTML = this.generateLoadingHTML();
            const data = await adminApi.getShopDetails();
            
            if (!data || !Array.isArray(data.details)) {
                throw new Error('Invalid shop details data');
            }
            
            this.details = data.details;
            content.innerHTML = this.generateShopDetailsHTML();
            this.bindEvents();
            this.animateElements();
        } catch (error) {
            console.error('Error in shop details render:', error);
            content.innerHTML = this.generateErrorHTML(error.message);
        }
    },

    generateLoadingHTML() {
        return `
            <div class="flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <p class="mt-4 text-gray-600 font-medium">Loading shop details...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Shop Details</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminShopDetails.render()" class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },

    generateShopDetailsHTML() {
        return `
            <div class="space-y-8">
                <!-- Header Section -->
                <div class="glass-morphism rounded-3xl p-8 border border-white/20">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <i class="fas fa-store text-white text-2xl"></i>
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-800">Shop Details</h1>
                                <p class="text-gray-600 mt-1">Manage store information and settings</p>
                            </div>
                        </div>                        <!-- Stats Cards -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-blue-600">${this.details.length}</p>
                                    <p class="text-sm text-blue-700">Total Details</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-green-600">${this.details.filter(d => d.category === 'FINALCHARGES').length}</p>
                                    <p class="text-sm text-green-700">Final Charges (Tax %)</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-blue-600">${this.details.filter(d => d.category === 'DELIVERY').length}</p>
                                    <p class="text-sm text-blue-700">Delivery</p>
                                </div>
                            </div>
                            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                                <div class="text-center">
                                    <p class="text-2xl font-bold text-purple-600">${this.details.filter(d => d.category === 'PAYMENTTYPE').length}</p>
                                    <p class="text-sm text-purple-700">Payment Types</p>
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
                                <input type="text" id="detail-search" placeholder="Search shop details..." 
                                       class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-4">                
                         <select id="category-filter" class="px-4 py-3 border border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" >
                                <option value="">All Categories</option>
                                <option value="FINALCHARGES">Final Charges</option>
                                <option value="DELIVERY">Delivery</option>
                                <option value="PAYMENTTYPE">Payment Types</option>
                            </select>

                            <button id="add-detail-btn" class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105" ${this.changeEnabled ? '' : 'style="display: none;"'}>
                                <i class="fas fa-plus mr-2"></i>
                                Add Detail
                            </button>
                        </div>
                    </div>
                </div>                <!-- Details Grid -->
                <div class="glass-morphism rounded-3xl border border-white/20 overflow-hidden">
                    <div class="overflow-x-auto max-h-[calc(100vh-22rem)] scroll-smooth">
                        <div id="details-grid" class="space-y-6 p-6">
                            ${this.renderGroupedDetails()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },    renderDetailCard(detail) {
        const categoryIcons = {
            FINALCHARGES: 'fas fa-calculator text-green-500',
            DELIVERY: 'fas fa-truck text-blue-500',
            PAYMENTTYPE: 'fas fa-credit-card text-purple-500'
        };

        const categoryColors = {
            FINALCHARGES: 'bg-green-50 text-green-700 border-green-200',
            DELIVERY: 'bg-blue-50 text-blue-700 border-blue-200',
            PAYMENTTYPE: 'bg-purple-50 text-purple-700 border-purple-200'
        };

        const categoryLabels = {
            FINALCHARGES: 'Final Charges',
            DELIVERY: 'Delivery',
            PAYMENTTYPE: 'Payment Type'
        };

        return `
            <div class="detail-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100" data-detail-id="${detail._id}">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                        <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                            <i class="${categoryIcons[detail.category] || 'fas fa-info-circle text-gray-500'}"></i>
                        </div>
                        
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-gray-900 text-lg truncate">${detail.name}</h3>
                            <p class="text-gray-600 mt-1 break-words">${detail.value}</p>
                            <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium mt-2 ${categoryColors[detail.category] || 'bg-gray-50 text-gray-700 border-gray-200'}">
                                ${categoryLabels[detail.category] || detail.category}
                            </span>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="adminShopDetails.editDetail('${detail._id}')" 
                                class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="adminShopDetails.deleteDetail('${detail._id}')" 
                                class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },bindEvents() {
        // Add detail button
        document.getElementById('add-detail-btn')?.addEventListener('click', () => {
            this.showDetailModal();
        });

        // Search functionality
        const searchInput = document.getElementById('detail-search');
        const categoryFilter = document.getElementById('category-filter');
        
        searchInput?.addEventListener('input', () => this.filterDetails());
        categoryFilter?.addEventListener('change', () => this.filterDetails());
    },    filterDetails() {
        const searchTerm = document.getElementById('detail-search').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        const detailCards = document.querySelectorAll('.detail-card');
        const categoryGroups = document.querySelectorAll('.category-group');
        
        detailCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const detailId = card.dataset.detailId;
            const detail = this.details.find(d => d._id === detailId);
            
            const matchesSearch = cardText.includes(searchTerm);
            const matchesCategory = !categoryFilter || detail?.category === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                card.style.display = 'none';
            }
        });

        // Hide/show category groups based on whether they have visible cards
        categoryGroups.forEach(group => {
            const visibleCards = group.querySelectorAll('.detail-card[style*="display: block"], .detail-card:not([style*="display: none"])');
            if (visibleCards.length === 0) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });
    },

    async editDetail(detailId) {
        try {
            const detail = this.details.find(d => d._id === detailId);
            if (!detail) {
                this.showNotification('Detail not found', 'error');
                return;
            }
            this.showDetailModal(detail);
        } catch (error) {
            console.error('Error editing detail:', error);
            this.showNotification('Failed to load detail for editing', 'error');
        }
    },

    async deleteDetail(detailId) {
        if (!confirm('Are you sure you want to delete this shop detail?')) {
            return;
        }

        try {
            await adminApi.deleteShopDetail(detailId);
            this.showNotification('Shop detail deleted successfully', 'success');
            await this.render();
        } catch (error) {
            console.error('Error deleting detail:', error);
            this.showNotification('Failed to delete shop detail', 'error');
        }
    },

    showDetailModal(detail = null) {
        const modalHTML = `
            <div id="detail-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-morphism w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <!-- Modal Header -->
                    <div class="px-6 py-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-bold text-gray-800">${detail ? 'Edit' : 'Add'} Shop Detail</h3>
                            <button onclick="this.closest('#detail-modal').remove()" class="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Modal Content -->
                    <div class="p-6">
                        <form id="detail-form" class="space-y-4">
                         <div ${this.changeEnabled ? '' : 'hidden'}>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input type="text" name="name" required 
                                       value="${detail?.name || ''}"
                                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                       placeholder="e.g., Shipping Cost, COD Charges, Credit Card">
                            </div>
                            
                            <div ${this.changeEnabled ? '' : 'hidden'}>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select name="category" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" >
                                    <option value="">Select Category</option>
                                    <option value="FINALCHARGES" ${detail?.category === 'FINALCHARGES' ? 'selected' : ''}>Final Charges</option>
                                    <option value="DELIVERY" ${detail?.category === 'DELIVERY' ? 'selected' : ''}>Delivery</option>
                                    <option value="PAYMENTTYPE" ${detail?.category === 'PAYMENTTYPE' ? 'selected' : ''}>Payment Types</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Value</label>
                                <textarea name="value" required rows="3"
                                          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                          placeholder="Enter the value or amount (e.g., ₹50, Free, 2-3 days, UPI/Card)">${detail?.value || ''}</textarea>
                            </div>
                            
                            <div class="flex space-x-3 pt-4">
                                <button type="button" onclick="this.closest('#detail-modal').remove()" 
                                        class="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                    Cancel
                                </button>
                                <button type="submit"
                                        class="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all font-medium">
                                    ${detail ? 'Update' : 'Add'} Detail
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Handle form submission
        document.getElementById('detail-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = detail ? 'Updating...' : 'Adding...';
                
                const formData = new FormData(e.target);
                const data = {
                    name: formData.get('name'),
                    category: formData.get('category'),
                    value: formData.get('value')
                };

                if (detail) {
                    await adminApi.updateShopDetail(detail._id, data);
                    this.showNotification('Shop detail updated successfully', 'success');
                } else {
                    await adminApi.addShopDetail(data);
                    this.showNotification('Shop detail added successfully', 'success');
                }
                
                document.getElementById('detail-modal').remove();
                await this.render();
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification(error.message || `Failed to ${detail ? 'update' : 'add'} shop detail`, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
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
        const cards = document.querySelectorAll('.detail-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    },

    renderGroupedDetails() {
        const categories = ['FINALCHARGES', 'DELIVERY', 'PAYMENTTYPE'];
        const categoryLabels = {
            FINALCHARGES: 'Final Charges (%)',
            DELIVERY: 'Delivery',
            PAYMENTTYPE: 'Payment Types'
        };
        
        const categoryIcons = {
            FINALCHARGES: 'fas fa-calculator',
            DELIVERY: 'fas fa-truck',
            PAYMENTTYPE: 'fas fa-credit-card'
        };

        const categoryColors = {
            FINALCHARGES: 'from-green-500 to-emerald-600',
            DELIVERY: 'from-blue-500 to-cyan-600',
            PAYMENTTYPE: 'from-purple-500 to-violet-600'
        };

        return categories.map(category => {
            const categoryDetails = this.details.filter(detail => detail.category === category);
            
            if (categoryDetails.length === 0) return '';
            
            return `
                <div class="category-group">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 bg-gradient-to-r ${categoryColors[category]} rounded-xl flex items-center justify-center text-white">
                            <i class="${categoryIcons[category]}"></i>
                        </div>
                        <h2 class="text-xl font-bold text-gray-800">${categoryLabels[category]}</h2>
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                            ${categoryDetails.length} item${categoryDetails.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${categoryDetails.map(detail => this.renderDetailCard(detail)).join('')}
                    </div>
                </div>
            `;
        }).filter(html => html !== '').join('');
    },
};
