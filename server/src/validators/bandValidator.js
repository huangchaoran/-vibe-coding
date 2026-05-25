const { body } = require('express-validator');

const createBandValidator = [
  body('name')
    .notEmpty()
    .withMessage('乐队名称不能为空')
    .isString()
    .withMessage('乐队名称必须是字符串')
    .isLength({ max: 100 })
    .withMessage('乐队名称最多100个字符'),
  body('style')
    .optional()
    .isString()
    .withMessage('音乐风格必须是字符串'),
  body('intro')
    .optional()
    .isString()
    .withMessage('乐队介绍必须是字符串')
    .isLength({ max: 2000 })
    .withMessage('乐队介绍最多2000个字符'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('头像必须是有效的URL'),
  body('cover')
    .optional()
    .isURL()
    .withMessage('封面必须是有效的URL'),
];

const updateBandValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('乐队名称必须是字符串')
    .isLength({ max: 100 })
    .withMessage('乐队名称最多100个字符'),
  body('style')
    .optional()
    .isString()
    .withMessage('音乐风格必须是字符串'),
  body('intro')
    .optional()
    .isString()
    .withMessage('乐队介绍必须是字符串')
    .isLength({ max: 2000 })
    .withMessage('乐队介绍最多2000个字符'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('头像必须是有效的URL'),
  body('cover')
    .optional()
    .isURL()
    .withMessage('封面必须是有效的URL'),
];

module.exports = {
  createBandValidator,
  updateBandValidator,
};
