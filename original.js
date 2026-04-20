const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8200;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/product-details/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'product-details.html'));
});

app.get('/docs/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'API_DOCUMENTATION.md'));
});

app.get('/status', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.get('/products', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'products.html'));});
app.get('/checkout', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'checkout.html'));});
app.get('/profile', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'profile.html'));});
app.get('/other-stores', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'other-stores.html'));});
app.get('/order-confirmation', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'order-confirmation.html'));});
app.get('/blogs', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'blogs.html'));});
app.get('/about', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'about.html'));});
app.get('/contact', (req, res) => {res.sendFile(path.join(__dirname, 'public', 'contact.html'));});
// Static files setup
app.get('/admin/invoice', (req, res) => {res.sendFile(path.join(__dirname, 'public/admin', 'invoice.html'));});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const chargeRoutes = require('./routes/chargeRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const userRoutes = require('./routes/userRoutes');
const shopDetailsRoutes = require('./routes/shopDetailsRoutes');
const otherStoreRoutes = require('./routes/otherStoreRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Mount API routes
app.use('/api/books', bookRoutes);
app.use('/api/products', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/shop-details', shopDetailsRoutes);
app.use('/api/other-stores', otherStoreRoutes);
app.use('/api', blogRoutes); // Blog routes (both public and admin)

// Mount admin routes
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/charges', chargeRoutes);
app.use('/api/admin/vouchers', voucherRoutes);
app.use('/api/admin/shop-details', shopDetailsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/other-stores', otherStoreRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
        message: err.message,
        status: 'error'
    });
});

// Database connection with retry logic
const connectDB = async (retries = 5) => {
    const dbURI = process.env.NODE_ENV === 'production' 
        ? process.env.MONGODB_URI_PROD 
        : process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/bookstore';

    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        if (retries > 0) {
            console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectDB(retries - 1);
        }
        console.error('MongoDB connection failed after all retries:', error);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    await connectDB();
    
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown handlers
    const shutdown = async () => {
        console.log('Shutting down gracefully...');
        server.close(async () => {
            console.log('HTTP server closed');
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        });

        // Force shutdown after 10s
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        shutdown();
    });
};

// Start the server
startServer().catch(console.error);
