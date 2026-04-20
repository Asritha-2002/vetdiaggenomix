const adminVouchers = {
    vouchers: [],
    currentPage: 1,
    itemsPerPage: 10,
    currentFilter: 'all',
    currentSort: 'newest',

    async render() {
        const content = document.getElementById('main-content');
        try {
            content.innerHTML = this.generateLoadingHTML();
            await this.loadVouchers();
            content.innerHTML = this.generateVouchersHTML();
            this.attachEventListeners();
            this.animateElements();
        } catch (error) {
            console.error('Vouchers error:', error);
            content.innerHTML = this.generateErrorHTML(error.message);
        }
    },

    generateLoadingHTML() {
        return `
            <div class="flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <p class="mt-4 text-gray-600 font-medium">Loading vouchers...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Vouchers</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminVouchers.render()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },

    async loadVouchers() {
        const vouchers = await adminApi.getVouchers();
        this.vouchers = vouchers || [];
    },

    generateVouchersHTML() {
        const filteredVouchers = this.getFilteredVouchers();
        const paginatedVouchers = this.getPaginatedVouchers(filteredVouchers);
        const totalPages = Math.ceil(filteredVouchers.length / this.itemsPerPage);

        return `
            <!-- Vouchers Header -->
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Vouchers Management</h1>
                        <p class="text-gray-600">Create and manage discount vouchers and promotions</p>
                    </div>
                    <div class="mt-4 lg:mt-0 flex space-x-3">
                        <button onclick="adminVouchers.exportVouchers()" class="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <i class="fas fa-download mr-2"></i>Export
                        </button>
                        <button onclick="adminVouchers.showAddVoucherModal()" class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all">
                            <i class="fas fa-plus mr-2"></i>Add Voucher
                        </button>
                    </div>
                </div>
            </div>

            <!-- Vouchers Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-tags text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Vouchers</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.vouchers.length.toLocaleString()}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-check-circle text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Active</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.vouchers.filter(v => v.isActive && new Date(v.expiryDate) > new Date()).length}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-clock text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Expired</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.vouchers.filter(v => new Date(v.expiryDate) < new Date()).length}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-chart-line text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Uses</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <!-- Filters and Search -->
            <div class="stats-card rounded-2xl p-6 mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <!-- Search -->
                    <div class="flex-1 max-w-md">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-search text-gray-400"></i>
                            </div>
                            <input type="text" id="search-vouchers" placeholder="Search vouchers by code..." 
                                   class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                        </div>
                    </div>
                    
                    <!-- Filters -->
                    <div class="flex space-x-4">
                        <select id="status-filter" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="disabled">Disabled</option>
                        </select>
                        
                        <select id="type-filter" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="all">All Types</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                            <option value="complimentary">Complimentary</option>
                        </select>
                        
                        <select id="sort-vouchers" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="expiry-soon">Expiring Soon</option>
                            <option value="most-used">Most Used</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Vouchers Table with Enhanced Scrollable Container -->
            <div class="stats-card rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">Vouchers List</h3>
                            <p class="text-gray-600 text-sm">Showing ${paginatedVouchers.length} of ${filteredVouchers.length} vouchers</p>
                        </div>
                        <div class="text-sm text-gray-500">
                            Page ${this.currentPage} of ${totalPages || 1}
                        </div>
                    </div>
                </div>
                
                <!-- Enhanced Scrollable Table Container -->
                <div class="relative">
                    <div class="overflow-x-auto scroll-smooth">
                        <div class="max-h-[calc(100vh-32rem)] overflow-y-auto scroll-smooth" style="scrollbar-width: thin; scrollbar-color: rgb(156 163 175) rgb(243 244 246);">
                            <table class="min-w-full">
                                <thead class="bg-gray-50 sticky top-0 z-20 shadow-sm">
                                    <tr>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Code</th>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Type</th>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Value</th>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Status</th>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Usage</th>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Expiry</th>
                                        <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50 bg-white">
                                    ${this.generateVoucherRows(paginatedVouchers)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Pagination -->
                ${totalPages > 1 ? this.generatePaginationHTML(totalPages) : ''}
            </div>
        `;
    },

    generateVoucherRows(vouchers) {
        if (!vouchers.length) {
            return `
                <tr>
                    <td colspan="7" class="text-center py-16">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-tags text-gray-400 text-xl"></i>
                        </div>
                        <p class="text-gray-500">No vouchers found</p>
                    </td>
                </tr>
            `;
        }

        return vouchers.map(voucher => `
            <tr class="hover:bg-gray-50 transition-colors voucher-row">
                <td class="py-4 px-6">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xs font-bold mr-3">
                            <i class="fas fa-ticket-alt"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-800">${voucher.code}</p>
                            <p class="text-xs text-gray-500">${voucher.description || 'No description'}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${this.getTypeColor(voucher.type)}">
                        ${voucher.type}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <div>                        <p class="font-medium text-gray-800">${this.formatVoucherValue(voucher)}</p>
                        ${voucher.minPurchase ? `<p class="text-xs text-gray-500">Min order: ₹${voucher.minPurchase}</p>` : ''}
                    </div>
                </td>
                <td class="py-4 px-6">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${this.getStatusColor(voucher)}">
                        ${this.getVoucherStatus(voucher)}
                    </span>
                </td>
                 <td class="py-4 px-6">
                    <div>
                        <p class="text-sm font-medium text-gray-800">${voucher.maxUses || '∞'}</p>
                        
                    </div>
                </td>
                <td class="py-4 px-6">
                    <div>
                        <p class="text-sm text-gray-800">${new Date(voucher.expiryDate).toLocaleDateString()}</p>
                        <p class="text-xs text-gray-500">${this.getDaysRemaining(voucher.expiryDate)}</p>
                    </div>
                </td>
                <td class="py-4 px-6">
                    <div class="flex space-x-2">
                        <button onclick="adminVouchers.editVoucher('${voucher._id}')" 
                                class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors">
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button onclick="adminVouchers.toggleVoucherStatus('${voucher._id}')" 
                                class="w-8 h-8 ${voucher.isActive ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'bg-green-100 hover:bg-green-200 text-green-600'} rounded-lg flex items-center justify-center transition-colors">
                            <i class="fas ${voucher.isActive ? 'fa-pause' : 'fa-play'} text-xs"></i>
                        </button>
                        <button onclick="adminVouchers.deleteVoucher('${voucher._id}')" 
                                class="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    formatVoucherValue(voucher) {
        switch (voucher.type) {
            case 'percentage':
                return `${voucher.value}% off${voucher.maxDiscount ? ` (Max: ₹${voucher.maxDiscount})` : ''}`;
            case 'fixed':
                return `₹${voucher.value} off`;
            case 'complimentary':
                return `${voucher.complimentaryConfig?.quantity || 1}x Free Items`;
            default:
                return voucher.value;
        }
    },

    getTypeColor(type) {
        const colors = {
            'percentage': 'bg-blue-100 text-blue-800',
            'fixed': 'bg-green-100 text-green-800',
            'complimentary': 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    },    getVoucherStatus(voucher) {
        if (!voucher.isActive) return 'disabled';
        if (new Date(voucher.expiryDate) < new Date()) return 'expired';
        if (voucher.maxUses && voucher.usedCount >= voucher.maxUses) return 'exhausted';
        return 'active';
    },

    getStatusColor(voucher) {
        const status = this.getVoucherStatus(voucher);
        const colors = {
            'active': 'bg-green-100 text-green-800',
            'expired': 'bg-red-100 text-red-800',
            'disabled': 'bg-gray-100 text-gray-800',
            'exhausted': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    },

    getDaysRemaining(expiryDate) {
        const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Expired';
        if (days === 0) return 'Expires today';
        if (days === 1) return 'Expires tomorrow';
        return `${days} days left`;
    },

    generatePaginationHTML(totalPages) {
        return `
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                        Showing ${((this.currentPage - 1) * this.itemsPerPage) + 1} to ${Math.min(this.currentPage * this.itemsPerPage, this.getFilteredVouchers().length)} of ${this.getFilteredVouchers().length} results
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="adminVouchers.goToPage(${this.currentPage - 1})" 
                                ${this.currentPage === 1 ? 'disabled' : ''} 
                                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Previous
                        </button>
                        
                        ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                            const page = i + 1;
                            return `
                                <button onclick="adminVouchers.goToPage(${page})" 
                                        class="px-3 py-2 text-sm font-medium ${page === this.currentPage ? 'text-white bg-purple-500' : 'text-gray-500 bg-white hover:bg-gray-50'} border border-gray-200 rounded-lg transition-colors">
                                    ${page}
                                </button>
                            `;
                        }).join('')}
                        
                        <button onclick="adminVouchers.goToPage(${this.currentPage + 1})" 
                                ${this.currentPage === totalPages ? 'disabled' : ''} 
                                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getFilteredVouchers() {
        let filtered = [...this.vouchers];
        
        // Apply status filter
        const statusFilter = document.getElementById('status-filter')?.value;
        if (statusFilter && statusFilter !== 'all') {
            filtered = filtered.filter(voucher => {
                const status = this.getVoucherStatus(voucher);
                return status === statusFilter;
            });
        }
        
        // Apply type filter
        const typeFilter = document.getElementById('type-filter')?.value;
        if (typeFilter && typeFilter !== 'all') {
            filtered = filtered.filter(voucher => voucher.type === typeFilter);
        }
        
        // Apply search
        const searchTerm = document.getElementById('search-vouchers')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(voucher => 
                voucher.code?.toLowerCase().includes(searchTerm) ||
                voucher.description?.toLowerCase().includes(searchTerm)
            );
        }
          // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
                case 'oldest':
                    return new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id);
                case 'expiry-soon':
                    return new Date(a.expiryDate) - new Date(b.expiryDate);
                case 'most-used':
                    return (b.usedCount || 0) - (a.usedCount || 0);
                default:
                    return 0;
            }
        });
        
        return filtered;
    },

    getPaginatedVouchers(vouchers) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return vouchers.slice(startIndex, endIndex);
    },

    attachEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-vouchers');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.currentPage = 1;
                this.updateVouchersList();
            });
        }

        // Filter functionality
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.updateVouchersList();
            });
        }

        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.updateVouchersList();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-vouchers');
        if (sortSelect) {
            sortSelect.value = this.currentSort;
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.updateVouchersList();
            });
        }
    },

    updateVouchersList() {
        const tableContainer = document.querySelector('.max-h-\\[calc\\(100vh-32rem\\)\\]');
        if (tableContainer) {
            const filteredVouchers = this.getFilteredVouchers();
            const paginatedVouchers = this.getPaginatedVouchers(filteredVouchers);
            const totalPages = Math.ceil(filteredVouchers.length / this.itemsPerPage);

            tableContainer.innerHTML = `
                <table class="min-w-full">
                    <thead class="bg-gray-50 sticky top-0 z-20 shadow-sm">
                        <tr>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Code</th>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Type</th>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Value</th>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Status</th>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Usage</th>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Expiry</th>
                            <th class="text-left py-4 px-6 font-semibold text-gray-700 text-sm border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50 bg-white">
                        ${this.generateVoucherRows(paginatedVouchers)}
                    </tbody>
                </table>
            `;

            // Update pagination
            const paginationContainer = document.querySelector('.stats-card .px-6.py-4.border-t');
            if (paginationContainer && totalPages > 1) {
                paginationContainer.outerHTML = this.generatePaginationHTML(totalPages);
            }
        }
    },

    goToPage(page) {
        const totalPages = Math.ceil(this.getFilteredVouchers().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateVouchersList();
        }
    },    async showAddVoucherModal() {
        this.showVoucherForm();
    },

    async editVoucher(voucherId) {
        this.showVoucherForm(voucherId);
    },

    async showVoucherForm(voucherId = null) {
        const content = document.getElementById('main-content');
        let voucher = null;

        try {
            if (voucherId) {
                voucher = this.vouchers.find(v => v._id === voucherId);
                if (!voucher) {
                    await this.loadVouchers();
                    voucher = this.vouchers.find(v => v._id === voucherId);
                }
            }

            content.innerHTML = `
                <div class="max-w-4xl mx-auto">
                    <!-- Header -->
                    <div class="mb-8">
                        <div class="flex items-center space-x-4">
                            <button onclick="adminVouchers.render()" class="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                                <i class="fas fa-arrow-left text-gray-600"></i>
                            </button>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-800">${voucher ? 'Edit' : 'Add'} Voucher</h1>
                                <p class="text-gray-600">Create and configure discount vouchers for your store</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Container -->
                    <div class="stats-card rounded-2xl p-8">
                        <form id="voucher-form" class="space-y-6">
                            <!-- Basic Information -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Voucher Code *</label>
                                    <input type="text" name="code" required 
                                           value="${voucher?.code || ''}"
                                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                           placeholder="Enter voucher code (e.g., SAVE20)">
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Voucher Type *</label>
                                    <select name="type" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                                        <option value="fixed" ${voucher?.type === 'fixed' ? 'selected' : ''}>Fixed Amount</option>
                                        <option value="percentage" ${voucher?.type === 'percentage' ? 'selected' : ''}>Percentage Discount</option>
                                        <!-- <option value="complimentary" ${voucher?.type === 'complimentary' ? 'selected' : ''}>Complimentary Items</option> -->
                                    </select>
                                </div>
                            </div>

                            <!-- Value Section -->
                            <div id="valueSection" class="${voucher?.type === 'complimentary' ? 'hidden' : ''} space-y-6">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">Value *</label>
                                        <div class="relative">
                                            <input type="number" name="value" min="0" step="0.01"
                                                   value="${voucher?.value || ''}"
                                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                                   placeholder="Enter discount value">
                                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" id="valueUnit">
                                                ${voucher?.type === 'percentage' ? '%' : '₹'}
                                            </div>
                                        </div>
                                    </div>
                                    <div id="maxDiscountSection" class="${voucher?.type !== 'percentage' ? 'hidden' : ''}">
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">Max Discount</label>
                                        <div class="relative">
                                            <input type="number" name="maxDiscount" min="0" step="0.01"
                                                   value="${voucher?.maxDiscount || ''}"
                                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                                   placeholder="Leave empty for unlimited">
                                            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Complimentary Configuration -->
                            <div id="complimentaryConfig" class="${voucher?.type !== 'complimentary' ? 'hidden' : ''} space-y-6">
                                <div class="bg-purple-50 p-6 rounded-xl border border-purple-200">
                                    <h4 class="text-lg font-semibold text-purple-800 mb-4">Complimentary Items Configuration</h4>
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                                            <input type="number" name="quantity" min="1"
                                                   value="${voucher?.complimentaryConfig?.quantity || 1}"
                                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all"
                                                   placeholder="Number of free items">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700 mb-2">Min Price Range *</label>
                                            <div class="relative">
                                                <input type="number" name="minPrice" min="0" step="0.01"
                                                       value="${voucher?.complimentaryConfig?.minPrice || 0}"
                                                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all"
                                                       placeholder="Minimum item price">
                                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</div>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-semibold text-gray-700 mb-2">Max Price Range *</label>
                                            <div class="relative">
                                                <input type="number" name="maxPrice" min="0" step="0.01"
                                                       value="${voucher?.complimentaryConfig?.maxPrice || ''}"
                                                       class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all"
                                                       placeholder="Maximum item price">
                                                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Purchase Requirements -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Minimum Purchase Amount</label>
                                    <div class="relative">
                                        <input type="number" name="minPurchase" min="0" step="0.01"
                                               value="${voucher?.minPurchase || 0}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                               placeholder="Minimum order value">
                                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</div>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Usage Limit</label>
                                    <input type="number" name="maxUses" min="0"
                                           value="${voucher?.maxUses || ''}"
                                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                                           placeholder="Leave empty for unlimited">
                                </div>
                            </div>

                            <!-- Expiry and Status -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                                    <input type="date" name="expiryDate"
                                           value="${voucher?.expiryDate ? new Date(voucher.expiryDate).toISOString().split('T')[0] : ''}"
                                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                                </div>
                                <div class="flex items-center pt-8">
                                    <label class="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" name="isActive" 
                                               ${voucher?.isActive !== false ? 'checked' : ''} 
                                               class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2">
                                        <span class="text-sm font-semibold text-gray-700">Active Voucher</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Form Actions -->
                            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button type="button" onclick="adminVouchers.render()" 
                                        class="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                    Cancel
                                </button>
                                <button type="submit" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all font-medium">
                                    <i class="fas ${voucher ? 'fa-save' : 'fa-plus'} mr-2"></i>
                                    ${voucher ? 'Update' : 'Create'} Voucher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            // Setup form interactions
            this.setupFormInteractions(voucherId);

        } catch (error) {
            console.error('Error showing voucher form:', error);
            content.innerHTML = `
                <div class="text-center py-16">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Error Loading Form</h3>
                    <p class="text-gray-600 mb-4">${error.message}</p>
                    <button onclick="adminVouchers.render()" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all">
                        Back to Vouchers
                    </button>
                </div>
            `;
        }
    },

    setupFormInteractions(voucherId) {
        const typeSelect = document.querySelector('select[name="type"]');
        const valueSection = document.getElementById('valueSection');
        const maxDiscountSection = document.getElementById('maxDiscountSection');
        const complimentaryConfig = document.getElementById('complimentaryConfig');
        const valueUnit = document.getElementById('valueUnit');

        // Handle type change
        typeSelect?.addEventListener('change', () => {
            const isComplimentary = typeSelect.value === 'complimentary';
            const isPercentage = typeSelect.value === 'percentage';
            
            valueSection.classList.toggle('hidden', isComplimentary);
            complimentaryConfig.classList.toggle('hidden', !isComplimentary);
            maxDiscountSection.classList.toggle('hidden', !isPercentage);
            
            if (valueUnit) {
                valueUnit.textContent = isPercentage ? '%' : '₹';
            }
        });

        // Handle form submission
        document.getElementById('voucher-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = e.target.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            try {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
                submitButton.disabled = true;
                
                const formData = new FormData(e.target);
                const data = {
                    code: formData.get('code'),
                    type: formData.get('type'),
                    value: formData.get('type') !== 'complimentary' ? Number(formData.get('value')) : null,
                    maxDiscount: formData.get('maxDiscount') ? Number(formData.get('maxDiscount')) : null,
                    maxUses: formData.get('maxUses') ? Number(formData.get('maxUses')) : null,
                    minPurchase: Number(formData.get('minPurchase')),
                    expiryDate: formData.get('expiryDate') || null,
                    isActive: formData.get('isActive') === 'on'
                };

                if (formData.get('type') === 'complimentary') {
                    data.complimentaryConfig = {
                        quantity: Number(formData.get('quantity')),
                        minPrice: Number(formData.get('minPrice')),
                        maxPrice: Number(formData.get('maxPrice'))
                    };
                }

                if (voucherId) {
                    await adminApi.updateVoucher(voucherId, data);
                } else {
                    await adminApi.addVoucher(data);
                }
                
                // Success feedback
                this.showSuccessMessage(voucherId ? 'Voucher updated successfully!' : 'Voucher created successfully!');
                setTimeout(() => this.render(), 1500);
                
            } catch (error) {
                console.error('Error saving voucher:', error);
                this.showErrorMessage(error.message || 'Failed to save voucher');
                
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    },

    showSuccessMessage(message) {
        const content = document.getElementById('main-content');
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform';
        successDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => successDiv.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            successDiv.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(successDiv), 300);
        }, 3000);
    },

    showErrorMessage(message) {
        const content = document.getElementById('main-content');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transform translate-x-full transition-transform';
        errorDiv.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            errorDiv.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(errorDiv), 300);
        }, 5000);
    },

    async toggleVoucherStatus(voucherId) {
        try {
            await adminApi.toggleVoucherStatus(voucherId);
            await this.loadVouchers();
            this.updateVouchersList();
            alert('Voucher status updated successfully');
        } catch (error) {
            console.error('Error toggling voucher status:', error);
            alert('Failed to update voucher status');
        }
    },

    async deleteVoucher(voucherId) {
        if (confirm('Are you sure you want to delete this voucher?')) {
            try {
                await adminApi.deleteVoucher(voucherId);
                await this.loadVouchers();
                this.updateVouchersList();
                alert('Voucher deleted successfully');
            } catch (error) {
                console.error('Error deleting voucher:', error);
                alert('Failed to delete voucher');
            }
        }
    },    async exportVouchers() {
        try {
            const vouchers = this.getFilteredVouchers();
            
            if (!vouchers.length) {
                alert('No vouchers to export');
                return;
            }

            // Prepare CSV data
            const headers = ['Code', 'Type', 'Value', 'Status', 'Usage', 'Min Purchase', 'Expiry Date', 'Created'];            const csvData = vouchers.map(voucher => [
                voucher.code,
                voucher.type,
                this.formatVoucherValue(voucher),
                this.getVoucherStatus(voucher),
                `${voucher.usedCount || 0}/${voucher.maxUses || '∞'}`,
                `₹${voucher.minPurchase || 0}`,
                voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : 'No expiry',
                voucher.createdAt ? new Date(voucher.createdAt).toLocaleDateString() : 'Unknown'
            ]);

            // Create CSV content
            const csvContent = [headers, ...csvData]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `vouchers-export-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccessMessage('Vouchers exported successfully!');
        } catch (error) {
            console.error('Error exporting vouchers:', error);
            this.showErrorMessage('Failed to export vouchers');
        }
    },

    animateElements() {
        // Add staggered animation to stats cards
        const statsCards = document.querySelectorAll('.stats-card');
        statsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Add fade-in animation to table rows
        setTimeout(() => {
            const voucherRows = document.querySelectorAll('.voucher-row');
            voucherRows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    row.style.transition = 'all 0.4s ease-out';
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, index * 50);
            });
        }, 800);
    }
};
