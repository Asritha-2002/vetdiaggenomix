const Book = require('./Book');
const Order = require('./Order');
const User = require('./User');
const Blog = require('./Blogs');

async function createIndexes() {
  try {
    // Book indexes
    await Book.collection.createIndex({ 'statistics.purchases': -1 });
    await Book.collection.createIndex({ category: 1 });

    // Order indexes
    await Order.collection.createIndex({ 'payment.status': 1, status: 1 });
    await Order.collection.createIndex({ createdAt: -1 });
    await Order.collection.createIndex({ user: 1 });

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ isAdmin: 1 });

    // Blog indexes
    await Blog.collection.createIndex({ status: 1, publishedAt: -1 });
    await Blog.collection.createIndex({ tags: 1 });
    await Blog.collection.createIndex({ slug: 1 }, { unique: true });
    await Blog.collection.createIndex({ featured: 1, publishedAt: -1 });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

module.exports = { createIndexes };
