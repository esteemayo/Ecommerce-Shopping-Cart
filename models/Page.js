const mongoose = require('mongoose');
const slugify = require('slugify');

const pageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A page must have a title'],
        unique: true,
        trim: true,
        maxlength: [10, 'A page title must have less or equal than 10 characters'],
        minlength: [4, 'A page title must have more or equal than 4 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'A page must have a content']
    },
    sorting: {
        type: Number
    }
});

// DOCUMENT MIDDLEWARE
pageSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;