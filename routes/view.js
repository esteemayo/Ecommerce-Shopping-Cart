const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/login', authController.isLoggedIn, viewsController.loginForm);

router.get('/signup', viewsController.signUpForm);

// router.get('/admin/pages', viewsController.getAllPages);

// router.post('/admin/pages/reorder-pages', viewsController.getReorderPage);

// router.get('/admin/pages/add-page', viewsController.getAddPage);

// router.post('/admin/pages/add-page', viewsController.createAddPage);

// router.get('/admin/pages/edit-page/:slug', viewsController.getEditPage);

// router.post('/admin/pages/edit-page/:slug', viewsController.updateEditPage);

// router.get('/admin/pages/delete-page/:id', viewsController.deletePage);

// router.get('/admin/categories', viewsController.getAllCategories);

// router.get('/admin/categories/add-category', viewsController.addCategory);

// router.get('/admin/categories/edit-category/:id', viewsController.getEditCategory);

// router.get('/admin/products', viewsController.getProducts);

// router.get('/admin/products/add-product', viewsController.addProduct);

// router.post('/admin/products/add-product', viewsController.createProduct);

// router.get('/admin/products/edit-product/:id', viewsController.getEditProduct);

// router.post('/admin/products/edit-product/:id', viewsController.updateProduct);

// router.get('/', authController.isLoggedIn, viewsController.indexPage);

// router.get('/products', authController.isLoggedIn, viewsController.getAllProduct);

// router.get('/products/:category', authController.protect, viewsController.getProductCategory);

// router.get('/products/:category/:product', authController.isLoggedIn, viewsController.getProductDetail);

// GET OTHER PAGES (ABOUT, SERVICES, BLOG, CONTACT US etc...)
// router.get('/:slug', authController.isLoggedIn, viewsController.page);

module.exports = router;