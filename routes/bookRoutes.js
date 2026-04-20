const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');

// Get all books with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, search, exclude, page = 1, limit = 10, variants = false } = req.query;
    let query = {};

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (exclude) query._id = { $ne: exclude };

    if (variants !== 'true') {
      query.$or = [
        { parentProduct: { $exists: false } },
        { parentProduct: null }
      ];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'popular') {
      sortOption = { 'statistics.views': -1 };
    } else if (sort === 'bestseller') {
      sortOption = { 'statistics.purchases': -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        totalItems: totalBooks,
        hasNextPage: page * limit < totalBooks,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get most viewed books
router.get('/most-viewed', async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ 'statistics.views': -1 })
      .limit(10);
    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ 'statistics.purchases': -1 })
      .limit(10);
    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get books with filters
router.get('/products', async (req, res) => {
  try {
    const { category, limit, featured } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    // Build query
    let query = Book.find(filter);

    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const books = await query
      .select('title category price stock images featured')
      .sort('-createdAt');

    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get books by category
router.get('/category/:category', async (req, res) => {
  try {
    const books = await Book.find({ category: req.params.category });
    res.json(books);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get categorry image by category name from first product image
router.get('/category-image/:category', async (req, res) => {
  try {
    const book = await Book.findOne({ category: req.params.category });
    if (!book) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(book.images[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single book with view tracking
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await book.incrementViews();
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/:id/variants', async (req, res) => {
  try {
    const variants = await Book.find({ parentProduct: req.params.id });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
