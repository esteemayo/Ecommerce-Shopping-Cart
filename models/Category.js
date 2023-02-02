const slugify = require('slugify');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A category must have a title'],
    unique: true,
    trim: true,
    maxlength: [20, 'A category title must have less or equal than 20 characters'],
    minlength: [4, 'A category title must have more or equal than 5 characters'],
  },
  slug: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Category = mongoose.models.Category ||
  mongoose.model('Category', categorySchema);

module.exports = Category;
