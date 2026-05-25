const { body } = require('express-validator');

const loginValidator = [
  body('code')
    .if(() => process.env.NODE_ENV !== 'development')
    .notEmpty()
    .withMessage('微信授权code不能为空')
    .isString()
    .withMessage('code必须是字符串'),
  body('identity')
    .optional()
    .isString()
    .withMessage('identity必须是字符串'),
];

const registerValidator = [
  body('openid')
    .notEmpty()
    .withMessage('openid不能为空')
    .isString()
    .withMessage('openid必须是字符串'),
  body('nickname')
    .optional()
    .isString()
    .withMessage('昵称必须是字符串')
    .isLength({ max: 50 })
    .withMessage('昵称最多50个字符'),
];

module.exports = {
  loginValidator,
  registerValidator,
};
