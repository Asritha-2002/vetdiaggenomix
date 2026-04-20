const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  context: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: {
    main: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      required: true
    }
  },
  author: {
    type: String,
    default: 'Admin'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  slug: {
    type: String,
    unique: true,
    required: false // Changed to false since we auto-generate it
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create slug from heading before saving
blogSchema.pre('save', async function(next) {
  try {
    // Generate slug if heading is modified or this is a new document
    if (this.isModified('heading') || this.isNew || !this.slug) {
      let baseSlug = this.heading
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Ensure the slug is not empty
      if (!baseSlug) {
        baseSlug = 'blog-post';
      }
      
      // Handle duplicate slugs by appending a number
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug already exists (excluding current document)
      const existingBlog = await this.constructor.findOne({ 
        slug: slug, 
        _id: { $ne: this._id } 
      });
      
      if (existingBlog) {
        // Find a unique slug by appending numbers
        while (true) {
          const testSlug = `${baseSlug}-${counter}`;
          const existingWithCounter = await this.constructor.findOne({ 
            slug: testSlug, 
            _id: { $ne: this._id } 
          });
          
          if (!existingWithCounter) {
            slug = testSlug;
            break;
          }
          counter++;
          
          // Prevent infinite loop
          if (counter > 1000) {
            slug = `${baseSlug}-${Date.now()}`;
            break;
          }
        }
      }
      
      this.slug = slug;
    }
    
    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Add indexes for better querying
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1, publishedAt: -1 });

// Static methods
blogSchema.statics.getPublishedBlogs = function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('heading context tags images.main author publishedAt views slug metaDescription featured');
};

blogSchema.statics.getFeaturedBlogs = function(limit = 5) {
  return this.find({ status: 'published', featured: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .select('heading context tags images.main author publishedAt views slug metaDescription');
};

blogSchema.statics.getBlogsByTag = function(tag, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ 
    status: 'published', 
    tags: { $in: [tag.toLowerCase()] } 
  })
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('heading context tags images.main author publishedAt views slug metaDescription');
};

// Instance methods
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

blogSchema.methods.generateSlug = async function() {
  let baseSlug = this.heading
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (!baseSlug) {
    baseSlug = 'blog-post';
  }
  
  let slug = baseSlug;
  let counter = 1;
  const existingBlog = await this.constructor.findOne({ 
    slug: slug, 
    _id: { $ne: this._id } 
  });
  
  if (existingBlog) {
    while (true) {
      const testSlug = `${baseSlug}-${counter}`;
      const existingWithCounter = await this.constructor.findOne({ 
        slug: testSlug, 
        _id: { $ne: this._id } 
      });
      
      if (!existingWithCounter) {
        slug = testSlug;
        break;
      }
      counter++;
      
      if (counter > 1000) {
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }
  }
  
  this.slug = slug;
  return slug;
};

module.exports = mongoose.model('Blog', blogSchema);
