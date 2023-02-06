import Page from '../models/Page.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getAllPages = catchAsync(async (req, res, next) => {
  const pages = await Page.find().sort({ sorting: 1 });

  res.status(200).render('admin/pages', {
    title: '',
    pages
  });
});

// export const getPage = catchAsync(async (req, res, next) => {
//     const page = await Page.findOne({ slug: 'home' });

//     res.status(200).render('index', {
//         title: '',
//         page
//     });
// });

export const getAddPage = (req, res, next) => {
  res.render('admin/add_page', {
    title: 'Add page'
  });
};

export const createAddPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ slug: req.body.slug });
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

export const getEditPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ slug: req.params.slug });

  if (!page) {
    return next(new AppError('There is no page with that name', 404));
  }

  res.status(200).render('admin/edit_page', {
    title: 'Edit page',
    page
  });
});

export const updateEditPage = catchAsync(async (req, res, next) => {
  const page = await Page.findOne({ slug: req.params.slug });

  if (!page) {
    return next(new AppError('There is no page with that name', 404));
  }

  page.title = req.body.title;
  page.slug = req.body.slug;
  page.content = req.body.content;
  await page.save();

  res.status(200).redirect(`/admin/pages/edit-page/${page.slug}`);
});

export const deletePage = catchAsync(async (req, res, next) => {
  const page = await Page.findByIdAndDelete(req.params.id);

  if (!page) {
    return next(new AppError('There is no page with the given ID', 404));
  }

  res.status(200).redirect('/admin/pages');
});

export const getReorderPage = catchAsync(async (req, res, next) => {
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
