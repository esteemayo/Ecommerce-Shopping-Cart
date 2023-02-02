const express = require('express');
const multer = require('multer');

const authController = require('../controllers/authController');
const adminProductViewController = require('../controllers/adminProductViewController');

const upload = multer({ dest: 'public/img/products' });

const router = express.Router();

router.use(authController.protect);

router.get('/', adminProductViewController.getProducts);

router.get('/add-product', adminProductViewController.addProduct);

router.post('/add-product',
  adminProductViewController.upload,
  adminProductViewController.resizeProductImages,
  adminProductViewController.createProduct
);

router.get('/edit-product/:id', adminProductViewController.getEditProduct);

router.post('/edit-product/:id', adminProductViewController.updateProduct);

module.exports = router;
