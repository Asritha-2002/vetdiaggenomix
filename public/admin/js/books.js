const adminBooks = {
    books: [],
    bookVariants: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    currentPage: 1,
    itemsPerPage: 12,
    currentFilter: 'all',
    currentSort: 'newest',
    currencySymbol: '₹',
    currency: 'INR',

    formatCurrency(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return `${this.currencySymbol}0`;
        }
        return `${this.currencySymbol}${Number(amount).toLocaleString()}`;
    },

    formatCurrencyWithDecimals(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return `${this.currencySymbol}0.00`;
        }
        return `${this.currencySymbol}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    async render() {
        const content = document.getElementById('main-content');
        try {
            content.innerHTML = this.generateLoadingHTML();
            await this.loadBooks();
            content.innerHTML = this.generateBooksHTML();
            this.attachEventListeners();
            this.animateElements();
        } catch (error) {
            console.error('Books error:', error);
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
                    <p class="mt-4 text-gray-600 font-medium">Loading books...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Books</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminBooks.render()" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },

    async loadBooks(params = {}) {
        try {
            const queryParams = new URLSearchParams({
                page: this.currentPage,
                limit: this.itemsPerPage,
                sort: this.currentSort
            });

            // Add category filter if set
            const categoryFilter = document.getElementById('category-filter')?.value;
            if (categoryFilter && categoryFilter !== 'all') {
                queryParams.set('category', categoryFilter);
            }

            // Add search if set
            const searchTerm = document.getElementById('search-books')?.value;
            if (searchTerm && searchTerm.trim()) {
                queryParams.set('search', searchTerm.trim());
            }

            // Add stock filter if set
            const stockFilter = document.getElementById('stock-filter')?.value;
            if (stockFilter && stockFilter !== 'all') {
                queryParams.set('stockFilter', stockFilter);
            }

            // Add variant filter if set
            const variantFilter = document.getElementById('variant-filter')?.value;
            if (variantFilter && variantFilter !== 'all') {
                queryParams.set('variantFilter', variantFilter);
            }

            const response = await adminApi.getBooksWithPagination(queryParams);
            console.log('API Response:', response); // Debug log
            this.books = response.books || [];
            this.pagination = response.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                hasNextPage: false,
                hasPrevPage: false
            };
            console.log('Pagination object:', this.pagination); // Debug log
        } catch (error) {
            console.error('Error loading books:', error);
            this.books = [];
            this.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                hasNextPage: false,
                hasPrevPage: false
            };
        }
    },

    async loadProductVariants(productId) {
        try {
            const variants = await adminApi.getProductVariants(productId);
            return variants || [];
        } catch (error) {
            console.error('Error loading product variants:', error);
            return [];
        }
    },

    generateBooksHTML() {

        return `
            <!-- Books Header -->
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
                        <p class="text-gray-600">Manage your Product inventory and catalog</p>
                    </div>
                    <div class="mt-4 lg:mt-0 flex space-x-3">
                        <button onclick="adminBooks.exportBooks()" class="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <i class="fas fa-download mr-2"></i>Export
                        </button>
                        <button onclick="adminBooks.showAddBookModal()" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all">
                            <i class="fas fa-plus mr-2"></i>Add Product
                        </button>
                    </div>
                </div>
            </div>

            <!-- Books Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-book text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Products</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.pagination.totalItems?.toLocaleString() || 0}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-sitemap text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Main Products</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.books.filter(b => !b.parentProduct).length}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-copy text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Variants</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.books.filter(b => b.parentProduct).length}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Low Stock</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.books.filter(b => b.stock < 5).length}</p>
                    </div>
                </div>

                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-rupee-sign text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Page Value</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${this.formatCurrency(this.books.reduce((sum, b) => sum + (b.price * b.stock), 0))}</p>
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
                            <input type="text" id="search-books" placeholder="Search Products by title" 
                                   class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                        </div>
                    </div>
                    
                    <!-- Filters -->
                    <div class="flex space-x-4">
                        <select id="category-filter" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="all">All Categories</option>
                            ${[...new Set(this.books.map(b => b.category))].map(cat => `
                                <option value="${cat}">${cat}</option>
                            `).join('')}
                        </select>
                        
                        <select id="stock-filter" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="all">All Stock</option>
                            <option value="low">Low Stock (< 5)</option>
                            <option value="medium">Medium Stock (5-20)</option>
                            <option value="high">High Stock (> 20)</option>
                        </select>
                        
                        <select hidden id="variant-filter" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="all">All Products</option>
                            <option value="main">Main Products Only</option>
                            <option value="variants">Variants Only</option>
                        </select>
                        
                        <select id="sort-books" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="title">Title A-Z</option>
                        </select>
                        
                        <select id="items-per-page" class="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all">
                            <option value="12">12 per page</option>
                            <option value="24">24 per page</option>
                            <option value="48">48 per page</option>
                            <option value="96">96 per page</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Books Grid with Scrollable Container -->
            <div class="stats-card rounded-2xl overflow-hidden">
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">Products Catalog</h3>
                            <p class="text-gray-600 text-sm">Showing ${this.books.length} products on page ${this.pagination.currentPage} of ${this.pagination.totalPages}</p>
                        </div>
                        <div class="text-sm text-gray-500">
                            Page ${this.pagination.currentPage} of ${this.pagination.totalPages || 1}
                        </div>
                    </div>
                </div>
                
                <!-- Scrollable Grid Container -->
                <div class="p-6">
                    <div class="max-h-[calc(100vh-32rem)] overflow-y-auto scroll-smooth" style="scrollbar-width: thin; scrollbar-color: rgb(156 163 175) rgb(243 244 246);">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            ${this.generateBookCards(this.books)}
                        </div>
                    </div>
                </div>

                <!-- Enhanced Pagination -->
                ${this.books.length > 0 ? this.generatePaginationHTML() : ''}
            </div>
        `;
    },

    generateBookCards(books) {
        if (!books.length) {
            return `
                <div class="col-span-full text-center py-16">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-book text-gray-400 text-xl"></i>
                    </div>
                    <p class="text-gray-500">No books found</p>
                </div>
            `;
        }

        return books.map(book => {
            const parentProduct = book.parentProduct ? this.books.find(b => b._id === book.parentProduct) : null;
            const variants = this.books.filter(b => b.parentProduct === book._id);
            
            return `
            <div class="book-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover border border-gray-100" data-book-id="${book._id}">
                <div class="relative overflow-hidden">
                    <img src="${book.images?.[0]?.url || '/assets/default-book.jpg'}" 
                         alt="${book.title}"
                         class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="flex space-x-2">
                            <button onclick="adminBooks.editBook('${book._id}')" class="w-10 h-10 bg-white/90 hover:bg-white text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                                <i class="fas fa-edit text-sm"></i>
                            </button>
                            <button onclick="adminBooks.viewBook('${book._id}')" class="w-10 h-10 bg-white/90 hover:bg-white text-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                                <i class="fas fa-eye text-sm"></i>
                            </button>
                            ${!book.parentProduct ? `
                                <button onclick="adminBooks.createVariant('${book._id}')" class="w-10 h-10 bg-white/90 hover:bg-white text-purple-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                                    <i class="fas fa-copy text-sm"></i>
                                </button>
                            ` : ''}
                            <button onclick="adminBooks.deleteBook('${book._id}')" class="w-10 h-10 bg-white/90 hover:bg-white text-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                                <i class="fas fa-trash text-sm"></i>
                            </button>
                        </div>
                    </div>
                    ${book.stock < 5 ? `
                        <div class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium animate-pulse">
                            Low Stock: ${book.stock}
                        </div>
                    ` : ''}
                    ${book.parentProduct ? `
                        <div class="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium">
                            Variant
                        </div>
                    ` : variants.length > 0 ? `
                        <div class="absolute top-2 left-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
                            ${variants.length} Variant${variants.length > 1 ? 's' : ''}
                        </div>
                    ` : ''}
                    ${book.featured ? `
                        <div class="absolute top-2 ${book.parentProduct || variants.length > 0 ? 'right-2' : 'left-2'} px-2 py-1 bg-emerald-500 text-white text-xs rounded-full font-medium">
                            Featured
                        </div>
                    ` : ''}
                </div>
                <div class="p-4">
                    <div class="mb-3">
                        <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">${book.title}</h3>
                        ${book.parentProduct && parentProduct ? `
                            <p class="text-xs text-gray-500 mb-1">
                                <i class="fas fa-link mr-1"></i>Variant of: ${parentProduct.title}
                            </p>
                        ` : ''}
                        <span class="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg font-medium">${book.category}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-lg font-bold text-emerald-600">${this.formatCurrency(book.price)}</span>
                            ${book.originalPrice && book.originalPrice > book.price ? `
                                <span class="text-sm text-gray-400 line-through ml-1">${this.formatCurrency(book.originalPrice)}</span>
                            ` : ''}
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-800">Stock: ${book.stock}</p>
                            <div class="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                                <div class="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style="width: ${Math.min((book.stock / 50) * 100, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    },

    generatePaginationHTML() {
        const { currentPage, totalPages, totalItems } = this.pagination;
        const startItem = ((currentPage - 1) * this.itemsPerPage) + 1;
        const endItem = Math.min(currentPage * this.itemsPerPage, totalItems);

        // Calculate page range to show
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pages = [];
        
        // Generate page buttons
        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <button onclick="adminBooks.goToPage(${i})" 
                        class="px-3 py-2 text-sm font-medium ${i === currentPage ? 'text-white bg-emerald-500 border-emerald-500' : 'text-gray-500 bg-white hover:bg-gray-50 border-gray-200'} border rounded-lg transition-colors">
                    ${i}
                </button>
            `);
        }

        return `
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                        Showing ${startItem} to ${endItem} of ${totalItems} results
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="adminBooks.goToPage(${currentPage - 1})" 
                                ${currentPage === 1 ? 'disabled' : ''} 
                                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <i class="fas fa-chevron-left mr-1"></i>
                            Previous
                        </button>
                        
                        ${startPage > 1 ? `
                            <button onclick="adminBooks.goToPage(1)" 
                                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                                1
                            </button>
                            ${startPage > 2 ? '<span class="px-2 py-2 text-gray-500">...</span>' : ''}
                        ` : ''}
                        
                        ${pages.join('')}
                        
                        ${endPage < totalPages ? `
                            ${endPage < totalPages - 1 ? '<span class="px-2 py-2 text-gray-500">...</span>' : ''}
                            <button onclick="adminBooks.goToPage(${totalPages})" 
                                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                                ${totalPages}
                            </button>
                        ` : ''}
                        
                        <button onclick="adminBooks.goToPage(${currentPage + 1})" 
                                ${currentPage === totalPages ? 'disabled' : ''} 
                                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            Next
                            <i class="fas fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    attachEventListeners() {
        // Search functionality with debounce
        const searchInput = document.getElementById('search-books');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentPage = 1;
                    this.refreshBooks();
                }, 500); // 500ms debounce
            });
        }

        // Filter functionality
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.refreshBooks();
            });
        }

        const stockFilter = document.getElementById('stock-filter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.refreshBooks();
            });
        }

        const variantFilter = document.getElementById('variant-filter');
        if (variantFilter) {
            variantFilter.addEventListener('change', () => {
                this.currentPage = 1;
                this.refreshBooks();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-books');
        if (sortSelect) {
            sortSelect.value = this.currentSort;
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.refreshBooks();
            });
        }

        // Items per page functionality
        const itemsPerPageSelect = document.getElementById('items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.value = this.itemsPerPage.toString();
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.refreshBooks();
            });
        }
    },

    async refreshBooks() {
        try {
            const gridContainer = document.querySelector('.max-h-\\[calc\\(100vh-32rem\\)\\] .grid');
            const paginationContainer = document.querySelector('.stats-card .px-6.py-4.border-t');
            const statsContainer = document.querySelector('.text-gray-600.text-sm');
            
            if (gridContainer) {
                // Show loading state
                gridContainer.innerHTML = `
                    <div class="col-span-full flex items-center justify-center py-16">
                        <div class="text-center">
                            <div class="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                            <p class="mt-2 text-gray-600">Loading...</p>
                        </div>
                    </div>
                `;
            }

            await this.loadBooks();

            // Update books grid
            if (gridContainer) {
                gridContainer.innerHTML = this.generateBookCards(this.books);
            }

            // Update pagination
            if (paginationContainer && this.pagination.totalPages > 1) {
                paginationContainer.outerHTML = this.generatePaginationHTML();
            } else if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }

            // Update stats display
            if (statsContainer) {
                statsContainer.innerHTML = `Showing ${this.books.length} products on page ${this.pagination.currentPage} of ${this.pagination.totalPages}`;
            }

        } catch (error) {
            console.error('Error refreshing books:', error);
            const gridContainer = document.querySelector('.max-h-\\[calc\\(100vh-32rem\\)\\] .grid');
            if (gridContainer) {
                gridContainer.innerHTML = `
                    <div class="col-span-full text-center py-16">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                        </div>
                        <p class="text-gray-500">Failed to load books</p>
                        <button onclick="adminBooks.refreshBooks()" class="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                            Try Again
                        </button>
                    </div>
                `;
            }
        }
    },

    async goToPage(page) {
        if (page >= 1 && page <= this.pagination.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            await this.refreshBooks();
        }
    },    async showAddBookModal() {
        this.showBookModal();
    },

    async editBook(bookId) {
        try {
            const book = this.books.find(b => b._id === bookId);
            if (!book) {
                this.showNotification('Book not found', 'error');
                return;
            }
            this.showBookModal(book);
        } catch (error) {
            console.error('Error editing book:', error);
            this.showNotification('Failed to load book for editing', 'error');
        }
    },


    async editVariant(variantId) {
        try {
            const variant = this.bookVariants.find(v => v._id === variantId);
            if (!variant) {
                this.showNotification('Variant not found', 'error');
                return;
            }
            this.showBookModal(variant);
        } catch (error) {
            console.error('Error editing variant:', error);
            this.showNotification('Failed to load variant for editing', 'error');
        }
    },

    async createVariant(parentBookId) {
        try {
            const parentBook = this.books.find(b => b._id === parentBookId);
            if (!parentBook) {
                this.showNotification('Parent book not found', 'error');
                return;
            }
            const randomSuffix = Math.floor(Math.random() * 1000);
            
            // Create a variant object with parent data as template
            const variantTemplate = {
                title: `(Variant-${randomSuffix}) ${parentBook.title}`,
                slug: `(Variant-${randomSuffix})-${parentBook.title}`,
                description: parentBook.description,
                category: parentBook.category,
                parentProduct: parentBook._id,
                price: parentBook.price,
                originalPrice: parentBook.originalPrice,
                stock: 0,
                productDetails: parentBook.productDetails ? [...parentBook.productDetails] : []
            };
            
            this.showBookModal(variantTemplate, true);
        } catch (error) {
            console.error('Error creating variant:', error);
            this.showNotification('Failed to create variant', 'error');
        }
    },


    async viewVariant(variantId) {
        try {
            const variant = this.bookVariants.find(v => v._id === variantId);
            if (!variant) {
                this.showNotification('Variant not found', 'error');
                return;
            }
            this.showBookDetailsModal(variant);
        } catch (error) {
            console.error('Error viewing variant:', error);
            this.showNotification('Failed to load variant details', 'error');
        }
    },

    async viewBook(bookId) {
        try {
            const book = this.books.find(b => b._id === bookId);
            if (!book) {
                this.showNotification('Book not found', 'error');
                return;
            }
            this.showBookDetailsModal(book);
        } catch (error) {
            console.error('Error viewing book:', error);
            this.showNotification('Failed to load book details', 'error');
        }
    },    async deleteBook(bookId) {
        if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            try {
                await adminApi.deleteBook(bookId);
                await this.loadBooks();
                // Refresh the entire books display to update stats and pagination
                const content = document.getElementById('main-content');
                content.innerHTML = this.generateBooksHTML();
                this.attachEventListeners();
                this.animateElements();
                this.showNotification('Book deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting book:', error);
                this.showNotification('Failed to delete book', 'error');
            }
        }
    },async exportBooks() {
        try {
            this.showNotification('Generating export file...', 'info');
            
            const csvContent = this.generateBooksCSV();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `books-export-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('Books exported successfully', 'success');
            } else {
                throw new Error('Browser does not support file downloads');
            }
        } catch (error) {
            console.error('Error exporting books:', error);
            this.showNotification('Failed to export books', 'error');
        }
    },

    generateBooksCSV() {
        const headers = [
            'Title',  'Category', 'skuId', 'Price', 'Original Price',
            'Stock',  'Featured', 'Available',
            'Description', 'Tags', 'Created Date'
        ];
        
        const csvRows = [headers.join(',')];

        this.books.forEach(book => {
            const row = [
                `"${book.title || ''}"`,
                `"${book.author || ''}"`,
                `"${book.category || ''}"`,
                `"${book.skuId || ''}"`,
                book.price || 0,
                book.originalPrice || '',
                book.stock || 0,
                `"${book.publisher || ''}"`,
                book.publicationYear || '',
                book.featured ? 'Yes' : 'No',
                book.available ? 'Yes' : 'No',
                `"${(book.description || '').replace(/"/g, '""')}"`,
                `"${book.tags?.join('; ') || ''}"`,
                `"${new Date(book.createdAt).toLocaleDateString()}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    },    showBookModal(book = null, variant=false) {
        const isEdit = book !== null;
        const isVariant = variant;
        const categories = [...new Set(this.books.map(b => b.category))];
        
        const modalHTML = `
            <div id="book-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-morphism w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 max-h-[95vh]">
                    <!-- Modal Header -->
                    <div class="px-8 py-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-white/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                                     ${isVariant ? `<i class="fas fa-tags"></i>` : isEdit ? `<i class="fas fa-edit"></i>` : `<i class="fas fa-plus"></i>`}
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-800">${isVariant ? 'Create Variant' : isEdit ? 'Edit Product' : 'Add New Product'}</h3>
                                    <p class="text-gray-600">${isVariant ? 'Create a new variant for the selected product' : isEdit ? 'Modify the details of the product' : 'Fill in the details to add a new product'}</p>
                                </div>
                            </div>
                            <button onclick="this.closest('#book-modal').remove()" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Modal Content -->
                    <div class="max-h-[calc(95vh-8rem)] overflow-y-auto p-8">
                        <form id="book-form" class="space-y-8" enctype="multipart/form-data">
                            <!-- Basic Information -->
                            <div class="bg-gray-50 rounded-2xl p-6">
                                <h4 class="text-lg font-semibold text-gray-800 mb-6">Basic Information</h4>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                                        <input type="text" name="title" required
                                               value="${book?.title || ''}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                               placeholder="Enter product title">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">SKU Id</label>
                                        <input type="text" name="skuId"
                                               value="${book?.skuId || ''}"
                                               ${isVariant ? '' : isEdit ? 'readonly' : ''}
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${isVariant ? '' : isEdit ? 'bg-gray-100' : ''}"
                                               placeholder="SKU Id number">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                                        <input readonly type="text" name="slug" required
                                               value="${book?.slug || ''}"
                                               class="w-full px-4 py-3 border bg-gray-100 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                               placeholder="product-url-slug">
                                        <p class="text-xs text-gray-500 mt-1">URL-friendly identifier (lowercase, hyphens only)</p>
                                    </div>
                                      <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                        <div class="relative">
                                            <select id="category-select" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white">
                                                <option value="">Select existing category</option>
                                                ${categories.map(cat => `
                                                    <option value="${cat}" ${book?.category === cat ? 'selected' : ''}>${cat}</option>
                                                `).join('')}
                                                <option value="__new__">+ Add New Category</option>
                                            </select>
                                            <input type="text" name="category" required
                                                   value="${book?.category || ''}"
                                                   ${book?.category && categories.includes(book.category) ? 'style="display: none;"' : ''}
                                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mt-2"
                                                   placeholder="Enter new category name"
                                                   id="category-input">
                                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <i class="fas fa-chevron-down text-gray-400"></i>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                            <input type="number" name="price" required min="0" step="0.01"
                                                   value="${book?.price || ''}"
                                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                   placeholder="0.00">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                                            <input type="number" name="originalPrice" min="0" step="0.01"
                                                   value="${book?.originalPrice || ''}"
                                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                   placeholder="0.00">
                                            <p class="text-xs text-gray-500 mt-1">Leave empty if no discount</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                        <input type="number" name="stock" required min="0"
                                               value="${book?.stock || ''}"
                                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                               placeholder="0">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Parent Product</label>
                                        <div class="relative">
                                            <select name="parentProduct" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white">
                                                <option value="">No Parent (Main Product)</option>
                                                ${this.books
                                                    .filter(b => !b.parentProduct && (!book || b._id !== book._id))
                                                    .map(parentBook => `
                                                        <option value="${parentBook._id}" ${book?.parentProduct === parentBook._id ? 'selected' : ''}>
                                                            ${parentBook.title} (${parentBook.category})
                                                        </option>
                                                    `).join('')}
                                            </select>
                                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <i class="fas fa-chevron-down text-gray-400"></i>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500 mt-1">Select a parent product to create a variant. Leave empty for main products.</p>
                                    </div>
                                    
                                    <div class="lg:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                        <textarea name="description" rows="4" required
                                                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                                  placeholder="Enter book description...">${book?.description || ''}</textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Product Details -->
                            <div class="bg-gray-50 rounded-2xl p-6">
                                <div class="flex items-center justify-between mb-6">
                                    <h4 class="text-lg font-semibold text-gray-800">Product Details</h4>
                                    <button type="button" onclick="adminBooks.addProductDetail()" class="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium">
                                        <i class="fas fa-plus mr-2"></i>Add Detail
                                    </button>
                                </div>
                                <div id="product-details" class="space-y-3">
                                    ${book?.productDetails?.map(detail => `
                                        <div class="flex gap-3">
                                            <input type="text" name="detail-labels[]" placeholder="Label" 
                                                   value="${detail.label}" 
                                                   class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                            <input type="text" name="detail-values[]" placeholder="Value" 
                                                   value="${detail.value}" 
                                                   class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                            <button type="button" onclick="this.parentElement.remove()" class="px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `).join('') || `
                                        <div class="flex gap-3">
                                            <input type="text" name="detail-labels[]" placeholder="Label" 
                                                   class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                            <input type="text" name="detail-values[]" placeholder="Value" 
                                                   class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                                            <button type="button" onclick="this.parentElement.remove()" class="px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `}
                                </div>
                            </div>

                            <!-- Images Section -->
                            <div class="bg-gray-50 rounded-2xl p-6">
                                <h4 class="text-lg font-semibold text-gray-800 mb-6">Images</h4>
                                
                                ${book?.images?.length > 0 ? `
                                    <div class="mb-6">
                                        <h5 class="text-sm font-medium text-gray-700 mb-3">Existing Images</h5>
                                        <div class="grid grid-cols-4 gap-3">
                                            ${book.images.map(img => `
                                                <div class="relative group">
                                                    <img src="${img.url}" class="w-full h-24 object-cover rounded-xl border border-gray-200">
                                                    <button type="button" 
                                                            class="delete-image absolute top-1 right-1 bg-red-500 text-white 
                                                                   rounded-full w-6 h-6 flex items-center justify-center 
                                                                   opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                                                            data-id="${img.public_id}">×</button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                  <div>
                                    <h5 class="text-sm font-medium text-gray-700 mb-3">Add New Images</h5>
                                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                        <input type="file" name="bookImages" multiple accept="image/*" class="hidden" id="book-images">
                                        <div id="new-image-preview" class="grid grid-cols-4 gap-3 mb-4"></div>
                                        <button type="button" onclick="document.getElementById('book-images').click()" class="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors font-medium">
                                            <i class="fas fa-cloud-upload-alt mr-2"></i>Upload Images
                                        </button>
                                        <p class="text-sm text-gray-500 mt-2">Upload book cover and additional images</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Videos Section -->
                            <div class="bg-gray-50 rounded-2xl p-6">
                                <h4 class="text-lg font-semibold text-gray-800 mb-6">Videos</h4>
                                
                                ${book?.videos?.length > 0 ? `
                                    <div class="mb-6">
                                        <h5 class="text-sm font-medium text-gray-700 mb-3">Existing Videos</h5>
                                        <div class="grid grid-cols-2 gap-3">
                                            ${book.videos.map(video => `
                                                <div class="relative group">
                                                    <video src="${video.path}" class="w-full h-32 object-cover rounded-xl border border-gray-200"></video>
                                                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 rounded-b-xl">
                                                        <p class="text-white text-sm">${video.title}</p>
                                                    </div>
                                                    <button type="button" 
                                                            class="delete-video absolute top-1 right-1 bg-red-500 text-white 
                                                                   rounded-full w-6 h-6 flex items-center justify-center 
                                                                   opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                                                            data-id="${video.path}">×</button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                  <div>
                                    <h5 class="text-sm font-medium text-gray-700 mb-3">Add New Videos</h5>
                                    <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                        <input type="file" name="bookVideos" multiple accept="video/*" class="hidden" id="book-videos">
                                        <button type="button" onclick="document.getElementById('book-videos').click()" class="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors font-medium">
                                            <i class="fas fa-video mr-2"></i>Upload Videos
                                        </button>
                                        <p class="text-sm text-gray-500 mt-2">Max size: 100MB per video</p>
                                        <div id="video-titles" class="mt-4"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Variants Section - Only show for main products (non-variants) -->
                            ${book && !book.parentProduct ? `
                                <div class="bg-gray-50 rounded-2xl p-6">
                                    <div class="flex items-center justify-between mb-6">
                                        <h4 class="text-lg font-semibold text-gray-800">
                                            <i class="fas fa-sitemap mr-2 text-purple-600"></i>Product Variants
                                        </h4>
                                        <button type="button" onclick="adminBooks.createVariant('${book._id}')" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                                            <i class="fas fa-plus mr-2"></i>Add Variant
                                        </button>
                                    </div>
                                    
                                    <div id="variants-container">
                                        <!-- Variants will be loaded dynamically -->
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- Form Actions -->
                            <div class="flex space-x-4 pt-6 border-t border-gray-200">
                                <button type="button" onclick="this.closest('#book-modal').remove()" 
                                        class="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                    Cancel
                                </button>
                                <button type="submit"
                                        class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-medium">
                                    ${isVariant ? 'Create Variant' : isEdit ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Wait for DOM to be ready, then attach event listeners
        setTimeout(async () => {
            // Load variants if this is a main product
            if (book && !book.parentProduct) {
                const variantsContainer = document.getElementById('variants-container');
                if (variantsContainer) {
                    variantsContainer.innerHTML = '<div class="text-center py-4"><div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div><p class="mt-2 text-gray-500">Loading variants...</p></div>';
                    const variantCardsHTML = await this.generateVariantCards(book._id);
                    variantsContainer.innerHTML = variantCardsHTML;
                }
            }
            
            // Auto-generate slug from title
        const titleInput = document.querySelector('input[name="title"]');
        const slugInput = document.querySelector('input[name="slug"]');
        
        // Store the original slug to compare against
        const originalSlug = slugInput.value;
        let hasManuallyEditedSlug = false;
        
        // Track if user manually edits the slug
        slugInput.addEventListener('input', () => {
            hasManuallyEditedSlug = true;
        });
        
        titleInput.addEventListener('input', (e) => {
            const title = e.target.value;
            const newSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single
                .trim()
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            
            // Auto-update slug if:
            // 1. It's a new book (no book object), OR
            // 2. Current slug is empty, OR  
            // 3. User hasn't manually edited the slug field yet
            const shouldAutoUpdate = !book || !slugInput.value || !hasManuallyEditedSlug;
            
            if (shouldAutoUpdate) {
                slugInput.value = newSlug;
            }
        });
        
        // Validate slug format with debouncing
        let slugTimeout;
        slugInput.addEventListener('input', (e) => {
            clearTimeout(slugTimeout);
            slugTimeout = setTimeout(() => {
                let value = e.target.value;
                const originalValue = value;
                value = value
                    .toLowerCase()
                    .replace(/[^a-z0-9-_]/g, '') // Allow lowercase letters, numbers, hyphens, and underscores
                    .replace(/[-_]+/g, '-') // Replace multiple hyphens/underscores with single hyphen
                    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
                
                // Only update if the value actually changed to avoid cursor jumping
                if (value !== originalValue) {
                    e.target.value = value;
                }
            }, 300); // 300ms delay
        });
        
        // Also validate on blur for immediate feedback
        slugInput.addEventListener('blur', (e) => {
            let value = e.target.value;
            value = value
                .toLowerCase()
                .replace(/[^a-z0-9-_]/g, '')
                .replace(/[-_]+/g, '-')
                .replace(/^-+|-+$/g, '');
            e.target.value = value;
        });

        // Handle category selection
        const categorySelect = document.getElementById('category-select');
        const categoryInput = document.getElementById('category-input');
        
        categorySelect.addEventListener('change', (e) => {
            if (e.target.value === '__new__') {
                categoryInput.style.display = 'block';
                categoryInput.required = true;
                categoryInput.focus();
                categoryInput.value = '';
            } else if (e.target.value === '') {
                categoryInput.style.display = 'block';
                categoryInput.required = true;
                categoryInput.value = '';
            } else {
                categoryInput.style.display = 'none';
                categoryInput.required = false;
                categoryInput.value = e.target.value;
            }
        });

        // Handle image preview for new uploads
        const imageInput = document.querySelector('input[name="bookImages"]');
        imageInput.addEventListener('change', (e) => {
            const preview = document.getElementById('new-image-preview');
            preview.innerHTML = '';
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML += `
                        <div class="relative">
                            <img src="${e.target.result}" class="w-full h-24 object-cover rounded-xl border border-gray-200">
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            });
        });

        // Handle video uploads
        const videoInput = document.querySelector('input[name="bookVideos"]');
        videoInput.addEventListener('change', (e) => {
            const titleContainer = document.getElementById('video-titles');
            titleContainer.innerHTML = Array.from(e.target.files).map((file, index) => `
                <div class="mt-3">
                    <input type="text" 
                           name="videoTitles[]" 
                           placeholder="Title for ${file.name}"
                           class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                </div>
            `).join('');
        });

        // Handle deletion of existing images and videos
        document.querySelectorAll('.delete-image').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Delete this image?')) {
                    const imageId = e.target.dataset.id;
                    try {
                        await adminApi.deleteBookImage(book._id, imageId);
                        e.target.parentElement.remove();
                    } catch (error) {
                        alert('Failed to delete image');
                    }
                }
            });
        });

        document.querySelectorAll('.delete-video').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Delete this video?')) {
                    const videoPath = e.target.dataset.id;
                    try {
                        await adminApi.deleteBookVideo(book._id, videoPath);
                        e.target.parentElement.remove();
                    } catch (error) {
                        alert('Failed to delete video');
                    }
                }
            });
        });

        // Handle form submission
        document.getElementById('book-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = isEdit ? 'Updating...' : 'Adding...';
                
                const formData = new FormData();

                // Add basic fields
                const basicFields = ['title', 'description', 'price', 'originalPrice', 'stock', 'skuId', 'category', 'slug', 'parentProduct'];
                basicFields.forEach(field => {
                    const value = e.target[field].value;
                    if (value) {
                        formData.append(field, value);
                    }
                });

                // Add product details
                const productDetails = Array.from(document.getElementsByName('detail-labels[]')).map((label, index) => ({
                    label: label.value,
                    value: document.getElementsByName('detail-values[]')[index].value
                })).filter(detail => detail.label && detail.value);
                
                if (productDetails.length > 0) {
                    formData.append('productDetails', JSON.stringify(productDetails));
                }

                // Add images - name must match multer field name
                const imageFiles = e.target.bookImages.files;
                for (let i = 0; i < imageFiles.length; i++) {
                    formData.append('bookImages', imageFiles[i]);
                }

                // Add videos - name must match multer field name
                const videoFiles = e.target.bookVideos.files;
                for (let i = 0; i < videoFiles.length; i++) {
                    formData.append('bookVideos', videoFiles[i]);
                }

                // Add video titles
                const videoTitles = Array.from(document.getElementsByName('videoTitles[]'))
                    .map(input => input.value.trim())
                    .filter(Boolean);
                if (videoTitles.length > 0) {
                    formData.append('videoTitles', JSON.stringify(videoTitles));
                }

                // const response = isEdit ? 
                //     await adminApi.updateBook(book._id, formData) :
                //     await adminApi.addBook(formData);

                const response = isVariant ? await adminApi.addBook(formData) : isEdit ? await adminApi.updateBook(book._id, formData) : await adminApi.addBook(formData);

                if (response.error) {
                    throw new Error(response.error);
                }
                
                document.getElementById('book-modal').remove();
                await this.refreshBooks();
                
                // If a variant was added/updated, refresh variants in any open modal
                const parentProductId = formData.get('parentProduct');
                if (parentProductId) {
                    // Check if there's another modal open with variants container
                    const otherModal = document.querySelector('#book-modal #variants-container');
                    if (otherModal) {
                        await this.refreshVariantsContainer(parentProductId);
                    }
                }

                this.showNotification(`Product ${isVariant ? 'Variant created' : isEdit ? 'updated' : 'added'} successfully`, 'success');
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification(error.message || `Failed to ${isEdit ? 'update' : 'add'} product`, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
        }, 100); // End setTimeout
    },

    showBookDetailsModal(book) {
        const parentProduct = book.parentProduct ? this.books.find(b => b._id === book.parentProduct) : null;
        const variants = this.books.filter(b => b.parentProduct === book._id);
        
        const modalHTML = `
            <div id="book-details-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="glass-morphism w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 max-h-[95vh]">
                    <!-- Modal Header -->
                    <div class="px-8 py-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-b border-white/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                                    <i class="fas fa-book"></i>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-800">${book.title}</h3>
                                    <p class="text-gray-600"> ${book.category} | SKU: ${book.skuId || 'N/A'}</p>
                                </div>
                            </div>
                            <button onclick="this.closest('#book-details-modal').remove()" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Modal Content -->
                    <div class="max-h-[calc(95vh-8rem)] overflow-y-auto p-8">
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <!-- Book Image -->
                            <div class="lg:col-span-1">
                                <div class="sticky top-0">
                                    <img src="${book.images?.[0]?.url || '/assets/default-book.jpg'}" 
                                         alt="${book.title}"
                                         class="w-full h-auto rounded-2xl shadow-lg border border-gray-200">
                                    
                                    ${book.images?.length > 1 ? `
                                        <div class="grid grid-cols-3 gap-2 mt-4">
                                            ${book.images.slice(1, 4).map(img => `
                                                <img src="${img.url}" alt="Book image" class="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity">
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <!-- Book Details -->
                            <div class="lg:col-span-2 space-y-6">
                                <!-- Price and Stock -->
                                <div class="bg-gray-50 rounded-2xl p-6">
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-600">Current Price</p>
                                            <p class="text-2xl font-bold text-emerald-600">₹${book.price?.toLocaleString()}</p>
                                            ${book.originalPrice && book.originalPrice > book.price ? `
                                                <p class="text-sm text-gray-400 line-through">₹${book.originalPrice.toLocaleString()}</p>
                                            ` : ''}
                                        </div>
                                        <div class="text-center">
                                            <p class="text-sm text-gray-600">Stock Available</p>
                                            <p class="text-2xl font-bold ${book.stock < 5 ? 'text-red-600' : 'text-gray-800'}">${book.stock}</p>
                                            <p class="text-sm ${book.stock < 5 ? 'text-red-500' : 'text-green-500'}">${book.stock < 5 ? 'Low Stock' : 'In Stock'}</p>
                                        </div>
                                        <div class="text-center">
                                            <p class="text-sm text-gray-600">Status</p>
                                            <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium ${book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                ${book.stock > 0 ? 'Available' : 'Unavailable'}
                                            </span>
                                            ${book.featured ? '<p class="text-sm text-yellow-600 mt-1"><i class="fas fa-star mr-1"></i>Featured</p>' : ''}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Book Information -->
                                <div class="bg-gray-50 rounded-2xl p-6">
                                    <h4 class="font-semibold text-gray-800 mb-4"> Information</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="text-sm text-gray-600">Category</label>
                                            <p class="font-medium text-gray-900">${book.category}</p>
                                        </div>
                                        ${book.skuId ? `
                                            <div>
                                                <label class="text-sm text-gray-600">skuId</label>
                                                <p class="font-medium text-gray-900 font-mono">${book.skuId}</p>
                                            </div>
                                        ` : ''}
                                        ${book.publisher ? `
                                            <div>
                                                <label class="text-sm text-gray-600">Publisher</label>
                                                <p class="font-medium text-gray-900">${book.publisher}</p>
                                            </div>
                                        ` : ''}
                                        ${book.publicationYear ? `
                                            <div>
                                                <label class="text-sm text-gray-600">Publication Year</label>
                                                <p class="font-medium text-gray-900">${book.publicationYear}</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                ${book.description ? `
                                    <div class="bg-gray-50 rounded-2xl p-6">
                                        <h4 class="font-semibold text-gray-800 mb-4">Description</h4>
                                        <p class="text-gray-700 leading-relaxed">${book.description}</p>
                                    </div>
                                ` : ''}
                                
                                ${book.tags?.length ? `
                                    <div class="bg-gray-50 rounded-2xl p-6">
                                        <h4 class="font-semibold text-gray-800 mb-4">Tags</h4>
                                        <div class="flex flex-wrap gap-2">
                                            ${book.tags.map(tag => `
                                                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">${tag}</span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <!-- Variant Information -->
                                ${parentProduct || variants.length > 0 ? `
                                    <div class="bg-gray-50 rounded-2xl p-6">
                                        <h4 class="font-semibold text-gray-800 mb-4">
                                            <i class="fas fa-sitemap mr-2"></i>Product Variants
                                        </h4>
                                        
                                        ${parentProduct ? `
                                            <div class="mb-4">
                                                <p class="text-sm text-gray-600 mb-2">This is a variant of:</p>
                                                <div class="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                                                    <img src="${parentProduct.images?.[0]?.url || '/assets/default-book.jpg'}" 
                                                         class="w-12 h-12 object-cover rounded-lg mr-3">
                                                    <div class="flex-1">
                                                        <h5 class="font-medium text-gray-900">${parentProduct.title}</h5>
                                                        <p class="text-sm text-gray-500">₹${parentProduct.price?.toLocaleString()}</p>
                                                    </div>
                                                    <button onclick="adminBooks.viewBook('${parentProduct._id}'); this.closest('#book-details-modal').remove();" 
                                                            class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm">
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        ` : ''}
                                        
                                        ${variants.length > 0 ? `
                                            <div>
                                                <p class="text-sm text-gray-600 mb-2">Available variants (${variants.length}):</p>
                                                <div class="space-y-2 max-h-40 overflow-y-auto">
                                                    ${variants.map(variant => `
                                                        <div class="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                                                            <img src="${variant.images?.[0]?.url || '/assets/default-book.jpg'}" 
                                                                 class="w-12 h-12 object-cover rounded-lg mr-3">
                                                            <div class="flex-1">
                                                                <h5 class="font-medium text-gray-900">${variant.title}</h5>
                                                                <p class="text-sm text-gray-500">
                                                                    ₹${variant.price?.toLocaleString()} | Stock: ${variant.stock}
                                                                </p>
                                                            </div>
                                                            <button onclick="adminBooks.viewBook('${variant._id}'); this.closest('#book-details-modal').remove();" 
                                                                    class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm">
                                                                View
                                                            </button>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : ''}
                                
                                <!-- Action Buttons -->
                                <div class="flex space-x-4 pt-6 border-t border-gray-200">
                                    <button onclick="adminBooks.editBook('${book._id}'); this.closest('#book-details-modal').remove();" 
                                            class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-medium">
                                        <i class="fas fa-edit mr-2"></i>Edit Product
                                    </button>
                                    <button onclick="this.closest('#book-details-modal').remove()" 
                                            class="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                        Close
                                    </button>
                                </div>
                            </div>
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
    },    animateElements() {
        const cards = document.querySelectorAll('.book-card');
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

    addProductDetail() {
        const container = document.getElementById('product-details');
        const newDetail = document.createElement('div');
        newDetail.className = 'flex gap-3';
        newDetail.innerHTML = `
            <input type="text" name="detail-labels[]" placeholder="Label" 
                   class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <input type="text" name="detail-values[]" placeholder="Value" 
                   class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <button type="button" onclick="this.parentElement.remove()" class="px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(newDetail);
    },

     async generateVariantCards(parentBookId) {
        const variants = await adminApi.getBookVariants(parentBookId);
        this.bookVariants = variants;

        if (variants.length === 0) {
            return `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-cube text-3xl mb-3 opacity-50"></i>
                    <p>No variants created yet</p>
                    <p class="text-sm">Click "Add Variant" to create the first variant</p>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                ${variants.map(variant => `
                    <div class="variant-card group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-400 border border-gray-200">
                        <div class="relative overflow-hidden">
                            <img src="${variant.images?.[0]?.url || '/assets/default-book.jpg'}" 
                                 alt="${variant.title}"
                                 class="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300">
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div class="flex space-x-2">
                                    <button onclick="adminBooks.editVariant('${variant._id}'); document.getElementById('book-modal').remove();" 
                                            class="w-8 h-8 bg-white/95 hover:bg-white text-blue-600 rounded-full flex items-center justify-center transition-colors shadow-md">
                                        <i class="fas fa-edit text-xs"></i>
                                    </button>
                                    <button onclick="adminBooks.viewVariant('${variant._id}'); document.getElementById('book-modal').remove();" 
                                            class="w-8 h-8 bg-white/95 hover:bg-white text-green-600 rounded-full flex items-center justify-center transition-colors shadow-md">
                                        <i class="fas fa-eye text-xs"></i>
                                    </button>
                                    <button onclick="adminBooks.deleteVariant('${variant._id}', '${parentBookId}')" 
                                            class="w-8 h-8 bg-white/95 hover:bg-white text-red-500 rounded-full flex items-center justify-center transition-colors shadow-md">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                            ${variant.stock < 5 ? `
                                <div class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-md font-medium">
                                    Low: ${variant.stock}
                                </div>
                            ` : ''}
                            <div class="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-md font-medium">
                                Variant
                            </div>
                            ${variant.featured ? `
                                <div class="absolute bottom-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-md font-medium">
                                    Featured
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="p-3">
                            <div class="mb-2">
                                <h4 class="font-medium text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors" title="${variant.title}">
                                    ${variant.title}
                                </h4>
                                <span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                                    ${variant.category}
                                </span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-base font-semibold text-gray-900">₹${variant.price?.toLocaleString()}</span>
                                ${variant.originalPrice && variant.originalPrice > variant.price ? `
                                    <span class="text-xs text-gray-500 line-through">₹${variant.originalPrice}</span>
                                ` : ''}
                            </div>
                            <div class="flex items-center justify-between text-xs text-gray-600">
                                <span>Stock: ${variant.stock}</span>
                                <div class="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style="width: ${Math.min((variant.stock / 50) * 100, 100)}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    async deleteVariant(variantId, parentBookId) {
        if (confirm('Are you sure you want to delete this variant? This action cannot be undone.')) {
            try {
                await adminApi.deleteBook(variantId);
                // Refresh variants display
                const container = document.getElementById('variants-container');
                if (container) {
                    container.innerHTML = '<div class="text-center py-4"><div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div><p class="mt-2 text-gray-500">Updating variants...</p></div>';
                    const variantCardsHTML = await this.generateVariantCards(parentBookId);
                    container.innerHTML = variantCardsHTML;
                }
                // Refresh main books list
                await this.refreshBooks();
                this.showNotification('Variant deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting variant:', error);
                this.showNotification('Failed to delete variant', 'error');
            }
        }
    },

    async refreshVariantsContainer(parentBookId) {
        const container = document.getElementById('variants-container');
        if (container) {
            container.innerHTML = '<div class="text-center py-4"><div class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div><p class="mt-2 text-gray-500">Refreshing variants...</p></div>';
            try {
                const variantCardsHTML = await this.generateVariantCards(parentBookId);
                container.innerHTML = variantCardsHTML;
            } catch (error) {
                container.innerHTML = '<div class="text-center py-4 text-red-500"><i class="fas fa-exclamation-triangle"></i><p class="mt-2">Failed to load variants</p></div>';
                console.error('Error refreshing variants:', error);
            }
        }
    }
};
