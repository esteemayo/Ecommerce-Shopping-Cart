const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAddCart = catchAsync(async (req, res, next) => {
  let slug = req.params.product;
  const product = await Product.findOne({ slug });

  if (typeof req.session.cart === 'undefined') {
    req.session.cart = [];
    req.session.cart.push({
      title: slug,
      qty: 1,
      price: parseFloat(product.price).toFixed(2),
      priceDiscount: parseFloat(product.priceDiscount).toFixed(2),
      image: `/img/products/${product.image}`,
      id: product._id
    });
  } else {
    let cart = req.session.cart;
    let newItem = true;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].title === slug) {
        cart[i].qty++;
        newItem = false;
        break;
      }
    }
    // check if new item is true
    if (newItem) {
      cart.push({
        title: slug,
        qty: 1,
        price: parseFloat(product.price).toFixed(2),
        priceDiscount: parseFloat(product.priceDiscount).toFixed(2),
        image: `/img/products/${product.image}`,
        id: product._id
      });
    }
  }
  console.log(req.session.cart);
  res.redirect('back');
});

exports.getCheckout = (req, res, next) => {
  if (req.session.cart && req.session.cart.length === 0) {
    delete req.session.cart;
    return res.redirect('/cart/checkout');
  }
  return res.render('checkout', {
    title: 'Checkout',
    cart: req.session.cart
  });
};

exports.updateCart = catchAsync(async (req, res, next) => {
  const slug = req.params.product;
  const cart = req.session.cart;
  const action = req.query.action;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].title === slug) {
      switch (action) {
        case 'add':
          cart[i].qty++;
          break;
        case 'remove':
          cart[i].qty--;
          if (cart[i].qty < 1) cart.splice(i, 1);
          break;
        case 'clear':
          cart.splice(i, 1);
          if (cart.length === 0) delete cart;
          // if (cart.length === 0) delete req.session.cart;
          break;

        default:
          console.log(`There's a problem updating...`);
          break;
      }
      break;
    }
  }
  res.redirect('back');
});

exports.clearCart = (req, res) => {
  delete req.session.cart;

  res.redirect('back');
};

// exports.buyNow = (req, res) => {
//     delete req.session.cart;
//     res.status(200).json({ status: 'success' });
// };

exports.buyNow = catchAsync(async (req, res, next) => {
  const cart = req.session.cart;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/products`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart/checkout`,
    // customer_email: req.user.email,
    // client_reference_id: cart.id,
    line_items: [
      {
        name: req.session.cart.title,
        description: req.session.cart.description,
        image: [
          `${req.protocol}://${req.get('host')}/img/products/${req.session.cart.image}`
        ],
        amount: req.session.cart.price * 100,
        currency: 'usd',
        quantity: req.session.cart.qty
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    session
  });
});
