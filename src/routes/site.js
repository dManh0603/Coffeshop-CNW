const express = require('express');
const SiteController = require('../app/controllers/SiteController');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
 
router.get('/search', siteController.search)
router.get('/contact', siteController.contact)
router.get('/', siteController.index)

// router.get('/menu', siteController.menu)

module.exports = router;