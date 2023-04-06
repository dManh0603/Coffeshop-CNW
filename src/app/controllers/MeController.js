const Product = require('../models/Product');
const Order = require('../models/Order');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class MeController {
    // [GET] /me/account
    account(req, res, next) {
        res.render('me/account');
    }

    orders(req, res, next) {
        const userId = req.session.currentUser.accountId;
        Order.find({ created_by: userId })
            .then(orders => {
                res.render('me/orders', { orders: multipleMongooseToObject(orders) });
            })
            .catch(error => {
                console.log(error);
                const errorMessage = 'Error retrieving orders';
                res.status(500).render('error', { message: errorMessage });
            });
    }

}

module.exports = new MeController;