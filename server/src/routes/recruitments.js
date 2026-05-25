const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitmentController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');

router.get('/', asyncHandler(recruitmentController.getList));

router.get('/:id', asyncHandler(recruitmentController.getDetail));

router.post('/', requireAuth(), asyncHandler(recruitmentController.create));

router.put('/:id', requireAuth(), asyncHandler(recruitmentController.update));

router.delete('/:id', requireAuth(), asyncHandler(recruitmentController.delete));

router.post('/:id/apply', requireAuth(), asyncHandler(recruitmentController.apply));

module.exports = router;