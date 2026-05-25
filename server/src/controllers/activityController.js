const ActivityService = require('../services/activityService');
const ApiResponse = require('../utils/response');
const asyncHandler = require('../middlewares/errorHandler').asyncHandler;

const ActivityController = {
  getList: asyncHandler(async (req, res) => {
    const result = await ActivityService.getActivities(req.query);
    ApiResponse.success(res, result);
  }),

  getDetail: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await ActivityService.getActivityById(id);

    if (!activity) {
      return ApiResponse.notFound(res, '活动不存在');
    }

    ApiResponse.success(res, activity);
  }),

  create: asyncHandler(async (req, res) => {
    const data = {
      ...req.body,
      organizer_id: req.user.userId,
    };

    const activity = await ActivityService.createActivity(data);
    ApiResponse.created(res, activity);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await ActivityService.getActivityById(id);

    if (!activity) {
      return ApiResponse.notFound(res, '活动不存在');
    }

    if (activity.organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, '无权修改此活动');
    }

    const updatedActivity = await ActivityService.updateActivity(id, req.body);
    ApiResponse.success(res, updatedActivity);
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await ActivityService.getActivityById(id);

    if (!activity) {
      return ApiResponse.notFound(res, '活动不存在');
    }

    if (activity.organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, '无权删除此活动');
    }

    await ActivityService.deleteActivity(id);
    ApiResponse.deleted(res);
  }),

  signup: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const signup = await ActivityService.signupActivity(id, req.user.userId, req.body);
    ApiResponse.created(res, signup);
  }),

  cancelSignup: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const signup = await ActivityService.cancelSignup(id, req.user.userId);
    ApiResponse.success(res, signup);
  }),

  checkin: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const signup = await ActivityService.checkinActivity(id, req.user.userId);
    ApiResponse.success(res, signup);
  }),

  getSignups: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const activity = await ActivityService.getActivityById(id);

    if (!activity) {
      return ApiResponse.notFound(res, '活动不存在');
    }

    if (activity.organizer_id !== req.user.userId && req.user.role !== 'admin') {
      return ApiResponse.forbidden(res, '无权查看报名列表');
    }

    const result = await ActivityService.getActivitySignups(id, req.query);
    ApiResponse.success(res, result);
  }),

  getUserActivities: asyncHandler(async (req, res) => {
    const result = await ActivityService.getUserActivities(req.user.userId, req.query);
    ApiResponse.success(res, result);
  }),
};

module.exports = ActivityController;