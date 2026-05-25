const path = require('path');
const ApiResponse = require('../utils/response');

const uploadImage = async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, '请选择要上传的图片');
  }

  const file = req.file;
  const url = `/uploads/images/${file.filename}`;

  ApiResponse.created(
    res,
    {
      filename: file.filename,
      url,
      size: file.size,
      mimetype: file.mimetype,
    },
    '图片上传成功'
  );
};

const uploadAudio = async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, '请选择要上传的音频');
  }

  const file = req.file;
  const url = `/uploads/audio/${file.filename}`;

  ApiResponse.created(
    res,
    {
      filename: file.filename,
      url,
      size: file.size,
      mimetype: file.mimetype,
    },
    '音频上传成功'
  );
};

const uploadVideo = async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, '请选择要上传的视频');
  }

  const file = req.file;
  const url = `/uploads/video/${file.filename}`;

  ApiResponse.created(
    res,
    {
      filename: file.filename,
      url,
      size: file.size,
      mimetype: file.mimetype,
    },
    '视频上传成功'
  );
};

module.exports = {
  uploadImage,
  uploadAudio,
  uploadVideo,
};
