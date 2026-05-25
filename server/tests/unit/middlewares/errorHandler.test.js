const { AppError, errorHandler, asyncHandler } = require('../../../src/middlewares/errorHandler');

describe('ErrorHandler Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      originalUrl: '/test',
      method: 'GET',
      ip: '127.0.0.1'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('AppError', () => {
    it('应该创建自定义错误', () => {
      const error = new AppError('Test error', 400, 3000);
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(3000);
      expect(error.isOperational).toBe(true);
    });
  });

  describe('errorHandler', () => {
    it('应该处理自定义 AppError', () => {
      const error = new AppError('Not found', 404, 3003);
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3003,
        message: 'Not found',
        errors: null
      });
    });

    it('应该处理 SequelizeValidationError', () => {
      const error = {
        name: 'SequelizeValidationError',
        errors: [
          { path: 'email', message: '邮箱格式不正确' }
        ]
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3004,
        message: '验证失败',
        errors: [{ field: 'email', message: '邮箱格式不正确' }]
      });
    });

    it('应该处理 SequelizeUniqueConstraintError', () => {
      const error = {
        name: 'SequelizeUniqueConstraintError',
        errors: [
          { path: 'openid', message: 'openid 已存在' }
        ]
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(409);
    });

    it('应该处理 JsonWebTokenError', () => {
      const error = new Error('invalid token');
      error.name = 'JsonWebTokenError';
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 3001, message: 'Token无效' })
      );
    });

    it('应该处理 TokenExpiredError', () => {
      const error = new Error('token expired');
      error.name = 'TokenExpiredError';
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Token已过期' })
      );
    });

    it('应该处理未知错误为 500', () => {
      const error = new Error('Unknown error');
      
      errorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 4000 })
      );
    });
  });

  describe('asyncHandler', () => {
    it('应该正常执行异步函数', async () => {
      const fn = jest.fn().mockResolvedValue('result');
      const wrappedFn = asyncHandler(fn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      
      expect(fn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    });

    it('应该捕获异步错误', async () => {
      const error = new Error('async error');
      const fn = jest.fn().mockRejectedValue(error);
      const wrappedFn = asyncHandler(fn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
