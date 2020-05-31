const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');
const Category = require('../models/Category');

/*
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/products');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `product-${req.params.id}-${Date.now()}.${ext}`);
    }
});
*/

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    }
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadProductImage = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageGallery', maxCount: 4 }
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
    // console.log(req.files);

    if (!req.files.image || !req.files.imageGallery) return next();

    // PRODUCT IMAGE
    req.body.image = `product-${req.params.id}-${Date.now()}.jpeg`;
    await sharp(req.files.image[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${req.body.image}`);

    // PRODUCT IMAGEGALLERY
    req.body.imageGallery = [];
    await Promise.all(
        req.files.imageGallery.map(async (file, i) => {
            const filename = `gallery-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/gallery/${filename}`);

            req.body.imageGallery.push(filename);
        })
    );

    next();
});

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getProductBySlug = catchAsync(async (req, res, next) => {
    const products = await Product.find({ category: req.params.category });

    if (!products) {
        return next(new AppError('No product found with the given SLUG', 404));
    }

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
});

// Nested route
exports.getProductByCategory = catchAsync(async (req, res, next) => {
    const products = await Product.find({ category: req.params.category, slug: req.params.product });

    if (!products) {
        return next(new AppError('No product found in that category', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            products
        }
    });
});