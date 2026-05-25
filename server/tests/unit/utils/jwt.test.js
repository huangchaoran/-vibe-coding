const jwt = require('jsonwebtoken');
const { generateToken, verifyToken, generateRefreshToken } = require('../../../src/utils/jwt');

describe('JWT Utils', () => {
  describe('generateToken', () => {
    it('应该生成有效的 JWT Token', () => {
      const payload = { userId: 1, openid: 'test', identity: 'fan' };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('Token 应该包含正确的 payload', () => {
      const payload = { userId: 1, identity: 'musician' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe(1);
      expect(decoded.identity).toBe('musician');
    });

    it('Token 应该在 24 小时 后过期', () => {
      const payload = { userId: 1 };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      const now = Math.floor(Date.now() / 1000);
      const exp = decoded.exp;
      expect(exp - now).toBeGreaterThanOrEqual(86399);
    });
  });

  describe('verifyToken', () => {
    it('应该验证并返回有效 Token', () => {
      const token = generateToken({ userId: 1 });
      const decoded = verifyToken(token);
      
      expect(decoded.userId).toBe(1);
    });

    it('应该拒绝无效 Token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('应该拒绝格式错误的 Token', () => {
      expect(() => verifyToken('not.a.valid.token')).toThrow();
    });
  });

  describe('generateRefreshToken', () => {
    it('应该生成有效的 Refresh Token', () => {
      const payload = { userId: 1 };
      const refreshToken = generateRefreshToken(payload);
      
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.split('.')).toHaveLength(3);
    });

    it('Refresh Token 应该包含正确的 payload', () => {
      const payload = { userId: 1 };
      const refreshToken = generateRefreshToken(payload);
      const decoded = verifyToken(refreshToken);
      
      expect(decoded.userId).toBe(1);
    });
  });
});
