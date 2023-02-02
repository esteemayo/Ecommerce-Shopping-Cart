const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/Product');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  }
  return cb(new AppError('Not an image! Please upload only images', 400), false);
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.upload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'imageGallery', maxCount: 4 }
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.image || !req.files.imageGallery) return next();

  // Product Image
  req.body.image = `product-${req.params.id}-${Date.now()}.jpeg`;

  await sharp(req.files.image[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.image}`);

  // Image Gallery
  req.body.imageGallery = [];

  await Promise.all(
    req.files.imageGallery.map(async (file, i) => {

      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

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
  const data = req.body;
  if (req.file) {
    data.image = req.file.filename;
  } else if (req.files) {
    data.imageGallery = req.files.filename;
  }

  await Product.create(data);
  // console.log({ data });

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
