// Marketing Assets Management Module
const adminMarketing = {
    assets: [],
    currentPage: 1,
    itemsPerPage: 12,
    currentFilter: 'all',
    currentSort: 'newest',

    async render() {
        const content = document.getElementById('main-content');
        try {
            content.innerHTML = this.generateLoadingHTML();
            await this.loadAssets();
            content.innerHTML = this.generateMarketingHTML();
            this.attachEventListeners();
            this.animateElements();
        } catch (error) {
            console.error('Marketing error:', error);
            content.innerHTML = this.generateErrorHTML(error.message);
        }
    },

    generateLoadingHTML() {
        return `
            <div class="flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
                        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <p class="mt-4 text-gray-600 font-medium">Loading marketing assets...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Marketing Assets</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminMarketing.render()" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },    async loadAssets() {
        try {
            this.assets = await adminApi.getMarketingAssets();
        } catch (error) {
            console.error('Error loading assets:', error);
            throw new Error('Failed to fetch marketing assets');
        }
    },

    generateMarketingHTML() {
        const filteredAssets = this.getFilteredAssets();
        const paginatedAssets = this.getPaginatedAssets(filteredAssets);
        const totalPages = Math.ceil(filteredAssets.length / this.itemsPerPage);

        return `
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Marketing Assets</h1>
                        <p class="text-gray-600">Manage promotional banners, images, and content</p>
                    </div>
                    <div class="mt-4 lg:mt-0 flex space-x-3">
                        <button onclick="adminMarketing.showAssetForm()" class="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 transition-all">
                            <i class="fas fa-plus mr-2"></i>Add Asset
                        </button>
                        <button onclick="adminMarketing.exportAssets()" class="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <i class="fas fa-download mr-2"></i>Export
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
                <div class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div class="flex-1">
                        <input type="text" id="asset-search" placeholder="Search assets..." 
                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all">
                    </div>
                    
                    <div class="flex space-x-4">                        <select id="asset-filter" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none">
                            <option value="all">All Types</option>
                            <option value="banner">Banners</option>
                            <option value="promotion">Promotions</option>
                            <option value="advertisement">Advertisements</option>
                            <option value="featured">Featured</option>
                            <option value="sale">Sale</option>
                        </select>
                        
                        <select id="asset-sort" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                        </select>
                    </div>
                </div>
            </div>

            ${this.generateStatsCards()}

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-800">Marketing Assets (${filteredAssets.length} total)</h2>
                </div>

                <div class="p-8">
                    ${paginatedAssets.length > 0 ? this.generateAssetsGrid(paginatedAssets) : this.generateEmptyState()}
                </div>

                ${totalPages > 1 ? this.generatePagination(totalPages) : ''}
            </div>
        `;
    },    generateStatsCards() {
        const totalAssets = this.assets.length;
        const activeAssets = this.assets.filter(a => a.isActive).length;
        const banners = this.assets.filter(a => a.type === 'banner').length;
        const promotions = this.assets.filter(a => a.type === 'promotion').length;

        const stats = [
            { title: 'Total Assets', value: totalAssets.toLocaleString(), icon: 'fas fa-image', color: 'from-blue-500 to-blue-600', bg: 'from-blue-500/10 to-blue-600/10' },
            { title: 'Active Assets', value: activeAssets.toLocaleString(), icon: 'fas fa-eye', color: 'from-emerald-500 to-emerald-600', bg: 'from-emerald-500/10 to-emerald-600/10' },
            { title: 'Banners', value: banners.toLocaleString(), icon: 'fas fa-flag', color: 'from-orange-500 to-orange-600', bg: 'from-orange-500/10 to-orange-600/10' },
            { title: 'Promotions', value: promotions.toLocaleString(), icon: 'fas fa-percent', color: 'from-purple-500 to-pink-500', bg: 'from-purple-500/10 to-pink-500/10' }
        ];

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${stats.map(stat => `
                    <div class="stats-card card-hover rounded-2xl p-6 border border-white/20 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.bg} rounded-full transform translate-x-8 -translate-y-8"></div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center">
                                    <i class="${stat.icon} text-white text-lg"></i>
                                </div>
                            </div>
                            <h3 class="text-gray-500 text-sm font-medium">${stat.title}</h3>
                            <p class="text-3xl font-bold text-gray-800 mt-1">${stat.value}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    generateAssetsGrid(assets) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${assets.map(asset => this.generateAssetCard(asset)).join('')}
            </div>
        `;
    },    generateAssetCard(asset) {
        const imageUrl = asset.image?.path || asset.imageUrl;
        return `
            <div class="asset-card card-hover rounded-2xl border border-white/20 overflow-hidden">
                <div class="aspect-video bg-gray-100 relative">
                    ${imageUrl ? `
                        <img src="${imageUrl}" alt="${asset.title}" class="w-full h-full object-cover">
                    ` : `
                        <div class="w-full h-full flex items-center justify-center">
                            <i class="fas fa-image text-gray-400 text-3xl"></i>
                        </div>
                    `}
                    <div class="absolute top-2 right-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${asset.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${asset.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                
                <div class="p-4">
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="font-semibold text-gray-800 truncate">${asset.title}</h3>
                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${asset.type}</span>
                    </div>
                    
                    ${asset.metadata?.description || asset.description ? `
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${asset.metadata?.description || asset.description}</p>
                    ` : ''}
                    
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>${new Date(asset.createdAt).toLocaleDateString()}</span>
                        ${asset.clickCount ? `<span>${asset.clickCount} clicks</span>` : ''}
                    </div>
                    
                    <div class="flex space-x-2">
                        <button onclick="adminMarketing.viewAsset('${asset._id}')" class="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" title="View Details">
                            <i class="fas fa-eye mr-1"></i>View
                        </button>
                        <button onclick="adminMarketing.showAssetForm('${asset._id}')" class="flex-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium" title="Edit Asset">
                            <i class="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button onclick="adminMarketing.deleteAsset('${asset._id}')" class="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium" title="Delete Asset">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    generateEmptyState() {
        return `
            <div class="text-center py-16">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-image text-gray-400 text-xl"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-600 mb-2">No marketing assets found</h3>
                <p class="text-gray-500 mb-6">Create your first marketing asset to get started.</p>
                <button onclick="adminMarketing.showAssetForm()" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 transition-all">
                    <i class="fas fa-plus mr-2"></i>Add First Asset
                </button>
            </div>
        `;
    },

    generatePagination(totalPages) {
        const currentPage = this.currentPage;
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        let paginationHTML = `
            <div class="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-white/20 flex items-center justify-between">
                <div class="text-sm text-gray-600">
                    Showing ${(currentPage - 1) * this.itemsPerPage + 1} to ${Math.min(currentPage * this.itemsPerPage, this.getFilteredAssets().length)} of ${this.getFilteredAssets().length} assets
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="adminMarketing.changePage(${currentPage - 1})" 
                            class="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 transition-colors ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${currentPage <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
        `;

        if (startPage > 1) {
            paginationHTML += `<button onclick="adminMarketing.changePage(1)" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 transition-colors">1</button>`;
            if (startPage > 2) paginationHTML += `<span class="px-2 text-gray-400">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button onclick="adminMarketing.changePage(${i})" 
                        class="px-3 py-2 rounded-lg border transition-colors ${i === currentPage ? 'bg-pink-500 text-white border-pink-500' : 'bg-white hover:bg-gray-50 text-gray-700'}"
                        >
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHTML += `<span class="px-2 text-gray-400">...</span>`;
            paginationHTML += `<button onclick="adminMarketing.changePage(${totalPages})" class="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 transition-colors">${totalPages}</button>`;
        }

        paginationHTML += `
                    <button onclick="adminMarketing.changePage(${currentPage + 1})" 
                            class="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 transition-colors ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${currentPage >= totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        return paginationHTML;
    },

    getFilteredAssets() {
        let filtered = [...this.assets];

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(asset => asset.type === this.currentFilter);
        }

        const searchTerm = document.getElementById('asset-search')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(asset => 
                asset.title?.toLowerCase().includes(searchTerm) ||
                asset.description?.toLowerCase().includes(searchTerm) ||
                asset.type?.toLowerCase().includes(searchTerm)
            );
        }

        switch (this.currentSort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'name':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return filtered;
    },

    getPaginatedAssets(assets) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return assets.slice(startIndex, startIndex + this.itemsPerPage);
    },

    attachEventListeners() {
        const searchInput = document.getElementById('asset-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.currentPage = 1;
                this.updateAssetsDisplay();
            });
        }

        const filterSelect = document.getElementById('asset-filter');
        if (filterSelect) {
            filterSelect.value = this.currentFilter;
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.updateAssetsDisplay();
            });
        }

        const sortSelect = document.getElementById('asset-sort');
        if (sortSelect) {
            sortSelect.value = this.currentSort;
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.updateAssetsDisplay();
            });
        }
    },

    updateAssetsDisplay() {
        const filteredAssets = this.getFilteredAssets();
        const paginatedAssets = this.getPaginatedAssets(filteredAssets);
        const totalPages = Math.ceil(filteredAssets.length / this.itemsPerPage);

        const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
        if (gridContainer) {
            gridContainer.outerHTML = paginatedAssets.length > 0 ? 
                this.generateAssetsGrid(paginatedAssets) : 
                this.generateEmptyState();
        }

        const paginationContainer = document.querySelector('.bg-gradient-to-r.from-gray-50.to-gray-100');
        if (paginationContainer && totalPages > 1) {
            paginationContainer.outerHTML = this.generatePagination(totalPages);
        }

        const headerElement = document.querySelector('.bg-gradient-to-r.from-gray-50.to-gray-100 h2');
        if (headerElement) {
            headerElement.textContent = `Marketing Assets (${filteredAssets.length} total)`;
        }
    },

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredAssets().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateAssetsDisplay();
        }
    },

    animateElements() {
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        setTimeout(() => {
            const assetCards = document.querySelectorAll('.asset-card');
            assetCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.4s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }, 800);    },

    showAssetModal(asset) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div class="p-8 border-b border-gray-200">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">${asset.title}</h2>
                            <p class="text-gray-600">${asset.type} • ${new Date(asset.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i class="fas fa-times text-gray-500 text-xl"></i>
                        </button>
                    </div>
                </div>

                <div class="p-8">
                    ${asset.imageUrl ? `
                        <div class="mb-6">
                            <img src="${asset.imageUrl}" alt="${asset.title}" class="w-full rounded-lg shadow-lg">
                        </div>
                    ` : ''}
                    
                    ${asset.description ? `
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p class="text-gray-600">${asset.description}</p>
                        </div>
                    ` : ''}
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <span class="text-gray-600">Status:</span>
                            <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full ${asset.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                ${asset.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div>
                            <span class="text-gray-600">Type:</span>
                            <span class="ml-2 font-medium">${asset.type}</span>
                        </div>
                        ${asset.clickCount !== undefined ? `
                            <div>
                                <span class="text-gray-600">Clicks:</span>
                                <span class="ml-2 font-medium">${asset.clickCount}</span>
                            </div>
                        ` : ''}
                        ${asset.url ? `
                            <div>
                                <span class="text-gray-600">URL:</span>
                                <a href="${asset.url}" target="_blank" class="ml-2 text-blue-600 hover:underline">${asset.url}</a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex space-x-3">
                        <button onclick="adminMarketing.editAsset('${asset._id}')" class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all">
                            <i class="fas fa-edit mr-2"></i>Edit Asset
                        </button>
                        <button onclick="adminMarketing.toggleAssetStatus('${asset._id}')" class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
                            <i class="fas fa-${asset.isActive ? 'eye-slash' : 'eye'} mr-2"></i>${asset.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },    async editAsset(assetId) {
        try {
            const asset = this.assets.find(a => a._id === assetId);
            if (!asset) throw new Error('Asset not found');
            this.showAssetForm(assetId);
        } catch (error) {
            console.error('Error editing asset:', error);
            this.showNotification('Error loading asset for editing', 'error');
        }
    },

    async deleteAsset(assetId) {
        if (!confirm('Are you sure you want to delete this marketing asset?')) return;

        try {
            await adminApi.deleteMarketingAsset(assetId);
            this.showNotification('Marketing asset deleted successfully', 'success');
            this.render();
        } catch (error) {
            console.error('Error deleting asset:', error);
            this.showNotification('Failed to delete marketing asset', 'error');
        }
    },    async toggleAssetStatus(assetId) {
        try {
            const asset = this.assets.find(a => a._id === assetId);
            if (!asset) {
                this.showNotification('Asset not found', 'error');
                return;
            }

            // Create FormData with just the isActive field to update
            const formData = new FormData();
            formData.set('isActive', !asset.isActive);

            await adminApi.updateMarketingAsset(assetId, formData);
            this.showNotification(`Asset ${!asset.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
            await this.render();
        } catch (error) {
            console.error('Error toggling asset status:', error);
            this.showNotification('Failed to update asset status', 'error');
        }
    },

    async refreshAssets() {
        try {
            const content = document.getElementById('main-content');
            content.innerHTML = this.generateLoadingHTML();
            await this.loadAssets();
            content.innerHTML = this.generateMarketingHTML();
            this.attachEventListeners();
            this.animateElements();
        } catch (error) {
            console.error('Error refreshing assets:', error);
        }
    },

    generateCSVContent() {
        const headers = ['Title', 'Type', 'Description', 'URL', 'Status', 'Click Count', 'Created Date'];
        const rows = this.assets.map(asset => [
            asset.title || '',
            asset.type || '',
            asset.description || '',
            asset.url || '',
            asset.isActive ? 'Active' : 'Inactive',
            asset.clickCount || 0,
            new Date(asset.createdAt).toLocaleDateString()
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return csvContent;
    },    showAssetForm(assetId = null) {
        const content = document.getElementById('main-content');
        const asset = assetId ? this.assets.find(a => a._id === assetId) : null;

        content.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                    <div class="bg-gradient-to-r from-pink-500 to-red-600 px-8 py-6 text-white">
                        <h2 class="text-2xl font-bold">${asset ? 'Edit' : 'Add'} Marketing Asset</h2>
                        <p class="text-pink-100">Create and manage promotional content</p>
                    </div>
                    
                    <form id="asset-form" class="p-8 space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input type="text" name="title" required 
                                   value="${asset?.title || ''}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                            <select name="type" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none">
                                <option value="banner" ${asset?.type === 'banner' ? 'selected' : ''}>Banner</option>
                                <option value="promotion" ${asset?.type === 'promotion' ? 'selected' : ''}>Promotion</option>
                                <option value="advertisement" ${asset?.type === 'advertisement' ? 'selected' : ''}>Advertisement</option>
                                <option value="featured" ${asset?.type === 'featured' ? 'selected' : ''}>Featured</option>
                                <option value="sale" ${asset?.type === 'sale' ? 'selected' : ''}>Sale</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                            ${asset?.image?.path ? `
                                <div class="mb-3">
                                    <img src="${asset.image.path}" alt="${asset.title}" class="w-32 h-32 object-cover rounded-lg border">
                                    <p class="text-sm text-gray-500 mt-1">Current image</p>
                                </div>
                            ` : ''}
                            <input type="file" name="image" accept="image/*" 
                                   ${!asset ? 'required' : ''}
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all">
                            <p class="text-sm text-gray-500 mt-1">Upload a new image to replace the current one</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Link To (optional)</label>
                            <input type="text" name="linkTo" 
                                   value="${asset?.linkTo || ''}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                   placeholder="Enter URL or path">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <input type="number" name="position" min="0"
                                   value="${asset?.position || 0}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                   placeholder="Display order (0 = first)">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" rows="3" 
                                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                      placeholder="Enter description...">${asset?.metadata?.description || asset?.description || ''}</textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                            <input type="text" name="altText" 
                                   value="${asset?.metadata?.altText || ''}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                   placeholder="Alternative text for accessibility">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input type="date" name="startDate" 
                                       value="${asset?.displayPeriod?.startDate ? new Date(asset.displayPeriod.startDate).toISOString().split('T')[0] : ''}"
                                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input type="date" name="endDate" 
                                       value="${asset?.displayPeriod?.endDate ? new Date(asset.displayPeriod.endDate).toISOString().split('T')[0] : ''}"
                                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all">
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="checkbox" name="isActive" id="isActive" 
                                   ${asset?.isActive !== false ? 'checked' : ''}
                                   class="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500">
                            <label for="isActive" class="ml-2 text-sm font-medium text-gray-700">Active</label>
                        </div>
                        
                        <div class="flex space-x-4">
                            <button type="submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 transition-all font-medium">
                                <i class="fas fa-save mr-2"></i>${asset ? 'Update' : 'Create'} Asset
                            </button>
                            <button type="button" onclick="adminMarketing.render()" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;        const form = document.getElementById('asset-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = asset ? 'Updating...' : 'Creating...';
                
                const formData = new FormData(e.target);
                formData.set('isActive', e.target.isActive.checked);
                
                // Handle position as number
                if (formData.get('position')) {
                    formData.set('position', parseInt(formData.get('position')) || 0);
                }
                
                if (asset) {
                    await adminApi.updateMarketingAsset(asset._id, formData);
                } else {
                    await adminApi.addMarketingAsset(formData);
                }
                
                this.showNotification(`Marketing asset ${asset ? 'updated' : 'created'} successfully`, 'success');
                this.render();
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification(error.message || `Failed to ${asset ? 'update' : 'create'} marketing asset`, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    },    

    async viewAsset(assetId) {
        try {
            const asset = this.assets.find(a => a._id === assetId);
            if (!asset) {
                this.showNotification('Asset not found', 'error');
                return;
            }

            const imageUrl = asset.image?.path || asset.imageUrl;
            const content = document.getElementById('main-content');
            
            content.innerHTML = `
                <div class="max-w-4xl mx-auto">
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h2 class="text-2xl font-bold">${asset.title}</h2>
                                    <p class="text-blue-100">Marketing Asset Details</p>
                                </div>
                                <button onclick="adminMarketing.render()" class="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                                    <i class="fas fa-arrow-left mr-2"></i>Back
                                </button>
                            </div>
                        </div>
                        
                        <div class="p-8">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
                                        ${imageUrl ? `
                                            <img src="${imageUrl}" alt="${asset.title}" class="w-full h-full object-cover">
                                        ` : `
                                            <div class="w-full h-full flex items-center justify-center">
                                                <i class="fas fa-image text-gray-400 text-4xl"></i>
                                            </div>
                                        `}
                                    </div>
                                    
                                    <div class="flex space-x-3">
                                        <button onclick="adminMarketing.showAssetForm('${asset._id}')" class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                            <i class="fas fa-edit mr-2"></i>Edit Asset
                                        </button>
                                        <button onclick="adminMarketing.deleteAsset('${asset._id}')" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                            <i class="fas fa-trash mr-2"></i>Delete Asset
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="space-y-6">
                                    <div>
                                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Asset Information</h3>
                                        <div class="space-y-3">
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Type:</span>
                                                <span class="font-medium">${asset.type}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Status:</span>
                                                <span class="px-2 py-1 text-xs font-medium rounded-full ${asset.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                                    ${asset.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Position:</span>
                                                <span class="font-medium">${asset.position || 0}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Created:</span>
                                                <span class="font-medium">${new Date(asset.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            ${asset.linkTo ? `
                                                <div class="flex justify-between">
                                                    <span class="text-gray-600">Link URL:</span>
                                                    <a href="${asset.linkTo}" target="_blank" class="text-blue-500 hover:underline font-medium">
                                                        ${asset.linkTo.length > 30 ? asset.linkTo.substring(0, 30) + '...' : asset.linkTo}
                                                    </a>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                    
                                    ${asset.metadata?.description || asset.description ? `
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                                            <p class="text-gray-600 leading-relaxed">${asset.metadata?.description || asset.description}</p>
                                        </div>
                                    ` : ''}
                                    
                                    ${asset.metadata?.altText ? `
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Alt Text</h3>
                                            <p class="text-gray-600">${asset.metadata.altText}</p>
                                        </div>
                                    ` : ''}
                                    
                                    ${asset.displayPeriod?.startDate || asset.displayPeriod?.endDate ? `
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-800 mb-3">Display Period</h3>
                                            <div class="space-y-2">
                                                ${asset.displayPeriod.startDate ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">Start Date:</span>
                                                        <span class="font-medium">${new Date(asset.displayPeriod.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                ` : ''}
                                                ${asset.displayPeriod.endDate ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-gray-600">End Date:</span>
                                                        <span class="font-medium">${new Date(asset.displayPeriod.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;        } catch (error) {
            console.error('Error viewing asset:', error);
            this.showNotification('Failed to load asset details', 'error');
        }
    },

    async refreshAssets() {
        try {
            this.currentPage = 1;
            const content = document.getElementById('main-content');
            content.innerHTML = this.generateLoadingHTML();
            await this.render();
            this.showNotification('Marketing assets refreshed', 'success');
        } catch (error) {
            console.error('Error refreshing assets:', error);
            this.showNotification('Failed to refresh marketing assets', 'error');
        }
    },

    generateCSVContent() {
        const headers = ['Title', 'Type', 'Category', 'Status', 'Views', 'Clicks', 'Created Date', 'Description'];
        const csvRows = [headers.join(',')];

        this.assets.forEach(asset => {
            const row = [
                `"${asset.title || ''}"`,
                `"${asset.type || ''}"`,
                `"${asset.category || ''}"`,
                `"${asset.isActive ? 'Active' : 'Inactive'}"`,
                asset.analytics?.views || 0,
                asset.analytics?.clicks || 0,
                `"${new Date(asset.createdAt).toLocaleDateString()}"`,
                `"${(asset.description || '').replace(/"/g, '""')}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    },

    async exportAssets() {
        try {
            const csvContent = this.generateCSVContent();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `marketing-assets-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('Marketing assets exported successfully', 'success');
            } else {
                throw new Error('Browser does not support file downloads');
            }
        } catch (error) {
            console.error('Error exporting assets:', error);
            this.showNotification('Failed to export marketing assets', 'error');
        }
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
    }
};
