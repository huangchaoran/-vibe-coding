const { body } = require('express-validator');
const { userIdentity } = require('../constants');

const updateProfileValidator = [
  body('nickname')
    .optional()
    .isString()
    .withMessage('昵称必须是字符串')
    .isLength({ max: 50 })
    .withMessage('昵称最多50个字符'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('头像必须是有效的URL'),
  body('phone')
    .optional()
    .isMobilePhone('zh-CN')
    .withMessage('手机号格式不正确'),
  body('instrument')
    .optional()
    .isString()
    .withMessage('乐器必须是字符串'),
  body('music_style')
    .optional()
    .isString()
    .withMessage('音乐风格必须是字符串'),
  body('location')
    .optional()
    .isString()
    .withMessage('位置必须是字符串'),
  body('bio')
    .optional()
    .isString()
    .withMessage('简介必须是字符串')
    .isLength({ max: 500 })
    .withMessage('简介最多500个字符'),
  body('video_url')
    .optional()
    .isURL()
    .withMessage('视频链接必须是有效的URL'),
];

const bindIdentityValidator = [
  body('identity')
    .notEmpty()
    .withMessage('身份不能为空')
    .isIn(Object.values(userIdentity))
    .withMessage('身份类型不正确'),
];

module.exports = {
  updateProfileValidator,
  bindIdentityValidator,
};
