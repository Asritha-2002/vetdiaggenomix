let currentPage = 1;
const itemsPerPage = 12;
let currentCategory = '';

async function initializePage() {
    await loadCategories();
    setupFilters();
    loadProducts();
}

async function loadCategories() {
    try {
        const categories = await api.getCategories();
        const categoriesList = document.getElementById('categoriesList');
        
        categoriesList.innerHTML = `
            <button 
                class="px-4 py-2 rounded-full ${currentCategory === '' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}"
                onclick="filterByCategory('')">
                All
            </button>
            ${categories.map(cat => `
                <button 
                    class="px-4 py-2 rounded-full ${currentCategory === cat ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}"
                    onclick="filterByCategory('${cat}')">
                    ${cat}
                </button>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function setupFilters() {
    ['minPrice', 'maxPrice', 'sortBy'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            currentPage = 1;
            loadProducts();
        });
    });
}

function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    loadProducts();
    loadCategories(); // Refresh category buttons
}

async function loadProducts() {
    try {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const sortBy = document.getElementById('sortBy').value;

        const params = {
            page: currentPage,
            limit: itemsPerPage,
            category: currentCategory,
            minPrice,
            maxPrice,
            sort: sortBy
        };

        const response = await api.getBooks(params);
        let { books, totalPages } = response;

        // Client-side sorting if needed
        if (sortBy) {
            books = sortBooks(books, sortBy);
        }

        renderProducts(books);
        renderPagination(totalPages);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="col-span-full text-center text-red-500">
                Error loading products. Please try again.
            </div>`;
    }
}

function sortBooks(books, sortBy) {
    switch (sortBy) {
        case 'price-asc':
            return books.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return books.sort((a, b) => b.price - a.price);
        case 'popular':
            return books.sort((a, b) => (b.statistics?.views || 0) - (a.statistics?.views || 0));
        case 'newest':
            return books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        default:
            return books;
    }
}

function renderProducts(books) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!books || !books.length) {
        productsGrid.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-8">
                No books found. Try adjusting your filters.
            </div>`;
        return;
    }

    productsGrid.innerHTML = books.map(book => `
        <div class="bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:shadow-xl">
            <a href="/product-details/${book._id}" class="block relative group">
                <img src="${book.images?.[0]?.url || '/assets/default-book.jpg'}" 
                     alt="${book.title}"
                     class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105">
                ${book.stock < 1 ? 
                    '<span class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">Out of Stock</span>' 
                    : ''}
                ${book.originalPrice ? `
                    <span class="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                        -${Math.round((1 - book.price / book.originalPrice) * 100)}%
                    </span>
                ` : ''}
            </a>
            <div class="p-5">
                <h3 class="font-bold text-lg mb-2 line-clamp-1 text-gray-800">${book.title}</h3>
                <p class="text-gray-600 text-sm mb-3">${book.category}</p>
                <div class="flex justify-between items-end mb-3">
                    <div>
                        <p class="text-red-600 font-bold text-lg">₹${book.price}</p>
                        ${book.originalPrice ? `
                            <p class="text-gray-400 text-sm line-through">₹${book.originalPrice}</p>
                        ` : ''}
                    </div>
                    <div class="text-right text-sm text-gray-500">
                        <p>${book.statistics?.views || 0} views</p>
                      
                    </div>
                </div>
                <button onclick="quickView('${book._id}')"
                        class="w-full bg-gray-50 text-gray-800 py-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                    Quick View
                </button>
            </div>
        </div>
    `).join('');
}

qview = (bookId) => {
    window.location.href = `/product-details/${bookId}`;
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = `
        <button onclick="changePage(${currentPage - 1})"
                class="px-4 py-2 rounded-xl ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}"
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left mr-1"></i> Previous
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})"
                    class="px-4 py-2 rounded-xl ${currentPage === i ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}">
                ${i}
            </button>`;
    }

    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})"
                class="px-4 py-2 rounded-xl ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}"
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right ml-1"></i>
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadProducts();
}

document.addEventListener('DOMContentLoaded', initializePage);
