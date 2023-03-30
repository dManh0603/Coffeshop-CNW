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

  // [GET] /search
  search(req, res) {
    res.render("site/search");
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
    res.render("site/menu");
  }
  // [GET] /about
  about(req, res) {
    res.render("site/about");
  }
  // [GET] /signin
  signin(req, res) {
    res.render("site/signin");
  }
  // [GET] /signup
  signup(req, res) {
    res.render("site/signup");
  }
  // [GET] /signout
  signout(req, res) {
    res.render("site/signout");
  }
  // [GET] /home
  home(req, res) {
    res.render("site/home");
  }
  // [GET] /shop
  shop(req, res) {
    res.render("site/shop");
  }
  // [GET] /product_detail
  product_detail(req, res) {
    res.render("site/product_detail");
  }
}

module.exports = new SiteController();
