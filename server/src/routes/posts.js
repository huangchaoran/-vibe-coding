const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { createPostValidator, updatePostValidator, commentValidator } = require('../validators/postValidator');

router.get('/', asyncHandler(postController.getList));

router.get('/:id', asyncHandler(postController.getDetail));

router.post('/', requireAuth(), createPostValidator, validate, asyncHandler(postController.create));

router.put('/:id', requireAuth(), updatePostValidator, validate, asyncHandler(postController.update));

router.delete('/:id', requireAuth(), asyncHandler(postController.delete));

router.post('/:id/like', requireAuth(), asyncHandler(postController.like));

router.post('/:id/comment', requireAuth(), commentValidator, validate, asyncHandler(postController.comment));

module.exports = router;