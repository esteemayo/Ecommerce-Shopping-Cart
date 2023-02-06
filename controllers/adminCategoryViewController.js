const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).render('admin/categories', {
    title: '',
    categories
  });
});

exports.addCategory = (req, res) => {
  res.status(200).render('admin/add_category', {
    title: 'Add new category'
  });
};

exports.getEditCategory = catchAsync(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(
      new AppError(`No category found with that ID → ${categoryId}`, 404)
    );
  }

  res.status(200).render('admin/edit_category', {
    title: '',
    category
  });
});
