const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');

router.get('/stored/products', adminController.storedProducts);
router.get('/trash/products', adminController.trashProducts);
router.get('/', adminController.index);
module.exports = router;