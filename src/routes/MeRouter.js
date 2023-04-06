const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/MeController');

const { authenticate, checkAdminRole, checkUserRole } = require('../app/middlewares/auth_with_cookie');

router.get("/account", authenticate, meController.account);
router.get("/orders", authenticate, meController.orders);


module.exports = router;