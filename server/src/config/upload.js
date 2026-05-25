const path = require('path');

module.exports = {
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  allowedImageTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  allowedAudioTypes: ['.mp3', '.wav', '.ogg', '.m4a'],
  allowedVideoTypes: ['.mp4', '.avi', '.mov', '.webm'],
  imageCompress: {
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
  },
  directory: {
    avatar: 'avatar',
    band: 'band',
    activity: 'activity',
    room: 'room',
    product: 'product',
    post: 'post',
    audio: 'audio',
    video: 'video',
    qcode: 'qcode',
  },
};
