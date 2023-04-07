const Product = require('../models/Product');
const Account = require('../models/Account');
const Order = require('../models/Order');

const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
class AdminController {

    // [GET] /admin
    async index(req, res, next) {

        const accountAmount = await Account.countDocuments({role: 'user'});
        const productAmount = await Product.countDocuments();
        let orderAmount = 0;
        let incomeAmount = 0;

        // Calculate total income from orders and order amount
        const orders = await Order.find();
        orders.forEach(order => {
            incomeAmount += order.total;
            orderAmount += 1;
        });

        const accounts = await Account.find({})
            .then(accounts => {
                console.log(multipleMongooseToObject(accounts))
                res.render('admin/adminpage', {
                    layout: 'blank',
                    accountAmount,
                    productAmount,
                    orderAmount,
                    incomeAmount,
                    accounts: multipleMongooseToObject(accounts),
                })
            })



    }
    // [GET] /admin/stored/products
    storedProducts(req, res, next) {
        // resolve sorting
        Promise.all([
            Product.find({}).sortable(req),
            Product.countDocumentsDeleted()])
            .then(([products, deletedCount]) =>
                res.render('admin/stored-products', {
                    deletedCount,
                    products: multipleMongooseToObject(products),
                })
            )
            .catch(next);
    }

    // [GET] /admin/trash/products
    trashProducts(req, res, next) {
        Product.findDeleted({})
            .then((products) => {
                res.render('admin/trash-products', {
                    products: multipleMongooseToObject(products)
                });
            })
            .catch(next);
    }

}

module.exports = new AdminController;