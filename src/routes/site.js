const express = require("express");
const router = express.Router();

const siteController = require("../app/controllers/SiteController");

router.get("/search", siteController.search);
router.get("/about", siteController.about);
router.get("/contact", siteController.contact);
router.get("/menu", siteController.menu);
router.get("/", siteController.index);

module.exports = router;
