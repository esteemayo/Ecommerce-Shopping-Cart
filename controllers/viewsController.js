const Page = require('../models/Page');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.indexPage = catchAsync(async (req, res, next) => {
    const page = await Page.findOne({ slug: 'home' });

    res.status(200).render('index', {
        title: page.title,
        page
    });
});

// GET OTHER PAGES (ABOUT, SERVICES, BLOG, CONTACT US etc...)
exports.page = catchAsync(async (req, res, next) => {
    const page = await Page.findOne({ slug: req.params.slug });

    // if (!page) {
    //     return next(new AppError('No page found with that slug', 404));
    // }

    res.status(200).render('index', {
        title: page.title,
        page
    });
});

exports.getAllPages = catchAsync(async (req, res, next) => {
    const pages = await Page.find().sort({ sorting: 1 });

    res.status(200).render('admin/pages', {
        title: '',
        pages
    });
});

exports.getPage = catchAsync(async (req, res, next) => {
    const page = await Page.findOne({ slug: 'home' });

    res.status(200).render('index', {
        title: '',
        page
    });
});

exports.getAddPage = (req, res, next) => {
    res.render('admin/add_page', {
        title: 'Add page'
    });
};

exports.createAddPage = catchAsync(async (req, res, next) => {
    const page = await Page.findOne({ slug: req.body.slug });
    if (page) {
        return next(new AppError('Page slug exists, choose another.'));
    }

    const newPage = await Page.create({
        title: req.body.title,
        content: req.body.content,
        sorting: 100
    });

    res.status(201).redirect('/admin/pages');
});

exports.getEditPage = catchAsync(async (req, res, next) => {
    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
        return next(new AppError('There is no page with that name', 404));
    }

    res.status(200).render('admin/edit_page', {
        title: 'Edit page',
        page
    });
});

exports.updateEditPage = catchAsync(async (req, res, next) => {
    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
        return next(new AppError('There is no page with that name', 404));
    }

    page.title = req.body.title;
    page.slug = req.body.slug;
    page.content = req.body.content;
    await page.save();

    res.status(200).redirect(`/admin/pages/edit-page/${page.slug}`);
});

exports.deletePage = catchAsync(async (req, res, next) => {
    const page = await Page.findByIdAndDelete(req.params.id);

    if (!page) {
        return next(new AppError('There is no page with the given ID', 404));
    }

    res.status(200).redirect('/admin/pages');
});

exports.getReorderPage = catchAsync(async (req, res, next) => {
    let ids = req.body['id'];

    sortPages(ids, async () => {
        const pages = await Page.find().sort({ sorting: 1 });
        req.app.locals.pages = pages;
    });
});

function sortPages(ids, cb) {
    let count = 0;

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;

        (async function (count) {
            const page = await Page.findById(id);
            page.sorting = count;
            await page.save();
            ++count;
            if (count >= ids.length) {
                cb();
            }
        })(count);
    }
};

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).render('admin/categories', {
        title: '',
        categories
    });
});

exports.addCategory = (req, res) => {
    res.status(200).render('admin/add_category', {
        title: 'Add new category'
    });
};

exports.getEditCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).render('admin/edit_category', {
        title: '',
        category
    });
});

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

exports.loginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.signUpForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create your account'
    });
};

// GET ALL PRODUCTS(FRONT --> ALL USERS)
exports.getAllProduct = catchAsync(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).render('allProducts', {
        title: 'Products',
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

    res.status(200).render('allProducts', {
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