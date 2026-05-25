const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/upload');
const ApiResponse = require('../utils/response');

const storage = (type) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(config.uploadPath, type));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${type}_${req.user?.userId || 'anonymous'}_${Date.now()}_${uuidv4().split('-')[0]}${ext}`;
      cb(null, filename);
    },
  });
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`不支持的文件类型: ${ext}`), false);
    }
  };
};

const uploadImage = multer({
  storage: storage('images'),
  fileFilter: fileFilter(config.allowedImageTypes),
  limits: { fileSize: config.maxFileSize },
});

const uploadAudio = multer({
  storage: storage('audio'),
  fileFilter: fileFilter(config.allowedAudioTypes),
  limits: { fileSize: config.maxFileSize * 10 },
});

const uploadVideo = multer({
  storage: storage('video'),
  fileFilter: fileFilter(config.allowedVideoTypes),
  limits: { fileSize: config.maxFileSize * 50 },
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.badRequest(res, '文件大小超出限制');
    }
    return ApiResponse.badRequest(res, err.message);
  }
  if (err) {
    return ApiResponse.badRequest(res, err.message);
  }
  next();
};

module.exports = {
  uploadImage,
  uploadAudio,
  uploadVideo,
  handleUploadError,
};
