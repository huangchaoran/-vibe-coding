const { body, param, query } = require('express-validator');

const activityValidator = {
  create: [
    body('title')
      .notEmpty()
      .withMessage('活动标题不能为空')
      .isLength({ max: 200 })
      .withMessage('活动标题不能超过200个字符'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('活动描述不能超过2000个字符'),
    body('type')
      .optional()
      .isIn(['recruitment', 'performance', 'competition', 'other'])
      .withMessage('活动类型无效'),
    body('status')
      .optional()
      .isIn(['recruiting', 'in_progress', 'ended'])
      .withMessage('活动状态无效'),
    body('start_time')
      .optional()
      .isISO8601()
      .withMessage('开始时间格式无效'),
    body('end_time')
      .optional()
      .isISO8601()
      .withMessage('结束时间格式无效'),
    body('location')
      .optional()
      .isLength({ max: 200 })
      .withMessage('活动地点不能超过200个字符'),
    body('max_participants')
      .optional()
      .isInt({ min: 1 })
      .withMessage('最大参与人数必须大于0'),
    body('band_id')
      .optional()
      .isInt()
      .withMessage('乐队ID必须是整数'),
  ],

  update: [
    body('title')
      .optional()
      .isLength({ max: 200 })
      .withMessage('活动标题不能超过200个字符'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('活动描述不能超过2000个字符'),
    body('type')
      .optional()
      .isIn(['recruitment', 'performance', 'competition', 'other'])
      .withMessage('活动类型无效'),
    body('status')
      .optional()
      .isIn(['recruiting', 'in_progress', 'ended'])
      .withMessage('活动状态无效'),
    body('start_time')
      .optional()
      .isISO8601()
      .withMessage('开始时间格式无效'),
    body('end_time')
      .optional()
      .isISO8601()
      .withMessage('结束时间格式无效'),
    body('location')
      .optional()
      .isLength({ max: 200 })
      .withMessage('活动地点不能超过200个字符'),
    body('max_participants')
      .optional()
      .isInt({ min: 1 })
      .withMessage('最大参与人数必须大于0'),
  ],

  signup: [
    body('participant_count')
      .optional()
      .isInt({ min: 1 })
      .withMessage('参与人数必须大于0'),
    body('remark')
      .optional()
      .isLength({ max: 500 })
      .withMessage('备注不能超过500个字符'),
  ],

  getList: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('页码必须大于0'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('每页数量必须在1-100之间'),
    query('type')
      .optional()
      .isIn(['recruitment', 'performance', 'competition', 'other'])
      .withMessage('活动类型无效'),
    query('status')
      .optional()
      .isIn(['recruiting', 'in_progress', 'ended'])
      .withMessage('活动状态无效'),
    query('band_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('乐队ID必须是正整数'),
  ],

  getSignups: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('页码必须大于0'),
    query('pageSize')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('每页数量必须在1-100之间'),
    query('status')
      .optional()
      .isIn(['pending', 'approved', 'checked_in', 'cancelled'])
      .withMessage('报名状态无效'),
  ],

  paramId: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('活动ID必须是正整数'),
  ],
};

module.exports = activityValidator;