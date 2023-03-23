const Product = require('../models/Product');
const { mongooseToObject } = require('../../util/mongoose');

class ProductController {

    // [GET] /products/:slug
    show(req, res) {

        Product.findOne({ slug: req.params.slug })
            .then(product => {
                res.render('products/show', { product: mongooseToObject(product) });
            })
            .catch(e => next(e))
    }

    // [GET] /products/create
    create(req, res, next) {
        res.render('products/create');
    }
    // [POST] /products/store
    store(req, res, next) {
        const formData = req.body;
        const product = new Product(formData);
        product.save()
            .then(() => {
                console.log('Create successfully');
                res.redirect('/me/stored/products');
            })
            .catch(e => {

            });

    }

    // [GET] /products/:id/edit
    edit(req, res, next) {
        Product.findById(req.params.id)
            .then(product => res.render('products/edit', {
                product: mongooseToObject(product)
            }))
            .catch(next)

    }

    // [PUT] /products/:id
    update(req, res, next) {
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/products'))
            .catch(next)
    }

    // [DELETE] /products/:id
    delete(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [DELETE] /products/:id/destroy
    destroy(req, res, next) {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [PATCH] /products/:id/restore
    restore(req, res, next) {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [POST] /product/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Product.delete({ _id: { $in: req.body.productIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break;
            default:
                res.json({ messsage: 'Invalid action' })
        }
    }
}

module.exports = new ProductController;