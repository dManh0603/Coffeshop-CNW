const Product = require('../models/Product');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class AdminController {

    // [GET] /admin
    index(req, res, next) {
        res.render('admin/adminpage',{
            layout: 'blank',
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