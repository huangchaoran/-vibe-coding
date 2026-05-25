const { requireAuth, requireIdentity, requireRole, requireAdmin, requireOwnerOrAdmin } = require('../../../src/middlewares/auth');
const { generateToken } = require('../../../src/utils/jwt');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('requireAuth', () => {
    it('应该拒绝没有 Token 的请求', () => {
      requireAuth()(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: 3001 })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('应该拒绝无效 Token', () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      
      requireAuth()(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('应该接受有效 Token 并填充 req.user', () => {
      const token = generateToken({ userId: 1, identity: 'fan', role: 'user' });
      mockReq.headers.authorization = `Bearer ${token}`;
      
      requireAuth()(mockReq, mockRes, mockNext);
      
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe(1);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requireIdentity', () => {
    it('应该允许匹配的身份', () => {
      mockReq.user = { identity: 'musician' };
      const middleware = requireIdentity('musician', 'band');
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝不匹配的身份', () => {
      mockReq.user = { identity: 'fan' };
      const middleware = requireIdentity('musician', 'band');
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('应该拒绝未登录用户', () => {
      const middleware = requireIdentity('musician');
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('requireRole', () => {
    it('应该允许匹配的角色', () => {
      mockReq.user = { role: 'admin' };
      const middleware = requireRole('admin', 'super_admin');
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝不匹配的角色', () => {
      mockReq.user = { role: 'user' };
      const middleware = requireRole('admin', 'super_admin');
      
      middleware(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('应该允许超级管理员', () => {
      mockReq.user = { role: 'super_admin' };
      
      requireAdmin()(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该允许管理员', () => {
      mockReq.user = { role: 'admin' };
      
      requireAdmin()(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });

    it('应该拒绝普通用户', () => {
      mockReq.user = { role: 'user' };
      
      requireAdmin()(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
