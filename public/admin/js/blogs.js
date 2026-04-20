// Blog Management for Admin Panel

// Utility functions for UI feedback
function showLoading(show = true) {
    const loadingEl = document.getElementById('loading-overlay') || createLoadingOverlay();
    if (show) {
        loadingEl.classList.remove('hidden');
        document.body.appendChild(loadingEl);
    } else {
        loadingEl.classList.add('hidden');
        if (loadingEl.parentNode) {
            loadingEl.parentNode.removeChild(loadingEl);
        }
    }
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 hidden';
    overlay.innerHTML = `
        <div class="bg-white rounded-lg p-6 flex flex-col items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600">Loading...</p>
        </div>
    `;
    return overlay;
}

function showAlert(message, type = 'info', duration = 5000) {
    const alertEl = document.createElement('div');
    const bgColor = {
        'success': 'bg-green-500',
        'error': 'bg-red-500',
        'warning': 'bg-yellow-500',
        'info': 'bg-blue-500'
    }[type] || 'bg-blue-500';

    alertEl.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    alertEl.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(alertEl);
    
    // Slide in
    setTimeout(() => {
        alertEl.classList.remove('translate-x-full');
    }, 100);

    // Auto remove
    setTimeout(() => {
        alertEl.classList.add('translate-x-full');
        setTimeout(() => {
            if (alertEl.parentNode) {
                alertEl.parentNode.removeChild(alertEl);
            }
        }, 300);
    }, duration);
}

class BlogManager {
    constructor() {
        this.apiBase = '/api';
        this.currentPage = 1;
        this.blogsPerPage = 10;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadBlogs();
    }

    setupEventListeners() {
        // Remove existing event listeners to prevent duplicates
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('submit', this.handleSubmit);
        document.removeEventListener('change', this.handleChange);
        
        // Bind event handlers to this instance
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        // Add event listeners
        document.addEventListener('click', this.handleClick);
        document.addEventListener('submit', this.handleSubmit);
        document.addEventListener('change', this.handleChange);

        // Search functionality
        const searchInput = document.querySelector('#blog-search');
        if (searchInput) {
            // Remove existing listeners
            searchInput.removeEventListener('input', this.handleSearch);
            this.handleSearch = this.handleSearch.bind(this);
            searchInput.addEventListener('input', this.handleSearch);
        }
    }

    handleClick(e) {
        // Handle create blog button
        if (e.target.matches('[data-action="create-blog"]') || e.target.closest('[data-action="create-blog"]')) {
            e.preventDefault();
            e.stopPropagation();
            this.showCreateModal();
            return;
        }
        
        // Handle edit blog button
        if (e.target.matches('[data-action="edit-blog"]') || e.target.closest('[data-action="edit-blog"]')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.matches('[data-action="edit-blog"]') ? e.target : e.target.closest('[data-action="edit-blog"]');
            const blogId = button.dataset.blogId;
            if (blogId) {
                this.showEditModal(blogId);
            }
            return;
        }
        
        // Handle delete blog button
        if (e.target.matches('[data-action="delete-blog"]') || e.target.closest('[data-action="delete-blog"]')) {
            e.preventDefault();
            e.stopPropagation();
            const button = e.target.matches('[data-action="delete-blog"]') ? e.target : e.target.closest('[data-action="delete-blog"]');
            const blogId = button.dataset.blogId;
            if (blogId) {
                this.deleteBlog(blogId);
            }
            return;
        }
        
        // Handle close modal button
        if (e.target.matches('[data-action="close-modal"]') || e.target.closest('[data-action="close-modal"]')) {
            e.preventDefault();
            e.stopPropagation();
            this.closeModal();
            return;
        }
    }

    handleSubmit(e) {
        if (e.target.matches('#blog-form')) {
            e.preventDefault();
            e.stopPropagation();
            this.handleFormSubmit(e.target);
        }
    }

    handleChange(e) {
        if (e.target.matches('#status-filter')) {
            this.currentFilter = e.target.value;
            this.currentPage = 1;
            this.loadBlogs();
        }
    }

    handleSearch(e) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.searchBlogs(e.target.value);
        }, 500);
    }

    // Fallback direct event listeners for buttons
    attachDirectEventListeners() {
        // Remove existing listeners
        document.querySelectorAll('.edit-blog-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleEditClick);
        });
        document.querySelectorAll('.delete-blog-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleDeleteClick);
        });

        // Add direct listeners
        document.querySelectorAll('.edit-blog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const blogId = btn.dataset.blogId;
                if (blogId) {
                    console.log('Direct edit click for blog:', blogId);
                    this.showEditModal(blogId);
                }
            });
        });

        document.querySelectorAll('.delete-blog-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const blogId = btn.dataset.blogId;
                if (blogId) {
                    console.log('Direct delete click for blog:', blogId);
                    this.deleteBlog(blogId);
                }
            });
        });
    }

    async loadBlogs() {
        try {
            showLoading(true);
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.blogsPerPage
            });

            if (this.currentFilter !== 'all') {
                params.append('status', this.currentFilter);
            }

            const response = await fetch(`${this.apiBase}/admin/blogs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            
            if (result.success) {
                this.renderBlogs(result.data.blogs);
                this.renderPagination(result.data.pagination);
            } else {
                showAlert('Failed to load blogs', 'error');
            }
        } catch (error) {
            console.error('Error loading blogs:', error);
            showAlert('Failed to load blogs', 'error');
        } finally {
            showLoading(false);
        }
    }

    renderBlogs(blogs) {
        const container = document.getElementById('blogs-container');
        if (!container) return;

        if (blogs.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <i class="fas fa-blog text-3xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
                    <p class="text-gray-500 mb-4">Get started by creating your first blog post.</p>
                    <button data-action="create-blog" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Create Blog
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = blogs.map(blog => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div class="flex">
                    <div class="w-48 h-32 bg-gray-200 flex-shrink-0">
                        <img src="${blog.images.main}" alt="${blog.heading}" 
                             class="w-full h-full object-cover" 
                             onerror="this.src='/assets/default-blog.jpg'">
                    </div>
                    <div class="flex-1 p-6">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-2">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusColor(blog.status)}">
                                        ${blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                    </span>
                                    ${blog.featured ? '<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Featured</span>' : ''}
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    ${blog.heading}
                                </h3>
                                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                                    ${blog.context.substring(0, 150)}...
                                </p>
                                <div class="flex items-center gap-4 text-sm text-gray-500">
                                    <span><i class="fas fa-eye mr-1"></i>${blog.views}</span>
                                    <span><i class="fas fa-calendar mr-1"></i>${new Date(blog.createdAt).toLocaleDateString()}</span>
                                    ${blog.tags.length > 0 ? `<span><i class="fas fa-tags mr-1"></i>${blog.tags.length} tags</span>` : ''}
                                </div>
                                ${blog.tags.length > 0 ? `
                                    <div class="flex flex-wrap gap-1 mt-2">
                                        ${blog.tags.slice(0, 3).map(tag => `
                                            <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">${tag}</span>
                                        `).join('')}
                                        ${blog.tags.length > 3 ? `<span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">+${blog.tags.length - 3}</span>` : ''}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="flex items-center gap-2 ml-4">
                                <button data-action="edit-blog" data-blog-id="${blog._id}" 
                                        class="edit-blog-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                        title="Edit Blog"
                                        type="button">
                                    <i class="fas fa-edit pointer-events-none"></i>
                                </button>
                                <button data-action="delete-blog" data-blog-id="${blog._id}" 
                                        class="delete-blog-btn p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                        title="Delete Blog"
                                        type="button">
                                    <i class="fas fa-trash pointer-events-none"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add direct event listeners as fallback
        this.attachDirectEventListeners();
    }

    getStatusColor(status) {
        const colors = {
            'draft': 'bg-gray-100 text-gray-800',
            'published': 'bg-green-100 text-green-800',
            'archived': 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || colors.draft;
    }

    renderPagination(pagination) {
        const container = document.getElementById('blogs-pagination');
        if (!container) return;

        const { currentPage, totalPages, hasNext, hasPrev } = pagination;

        container.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-500">
                    Page ${currentPage} of ${totalPages}
                </div>
                <div class="flex gap-2">
                    <button ${!hasPrev ? 'disabled' : ''} 
                            onclick="blogManager.changePage(${currentPage - 1})"
                            class="px-3 py-1 text-sm border rounded ${!hasPrev ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}">
                        Previous
                    </button>
                    <button ${!hasNext ? 'disabled' : ''} 
                            onclick="blogManager.changePage(${currentPage + 1})"
                            class="px-3 py-1 text-sm border rounded ${!hasNext ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}">
                        Next
                    </button>
                </div>
            </div>
        `;
    }

    changePage(page) {
        this.currentPage = page;
        this.loadBlogs();
    }

    async searchBlogs(query) {
        try {
            const params = new URLSearchParams({
                page: 1,
                limit: this.blogsPerPage,
                search: query
            });

            if (this.currentFilter !== 'all') {
                params.append('status', this.currentFilter);
            }

            const response = await fetch(`${this.apiBase}/admin/blogs?${params}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            
            if (result.success) {
                this.renderBlogs(result.data.blogs);
                this.renderPagination(result.data.pagination);
            }
        } catch (error) {
            console.error('Error searching blogs:', error);
        }
    }

    showCreateModal() {
        const modal = this.createBlogModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    async showEditModal(blogId) {
        try {
            const response = await fetch(`${this.apiBase}/admin/blogs/${blogId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            if (result.success) {
                const modal = this.createBlogModal(result.data);
                document.body.appendChild(modal);
                modal.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error loading blog for edit:', error);
            showAlert('Failed to load blog details', 'error');
        }
    }

    createBlogModal(blog = null) {
        const isEdit = !!blog;
        const modalId = 'blog-modal';
        
        // Remove existing modal
        const existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b">
                    <h2 class="text-xl font-semibold">${isEdit ? 'Edit Blog' : 'Create New Blog'}</h2>
                </div>
                <form id="blog-form" class="p-6 space-y-6" enctype="multipart/form-data">
                    ${isEdit ? `<input type="hidden" name="blogId" value="${blog._id}">` : ''}
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Heading *</label>
                        <input type="text" name="heading" required maxlength="200"
                               value="${blog?.heading || ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Context *</label>
                        <textarea name="context" required rows="6"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Write your blog content here...">${blog?.context || ''}</textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <input type="text" name="tags" 
                               value="${blog?.tags?.join(', ') || ''}"
                               placeholder="Enter tags separated by commas"
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                            <input type="file" name="mainImage" accept="image/*" ${!isEdit ? 'required' : ''}
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            ${blog?.images?.main ? `<img src="${blog.images.main}" alt="Current main image" class="mt-2 w-32 h-20 object-cover rounded">` : ''}
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Sub Image *</label>
                            <input type="file" name="subImage" accept="image/*" ${!isEdit ? 'required' : ''}
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            ${blog?.images?.sub ? `<img src="${blog.images.sub}" alt="Current sub image" class="mt-2 w-32 h-20 object-cover rounded">` : ''}
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select name="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="draft" ${blog?.status === 'draft' ? 'selected' : ''}>Draft</option>
                                <option value="published" ${blog?.status === 'published' ? 'selected' : ''}>Published</option>
                                <option value="archived" ${blog?.status === 'archived' ? 'selected' : ''}>Archived</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="flex items-center space-x-2 mt-6">
                                <input type="checkbox" name="featured" value="true" ${blog?.featured ? 'checked' : ''}
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="text-sm font-medium text-gray-700">Featured Blog</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                        <textarea name="metaDescription" rows="2" maxlength="160"
                                  placeholder="Brief description for SEO (max 160 characters)"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${blog?.metaDescription || ''}</textarea>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" data-action="close-modal"
                                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ${isEdit ? 'Update Blog' : 'Create Blog'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        return modal;
    }

    async handleFormSubmit(form) {
        try {
            showLoading(true);
            const formData = new FormData(form);
            const blogId = formData.get('blogId');
            const isEdit = !!blogId;

            const url = isEdit ? `${this.apiBase}/admin/blogs/${blogId}` : `${this.apiBase}/admin/blogs`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showAlert(`Blog ${isEdit ? 'updated' : 'created'} successfully`, 'success');
                this.closeModal();
                this.loadBlogs();
            } else {
                showAlert(result.message || `Failed to ${isEdit ? 'update' : 'create'} blog`, 'error');
            }
        } catch (error) {
            console.error('Error submitting blog form:', error);
            showAlert('An error occurred while saving the blog', 'error');
        } finally {
            showLoading(false);
        }
    }

    async deleteBlog(blogId) {
        if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        try {
            showLoading(true);
            const response = await fetch(`${this.apiBase}/admin/blogs/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            
            if (result.success) {
                showAlert('Blog deleted successfully', 'success');
                this.loadBlogs();
            } else {
                showAlert('Failed to delete blog', 'error');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showAlert('Failed to delete blog', 'error');
        } finally {
            showLoading(false);
        }
    }

    closeModal() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Initialize blog manager when needed
let blogManager;

// Function to render blogs page
function renderBlogsPage() {
    const content = `
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Blog Management</h1>
                    <p class="text-gray-600 mt-1">Create and manage your blog posts</p>
                </div>
                <button data-action="create-blog" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    Create Blog
                </button>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div class="flex flex-wrap items-center gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select id="status-filter" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input type="text" id="blog-search" 
                               placeholder="Search by title, content, or tags..."
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                </div>
            </div>

            <!-- Blogs List -->
            <div id="blogs-container" class="space-y-4">
                <!-- Blogs will be loaded here -->
            </div>

            <!-- Pagination -->
            <div id="blogs-pagination" class="flex justify-center">
                <!-- Pagination will be loaded here -->
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    
    // Clean up existing blog manager
    if (blogManager) {
        // Clean up any existing event listeners
        if (blogManager.handleClick) {
            document.removeEventListener('click', blogManager.handleClick);
        }
        if (blogManager.handleSubmit) {
            document.removeEventListener('submit', blogManager.handleSubmit);
        }
        if (blogManager.handleChange) {
            document.removeEventListener('change', blogManager.handleChange);
        }
    }
    
    // Create new blog manager instance
    blogManager = new BlogManager();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogManager, renderBlogsPage };
}
