async function loadCategories() {
    try {
        const categories = await api.getCategories();
        
        document.getElementById('categoriesGrid').innerHTML = categories.map(category => `
            <a href="/products.html?category=${encodeURIComponent(category)}" 
               class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 class="text-xl font-bold mb-2">${category}</h2>
                <p class="text-gray-600">Browse ${category} books</p>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
        document.getElementById('categoriesGrid').innerHTML = `
            <div class="col-span-full text-center text-red-500">
                Error loading categories. Please try again.
            </div>`;
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);
