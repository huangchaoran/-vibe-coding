const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/upload');

const generateFilename = (type, userId, ext) => {
  const timestamp = Date.now();
  const random = uuidv4().split('-')[0];
  return `${type}_${userId}_${timestamp}_${random}${ext}`;
};

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const isAllowedImageType = (filename) => {
  const ext = getFileExtension(filename);
  return config.allowedImageTypes.includes(ext);
};

const isAllowedAudioType = (filename) => {
  const ext = getFileExtension(filename);
  return config.allowedAudioTypes.includes(ext);
};

const isAllowedVideoType = (filename) => {
  const ext = getFileExtension(filename);
  return config.allowedVideoTypes.includes(ext);
};

const getUploadDirectory = (type) => {
  return path.join(config.uploadPath, type);
};

module.exports = {
  generateFilename,
  getFileExtension,
  isAllowedImageType,
  isAllowedAudioType,
  isAllowedVideoType,
  getUploadDirectory,
};
