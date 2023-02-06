const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// models
const Page = require('../models/Page');
const Category = require('../models/Category');

// routes
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');
const authController = require('../controllers/authController');
const categoryRoute = require('../routes/category');
const pageRoute = require('../routes/page');
const productRoute = require('../routes/products');
const usersRoute = require('../routes/users');
const viewRoute = require('../routes/view');
const pageView = require('../routes/pageView');
const productView = require('../routes/productView');
const cartRoute = require('../routes/cart');
const adminProductView = require('../routes/adminProductView');
const adminCategoryView = require('../routes/adminCategoryView');
const adminPageView = require('../routes/adminPageView');

module.exports = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  // GLOBAL MIDDLEWARES

  // serving static files
  app.use(express.static(path.join(__dirname, '../public')));

  // set security HTTP headers
  app.use(helmet());

  // development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // express session middleware
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

  // limit request from some API
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests from this IP, Please try again in an hour!'
  });
  app.use('/api', limiter);

  // app.use((req, res, next) => {
  //     res.locals.user = req.user;
  //     next();
  // });

  // get all pages to header.ejs
  app.use(catchAsync(async (req, res, next) => {
    const pages = await Page.find().sort({ sorting: 1 });
    res.locals.pages = pages;
    res.locals.user = authController.isLoggedIn;
    next();
  }));

  app.use((req, res, next) => {
    res.locals.cart = req.session.cart;
    res.locals.user = authController.isLoggedIn;
    res.locals.url = req.originalUrl;
    next();
  });

  // get all categories to header.ejs
  app.use(async (req, res, next) => {
    const categories = await Category.find();
    res.locals.categories = categories;
    next();
  });

  // body parser
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // cookie parser middleware
  app.use(cookieParser());

  // data sanitization against noSQL query injection
  app.use(mongoSanitize());

  // data sanitization against XSS
  app.use(xss());

  // prevent parameter pollution
  app.use(hpp({
    whitelist: [
      'price',
      'priceDiscount',
      'title'
    ]
  }));

  // test middleware
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
  });

  // api routes
  app.use('/admin/pages', adminPageView);
  app.use('/admin/categories', adminCategoryView);
  app.use('/admin/products', adminProductView);
  app.use('/products', productView);
  app.use('/cart', cartRoute);
  app.use('/', viewRoute);
  app.use('/', pageView);
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/pages', pageRoute);
  app.use('/api/v1/products', productRoute);
  app.use('/api/v1/users', usersRoute);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });

  app.use(globalErrorHandler);
};
