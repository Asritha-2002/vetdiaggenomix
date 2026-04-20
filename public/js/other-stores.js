const STORE_LOGOS = {
    'amazon': '/assets/images/stores/amazon-logo.png',
    'flipkart': '/assets/images/stores/flipkart-logo.png',
    'swiggy instamart': '/assets/images/stores/swiggy-logo.png',
    'zepto': '/assets/images/stores/zepto-logo.png',
    'barnes & noble': '/assets/images/stores/barnes-noble-logo.png',
    'book depository': '/assets/images/stores/book-depository-logo.png',
    'default': '/assets/images/stores/default-store.png'
};

function getStoreLogo(storeName) {
    console.log('Fetching logo for store:', storeName);
    return STORE_LOGOS[storeName.toLowerCase()] || STORE_LOGOS['default'];
}

let allStores = [];
let currentFilter = 'all';

async function initOtherStores() {
    try {
        const response = await fetch('/api/other-stores');
        allStores = await response.json();
        renderStores(allStores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        document.getElementById('stores-grid').innerHTML = `
            <div class="col-span-full text-center text-red-500 py-8">
                Failed to load stores. Please try again later.
            </div>
        `;
    }
}

function filterStores(type) {
    currentFilter = type;
    const buttons = document.querySelectorAll('.store-filter');
    buttons.forEach(btn => btn.classList.remove('active', 'bg-red-600', 'text-white'));
    event.target.classList.add('active', 'bg-red-600', 'text-white');

    const filtered = type === 'all' ? 
        allStores : 
        allStores.filter(store => store.type === type);
    
    renderStores(filtered);
}

function renderStores(stores) {
    const grid = document.getElementById('stores-grid');
    
    if (!stores.length) {
        grid.innerHTML = `
            <div class="col-span-full text-center text-gray-500 py-8">
                No stores found.
            </div>
        `;
        return;
    }

    const headerHtml = `
        <div class="col-span-full mb-8">
            <div class="flex flex-wrap items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
                <h2 class="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Our Store Locations</h2>
                <div class="flex gap-3 flex-wrap">
                    <button onclick="filterStores('all')" 
                            class="store-filter px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${currentFilter === 'all' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
                        All Stores
                    </button>
                    <button onclick="filterStores('online')"
                            class="store-filter px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${currentFilter === 'online' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
                        Online Stores
                    </button>
                    <button onclick="filterStores('offline')"
                            class="store-filter px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                            ${currentFilter === 'offline' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
                        Retail Stores
                    </button>
                </div>
            </div>
        </div>
    `;

    grid.innerHTML = headerHtml + stores.map(store => `
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="p-6">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex-1">
                        <h3 class="font-bold text-xl text-gray-800 mb-2">${store.name}</h3>
                        <span class="inline-block px-4 py-1.5 text-sm rounded-lg
                            ${store.type === 'online' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}">
                            ${store.type === 'online' ? '🌐 Online Store' : '🏪 Retail Store'}
                        </span>
                    </div>
                </div>
                <div class="bg-gray-50 rounded-xl p-5 mb-4">
                    ${store.type === 'online' ? renderOnlineStore(store) : renderOfflineStore(store)}
                </div>
            </div>
        </div>
    `).join('');
}

function renderOnlineStore(store) {
    const logoUrl = getStoreLogo(store.onlineDetails.ecommerceName);
    
    return `
        <div class="space-y-4">
            <div class="flex items-center justify-center bg-white rounded-lg p-4">
                <img src="${logoUrl}" 
                     alt="${store.onlineDetails.ecommerceName}" 
                     class="h-12 object-contain">
            </div>
            <div class="space-y-3 border-t border-gray-200 pt-4">
                <div class="flex items-center text-gray-700">
                    <i class="fas fa-shopping-cart mr-3 text-red-500"></i>
                    <p>Platform: <span class="font-medium">${store.onlineDetails.ecommerceName}</span></p>
                </div>
                <div class="flex items-center text-gray-700">
                    <i class="fas fa-calendar-alt mr-3 text-blue-500"></i>
                    <p>Joined: <span class="font-medium">${new Date(store.onlineDetails.joinedOn).toLocaleDateString()}</span></p>
                </div>
                <a href="${store.onlineDetails.link}" 
                   target="_blank" 
                   class="inline-flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                    Visit Store 
                    <i class="fas fa-external-link-alt ml-2"></i>
                </a>
            </div>
        </div>
    `;
}

function renderOfflineStore(store) {
    return `
        <div class="space-y-4">
            ${store.offlineDetails.image?.url ? `
                <div class="relative group overflow-hidden rounded-lg">
                    <img src="${store.offlineDetails.image.url}" 
                         alt="${store.name}" 
                         class="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                         onclick="handleImageClick('${store.offlineDetails.image.url}')">
                    <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="text-white text-sm">Click to view larger</span>
                    </div>
                </div>
            ` : ''}
            <div class="space-y-3">
                <div class="flex items-start">
                    <i class="fas fa-map-marker-alt mt-1 mr-3 text-red-500"></i>
                    <p class="text-gray-700 flex-1">${store.offlineDetails.address}</p>
                </div>
                ${store.offlineDetails.contactNumber ? `
                    <div class="flex items-center">
                        <i class="fas fa-phone-alt mr-3 text-green-600"></i>
                        <p class="text-gray-700">${store.offlineDetails.contactNumber}</p>
                    </div>
                ` : ''}
                ${store.offlineDetails.openingHours ? `
                    <div class="flex items-center">
                        <i class="fas fa-clock mr-3 text-blue-600"></i>
                        <p class="text-gray-700">${store.offlineDetails.openingHours}</p>
                    </div>
                ` : ''}
                <a href="${store.offlineDetails.mapsLink}" 
                   target="_blank" 
                   class="inline-flex items-center px-4 py-2 mt-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    View on Maps
                    <i class="fas fa-map-marker-alt ml-2"></i>
                </a>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', initOtherStores);
