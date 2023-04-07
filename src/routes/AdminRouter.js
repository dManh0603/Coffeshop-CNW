const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');

router.get('/stored/products', adminController.storedProducts);
router.get('/trash/products', adminController.trashProducts);
router.get('/showorder', adminController.showOrder);
router.get('/orders', adminController.orders);
router.get('/account', adminController.account);
router.get('/admin', adminController.index);
router.get('/', adminController.index);
module.exports = router;