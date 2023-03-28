const express = require('express');
const SiteController = require('../app/controllers/SiteController');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
 
router.get('/search', siteController.search)
router.get('/contact', siteController.contact)

router.get('/menu', siteController.menu)
router.get('/signin', siteController.signin)
router.get('/signup', siteController.signup)
router.get('/signout', siteController.signout)
router.get('/about', siteController.about)
router.get('/shop', siteController.shop)

router.get('/home', siteController.index)

router.get('/', siteController.index)

module.exports = router;