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
        Order.find({ created_by: userId }).sortable(req)
            .select('order_id phone total isPaid firstname lastname createdAt')
            .then(orders => {
                const modifiedOrders = orders.map(order => {
                    const fullname = order.firstname + ' ' + order.lastname;
                    return {
                        order_id: order.order_id,
                        phone: order.phone,
                        total: order.total,
                        isPaid: order.isPaid,
                        fullname: fullname,
                        createdAt: order.createdAt
                    };
                });

                res.render('me/orders', { orders: modifiedOrders });
            })
            .catch(error => {
                console.log(error);
                const errorMessage = 'Error retrieving orders';
                res.status(500).send({ message: errorMessage });
            });
    }

    showOrder(req, res, next) {
        const orderId = req.params.id;

        Order.findOne({ order_id: orderId }, (err, order) => {
            if (err) {
                return next(err);
            }

            if (!order) {
                return res.status(404).send('Order not found');
            }

            // Extract the product IDs and quantities from the items array
            const itemsWithProduct = order.items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            // Query the Product collection for the matching products
            const productIds = itemsWithProduct.map(item => item.product_id);
            Product.find({ product_id: { $in: productIds } }, (err, products) => {
                if (err) {
                    return next(err);
                }

                // Map the product details to the items in the order
                const itemsWithProductDetails = itemsWithProduct.map(item => {
                    const product = products.find(p => p.product_id === item.product_id);
                    return {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        imageId: product.imageId,
                        slug: product.slug,
                        product_id: product.product_id,
                        quantity: item.quantity,
                        totalCost: item.quantity * product.price,
                    };
                });
                const totalQuantity = itemsWithProductDetails.reduce((total, item) => total + item.quantity, 0);
                // Combine the order and items objects
                const orderWithItems = {
                    order_id: order.order_id,
                    payment_id: order.payment_id,
                    firstname: order.firstname,
                    lastname: order.lastname,
                    email: order.email,
                    phone: order.phone,
                    address: order.address,
                    isPaid: order.isPaid,
                    items: itemsWithProductDetails,
                    total: order.total,
                    updatedAt: order.updatedAt,
                    totalQuantity:totalQuantity
                };



                res.render('me/orderDetails',{ order: orderWithItems });
            });
        });
    }






}

module.exports = new MeController;
