const Page = require('../models/Page');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.indexPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ slug: 'home' });

  res.status(200).render('index', {
    title: page.title,
    content: page.content
  });
});

// GET OTHER PAGES (ABOUT, SERVICES, BLOG, CONTACT US etc...)
exports.page = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ slug: req.params.slug });

  // if (!page) {
  //     return next(new AppError('No page found with that slug', 404));
  // }

  res.status(200).render('index', {
    title: page.title,
    content: page.content
  });
});
