const express = require("express");
const router = express.Router();
const AuthController = require("../app/controllers/AuthController");
const authenticate = require("../app/middlewares/authenticate");

var { validationResult } = require("express-validator");
const validator = require("../app/middlewares/validate");
const { check } = require("express-validator");

router.post("/signup", validator.validateSignUpAccount(), AuthController.signup);

router.post("/login", validator.validateLogin(), AuthController.login);
router.post("/refreshtoken", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.get("/api/getAll", authenticate, AuthController.getAll);

module.exports = router;
