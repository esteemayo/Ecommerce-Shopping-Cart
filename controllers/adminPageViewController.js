const Page = require('../models/Page');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPages = catchAsync(async (req, res, next) => {
  const pages = await Page.find().sort({ sorting: 1 });

  res.status(200).render('admin/pages', {
    title: '',
    pages
  });
});

// exports.getPage = catchAsync(async (req, res, next) => {
//     const page = await Page.findOne({ slug: 'home' });

//     res.status(200).render('index', {
//         title: '',
//         page
//     });
// });

exports.getAddPage = (req, res, next) => {
  res.render('admin/add_page', {
    title: 'Add page'
  });
};

exports.createAddPage = catchAsync(async (req, res, next) => {
  const { slug } = req.body;

  const page = await Page.findOne({ slug });
  if (page) {
    return next(new AppError('Page slug exists, choose another.'));
  }

  const newPage = await Page.create({
    title: req.body.title,
    content: req.body.content,
    sorting: 100
  });

  res.status(201).redirect('/admin/pages');
});

exports.getEditPage = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const page = await Page.findOne({ slug });

  if (!page) {
    return next(
      new AppError(`There is no page with that name → ${slug}`, 404)
    );
  }

  res.status(200).render('admin/edit_page', {
    title: 'Edit page',
    page
  });
});

exports.updateEditPage = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const page = await Page.findOne({ slug });

  if (!page) {
    return next(
      new AppError(`There is no page with that name → ${slug}`, 404)
    );
  }

  page.title = req.body.title;
  page.slug = req.body.slug;
  page.content = req.body.content;
  await page.save();

  res.status(200).redirect(`/admin/pages/edit-page/${page.slug}`);
});

exports.deletePage = catchAsync(async (req, res, next) => {
  const { id: pageId } = req.params;

  const page = await Page.findByIdAndDelete(pageId);

  if (!page) {
    return next(
      new AppError(`There is no page with the given ID → ${pageId}`, 404)
    );
  }

  res.status(200).redirect('/admin/pages');
});

exports.getReorderPage = catchAsync(async (req, res, next) => {
  let ids = req.body['id'];

  sortPages(ids, async () => {
    const pages = await Page.find().sort({ sorting: 1 });
    req.app.locals.pages = pages;
  });
});

function sortPages(ids, cb) {
  let count = 0;

  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    count++;

    (async function (count) {
      const page = await Page.findById(id);
      page.sorting = count;
      await page.save();
      ++count;
      if (count >= ids.length) {
        cb();
      }
    })(count);
  }
};
