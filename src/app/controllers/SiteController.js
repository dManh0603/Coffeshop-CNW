const Product = require('../models/Product');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class SiteController {

    // [GET] /
    index(req, res, next) {
        Product.find({})
            .then(products => {
                res.render('home', {
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
        res.render('search');
    }
}

module.exports = new SiteController;