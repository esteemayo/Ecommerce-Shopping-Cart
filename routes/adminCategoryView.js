const express = require('express');

const authController = require('../controllers/authController');
const adminCategoryViewController = require('../controllers/adminCategoryViewController');

const router = express.Router();

// router.use(authController.protect);

router.get('/', adminCategoryViewController.getAllCategories);

router.get('/add-category', adminCategoryViewController.addCategory);

router.get('/edit-category/:id', adminCategoryViewController.getEditCategory);

module.exports = router;
