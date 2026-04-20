const adminDashboard = {
    currentTimeframe: 'month',
    currentStats: null,
    
    // Helper function to generate growth badges
    getGrowthBadge(growth) {
        if (growth === undefined || growth === null) {
            return '<span class="text-gray-400 text-sm font-medium bg-gray-50 px-2 py-1 rounded-full">--</span>';
        }
        
        const isPositive = growth >= 0;
        const colorClass = isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50';
        const iconClass = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const sign = isPositive ? '+' : '';
        
        return `
            <span class="${colorClass} text-sm font-medium px-2 py-1 rounded-full">
                <i class="fas ${iconClass} text-xs mr-1"></i>${sign}${Math.abs(growth)}%
            </span>
        `;
    },

    // Helper function to generate inventory status badges
    getInventoryBadge(inventory) {
        if (!inventory) {
            return '<span class="text-gray-400 text-sm font-medium bg-gray-50 px-2 py-1 rounded-full">--</span>';
        }
        
        const { lowStock, outOfStock } = inventory;
        if (outOfStock > 0) {
            return `
                <span class="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">
                    <i class="fas fa-exclamation-triangle text-xs mr-1"></i>${outOfStock} out
                </span>
            `;
        } else if (lowStock > 0) {
            return `
                <span class="text-yellow-500 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
                    <i class="fas fa-exclamation text-xs mr-1"></i>${lowStock} low
                </span>
            `;
        } else {
            return `
                <span class="text-green-500 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                    <i class="fas fa-check text-xs mr-1"></i>Good
                </span>
            `;
        }
    },

    async render() {
        const content = document.getElementById('main-content');
        try {
            // Show loading state with beautiful animation
            content.innerHTML = this.generateLoadingHTML();
            
            const stats = await this.fetchStats();
            console.log('Dashboard stats:', stats);
            this.currentStats = stats;
            
            // Generate the beautiful dashboard
            content.innerHTML = this.generateDashboardHTML(stats);
            
            // Initialize charts with animations
            await this.initializeCharts();
            
            // Add entrance animations
            this.animateElements();
            
        } catch (error) {
            console.error('Dashboard error:', error);
            content.innerHTML = this.generateErrorHTML(error.message);
        }
    },

    async changeTimeframe(timeframe) {
        try {
            this.currentTimeframe = timeframe;
            
            // Update active button
            document.querySelectorAll('.timeframe-btn').forEach(btn => {
                btn.className = 'timeframe-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors';
            });
            event.target.className = 'timeframe-btn px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium';
            
            // Update chart and stats
            await this.updateTimeframeData(timeframe);
            
        } catch (error) {
            console.error('Error changing timeframe:', error);
        }
    },

    async updateTimeframeData(timeframe) {
        const chartSubtitle = document.getElementById('chart-subtitle');
        
        try {
            // Fetch real data from backend
            const response = await fetch(`/api/admin/stats/timeframe/${timeframe}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch timeframe data');
            }
            
            const timeframeData = await response.json();
            
            switch(timeframe) {
                case 'today':
                    chartSubtitle.textContent = "Today's hourly revenue";
                    await this.initializeCharts(timeframeData);
                    this.updateStatsCards({
                        title: "Today's Performance",
                        orders: timeframeData.summary.totalOrders,
                        revenue: timeframeData.summary.totalRevenue
                    });
                    break;
                case 'week':
                    chartSubtitle.textContent = "This week's daily revenue";
                    await this.initializeCharts(timeframeData);
                    this.updateStatsCards({
                        title: "This Week's Performance", 
                        orders: timeframeData.summary.totalOrders,
                        revenue: timeframeData.summary.totalRevenue
                    });
                    break;
                case 'month':
                    chartSubtitle.textContent = "This month's daily revenue";
                    await this.initializeCharts(timeframeData);
                    this.updateStatsCards({
                        title: "This Month's Performance",
                        orders: timeframeData.summary.totalOrders,
                        revenue: timeframeData.summary.totalRevenue
                    });
                    break;
                case 'year':
                    chartSubtitle.textContent = "This year's monthly revenue";
                    await this.initializeCharts(timeframeData);
                    this.updateStatsCards({
                        title: "This Year's Performance",
                        orders: timeframeData.summary.totalOrders,
                        revenue: timeframeData.summary.totalRevenue
                    });
                    break;
            }
        } catch (error) {
            console.error('Error fetching timeframe data:', error);
            // Fallback to existing data
            await this.initializeCharts();
        }
    },

    updateStatsCards(data) {
        // You can add logic here to update specific stat cards based on timeframe
        console.log('Updating stats for timeframe:', data);
    },

    generateLoadingHTML() {
        return `
            <div class="flex items-center justify-center min-h-96">
                <div class="text-center">
                    <div class="relative">
                        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-ping mx-auto"></div>
                    </div>
                    <p class="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
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
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Unable to Load Dashboard</h3>
                <p class="text-gray-600 mb-4">${errorMessage}</p>
                <button onclick="adminDashboard.render()" class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                    Try Again
                </button>
            </div>
        `;
    },

    async fetchStats() {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard statistics');
        }
        return response.json();
    },

    generateDashboardHTML(stats) {
        if (!stats) {
            stats = {
                totalOrders: 0,
                totalRevenue: 0,
                totalUsers: 0,
                totalBooks: 0,
                growth: { orders: 0, revenue: 0, users: 0 },
                today: { orders: 0, revenue: 0, newUsers: 0 },
                thisWeek: { orders: 0, revenue: 0 },
                orderStats: { pending: 0, delivered: 0, cancelled: 0, refunded: 0 },
                inventory: { lowStock: 0, outOfStock: 0 },
                recentOrders: [],
                topSellingBooks: [],
                monthlySales: []
            };
        }

        return `
            <!-- Dashboard Header -->
            <div class="mb-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
                        <p class="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
                    </div>
                    <!-- <div class="mt-4 lg:mt-0 flex space-x-3">
                        <button class="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <i class="fas fa-download mr-2"></i>Export
                        </button>
                        <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all">
                            <i class="fas fa-plus mr-2"></i>New Order
                        </button>
                    </div> -->
                </div>
            </div>

            <!-- Stats Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Total Orders Card -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-shopping-bag text-white text-lg"></i>
                            </div>
                            ${this.getGrowthBadge(stats.growth?.orders)}
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Orders</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${(stats.totalOrders || 0).toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">Today: ${(stats.today?.orders || 0).toLocaleString()}</p>
                    </div>
                </div>

                <!-- Total Revenue Card -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-rupee-sign text-white text-lg"></i>
                            </div>
                            ${this.getGrowthBadge(stats.growth?.revenue)}
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Revenue</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">₹${(stats.totalRevenue || 0).toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">Today: ₹${(stats.today?.revenue || 0).toLocaleString()}</p>
                    </div>
                </div>

                <!-- Total Users Card -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-users text-white text-lg"></i>
                            </div>
                            ${this.getGrowthBadge(stats.growth?.users)}
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${(stats.totalUsers || 0).toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">New today: ${(stats.today?.newUsers || 0).toLocaleString()}</p>
                    </div>
                </div>

                <!-- Total Books Card -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-book text-white text-lg"></i>
                            </div>
                            ${this.getInventoryBadge(stats.inventory)}
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Total Products</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${(stats.totalBooks || 0).toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">Low stock: ${(stats.inventory?.lowStock || 0)}</p>
                    </div>
                </div>
            </div>

            <!-- Additional Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Pending Orders -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-clock text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Pending Orders</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${(stats.orderStats?.pending || 0).toLocaleString()}</p>
                    </div>
                </div>

                <!-- Delivered Orders -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-check-circle text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Delivered Orders</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${(stats.orderStats?.delivered || 0).toLocaleString()}</p>
                    </div>
                </div>

                <!-- This Week Revenue -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-calendar-week text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">This Week Revenue</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">₹${(stats.thisWeek?.revenue || 0).toLocaleString()}</p>
                        <p class="text-xs text-gray-500 mt-2">${(stats.thisWeek?.orders || 0)} orders</p>
                    </div>
                </div>

                <!-- Out of Stock -->
                <div class="stats-card card-hover rounded-2xl p-6 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                <i class="fas fa-exclamation-triangle text-white text-lg"></i>
                            </div>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium">Out of Stock</h3>
                        <p class="text-3xl font-bold text-gray-800 mt-1">${(stats.inventory?.outOfStock || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <!-- Charts and Analytics Section -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                <!-- Sales Chart -->
                <div class="xl:col-span-2 stats-card card-hover rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">Sales Analytics</h3>
                            <p class="text-gray-600 text-sm" id="chart-subtitle">Monthly revenue trends</p>
                        </div>
                        <div class="flex space-x-2">
<!--                            <button onclick="adminDashboard.changeTimeframe('today')" class="timeframe-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">Today</button>
-->                            <button onclick="adminDashboard.changeTimeframe('week')" class="timeframe-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">Week</button>
                            <button onclick="adminDashboard.changeTimeframe('month')" class="timeframe-btn px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">Month</button>
                            <button onclick="adminDashboard.changeTimeframe('year')" class="timeframe-btn px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors">Year</button>
                        </div>
                    </div>
                    <div class="relative" style="height: 350px;">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>

                <!-- Top Books -->
                <div class="stats-card card-hover rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">Top Products</h3>
                            <p class="text-gray-600 text-sm">Best sellers this month</p>
                        </div>
                        <button class="text-blue-500 hover:text-blue-600 text-sm font-medium">View All</button>
                    </div>
                    <div class="space-y-4">
                        ${this.generateTopBooksHTML(stats.topSellingBooks)}
                    </div>
                </div>
            </div>

            <!-- Recent Orders Section -->
            <div class="stats-card card-hover rounded-2xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Recent Orders</h3>
                        <p class="text-gray-600 text-sm">Latest customer orders</p>
                    </div>
                    <a href="#/orders" class="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center">
                        View All Orders <i class="fas fa-arrow-right ml-1 text-xs"></i>
                    </a>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-b border-gray-100">
                                <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Order ID</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Amount</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
                                <th class="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            ${this.generateRecentOrdersHTML(stats.recentOrders)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    generateTopBooksHTML(books = []) {
        if (!books.length) {
            return `
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-book text-gray-400 text-xl"></i>
                    </div>
                    <p class="text-gray-500 text-sm">No Products data available</p>
                </div>
            `;
        }
        
        return books.slice(0, 5).map((book, index) => `
            <div class="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        #${index + 1}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">${book.title || 'Unknown Title'}</p>
                    <p class="text-xs text-gray-500">${(book.statistics?.purchases || 0)} sold</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-bold text-green-600">₹${(book.price || 0).toLocaleString()}</p>
                    <div class="flex items-center">
                        <div class="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div class="bg-green-500 h-1.5 rounded-full" style="width: ${Math.min((book.statistics?.purchases || 0) / 100 * 100, 100)}%"></div>
                        </div>
                        <span class="text-xs text-gray-500">${Math.min((book.statistics?.purchases || 0) / 10 * 100, 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    generateRecentOrdersHTML(orders = []) {
        if (!orders.length) {
            return `
                <tr>
                    <td colspan="6" class="text-center py-12">
                        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-shopping-cart text-gray-400 text-xl"></i>
                        </div>
                        <p class="text-gray-500">No recent orders found</p>
                    </td>
                </tr>
            `;
        }
        
        return orders.slice(0, 8).map(order => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="py-4 px-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <span class="font-medium text-gray-800">#${order._id?.slice(-6) || 'N/A'}</span>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span class="text-xs font-bold text-gray-600">${(order?.customer?.name || order?.user?.name || 'Unknown User')[0]?.toUpperCase()}</span>
                        </div>
                        <div>
                            <p class="font-medium text-gray-800 text-sm">${order?.customer?.name || order?.user?.name || 'Unknown User'}</p>
                            <p class="text-xs text-gray-500">${order?.customer?.email || order?.user?.email || 'No email'}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <span class="font-bold text-gray-800">₹${(order?.totalAmount || 0).toLocaleString()}</span>
                </td>
                <td class="py-4 px-4">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${this.getStatusColor(order.status)}">
                        ${order.status || 'pending'}
                    </span>
                </td>
                <td class="py-4 px-4">
                    <span class="text-sm text-gray-600">${new Date(order.date).toLocaleDateString()}</span>
                </td>
                <td class="py-4 px-4">
                    <button onclick="adminOrders.showOrderDetails('${order._id}')" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
                        View
                    </button>
                </td>
            </tr>
        `).join('');
    },

    getStatusColor(status) {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'processing': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-purple-100 text-purple-800',
            'delivered': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    },

    salesChart: null,
    currentTimeframeData: null,

    async initializeCharts(timeframeData = null) {
        try {
            const ctx = document.getElementById('salesChart');
            if (!ctx) {
                console.error('Sales chart canvas not found');
                return;
            }

            // Destroy existing chart
            if (this.salesChart) {
                this.salesChart.destroy();
            }

            // Store current timeframe data
            this.currentTimeframeData = timeframeData;

            let chartData = this.prepareChartData();

            // Create gradient
            const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 350);
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
            gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');

            this.salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: chartData.data,
                        borderColor: 'rgb(102, 126, 234)',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgb(102, 126, 234)',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: 'rgb(102, 126, 234)',
                            borderWidth: 1,
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    return 'Revenue: ₹' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            border: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 12,
                                    weight: '500'
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#F3F4F6',
                                drawBorder: false
                            },
                            border: {
                                display: false
                            },
                            ticks: {
                                color: '#6B7280',
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                callback: function(value) {
                                    return '₹' + value.toLocaleString();
                                }
                            }
                        }
                    },
                    elements: {
                        point: {
                            hoverBackgroundColor: 'rgb(102, 126, 234)',
                            hoverBorderColor: '#ffffff'
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });

            console.log('Chart created successfully with data:', chartData);
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    },

    prepareChartData() {
        // If we have specific timeframe data, use it
        if (this.currentTimeframeData && this.currentTimeframeData.data) {
            const labels = this.currentTimeframeData.data.map(item => item.label);
            const data = this.currentTimeframeData.data.map(item => item.revenue);
            return { labels, data };
        }

        // Fallback to current stats based on timeframe
        if (!this.currentStats) {
            return { labels: [], data: [] };
        }

        switch(this.currentTimeframe) {
            case 'today':
            case 'week':
            case 'year':
                // These should now come from backend timeframe data
                return { labels: ['No Data'], data: [0] };
            case 'month':
            default:
                return this.prepareMonthData();
        }
    },

    prepareTodayData() {
        // This should not be used anymore - data comes from backend
        return { labels: ['Loading...'], data: [0] };
    },

    prepareWeekData() {
        // This should not be used anymore - data comes from backend
        return { labels: ['Loading...'], data: [0] };
    },

    prepareMonthData() {
        const monthlySales = this.currentStats.monthlySales || [];
        
        if (monthlySales.length === 0) {
            return { labels: ['No Data'], data: [0] };
        }

        // Use actual monthly sales data from the API
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        const data = [];

        // Only show months that have actual data
        monthlySales.forEach(sale => {
            const monthIndex = sale._id.month - 1; // MongoDB months are 1-indexed
            labels.push(months[monthIndex]);
            data.push(sale.revenue || 0);
        });

        return { labels, data };
    },

    prepareYearData() {
        // This should not be used anymore - data comes from backend
        return { labels: ['Loading...'], data: [0] };
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
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                row.style.transition = 'all 0.4s ease-out';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, 800 + (index * 100));
        });
    }
};
