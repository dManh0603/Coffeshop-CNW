const Product = require('../models/Product');
const { mongooseToObject } = require('../../util/mongoose');
const { body, validationResult } = require('express-validator');

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
        // Validate user input
        body('name').isString().isLength({ max: 600 }).trim().escape();
        body('description').isString().trim().escape();
        body('price').isNumeric();
        body('isPublished').isBoolean();
        body('imageId').isString();
        body('slug').isString();
        body('product_id').isNumeric();

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
        const { name, description, price, isPublished } = req.body;
        const { id } = req.params;

        // validate inputs
        const errors = [];
        if (!name) errors.push({ field: "name", message: "Name is required." });
        if (!description) errors.push({ field: "description", message: "Description is required." });
        if (!price) errors.push({ field: "price", message: "Price is required." });
        if (!Number.isInteger(Number(price))) errors.push({ field: "price", message: "Price must be an integer." });
        if (isPublished !== "true" && isPublished !== "false") errors.push({ field: "isPublished", message: "Invalid value for isPublished." });
        if (errors.length > 0) {
            return res.status(422).json({ errors });
        }

        // find the product by id
        Product.findById(id)
            .then(product => {
                if (!product) {
                    return res.status(404).json({ error: "Product not found." });
                }

                // update the product
                if (!req.file) {
                    // no new image uploaded
                    Product.updateOne({ _id: id }, { name, description, price, isPublished })
                        .then(() => res.redirect('/me/stored/products'))
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ error: "Failed to update product." });
                        });
                } else {
                    // new image uploaded
                    uploadImage(req.file)
                        .then(imageId => {
                            Product.updateOne({ _id: id }, { name, description, price, isPublished, imageId })
                                .then(() => res.redirect('/me/stored/products'))
                                .catch(err => {
                                    console.error(err);
                                    res.status(500).json({ error: "Failed to update product." });
                                });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).json({ error: "Failed to upload image." });
                        });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: "Failed to update product." });
            });
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