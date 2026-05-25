const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');

router.get('/', asyncHandler(productController.getList));

router.get('/:id', asyncHandler(productController.getDetail));

router.post('/', requireAuth(), asyncHandler(productController.create));

router.put('/:id', requireAuth(), asyncHandler(productController.update));

router.delete('/:id', requireAuth(), asyncHandler(productController.delete));

router.post('/:id/collect', requireAuth(), asyncHandler(productController.collect));

module.exports = router;