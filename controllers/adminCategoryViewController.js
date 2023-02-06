import Category from '../models/Category.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).render('admin/categories', {
    title: '',
    categories
  });
});

export const addCategory = (req, res) => {
  res.status(200).render('admin/add_category', {
    title: 'Add new category'
  });
};

export const getEditCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).render('admin/edit_category', {
    title: '',
    category
  });
});
