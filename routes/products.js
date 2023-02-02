const express = require('express');

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router.use(authController.protect);

router.use('/:category/:product', productController.getProductByCategory);

router.get('/:category', productController.getProductBySlug);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    productController.uploadProductImage,
    productController.resizeProductImages,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    productController.uploadProductImage,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
