const { Banner, User, Band, Activity, Product } = require('../models');
const ApiResponse = require('../utils/response');
const { Op } = require('sequelize');
const { verifyToken } = require('../utils/jwt');

const getBanners = async (req, res) => {
  const now = new Date();

  const banners = await Banner.findAll({
    where: {
      status: 1,
      [Op.or]: [
        {
          start_time: {
            [Op.lte]: now,
          },
          end_time: {
            [Op.gte]: now,
          },
        },
        {
          start_time: null,
          end_time: null,
        },
      ],
    },
    order: [['sort', 'ASC']],
  });

  ApiResponse.success(res, banners);
};

const getStats = async (req, res) => {
  try {
    const userCount = await User.count({ where: { status: 1 } });
    const bandCount = await Band.count({ where: { status: 1 } });
    
    let activityCount = 0;
    let productCount = 0;
    
    try {
      const { Activity, Product } = require('../models');
      activityCount = await Activity.count({ where: { status: 'recruiting' } });
      productCount = await Product.count({ where: { status: 1 } });
    } catch (e) {
      // 表不存在时返回0
    }

    const stats = {
      userCount,
      bandCount,
      activityCount,
      productCount,
    };

    ApiResponse.success(res, stats);
  } catch (error) {
    ApiResponse.internalError(res, '获取统计数据失败');
  }
};

const getBands = async (req, res) => {
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

  let bands = await Band.findAll({
    where: { status: 1 },
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'nickname', 'avatar'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: 10,
  });

  if (userId && bands.length > 0) {
    const { sequelize } = require('../database/connection');
    const bandIds = bands.map(b => b.id);

    const followsResult = await sequelize.query(
      'SELECT following_id FROM follows WHERE follower_id = ? AND following_id IN (?)',
      { replacements: [userId, bandIds], type: sequelize.QueryTypes.SELECT }
    );
    
    const followRows = Array.isArray(followsResult[0]) ? followsResult[0] : followsResult;
    const followedIds = new Set();
    
    if (followRows && Array.isArray(followRows)) {
      followRows.forEach(f => {
        if (f && f.following_id) {
          followedIds.add(f.following_id);
        }
      });
    }

    bands = bands.map(band => {
      const bandData = band.toJSON();
      bandData.isFollowed = followedIds.has(band.id);
      return bandData;
    });
  }

  ApiResponse.success(res, bands);
};

const getActivities = async (req, res) => {
  const activities = await Activity.findAll({
    where: { status: 'recruiting' },
    include: [
      {
        model: User,
        as: 'organizer',
        attributes: ['id', 'nickname', 'avatar'],
      },
      {
        model: Band,
        as: 'band',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit: 10,
  });

  ApiResponse.success(res, activities);
};

// 统一的首页数据接口
const getHomeData = async (req, res) => {
  try {
    const now = new Date();

    // 获取轮播图
    const banners = await Banner.findAll({
      where: {
        status: 1,
        [Op.or]: [
          {
            start_time: { [Op.lte]: now },
            end_time: { [Op.gte]: now },
          },
          {
            start_time: null,
            end_time: null,
          },
        ],
      },
      order: [['sort', 'ASC']],
      limit: 5,
    });

    // 获取统计数据
    const userCount = await User.count({ where: { status: 1 } });
    const bandCount = await Band.count({ where: { status: 1 } });
    let activityCount = 0;
    try {
      activityCount = await Activity.count({ where: { status: 'recruiting' } });
    } catch (e) {
      // 表不存在时返回0
    }

    const stats = { userCount, bandCount, activityCount };

    // 获取热门乐队
    const hotBands = await Band.findAll({
      where: { status: 1 },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'nickname', 'avatar'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    // 获取近期活动
    const activities = await Activity.findAll({
      where: { status: 'recruiting' },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'nickname', 'avatar'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    ApiResponse.success(res, {
      banners,
      stats,
      hotBands,
      activities,
    });
  } catch (error) {
    console.error('获取首页数据失败:', error);
    ApiResponse.internalError(res, '获取首页数据失败');
  }
};

module.exports = {
  getBanners,
  getStats,
  getBands,
  getActivities,
  getHomeData,
};
