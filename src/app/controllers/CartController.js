const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class CartController {

    // [POST] /add/:slug
    add(req, res, next) {
        console.log('controller', req.body.slug)
        Product.find({ _slug: req.body.slug })
            .then(product => {
                console.log(product);
                res.json({ success: true, })
            })
            .catch(e => {
                res.json({ error: e, })
            })
    }
}





module.exports = new CartController;