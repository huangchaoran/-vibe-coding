const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');

router.get('/', asyncHandler(roomController.getList));

router.get('/:id', asyncHandler(roomController.getDetail));

router.post('/', requireAuth(), asyncHandler(roomController.create));

router.put('/:id', requireAuth(), asyncHandler(roomController.update));

router.delete('/:id', requireAuth(), asyncHandler(roomController.delete));

router.post('/:id/join', requireAuth(), asyncHandler(roomController.join));

router.post('/:id/leave', requireAuth(), asyncHandler(roomController.leave));

module.exports = router;