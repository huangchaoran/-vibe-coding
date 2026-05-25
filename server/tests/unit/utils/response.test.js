const ApiResponse = require('../../../src/utils/response');

describe('Response Utils', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('success', () => {
    it('应该返回正确的成功响应格式', () => {
      const data = { id: 1, name: 'test' };
      ApiResponse.success(mockRes, data);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 1000,
        message: '操作成功',
        data: data
      });
    });

    it('应该使用默认消息当 message 为 null', () => {
      ApiResponse.success(mockRes, null);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 1000,
        message: '操作成功',
        data: null
      });
    });

    it('应该使用自定义消息', () => {
      ApiResponse.success(mockRes, { id: 1 }, '查询成功');
      
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 1000,
        message: '查询成功',
        data: { id: 1 }
      });
    });
  });

  describe('created', () => {
    it('应该返回 201 状态码', () => {
      const data = { id: 1 };
      ApiResponse.created(mockRes, data);
      
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 1001,
        message: '创建成功',
        data: data
      });
    });
  });

  describe('updated', () => {
    it('应该返回更新成功响应', () => {
      const data = { name: 'updated' };
      ApiResponse.updated(mockRes, data);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 1002,
        message: '更新成功',
        data: data
      });
    });
  });

  describe('deleted', () => {
    it('应该返回 204 状态码', () => {
      ApiResponse.deleted(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });

  describe('paginated', () => {
    it('应该返回分页响应（严格遵循API规范）', () => {
      const list = [{ id: 1 }, { id: 2 }];
      const pagination = {
        page: 1,
        pageSize: 20,
        total: 100,
        totalPages: 5
      };
      
      ApiResponse.paginated(mockRes, list, pagination);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 1000,
        message: '操作成功',
        data: {
          list: list,
          pagination: pagination
        }
      });
    });

    it('pagination 不应该包含 hasNext 和 hasPrev', () => {
      const list = [];
      const pagination = {
        page: 1,
        pageSize: 20,
        total: 100,
        totalPages: 5
      };
      
      ApiResponse.paginated(mockRes, list, pagination);
      
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.data.pagination).not.toHaveProperty('hasNext');
      expect(responseData.data.pagination).not.toHaveProperty('hasPrev');
    });
  });

  describe('error responses', () => {
    it('badRequest 应该返回 400', () => {
      ApiResponse.badRequest(mockRes, '请求参数错误');
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3000,
        message: '请求参数错误',
        errors: null
      });
    });

    it('unauthorized 应该返回 401', () => {
      ApiResponse.unauthorized(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3001,
        message: '未授权访问',
        errors: null
      });
    });

    it('forbidden 应该返回 403', () => {
      ApiResponse.forbidden(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3002,
        message: '禁止访问',
        errors: null
      });
    });

    it('notFound 应该返回 404', () => {
      ApiResponse.notFound(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3003,
        message: '资源不存在',
        errors: null
      });
    });

    it('validationError 应该返回 422', () => {
      const errors = [{ field: 'email', message: '邮箱格式不正确' }];
      ApiResponse.validationError(mockRes, '验证失败', errors);
      
      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3004,
        message: '验证失败',
        errors: errors
      });
    });

    it('conflict 应该返回 409', () => {
      ApiResponse.conflict(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3005,
        message: '资源冲突',
        errors: null
      });
    });

    it('tooManyRequests 应该返回 429', () => {
      ApiResponse.tooManyRequests(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 3006,
        message: '请求过于频繁',
        errors: null
      });
    });

    it('internalError 应该返回 500', () => {
      ApiResponse.internalError(mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        code: 4000,
        message: '服务器内部错误',
        errors: null
      });
    });
  });
});
