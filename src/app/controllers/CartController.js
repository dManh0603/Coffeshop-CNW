const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Account = require('../models/Account');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class CartController {

    // [GET] /cart
    async index(req, res, next) {
        let cartQuantity = 0;
        let cartItems = [];
        let cartId;

        if (req.session.currentUser) {
            const accountId = req.session.currentUser.accountId;
            try {
                const userCart = await Cart.findOne({ accountId });
                console.log('usercart:', userCart)
                if (userCart && userCart.items.length > 0) {
                    const productSlugs = userCart.items.map((item) => item.productSlug);
                    const products = await Product.find({ slug: { $in: productSlugs } });
                    cartItems = userCart.items.map((item) => {
                        const product = products.find((p) => p.slug === item.productSlug);
                        return {
                            name: product.name,
                            price: product.price,
                            quantity: item.quantity,
                            totalCost: item.quantity * product.price,
                            imageId: product.imageId,
                            slug: product.slug,
                        };
                    });
                    cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
                    cartId = userCart.cart_id;
                }
                renderCart(cartItems, cartQuantity, cartId);
            } catch (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }
        } else if (req.session.cart) {
            const productSlugs = req.session.cart.map((item) => item.productSlug);
            try {
                const products = await Product.find({ slug: { $in: productSlugs } });
                cartItems = products.map((product) => {
                    const cartItem = req.session.cart.find((item) => item.productSlug === product.slug);
                    return {
                        name: product.name,
                        price: product.price,
                        quantity: cartItem.quantity,
                        totalCost: cartItem.quantity * product.price,
                        imageId: product.imageId,
                        slug: product.slug,
                    };
                });
                cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
                renderCart(cartItems, cartQuantity, cartId);
            } catch (err) {
                console.error(err);
                // Handle errors
            }
        } else {
            renderCart(cartItems, cartQuantity, cartId);
        }

        function renderCart(items, quantity, cartId) {
            res.render('cart/index', {
                items,
                cartQuantity: quantity,
                cart_id: cartId
            });
        }
    }


    // [POST] /add/
    add(req, res, next) {
        const productSlug = req.body.slug;
        const quantity = req.body.quantity ?? 1;
        const cartItem = {
            productSlug,
            quantity,
        }

        // ON LOGGED IN
        if (req.session.currentUser) {
            const accountId = req.session.currentUser.accountId;

            // Find user's cart in the database
            Cart.findOne({ accountId })
                .then((userCart) => {
                    if (!userCart) {
                        // If user's cart doesn't exist in the database yet, create it
                        userCart = new Cart({
                            accountId,
                            items: [],
                        });
                    }

                    // Check if the product is already in the cart
                    const existingItemIndex = userCart.items.findIndex(item => item.productSlug === productSlug);

                    if (existingItemIndex !== -1) {
                        // If the product is already in the cart, update the quantity
                        userCart.items[existingItemIndex].quantity += quantity;
                    } else {
                        // If the product is not in the cart yet, add it as a new item
                        userCart.items.push(cartItem);
                    }

                    // Save user's updated cart in the database
                    userCart.save()
                        .then(() => {
                            // Return the current cart quantity to the client
                            const currentQuantity = userCart.items.reduce((total, item) => total + item.quantity, 0);
                            res.json({ success: true, currentQuantity });
                        })
                        .catch(err => {
                            console.error(err);
                            // Handle errors
                        });
                })
                .catch(err => {
                    console.error(err);
                    // Handle errors
                });
        }
        // ON SESSION
        else {
            // Add item to the cart on current session
            if (!req.session.cart) {
                // If the cart doesn't exist on the session yet, create it
                req.session.cart = [];
            }
            // Check if the product is already in the cart
            const existingItemIndex = req.session.cart.findIndex(item => item.productSlug === productSlug);
            if (existingItemIndex !== -1) {

                req.session.cart[existingItemIndex].quantity += quantity;
            } else {
                // If the product is not in the cart yet, add it as a new item
                req.session.cart.push(cartItem);
            }
            req.session.save()
            const currentQuantity = req.session.cart.reduce((total, item) => total + item.quantity, 0);
            res.json({ success: true, currentQuantity });
        }
    }


    // [POST] /update-cart-quantity
    updateCart(req, res, next) {
        const { productSlug, quantity } = req.body;

        if (req.session.currentUser) {
            const accountId = req.session.currentUser.accountId;

            Cart.findOne({ accountId })
                .then((cart) => {
                    const cartItem = cart.items.find((item) => item.productSlug === productSlug);
                    if (cartItem) {
                        cartItem.quantity = parseInt(quantity);
                    }
                    return cart.save();
                })
                .then(() => {
                    return Cart.findOne({ accountId });
                })
                .then((cart) => {
                    const currentQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
                    res.json({
                        success: true,
                        currentQuantity
                    });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                });
        } else {
            const cartItem = req.session.cart.find((item) => item.productSlug === productSlug);
            if (cartItem) {
                cartItem.quantity = parseInt(quantity);
            }

            const currentQuantity = req.session.cart.reduce((total, item) => total + item.quantity, 0);
            res.json({
                success: true,
                currentQuantity
            });
        }
    }


    // [DELETE] /cart/delete/:slug
    async deleteItem(req, res, next) {
        try {
            const slug = req.params.slug;

            if (req.session.currentUser) {
                const accountId = req.session.currentUser.accountId;
                const userCart = await Cart.findOne({ accountId });

                if (userCart) {
                    const itemIndex = userCart.items.findIndex((item) => item.productSlug === slug);

                    if (itemIndex >= 0) {
                        userCart.items.splice(itemIndex, 1);
                        await userCart.save();
                    }
                }
            } else {
                const cart = req.session.cart;
                const itemIndex = cart.findIndex((item) => item.productSlug === slug);

                if (itemIndex >= 0) {
                    cart.splice(itemIndex, 1);
                    req.session.save();
                }
            }

            const currentQuantity = req.session.cart.reduce((total, item) => total + item.quantity, 0);
            res.json({
                success: true,
                currentQuantity
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }


    // [GET] /cart/checkout
    async checkout(req, res, next) {
        const cartId = req.query.cart_id;

        try {
            const cart = await Cart.findOne({ cart_id: cartId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            const accountId = cart.accountId;
            const account = await Account.findOne({ accountId });
            if (!account) {
                throw new Error('Account not found');
            }

            const { firstname, lastname, email, phone } = account;

            res.render('cart/checkout', {
                firstname,
                lastname,
                email,
                phone
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            next()
        }
    }




    // [POST] /cart/pay
    pay(req, res, next) {
        const shippingInfo = req.body;
        let cartQuantity = 0;
        let cartItems = [];

        if (req.session.currentUser) {
            const accountId = req.session.currentUser.accountId;
            try {
                Cart.findOne({ accountId }, (err, userCart) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    if (userCart && userCart.items.length > 0) {
                        const productSlugs = userCart.items.map((item) => item.productSlug);
                        Product.find({ slug: { $in: productSlugs } }, (err, products) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('Internal Server Error');
                                return;
                            }

                            cartItems = userCart.items.map((item) => {
                                const product = products.find((p) => p.slug === item.productSlug);
                                return {
                                    product_id: product.product_id,
                                    name: product.name,
                                    price: product.price,
                                    quantity: item.quantity,
                                    totalCost: item.quantity * product.price,
                                    imageId: product.imageId,
                                    slug: product.slug
                                };
                            });

                            cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
                            const cartTotalCost = cartItems.reduce((total, item) => total + item.totalCost, 0);
                            req.session.shippingInfo = shippingInfo;
                            res.render('cart/pay', {
                                cartItems,
                                cartQuantity,
                                shippingInfo,
                                cartTotalCost,
                                PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID
                            });
                        });
                    } else {
                        res.redirect('/cart');
                    }
                });
            } catch (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }
        } else if (req.session.cart) {
            const productSlugs = req.session.cart.map(item => item.productSlug);
            Product.find({ slug: { $in: productSlugs } }, (err, products) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                cartItems = products.map(product => {
                    const cartItem = req.session.cart.find(item => item.productSlug === product.slug);
                    return {
                        product_id: product.product_id,
                        name: product.name,
                        price: product.price,
                        quantity: cartItem.quantity,
                        totalCost: cartItem.quantity * product.price,
                        imageId: product.imageId,
                        slug: product.slug
                    };
                });

                cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
                const cartTotalCost = cartItems.reduce((total, item) => total + item.totalCost, 0);
                req.session.shippingInfo = shippingInfo;
                res.render('cart/pay', {
                    cartItems,
                    cartQuantity,
                    shippingInfo,
                    cartTotalCost,
                    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID
                });
            });
        } else {
            res.redirect('/cart');
        }
    }

}





module.exports = new CartController;