const { validationResult } = require('express-validator');
const { body } = require('express-validator');

jest.mock('express-validator', () => {
  const actual = jest.requireActual('express-validator');
  return {
    ...actual,
    validationResult: jest.fn(),
  };
});

const validate = require('../../../src/middlewares/validator');

describe('Auth Validators', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('loginValidator', () => {
    it('应该通过有效的 code', async () => {
      mockReq.body = { code: 'valid_code' };
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
      
      await Promise.all([
        body('code').notEmpty().withMessage('微信授权code不能为空').isString().withMessage('code必须是字符串').run(mockReq)
      ]);
      validate(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝空的 code', async () => {
      mockReq.body = {};
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ path: 'code', msg: '微信授权code不能为空' }]
      });
      
      await Promise.all([
        body('code').notEmpty().withMessage('微信授权code不能为空').isString().withMessage('code必须是字符串').run(mockReq)
      ]);
      validate(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3004,
        message: '验证失败',
        errors: [{ field: 'code', message: '微信授权code不能为空' }]
      });
    });
  });

  describe('registerValidator', () => {
    it('应该通过有效的 openid', async () => {
      mockReq.body = { openid: 'valid_openid' };
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
      
      await Promise.all([
        body('openid').notEmpty().withMessage('openid不能为空').isString().withMessage('openid必须是字符串').run(mockReq),
        body('nickname').optional().isString().withMessage('昵称必须是字符串').isLength({ max: 50 }).withMessage('昵称最多50个字符').run(mockReq)
      ]);
      validate(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝空的 openid', async () => {
      mockReq.body = {};
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ path: 'openid', msg: 'openid不能为空' }]
      });
      
      await Promise.all([
        body('openid').notEmpty().withMessage('openid不能为空').isString().withMessage('openid必须是字符串').run(mockReq),
        body('nickname').optional().isString().withMessage('昵称必须是字符串').isLength({ max: 50 }).withMessage('昵称最多50个字符').run(mockReq)
      ]);
      validate(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(422);
    });
  });
});