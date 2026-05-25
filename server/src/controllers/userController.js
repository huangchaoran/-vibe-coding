const userService = require('../services/userService');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../middlewares/errorHandler').asyncHandler;

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await userService.getUserProfile(userId);
  ApiResponse.success(res, user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updateData = req.body;
  const user = await userService.updateUserProfile(userId, updateData);
  ApiResponse.updated(res, user);
});

const bindIdentity = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { identity } = req.body;
  const user = await userService.changeUserIdentity(userId, identity);
  ApiResponse.updated(res, user, '身份绑定成功');
});

const getIdentities = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const identities = await userService.getUserIdentities(userId);
  ApiResponse.success(res, identities);
});

const addIdentity = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { identity } = req.body;
  const identities = await userService.addUserIdentity(userId, identity);
  ApiResponse.updated(res, identities, '身份添加成功');
});

const removeIdentity = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { identity } = req.body;
  const identities = await userService.removeUserIdentity(userId, identity);
  ApiResponse.updated(res, identities, '身份移除成功');
});

const getStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const stats = await userService.getUserStats(userId);
  ApiResponse.success(res, stats);
});

const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await userService.getMyFavorites(userId, req.query);
  ApiResponse.paginated(res, result.list, result.pagination);
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  // 兼容前端 snake_case 和 camelCase 两种格式
  const targetType = req.body.target_type || req.body.targetType;
  const targetId = req.body.target_id || req.body.targetId;
  const result = await userService.toggleFavorite(userId, targetType, targetId);
  ApiResponse.success(res, result, result.favorited ? '收藏成功' : '取消收藏成功');
});

const getActivities = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await userService.getMyActivities(userId, req.query);
  ApiResponse.paginated(res, result.list, result.pagination);
});

const getBookings = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await userService.getMyBookings(userId, req.query);
  ApiResponse.paginated(res, result.list, result.pagination);
});

const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const booking = await userService.createBooking(userId, req.body);
  ApiResponse.created(res, booking, '预约创建成功');
});

const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await userService.getMyOrders(userId, req.query);
  ApiResponse.paginated(res, result.list, result.pagination);
});

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const order = await userService.createOrder(userId, req.body);
  ApiResponse.created(res, order, '订单创建成功');
});

const getFollows = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await userService.getMyFollows(userId, req.query);
  ApiResponse.paginated(res, result.list, result.pagination);
});

module.exports = {
  getProfile,
  updateProfile,
  bindIdentity,
  getIdentities,
  addIdentity,
  removeIdentity,
  getStats,
  getFavorites,
  toggleFavorite,
  getActivities,
  getBookings,
  createBooking,
  getOrders,
  createOrder,
  getFollows,
};
