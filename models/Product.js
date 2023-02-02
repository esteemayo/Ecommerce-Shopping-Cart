const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a title'],
    unique: true,
    trim: true,
    maxlength: [20, 'A product title must have less or equal than 20 characters'],
    minlength: [3, 'A product title must have more or equal than 3 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'A product must have a description'],
  },
  category: {
    type: String,
    required: [true, 'A product must belong to a category'],
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) must be less than regular price'
    },
    set: val => Math.round(val * 10) / 10
  },
  image: {
    type: String,
    default: 'noimage.png'
  },
  imageGallery: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

productSchema.index({ price: 1, slug: -1 });

productSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

productSchema.pre('save', function (next) {
  this.priceDiscount = this.price * 0.05;
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;