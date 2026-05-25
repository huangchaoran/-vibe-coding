const { body, param } = require('express-validator');

const createPostValidator = [
  body('title')
    .optional()
    .isString()
    .withMessage('标题必须是字符串')
    .isLength({ max: 200 })
    .withMessage('标题最长200字符'),
  body('content')
    .isString()
    .withMessage('内容必须是字符串')
    .isLength({ min: 1, max: 10000 })
    .withMessage('内容长度必须在1-10000字符之间'),
  body('images')
    .optional()
    .isArray()
    .withMessage('图片必须是数组'),
  body('audio_url')
    .optional()
    .isURL()
    .withMessage('音频链接格式不正确'),
  body('video_url')
    .optional()
    .isURL()
    .withMessage('视频链接格式不正确'),
];

const updatePostValidator = [
  param('id').isInt().withMessage('ID必须是整数'),
  body('title')
    .optional()
    .isString()
    .withMessage('标题必须是字符串')
    .isLength({ max: 200 })
    .withMessage('标题最长200字符'),
  body('content')
    .optional()
    .isString()
    .withMessage('内容必须是字符串')
    .isLength({ min: 1, max: 10000 })
    .withMessage('内容长度必须在1-10000字符之间'),
];

const commentValidator = [
  param('id').isInt().withMessage('ID必须是整数'),
  body('content')
    .isString()
    .withMessage('评论内容必须是字符串')
    .isLength({ min: 1, max: 2000 })
    .withMessage('评论长度必须在1-2000字符之间'),
];

module.exports = {
  createPostValidator,
  updatePostValidator,
  commentValidator,
};