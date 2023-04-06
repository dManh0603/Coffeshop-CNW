const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order')

const Paypal = require('@paypal/checkout-server-sdk');

const { multipleMongooseToObject, } = require('../../util/mongoose');
const Environment =
    process.env.NODE_ENV === "PROD"
        ? Paypal.core.LiveEnvironment
        : Paypal.core.SandboxEnvironment

const paypalClient = new Paypal.core.PayPalHttpClient(
    new Environment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET,
    )
);

class OrderController {

    async create(req, res, next) {
        try {
            const shippingInfo = req.session.shippingInfo;
            const cartItems = req.body.items;

            const products = await Product.find({
                product_id: { $in: req.body.items.map(item => item.product_id) }
            });

            if (!products.length) {
                return res.status(400).json({ error: 'No products found for given ids' });
            }

            const request = new Paypal.orders.OrdersCreateRequest();
            const total = req.body.items.reduce((sum, item) => {
                const product = products.find(p => p.product_id === item.product_id);
                return sum + product.price * item.quantity;
            }, 0);

            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: total,
                                },
                            },
                        },
                        items: req.body.items.map(item => {
                            const product = products.find(p => p.product_id === item.product_id);
                            return {
                                name: product.name,
                                unit_amount: {
                                    currency_code: "USD",
                                    value: product.price,
                                },
                                quantity: item.quantity,
                            }
                        }),
                    },
                ],
            });

            const PP_order = await paypalClient.execute(request);

            if (PP_order.statusCode !== 201) {
                return res.status(500).json({ error: 'Failed to create order' });
            }

            req.session.cart = null;

            res.json({ id: PP_order.result.id });

            // Save order to db
            const order = {
                created_by: 'guest',
                payment_id: PP_order.result.id,
                firstname: shippingInfo.firstname,
                lastname: shippingInfo.lastname,
                email: shippingInfo.email,
                phone: shippingInfo.phone,
                address: shippingInfo.address,
                items: cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
                total: total,
            };

            Order.create(order)
                .then(newOrder => {
                    console.log('New order created:', newOrder);
                    // Do something with the new order
                })
                .catch(error => {
                    console.error('Error creating new order:', error);
                    // Handle the error
                });
        } catch (e) {
            console.error(e);

            res.status(500).json({ error: 'An error occurred while creating the order' });
        }
    }

    update(req, res, next) {
        const orderDetails = req.body;
        const PP_orderId = orderDetails.id;
        // TODO: secure the transaction data
        Order.findOneAndUpdate({ payment_id: PP_orderId }, { isPaid: true }, { new: true })
            .then(updatedOrder => {
                if (updatedOrder) {
                    console.log('updated order:', updatedOrder)
                    res.json({ success: true, message: `Order ${updatedOrder._id} has been updated.` });
                } else {
                    res.status(404).json({ success: false, message: `Order with payment ID ${PP_orderId} not found.` });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ success: false, message: 'An error occurred while updating the order.' });
            });
    }


}

module.exports = new OrderController;