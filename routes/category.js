const express = require('express');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// router.use(authController.protect);
// router.use(authController.restrictTo('admin'));

router
    .route('/')
    .get(categoryController.getAllCAtegories)
    .post(categoryController.createCategory);

router
    .route('/:id')
    .get(categoryController.getCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;