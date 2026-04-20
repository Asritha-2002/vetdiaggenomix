const Joi = require('joi');

const userSchemas = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    phone:Joi.string().required().pattern(/^[0-9]{10}$/),
    isAdmin: Joi.boolean().optional(),

    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      country: Joi.string()
    }),
  }),

  
  

  login: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string(),
    gender: Joi.string().valid('Male', 'Female'),
    dateOfBirth: Joi.date(),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().allow(''),
      state: Joi.string().allow(''),
      zipCode: Joi.string().allow(''),
      country: Joi.string().allow('')
    }).allow(null),
    preferences: Joi.object({
      newsletter: Joi.boolean(),
      orderUpdates: Joi.boolean(),
      marketing: Joi.boolean(),
      language: Joi.string(),
      currency: Joi.string()
    })
  })
};

const appointmentSchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(50),

    email: Joi.string().required().email(),

    phone: Joi.string()
      .required()
      .pattern(/^[6-9]\d{9}$/),

    petCategory: Joi.string().required(),

    service: Joi.string().required(),

    dateOfAppointment: Joi.date().required(),

    time: Joi.string().required(),

    location: Joi.string().required(),

    rescheduleReason: Joi.string().optional()
  }),
};
const reviewSchemas = {
  create: Joi.object({
    appointmentId: Joi.string().required(),

    review: Joi.string().required().min(5).max(500),

    rating: Joi.number().required().min(1).max(5),
  }),
};

const bookSchemas = {
  create: Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    originalPrice: Joi.number().required().min(0),
    stock: Joi.number().required().min(0),
    skuId: Joi.string().required(),
    category: Joi.string().required(),
    productDetails: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          label: Joi.string().required(),
          value: Joi.string().required()
        })
      ),
      Joi.string()
    )
  })
};

const objectId = /^[0-9a-fA-F]{24}$/;

const cartSchemas = {
  // ✅ Add to cart
  add: Joi.object({
    bookId: Joi.string().pattern(objectId).required(),
    quantity: Joi.number().integer().min(1).max(10).default(1),
  }),

  // ✅ Update quantity
  update: Joi.object({
    bookId: Joi.string().pattern(objectId).required(),
    quantity: Joi.number().integer().min(1).max(10).required(),
  }),

  // ✅ Remove item
  remove: Joi.object({
    bookId: Joi.string().pattern(objectId).required(),
  }),
};

const orderSchemas = {
  create: Joi.object({
    shipping: Joi.object({
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
      }),
      method: Joi.string().required(),
    }),
    voucherId: Joi.string().optional()
  })
};

const blogSchemas = {
  create: Joi.object({
    heading: Joi.string().required().min(5).max(200),
    context: Joi.string().required().min(50),
    tags: Joi.alternatives().try(
      Joi.array().items(Joi.string().min(2).max(50)),
      Joi.string()
    ),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    metaDescription: Joi.string().max(160),
    featured: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'))
  })
};

 const checkoutAddressSchema = Joi.object({
  fullName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Full name is required",
    }),

  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),

  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow(""),

  landmark: Joi.string().allow(""),

  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be 6 digits",
    }),

  city: Joi.string().required(),
  state: Joi.string().required(),

  type: Joi.string()
    .valid("Home", "Office")
    .default("Home"),
});

module.exports = {
  userSchemas,
  appointmentSchemas,
  reviewSchemas,
  bookSchemas,
  orderSchemas,
  blogSchemas,
  cartSchemas,
  checkoutAddressSchema

};
