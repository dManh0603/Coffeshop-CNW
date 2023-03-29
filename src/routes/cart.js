const express = require('express');
const cartController = require('../app/controllers/CartController');
const router = express.Router();

router.get('/add/:slug', cartController.add)

module.exports = router;