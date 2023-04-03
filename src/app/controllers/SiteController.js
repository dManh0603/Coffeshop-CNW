const Product = require("../models/Product");
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
            products: multipleMongooseToObject(products),
          });
        })
        .catch((e) => {
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
  menu(req, res) {
    let cartQuantity
    if (req.session.cart) {
      cartQuantity = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    }
    else {
      cartQuantity = 0
    }
    Product.find({})
      .then(products => {
        res.render('site/menu', {
          layout: 'blank',
          title: 'Menu page',
          products: multipleMongooseToObject(products),
          cartQuantity
        });
      })
      .catch(e => {
        next(e);
      })
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
}

module.exports = new SiteController();
