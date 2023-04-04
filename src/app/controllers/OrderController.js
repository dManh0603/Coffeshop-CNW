const Product = require('../models/Product');
const Cart = require('../models/Cart');
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
            const products = await Product.find({
                slug: { $in: req.body.items.map(item => item.slug) }
            });

            if (!products.length) {
                return res.status(400).json({ error: 'No products found for given slugs' });
            }

            const request = new Paypal.orders.OrdersCreateRequest();
            const total = req.body.items.reduce((sum, item) => {
                const product = products.find(p => p.slug === item.slug);
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
                            const product = products.find(p => p.slug === item.slug);
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

            const order = await paypalClient.execute(request);

            if (order.statusCode !== 201) {
                return res.status(500).json({ error: 'Failed to create order' });
            }

            req.session.cart = null;

            res.json({ id: order.result.id });
        } catch (e) {
            console.error(e);

            res.status(500).json({ error: 'An error occurred while creating the order' });
        }
    }



    // [POST] /order/create
    // async create(req, res, next) {
    //     const request = new Paypal.orders.OrdersCreateRequest()
    //     const total = req.body.items.reduce((sum, item) => {
    //         return sum + storeItems.get(item.id).price * item.quantity
    //     }, 0)
    //     request.prefer("return=representation")
    //     request.requestBody({
    //         intent: "CAPTURE",
    //         purchase_units: [
    //             {
    //                 amount: {
    //                     currency_code: "USD",
    //                     value: total,
    //                     breakdown: {
    //                         item_total: {
    //                             currency_code: "USD",
    //                             value: total,
    //                         },
    //                     },
    //                 },
    //                 items: req.body.items.map(item => {
    //                     const storeItem = storeItems.get(item.id)
    //                     return {
    //                         name: storeItem.name,
    //                         unit_amount: {
    //                             currency_code: "USD",
    //                             value: storeItem.price,
    //                         },
    //                         quantity: item.quantity,
    //                     }
    //                 }),
    //             },
    //         ],
    //     })

    //     try {
    //         const order = await paypalClient.execute(request)
    //         res.json({ id: order.result.id })
    //     } catch (e) {
    //         res.status(500).json({ error: e.message })
    //     }
    // }

}





module.exports = new OrderController;