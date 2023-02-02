const express = require('express');

const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/add/:product', cartController.getAddCart);

router.get('/checkout', cartController.getCheckout);

router.get('/update/:product', cartController.updateCart);

router.get('/clear', cartController.clearCart);

router.get('/buy-now', cartController.buyNow);

module.exports = router;
