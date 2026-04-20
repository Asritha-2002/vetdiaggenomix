const adminPages = {
    dashboard: adminDashboard,
    books: adminBooks,
    orders: adminOrders,
    users: adminUsers,
    marketing: adminMarketing,
    vouchers: adminVouchers,
    blogs: { render: renderBlogsPage },
    charges: adminCharges,
    'shop-details': adminShopDetails,
    'other-stores': adminOtherStores // Make sure this line exists
};

function navigate() {
    const hash = window.location.hash || '#/dashboard';
    const pageName = hash.replace('#/', '');
    
    if (adminPages[pageName]) {
        adminPages[pageName].render();
    }
}

window.addEventListener('hashchange', navigate);
document.addEventListener('DOMContentLoaded', navigate);