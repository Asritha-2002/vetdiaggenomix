const books = {
    async renderBookList() {
        const books = await api.getBooks();
        const content = document.getElementById('main-content');
        
        content.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                ${books.map(book => `
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <img src="${book.images[0]?.url || '/placeholder.jpg'}" 
                             alt="${book.title}"
                             class="w-full h-48 object-cover rounded">
                        <h3 class="text-lg font-semibold mt-2">${book.title}</h3>
                        <p class="text-gray-600">₹${book.price}</p>
                        <button class="add-to-cart bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                data-book-id="${book._id}">
                            Add to Cart
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        this.bindBookEvents();
    },

    async renderBookDetails(id) {
        const book = await api.getBookDetails(id);
        const content = document.getElementById('main-content');
        
        content.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-4">
                        <img src="${book.images[0]?.url || '/placeholder.jpg'}"
                             alt="${book.title}"
                             class="w-full rounded-lg">
                        <div class="grid grid-cols-4 gap-2">
                            ${book.images.slice(1).map(img => `
                                <img src="${img.url}" 
                                     alt="${book.title}"
                                     class="w-full h-20 object-cover rounded cursor-pointer thumbnail">
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">${book.title}</h1>
                        <p class="text-xl text-blue-600 mt-2">₹${book.price}</p>
                        <p class="text-gray-600 mt-4">${book.description}</p>
                        <div class="mt-4">
                            <h3 class="font-semibold">Product Details:</h3>
                            <ul class="mt-2 space-y-2">
                                ${book.productDetails.map(detail => `
                                    <li><span class="font-medium">${detail.label}:</span> ${detail.value}</li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="mt-6 space-x-4">
                            <input type="number" 
                                   min="1" 
                                   value="1" 
                                   class="w-20 px-2 py-1 border rounded"
                                   id="quantity-input">
                            <button class="add-to-cart bg-blue-500 text-white px-6 py-2 rounded"
                                    data-book-id="${book._id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindBookEvents();
    },

    bindBookEvents() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', async (e) => {
                console.log('Add to cart button clicked');
                const bookId = e.target.dataset.bookId;
                const quantity = document.getElementById('quantity-input')?.value || 1;
                
                if (!localStorage.getItem('token')) {
                    router.navigate('login');
                    return;
                }

                try {
                    await api.addToCart(bookId, parseInt(quantity));
                    cart.updateCartCount();
                    alert('Added to cart successfully!');
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Failed to add to cart');
                }
            });
        });

        document.querySelectorAll('.thumbnail').forEach(img => {
            img.addEventListener('click', (e) => {
                const mainImage = e.target.parentElement.parentElement.querySelector('img');
                const temp = mainImage.src;
                mainImage.src = e.target.src;
                e.target.src = temp;
            });
        });
    }
};
