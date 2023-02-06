import express from 'express';
import morgan from 'morgan';
import path from 'path';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import session from 'express-session';

// MODELS
import Page from '../models/Page.js';
import Category from '../models/Category.js';

// ROUTES
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import globalErrorHandler from '../controllers/errorController.js';
import authController from '../controllers/authController.js';
import categoryRoute from '../routes/category.js';
import pageRoute from '../routes/page.js';
import productRoute from '../routes/products.js';
import usersRoute from '../routes/users.js';
import viewRoute from '../routes/view.js';
import pageView from '../routes/pageView.js';
import productView from '../routes/productView.js';
import cartRoute from '../routes/cart.js';
import adminProductView from '../routes/adminProductView.js';
import adminCategoryView from '../routes/adminCategoryView.js';
import adminPageView from '../routes/adminPageView.js';

const routes = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  // GLOBAL MIDDLEWARES

  // SERVING STATIC FILES
  app.use(express.static(path.join(__dirname, '../public')));

  // SET SECURITY HTTP HEADERS
  app.use(helmet());

  // DEVELOPMENT LOGGING
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // EXPRESS SESSION MIDDLEWARE
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

  // LIMIT REQUEST FROM SOME API
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

  // GET ALL PAGES TO HEADER.EJS
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

  // GET ALL CATEGORIES TO HEADER.EJS
  app.use(async (req, res, next) => {
    const categories = await Category.find();
    res.locals.categories = categories;
    next();
  });

  // BODY PARSER
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());

  // DATA SANITIZATION AGAINST NoSQL QUERY INJECTION
  app.use(mongoSanitize());

  // DATA SANITIZATION AGAINST XSS
  app.use(xss());

  // PREVENT PARAMETER POLLUTION
  app.use(hpp({
    whitelist: [
      'price',
      'priceDiscount',
      'title'
    ]
  }));

  // TEST MIDDLEWARE
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
  });

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
}

export default routes;
