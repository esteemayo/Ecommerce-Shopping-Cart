const express = require('express');

const authController = require('../controllers/authController');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(pageController.getAllPages)
  .post(pageController.createPage);

router
  .route('/:id')
  .get(pageController.getPage)
  .patch(pageController.updatePage)
  .delete(pageController.deletePage);

module.exports = router;
