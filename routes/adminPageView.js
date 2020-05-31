const express = require('express');
const authController = require('../controllers/authController');
const adminPageViewController = require('../controllers/adminPageViewController');

const router = express.Router();

// router.use(authController.protect);

router.get('/', adminPageViewController.getAllPages);

router.get('/reorder-pages', adminPageViewController.getReorderPage);

router.get('/add-page', adminPageViewController.getAddPage);

router.post('/add-page', adminPageViewController.createAddPage);

router.get('/edit-page/:slug', adminPageViewController.getEditPage);

router.post('/edit-page/:slug', adminPageViewController.updateEditPage);

router.get('/delete-page/:id', adminPageViewController.deletePage);

module.exports = router;