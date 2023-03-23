const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

router.get('/create', productController.create)
router.post('/handle-form-actions', productController.handleFormActions)
router.post('/store', productController.store)
router.get('/:id/edit', productController.edit)
router.put('/:id', productController.update)
router.patch('/:id/restore', productController.restore)
router.delete('/:id', productController.delete)
router.delete('/:id/destroy', productController.destroy)
router.get('/:slug', productController.show)


module.exports = router;