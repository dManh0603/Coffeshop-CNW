const express = require('express');
const cartController = require('../app/controllers/CartController');
const router = express.Router();

router.post('/add/', cartController.add)
router.post('/update-cart/', cartController.updateCart)
router.get('/', cartController.index)

module.exports = router;