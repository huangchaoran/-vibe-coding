const BandService = require('../services/bandService');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../middlewares/errorHandler').asyncHandler;
const { verifyToken } = require('../utils/jwt');

const BandController = {
  getList: asyncHandler(async (req, res) => {
    let userId = null;
    
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        const decoded = verifyToken(token);
        userId = decoded.userId;
      }
    } catch (error) {
      // Token无效或过期，忽略
    }
    
    const result = await BandService.getBands(req.query, userId);
    ApiResponse.paginated(res, result.list, result.pagination);
  }),

  getDetail: asyncHandler(async (req, res) => {
    const { id } = req.params;
    let userId = null;
    
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        const decoded = verifyToken(token);
        userId = decoded.userId;
      }
    } catch (error) {
      // Token无效或过期，忽略，继续处理
    }
    
    const band = await BandService.getBandById(id, userId);

    if (!band) {
      return ApiResponse.notFound(res, '乐队不存在');
    }

    ApiResponse.success(res, band);
  }),

  create: asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { name, style, intro, avatar, cover } = req.body;

    const band = await BandService.createBand({
      name,
      style,
      intro,
      avatar,
      cover,
      owner_id: userId,
      status: 1,
    });

    ApiResponse.created(res, band, '乐队创建成功');
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const band = await BandService.updateBand(id, req.body);
    ApiResponse.updated(res, band, '乐队更新成功');
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await BandService.deleteBand(id);
    ApiResponse.deleted(res, '乐队删除成功');
  }),

  follow: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const result = await BandService.followBand(id, userId);
    ApiResponse.success(res, result, result.followed ? '关注成功' : '取消关注成功');
  }),

  unfollow: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const result = await BandService.unfollowBand(id, userId);
    ApiResponse.success(res, result, '取消关注成功');
  }),

  getFollowed: asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const result = await BandService.getFollowedBands(userId, req.query);
    ApiResponse.paginated(res, result.list, result.pagination);
  }),

  getMembers: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const members = await BandService.getBandMembers(id);
    ApiResponse.success(res, members);
  }),

  addMember: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user_id, role, instrument } = req.body;
    const result = await BandService.addBandMember(id, user_id, role, instrument);
    ApiResponse.success(res, result, '成员添加成功');
  }),

  removeMember: asyncHandler(async (req, res) => {
    const { id, memberId } = req.params;
    await BandService.removeBandMember(id, memberId);
    ApiResponse.success(res, null, '成员移除成功');
  }),

  getBandActivities: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await BandService.getBandActivities(id, req.query);
    ApiResponse.paginated(res, result.list, result.pagination);
  }),

  createFollowsTable: asyncHandler(async (req, res) => {
    const { sequelize } = require('../database/connection');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id INT PRIMARY KEY AUTO_INCREMENT,
        follower_id INT NOT NULL,
        following_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_follower (follower_id),
        INDEX idx_following (following_id),
        UNIQUE KEY uk_follow (follower_id, following_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    ApiResponse.success(res, null, 'follows表创建成功');
  }),
};

module.exports = BandController;