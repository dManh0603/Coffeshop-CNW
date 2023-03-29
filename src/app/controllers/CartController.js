const Product = require('../models/Product');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class CartController {

    // [GET] /add/:slug
    add(req, res, next) {
        console.log(req.params)
        return "add to cart successfully"
    }


}





module.exports = new CartController;