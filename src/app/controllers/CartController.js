const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { multipleMongooseToObject, } = require('../../util/mongoose');
class CartController {

    // [GET] /cart
    index(req, res, next) {
        let cartQuantity
        if (req.session.cart) {
            cartQuantity = req.session.cart.reduce((total, item) => total + item.quantity, 0);
            const productSlugs = req.session.cart.map(item => item.productSlug);
            Product.find({ slug: { $in: productSlugs } })
                .then(products => {
                    const cartItems = products.map(product => {
                        const cartItem = req.session.cart.find(item => item.productSlug === product.slug);
                        return {
                            name: product.name,
                            price: product.price,
                            quantity: cartItem.quantity,
                            totalCost: cartItem.quantity * product.price,
                            imageId: product.imageId,
                            slug: product.slug
                        }
                    });
                    res.render('cart/index', {
                        items: cartItems,
                        cartQuantity,
                    });
                })
                .catch(err => {
                    console.error(err);
                    // Handle errors
                });
        }

        else {
            cartQuantity = 0

            res.render('cart/index', {
                cartQuantity,
            });
        }


        // console.log(req.session.cart);
    }

    // [POST] /add/:slug
    add(req, res, next) {
        const productSlug = req.body.slug;
        const quantity = req.body.quantity ?? 1;
        const cartItem = {
            productSlug,
            quantity,
        }

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

    // [POST] /update-cart-quantity
    updateCart(req, res, next) {
        const { productSlug, quantity } = req.body;

        const cartItem = req.session.cart.find(item => item.productSlug === productSlug);
        if (cartItem) {
            cartItem.quantity = parseInt(quantity);
        }

        const currentQuantity = req.session.cart.reduce((total, item) => total + item.quantity, 0);
        res.json({
            success: true,
            currentQuantity
        })
    }
}





module.exports = new CartController;