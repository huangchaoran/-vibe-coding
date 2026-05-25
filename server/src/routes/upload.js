const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const { uploadImage, uploadAudio, uploadVideo, handleUploadError } = require('../middlewares/upload');
const { uploadLimiter } = require('../middlewares/rateLimit');

router.post(
  '/image',
  requireAuth(),
  uploadLimiter,
  uploadImage.single('file'),
  handleUploadError,
  asyncHandler(uploadController.uploadImage)
);

router.post(
  '/audio',
  requireAuth(),
  uploadLimiter,
  uploadAudio.single('file'),
  handleUploadError,
  asyncHandler(uploadController.uploadAudio)
);

router.post(
  '/video',
  requireAuth(),
  uploadLimiter,
  uploadVideo.single('file'),
  handleUploadError,
  asyncHandler(uploadController.uploadVideo)
);

module.exports = router;
