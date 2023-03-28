const Product = require('../models/Product');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class SiteController {

    // [GET] /
    index(req, res, next) {
        Product.find({})
            .then(products => {
                res.render('site/home', {
                    title: 'Home page',
                    products: multipleMongooseToObject(products),
                });
            })
            .catch(e => {
                next(e);
            })
    }

    // [GET] /search
    search(req, res) {
        res.render('site/search');
    }

    // [GET] /contact
    contact(req, res) {
        res.render('site/contact');
    }
   
     // [GET] /menu
    contact(req, res) {
        res.render('site/menu');
    }
     // [GET] /about
    contact(req, res) {
        res.render('site/about');
    }
     // [GET] /shop
    contact(req, res) {
        res.render('site/shop');
    }
}





module.exports = new SiteController;