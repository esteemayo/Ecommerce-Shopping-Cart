const express = require('express');

const authController = require('../controllers/authController');
const pageViewController = require('../controllers/pageViewController');
const Page = require('../models/Page');

const router = express.Router();

router.get('/', pageViewController.indexPage);

router.get('/:slug', pageViewController.page);
// router.get('/:slug', (req, res) => {
//     let slug = req.params.slug;

//     Page.findOne({ slug })
//         .then(page => {
//             if (!page) {
//                 res.redirect('/');
//             } else {
//                 res.render('index', {
//                     title: page.title,
//                     content: page.content
//                 });
//             }
//         });
// });

module.exports = router;
