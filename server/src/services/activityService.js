const { Op } = require('sequelize');
const { Activity, ActivitySignup, User, Band } = require('../models');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

class ActivityService {
  static async getActivities(query = {}) {
    const { page = 1, pageSize = 10, type, status, keyword, band_id } = query;
    const { limit, offset } = getPagination(page, pageSize);

    const where = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` };
    }

    if (band_id) {
      where.band_id = band_id;
    }

    const result = await Activity.findAndCountAll({
      where,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'nickname', 'avatar'] },
        { model: Band, as: 'band', attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    const meta = getPaginationMeta(page, pageSize, result.count);

    return {
      list: result.rows,
      pagination: meta,
    };
  }

  static async getActivityById(id) {
    return Activity.findByPk(id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'nickname', 'avatar'] },
        { model: Band, as: 'band', attributes: ['id', 'name', 'avatar'] },
      ],
    });
  }

  static async createActivity(data) {
    return Activity.create(data);
  }

  static async updateActivity(id, data) {
    const activity = await Activity.findByPk(id);
    if (!activity) {
      throw new Error('活动不存在');
    }
    return activity.update(data);
  }

  static async deleteActivity(id) {
    const activity = await Activity.findByPk(id);
    if (!activity) {
      throw new Error('活动不存在');
    }
    return activity.destroy();
  }

  static async signupActivity(activityId, userId, data = {}) {
    const activity = await Activity.findByPk(activityId);
    if (!activity) {
      throw new Error('活动不存在');
    }

    const activityStatus = String(activity.status).toLowerCase();
    if (activityStatus !== 'recruiting' && activityStatus !== '1') {
      throw new Error('活动已结束招募');
    }

    if (activity.current_participants >= activity.max_participants) {
      throw new Error('活动已满员');
    }

    const existingSignup = await ActivitySignup.findOne({
      where: { activity_id: activityId, user_id: userId },
    });

    if (existingSignup) {
      if (existingSignup.status === 'cancelled') {
        return existingSignup.update({ status: 'approved', ...data });
      }
      throw new Error('您已报名该活动');
    }

    const transaction = await Activity.sequelize.transaction();

    try {
      const signup = await ActivitySignup.create(
        {
          activity_id: activityId,
          user_id: userId,
          status: 'approved',
          ...data,
        },
        { transaction }
      );

      await activity.update(
        { current_participants: activity.current_participants + 1 },
        { transaction }
      );

      await transaction.commit();
      return signup;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async cancelSignup(activityId, userId) {
    const signup = await ActivitySignup.findOne({
      where: { activity_id: activityId, user_id: userId },
    });

    if (!signup) {
      throw new Error('未找到报名记录');
    }

    if (signup.status === 'checked_in') {
      throw new Error('已签到的活动无法取消');
    }

    const transaction = await Activity.sequelize.transaction();

    try {
      await signup.update({ status: 'cancelled' }, { transaction });

      const activity = await Activity.findByPk(activityId);
      if (activity) {
        await activity.update(
          { current_participants: Math.max(0, activity.current_participants - 1) },
          { transaction }
        );
      }

      await transaction.commit();
      return signup;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async checkinActivity(activityId, userId) {
    const signup = await ActivitySignup.findOne({
      where: { activity_id: activityId, user_id: userId },
    });

    if (!signup) {
      throw new Error('未找到报名记录');
    }

    if (signup.status !== 'approved') {
      throw new Error('无法签到：报名状态不正确');
    }

    return signup.update({ status: 'checked_in', checked_in_at: new Date() });
  }

  static async getActivitySignups(activityId, query = {}) {
    const { page = 1, pageSize = 10, status } = query;
    const { limit, offset } = getPagination(page, pageSize);

    const where = { activity_id: activityId };

    if (status) {
      where.status = status;
    }

    const result = await ActivitySignup.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'nickname', 'avatar'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    const meta = getPaginationMeta(page, pageSize, result.count);

    return {
      list: result.rows,
      pagination: meta,
    };
  }

  static async getUserActivities(userId, query = {}) {
    const { page = 1, pageSize = 10, status } = query;
    const { limit, offset } = getPagination(page, pageSize);

    const where = { user_id: userId };

    if (status) {
      where.status = status;
    }

    const result = await ActivitySignup.findAndCountAll({
      where,
      include: [
        {
          model: Activity,
          as: 'activity',
          include: [
            { model: Band, as: 'band', attributes: ['id', 'name', 'avatar'] },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    const meta = getPaginationMeta(page, pageSize, result.count);

    return {
      list: result.rows,
      pagination: meta,
    };
  }
}

module.exports = ActivityService;