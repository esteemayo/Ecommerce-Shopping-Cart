
const Product = require('../models/Product');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });
    const count = await Product.countDocuments();

    res.status(200).render('admin/products', {
        title: 'Products',
        products,
        count
    });
});

exports.addProduct = catchAsync(async (req, res) => {
    const categories = await Category.find();

    res.status(200).render('admin/add_product', {
        title: 'Add product',
        categories
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).redirect('/admin/products');
});

exports.getEditProduct = catchAsync(async (req, res) => {
    const categories = await Category.find();
    const product = await Product.findById(req.params.id);
    res.status(200).render('admin/edit_product', {
        title: 'Edit product',
        categories,
        product
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).redirect('/admin/products');
});