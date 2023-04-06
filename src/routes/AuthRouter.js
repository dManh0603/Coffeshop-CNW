const express = require("express");
const router = express.Router();
const AuthController = require("../app/controllers/AuthController");
const {authenticate, checkAdminRole, checkUserRole} = require("../app/middlewares/auth_with_cookie");
const validator = require("../app/middlewares/validate");

router.post("/signup", validator.validateSignUpAccount(), AuthController.signup);

router.post("/signin", validator.validateLogin(), AuthController.signin);
router.post("/refreshtoken", AuthController.refreshToken);
router.post("/signout", AuthController.signout); 
router.post("/update", authenticate , AuthController.update); 
router.post("/forgetpassword", validator.validateForgetPassword(), AuthController.forgetPassword);

module.exports = router;
