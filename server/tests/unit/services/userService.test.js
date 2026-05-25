jest.mock('../../../src/models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

const { User } = require('../../../src/models');
const userService = require('../../../src/services/userService');
const usersFixtures = require('../../fixtures/users');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('应该返回用户资料当用户存在', async () => {
      const mockUser = usersFixtures.validUser;
      User.findByPk.mockResolvedValue(mockUser);

      const result = await userService.getUserProfile(1);

      expect(User.findByPk).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('nickname', 'Test User');
    });

    it('应该抛出错误当用户不存在', async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(userService.getUserProfile(999)).rejects.toThrow('用户不存在');
    });
  });

  describe('updateUserProfile', () => {
    it('应该更新用户资料', async () => {
      const mockUser = {
        ...usersFixtures.validUser,
        update: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);
      
      const updateData = { nickname: 'New Nickname' };
      await userService.updateUserProfile(1, updateData);
      
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
    });

    it('应该抛出错误当用户不存在', async () => {
      User.findByPk.mockResolvedValue(null);
      
      await expect(
        userService.updateUserProfile(999, { nickname: 'Test' })
      ).rejects.toThrow('用户不存在');
    });
  });

  describe('changeUserIdentity', () => {
    it('应该变更用户身份', async () => {
      const mockUser = {
        ...usersFixtures.validUser,
        update: jest.fn().mockResolvedValue(true)
      };
      User.findByPk.mockResolvedValue(mockUser);
      
      await userService.changeUserIdentity(1, 'musician');
      
      expect(mockUser.update).toHaveBeenCalledWith({ identity: 'musician' });
    });

    it('应该抛出错误当用户不存在', async () => {
      User.findByPk.mockResolvedValue(null);
      
      await expect(
        userService.changeUserIdentity(999, 'musician')
      ).rejects.toThrow('用户不存在');
    });
  });
});
