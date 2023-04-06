const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');
const googleDrive = require('../app/models/GoolgeDrive');
const multer = require('multer');
// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get('/create', productController.create)
router.get('/:id/edit', productController.edit)
router.get('/:slug', productController.show)
router.post('/handle-form-actions', productController.handleFormActions)
router.post('/store', upload.single('picture'), googleDrive.toGoogle, productController.store)
router.put('/:id', upload.single('picture'), googleDrive.toGoogle, productController.update, googleDrive.deleteFile, (req, res) =>
    res.redirect('/me/stored/products'));
router.patch('/:id/restore', productController.restore)
router.delete('/:id', productController.delete)
router.delete('/:id/destroy', productController.destroy, googleDrive.deleteFile, (req, res) =>
    res.redirect('/me/trash/products'));

module.exports = router;