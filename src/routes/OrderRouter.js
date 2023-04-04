const express = require('express');
const orderController = require('../app/controllers/OrderController');
const router = express.Router();

router.post('/create', orderController.create)


module.exports = router;