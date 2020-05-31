const express = require('express');
const authController = require('../controllers/authController');
const productViewController = require('../controllers/productViewController');

const router = express.Router();

router.get('/', authController.isLoggedIn, productViewController.getAllProduct);

router.get('/:category', authController.isLoggedIn, productViewController.getProductCategory);

router.get('/:category/:product', authController.isLoggedIn, productViewController.getProductDetail);

module.exports = router;