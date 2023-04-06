const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { multipleMongooseToObject } = require("../../util/mongoose");
class SiteController {
  // [GET] /
  index(req, res, next) {
    Product.find({})
      .then((products) => {
        res.render("site/home", {
          title: "Home page",
          products: multipleMongooseToObject(products),
        });
      })
      .catch((e) => {
        next(e);
      });
  }

  // [GET] /search?q=
  search(req, res) {
    if (req.query.q === '') {
      Product.find({})
        .then((products) => {
          res.json({
            success: true,
            msg: "Search results",
            products: multipleMongooseToObject(products),
          });
        })
        .catch((e) => {
          console.error(e);
          next(e);
        });
      return;
    }
    Product.find({ $text: { $search: req.query.q } })
      .then((products) => {
        res.json({
          success: true,
          msg: "Search results",
          products: multipleMongooseToObject(products),
        });
      })
      .catch((e) => {
        console.error(e);
        next(e);
      });
  }


  // [GET] /contact
  contact(req, res) {
    res.render("site/contact");
  }

  // [GET] /contact
  contact(req, res) {
    res.render("site/contact");
  }

  // [GET] /menu
  async menu(req, res) {
    let cartQuantity = 0;
    let products = [];

    try {
      if (req.session.currentUser) {
        const accountId = req.session.currentUser.accountId;
        const userCart = await Cart.findOne({ accountId });
        if (userCart) {
          products = await Product.find({ _id: { $in: userCart.items.map(item => item.product) } });
          cartQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);
        }
      }

      if (!products.length) {
        products = await Product.find({});
      }

      if (req.session.cart) {
        cartQuantity += req.session.cart.reduce((total, item) => total + item.quantity, 0);
      }

      res.render('site/menu', {
        layout: 'blank',
        title: 'Menu page',
        products: multipleMongooseToObject(products),
        cartQuantity
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }


  // [GET] /about
  about(req, res) {
    res.render('site/about');
  }
  // [GET] /signin
  signin(req, res) {
    res.render('site/signin');
  }
  // [GET] /signup
  signup(req, res) {
    res.render('site/signup');
  }
  // [GET] /signout
  signout(req, res) {
    res.render('site/signout');
  }
  // [GET] /signout
  forgetPassword(req, res) {
    res.render('site/forget_password');
  }
  // [GET] /home
  home(req, res) {
    res.render('site/home');
  }
  // [GET] /shop
  shop(req, res) {
    res.render('site/shop');
  }

  // [GET] /shop
  userDetail(req, res) {
    res.render('site/user_detail');
  }

  // [GET] /shop
  unauth(req, res) {
    res.render('site/401');
  }
}

module.exports = new SiteController();
