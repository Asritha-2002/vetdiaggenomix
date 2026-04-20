document.addEventListener('DOMContentLoaded', async () => {
    // Load categories
    try {
        const categories = await api.getCategories();
        const categoriesList = document.getElementById('categoriesList');
        
        categories.forEach(category => {
            categoriesList.innerHTML += `
                <a href="#" 
                   class="text-gray-600 hover:text-red-600 whitespace-nowrap transition-colors">
                    ${category}
                </a>
            `;
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }

    // Initialize Swiper
    const thumbSwiper = new Swiper('.thumbSwiper', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });

    const mainSwiper = new Swiper('.mainSwiper', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-nav-next',
            prevEl: '.swiper-nav-prev',
        },
        thumbs: {
            swiper: thumbSwiper,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        on: {
            slideChange: function () {
                // Pause all videos when switching slides
                const videos = document.querySelectorAll('.swiper-slide video');
                videos.forEach(video => video.pause());
            }
        }
    });

    async function loadProduct() {
        const productId = window.location.pathname.split('/').pop();

        if (!productId) {
            window.location.href = '/products';
            return;
        }

        try {
            // Show loading state
            document.getElementById('mainMediaWrapper').innerHTML = `
                <div class="swiper-slide">
                    <div class="flex items-center justify-center h-full">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                </div>`;

            const book = await api.getBookById(productId);
            
            // Update breadcrumb
            document.getElementById('productBreadcrumb').textContent = book.title;
            document.getElementById('categoryBadge').textContent = book.category;

            // Calculate and show discount
            if (book.originalPrice) {
                const discount = Math.round((1 - book.price / book.originalPrice) * 100);
                document.getElementById('discountBadge').textContent = `-${discount}%`;
            }

            // Update view count
            document.getElementById('viewCount').textContent = 
                `${book.statistics?.views || 0} views`;

            // Clear loading state
            document.getElementById('mainMediaWrapper').innerHTML = '';
            document.getElementById('thumbnailWrapper').innerHTML = '';

            // Load images
            if (book.images && book.images.length > 0) {
                book.images.forEach(image => {
                    const mainSlide = document.getElementById('imageSlideTemplate')
                        .content.cloneNode(true);
                    const thumbSlide = document.getElementById('imageSlideTemplate')
                        .content.cloneNode(true);
                    
                    mainSlide.querySelector('img').src = image.url;
                    mainSlide.querySelector('img').alt = book.title;
                    thumbSlide.querySelector('img').src = image.url;
                    thumbSlide.querySelector('img').alt = book.title;

                    document.getElementById('mainMediaWrapper').appendChild(mainSlide);
                    document.getElementById('thumbnailWrapper').appendChild(thumbSlide);
                });
            }

            // Load videos
            if (book.videos && book.videos.length > 0) {
                book.videos.forEach(video => {
                    const mainSlide = document.getElementById('videoSlideTemplate')
                        .content.cloneNode(true);
                    const thumbSlide = document.getElementById('imageSlideTemplate')
                        .content.cloneNode(true);
                    
                    mainSlide.querySelector('source').src = video.path;
                    mainSlide.querySelector('video').title = video.title;
                    thumbSlide.querySelector('img').src = '/assets/video-thumbnail.jpg';

                    document.getElementById('mainMediaWrapper').appendChild(mainSlide);
                    document.getElementById('thumbnailWrapper').appendChild(thumbSlide);
                });
            }

            // Update product details
            document.getElementById('productTitle').textContent = book.title;
            document.getElementById('productDescription').textContent = book.description;
            document.getElementById('productPrice').textContent = `₹${book.price}`;
            
            // Update product details in a card format
            const detailsSection = document.getElementById('productDetails');
            detailsSection.innerHTML = `
                <h3 class="font-semibold text-gray-700 mb-4">Product Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    ${book.productDetails.map(detail => `
                        <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span class="text-gray-600">${detail.label}</span>
                            <span class="font-medium">${detail.value}</span>
                        </div>
                    `).join('')}
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span class="text-gray-600">ISBN</span>
                        <span class="font-medium">${book.isbn}</span>
                    </div>
                </div>
            `;

            // Update stock information
            const stockBadge = document.createElement('div');
            stockBadge.className = `inline-block px-3 py-1 rounded-full text-sm ${
                book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`;
            stockBadge.textContent = book.stock > 0 ? `${book.stock} in stock` : 'Out of stock';
            document.getElementById('productPrice').after(stockBadge);

            // Load and display vouchers
            await displayVouchers(productId);

            // Update statistics
            if (book.statistics) {
                const statsSection = document.getElementById('productStats');
                statsSection.className = 'mt-4 text-sm text-gray-600';
                statsSection.innerHTML = `
                    <div class="flex items-center justify-between p-4">
                        <div>Views: ${book.statistics.views}</div>
                        <div>Last viewed: ${new Date(book.statistics.lastViewed).toLocaleDateString()}</div>
                    </div>
                `;
            }

            // Update Swiper
            mainSwiper.update();
            thumbSwiper.update();

            // Setup quantity controls with stock limit
            const quantityInput = document.getElementById('quantity');
            const addToCartBtn = document.getElementById('addToCartBtn');
            
            document.getElementById('decreaseQty').onclick = () => {
                if (quantityInput.value > 1) {
                    quantityInput.value = Number(quantityInput.value) - 1;
                }
            };
            
            document.getElementById('increaseQty').onclick = () => {
                if (quantityInput.value < book.stock) {
                    quantityInput.value = Number(quantityInput.value) + 1;
                }
            };

            // Add to cart functionality
            addToCartBtn.addEventListener('click', async () => {
                try {
                    const quantity = Number(quantityInput.value);
                    
                    if (quantity > book.stock) {
                        alert('Not enough stock available!');
                        return;
                    }

                    // Disable button and show loading state
                    addToCartBtn.disabled = true;
                    const originalText = addToCartBtn.innerHTML;
                    addToCartBtn.innerHTML = `
                        <div class="flex items-center gap-2">
                            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                            Adding...
                        </div>
                    `;

                    api.addToCart(book._id, quantity)
                        .then(() => {
                            updateCart();
                        });
                    // Show success feedback
                    addToCartBtn.innerHTML = `
                        <div class="flex items-center gap-2">
                            <i class="fas fa-check"></i>
                            Added to Cart
                        </div>
                    `;

                    // Reset button after 2 seconds
                    setTimeout(() => {
                        addToCartBtn.disabled = false;
                        addToCartBtn.innerHTML = originalText;
                    }, 2000);

                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Failed to add item to cart. Please try again.');
                    addToCartBtn.disabled = false;
                    addToCartBtn.innerHTML = originalText;
                }
            });

            // Load related products
            try {
                const relatedProducts = await api.getRelatedProducts(book.category, book._id);
                const relatedContainer = document.getElementById('relatedProducts');
                
                if (relatedProducts && relatedProducts.length > 0) {
                    relatedProducts.forEach(product => {
                        relatedContainer.innerHTML += `
                            <a href="/product-details/${product._id}" 
                                class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-md transition">
                                <img src="${product.images[0]?.url || '/assets/default-book.jpg'}" 
                                    alt="${product.title}" 
                                    class="w-full h-48 object-cover">
                                <div class="p-4">
                                    <h3 class="font-semibold text-gray-800">${product.title}</h3>
                                    <p class="text-red-600 font-bold mt-2">₹${product.price}</p>
                                </div>
                            </a>
                        `;
                    });
                } else {
                    relatedContainer.innerHTML = `
                        <div class="col-span-full text-center text-gray-500 py-8">
                            No related products found
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error loading related products:', error);
            }

        } catch (error) {
            console.error('Error loading product:', error);
            document.getElementById('mainMediaWrapper').innerHTML = `
                <div class="swiper-slide">
                    <div class="flex items-center justify-center h-full text-red-600">
                        Error loading product. Please try again.
                    </div>
                </div>`;
        }
    }

    // Load the product
    await loadProduct();
});

async function displayVouchers(productId) {
    try {
        const vouchers = await api.getProductVouchers(productId);
        const container = document.getElementById('vouchersContainer');
        container.innerHTML = ''; // Clear existing vouchers

        vouchers.forEach(voucher => {
            const template = document.getElementById('voucherTemplate');
            const clone = template.content.cloneNode(true);

            // Fill in voucher details
            clone.querySelector('.voucher-code').textContent = voucher.code;
            clone.querySelector('.voucher-status').textContent = voucher.isActive ? 'Active' : 'Inactive';

            // Generate description based on voucher type
            let description = '';
            if (voucher.type === 'complimentary') {
                const item = voucher.complimentaryItems[0];
                description = `Buy ${voucher.conditions.minQuantity} of this item and get ${item.quantity} complimentary books free!`;
            } else {
                description = `Get ${voucher.value}${voucher.type === 'percentage' ? '%' : ' Rs'} off`;
            }
            clone.querySelector('.voucher-description').textContent = description;

            // Generate details
            const details = [];
            if (voucher.expiryDate) {
                details.push(`Valid till: ${new Date(voucher.expiryDate).toLocaleDateString()}`);
            }
            if (voucher.conditions?.minQuantity) {
                details.push(`Min Purchase: ${voucher.conditions.minQuantity} units`);
            }
            clone.querySelector('.voucher-details').textContent = details.join(' • ');

            // Add copy functionality
            const copyBtn = clone.querySelector('.copy-voucher');
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(voucher.code);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Code';
                }, 2000);
            });

            container.appendChild(clone);
        });
    } catch (error) {
        console.error('Error loading vouchers:', error);
    }
}

async function initializeProduct(productId) {
    await displayVouchers(productId);
}

// Function to handle copying voucher code
function copyVoucherCode(code) {
    navigator.clipboard.writeText(code);
    const btn = event.target;
    btn.textContent = 'Copied!';
    setTimeout(() => {
        btn.textContent = 'Copy Code';
    }, 2000);
}
