const { hashPassword, comparePassword } = require('../../../src/utils/password');

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('应该成功加密密码', async () => {
      const password = 'password123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(password);
    });

    it('相同密码多次加密结果应该不同（加盐）', async () => {
      const password = 'password123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('应该验证正确的密码', async () => {
      const password = 'password123';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(password, hashedPassword);
      
      expect(result).toBe(true);
    });

    it('应该拒绝错误的密码', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hashedPassword);
      
      expect(result).toBe(false);
    });

    it('应该处理特殊字符密码', async () => {
      const password = '密码@#$%^&*()';
      const hashedPassword = await hashPassword(password);
      const result = await comparePassword(password, hashedPassword);
      
      expect(result).toBe(true);
    });
  });
});
