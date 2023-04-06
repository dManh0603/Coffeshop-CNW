const express = require('express');
const cartController = require('../app/controllers/CartController');
const router = express.Router();

router.delete('/delete/:slug', cartController.deleteItem)
router.post('/add', cartController.add)
router.post('/update-cart', cartController.updateCart)
router.post('/pay', cartController.pay)
router.get('/checkout', cartController.checkout)
router.get('/', cartController.index)

module.exports = router;