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
                res.redirect('/me/stored/products');
            })
            .catch(e => {
                console.error(e)
                next()
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
        if (!req.body.imageId) {
            // update when no image was uploaded
            Product.findById(req.params.id)
                .then(product => {
                    delete req.body.picture;
                    req.body.imageId = product.imageId;
                    Product.updateOne({ _id: req.params.id }, req.body)
                        .then(() => res.redirect('/me/stored/products'))
                        .catch((err) => {
                            console.error(err)
                        })
                })
                .catch((err) => {
                    console.error(err)
                })

        } else {
            // update when new image was uploaded
            let oldImageId;
            Product.findById(req.params.id).
                then(product => {
                    oldImageId = product.imageId;
                    delete req.body.picture;
                })
            Product.updateOne({ _id: req.params.id }, req.body)
                .then(() => {
                    req.body.oldImageId = oldImageId;
                    next()
                })
                .catch((err) => {
                    console.error(err);
                    next();
                })
        }
    }

    // [DELETE] /products/:id
    delete(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [DELETE] /products/:id/destroy
    destroy(req, res, next) {
        Product.findByIdAndDelete(req.params.id, (err, product) => {
            if (err) {
                console.error(err);
            } else {
                // write the imageId to be deleted and give it to the next function
                req.body.oldImageId = product.imageId;
                next()
            }
        })

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