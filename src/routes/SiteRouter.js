const express = require("express");
const SiteController = require("../app/controllers/SiteController");
const router = express.Router();

const siteController = require("../app/controllers/SiteController");
const authenticate = require("../app/middlewares/auth_with_token");
const test = require("../app/middlewares/auth_with_cookie");

router.get("/search", siteController.search);
router.get("/contact", siteController.contact);

router.get("/menu", siteController.menu);
router.get("/signin", siteController.signin);
router.get("/signup", siteController.signup);
router.get("/signout", siteController.signout);
router.get("/forgetpassword", siteController.forgetPassword);
router.get("/about", siteController.about);
router.get("/shop", siteController.shop);
router.get("/user_detail",test, siteController.userDetail);

router.get("/home", siteController.index);
router.get("/401", siteController.unauth);

router.get("/", siteController.index);

module.exports = router;
