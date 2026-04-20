const adminApp = {
    init() {
        this.checkAuth();
        this.bindEvents();
        this.navigate('dashboard');
    },

    checkAuth() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = '/admin/login.html';
        }
    },

    bindEvents() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigate(page);
            });
        });
    },

    routes: {
        'dashboard': adminDashboard,
        'books': adminBooks,
        'orders': adminOrders,
        'marketing': adminMarketing,
        'users': adminUsers,
        'vouchers': adminVouchers,
        'charges': adminCharges
        
    },

    async navigate(page) {
        const content = document.getElementById('main-content');
        
        // Add active state to current nav item
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('bg-gray-700');
            } else {
                link.classList.remove('bg-gray-700');
            }
        });
        
        // Call the appropriate module's render method
        const module = this.routes[page];
        if (module && module.render) {
            await module.render();
        }
    },

    async renderDashboard() {
        try {
            const stats = await adminApi.getStats();
            return `
                <div class="space-y-6">
                    <h2 class="text-2xl font-bold">Dashboard</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold">Total Orders</h3>
                            <p class="text-3xl font-bold mt-2">${stats.totalOrders || 0}</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold">Total Revenue</h3>
                            <p class="text-3xl font-bold mt-2">₹${stats.totalRevenue || 0}</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold">Total Users</h3>
                            <p class="text-3xl font-bold mt-2">${stats.totalUsers || 0}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">Recent Orders</h3>
                            <div class="space-y-2">
                                ${stats.recentOrders?.map(order => `
                                    <div class="flex justify-between items-center p-2 hover:bg-gray-50">
                                        <span>${order.user.name}</span>
                                        <span class="text-gray-600">₹${order.totalAmount}</span>
                                    </div>
                                `).join('') || 'No recent orders'}
                            </div>
                        </div>
                        
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold mb-4">Top Selling Books</h3>
                            <div class="space-y-2">
                                ${stats.topSellingBooks?.map(book => `
                                    <div class="flex justify-between items-center p-2 hover:bg-gray-50">
                                        <span>${book.title}</span>
                                        <span class="text-gray-600">${book.statistics.purchases} sold</span>
                                    </div>
                                `).join('') || 'No sales data'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            return `<div class="text-red-500">Error loading dashboard data</div>`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});
