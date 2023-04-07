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
            .select('order_id phone total isPaid firstname lastname')
            .then(orders => {
                const modifiedOrders = orders.map(order => {
                    const fullname = order.firstname + ' ' + order.lastname;
                    return {
                        order_id: order.order_id,
                        phone: order.phone,
                        total: order.total,
                        isPaid: order.isPaid,
                        fullname: fullname
                    };
                });
                console.log(multipleMongooseToObject(modifiedOrders));
                res.render('me/orders', { orders: multipleMongooseToObject(modifiedOrders) });
            })
            .catch(error => {
                console.log(error);
                const errorMessage = 'Error retrieving orders';
                res.status(500).render('error', { message: errorMessage });
            });
    }


}

module.exports = new MeController;
