const router = {
    init() {
        this.bindEvents();
        this.navigate(this.getPath() || 'home');
    },

    bindEvents() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigate(page);
            });
        });

        window.addEventListener('popstate', () => {
            this.navigate(this.getPath());
        });
    },

    getPath() {
        return location.hash.slice(1);
    },

    navigate(page) {
        history.pushState(null, '', `#${page}`);
        this.renderPage(page);
    },

    async renderPage(page) {
        const content = document.getElementById('main-content');
        
        switch(page) {
            case 'home':
                content.innerHTML = `
                    <div class="text-center py-12">
                        <h1 class="text-4xl font-bold mb-4">Welcome to Books Store</h1>
                        <p class="text-gray-600 mb-8">Discover your next favorite book</p>
                        <button class="browse-books bg-blue-500 text-white px-6 py-3 rounded-lg">
                            Browse Books
                        </button>
                    </div>
                `;
                document.querySelector('.browse-books').addEventListener('click', () => {
                    this.navigate('books');
                });
                break;

            case 'books':
                await books.renderBookList();
                break;

            case 'cart':
                await cart.renderCart();
                break;

            case 'login':
                content.innerHTML = `
                    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                        <h2 class="text-2xl font-bold mb-6">Login</h2>
                        <form id="login-form" class="space-y-4">
                            <div>
                                <label class="block text-gray-700">Email</label>
                                <input type="email" name="email" required
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-gray-700">Password</label>
                                <input type="password" name="password" required
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <button type="submit" 
                                    class="w-full bg-blue-500 text-white py-2 rounded">
                                Login
                            </button>
                        </form>
                    </div>
                `;
                document.getElementById('login-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const success = await auth.login(
                        formData.get('email'),
                        formData.get('password')
                    );
                    if (success) this.navigate('home');
                });
                break;

            case 'register':
                content.innerHTML = `
                    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                        <h2 class="text-2xl font-bold mb-6">Register</h2>
                        <form id="register-form" class="space-y-4">
                            <div>
                                <label class="block text-gray-700">Name</label>
                                <input type="text" name="name" required
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-gray-700">Email</label>
                                <input type="email" name="email" required
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-gray-700">Password</label>
                                <input type="password" name="password" required
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <button type="submit" 
                                    class="w-full bg-blue-500 text-white py-2 rounded">
                                Register
                            </button>
                        </form>
                    </div>
                `;
                document.getElementById('register-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const success = await auth.register({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        password: formData.get('password')
                    });
                    if (success) this.navigate('home');
                });
                break;
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    cart.updateCartCount();
    router.init();
});
