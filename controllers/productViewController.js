const Product = require('../models/Product');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProduct = catchAsync(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).render('allProducts', {
        title: 'All Products',
        products
    });
});

exports.getProductCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({ slug: req.params.category });
    const products = await Product.find({ category: req.params.category });
    const count = await Product.countDocuments();

    if (!products) {
        return next(new AppError('No product found in that category', 404));
    }

    res.status(200).render('categoryProducts', {
        title: category.title,
        products,
        count
    });
});

exports.getProductDetail = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ slug: req.params.product });

    res.status(200).render('product', {
        title: '',
        product
    });
});