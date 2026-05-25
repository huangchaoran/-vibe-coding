const { User, Follow, Band, Activity, ActivitySignup, Favorite, Booking, Order, UserIdentity } = require('../models');
const { userIdentity } = require('../constants');

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['openid', 'unionid'] },
    include: [
      {
        model: UserIdentity,
        as: 'identities',
        attributes: ['identity'],
      },
    ],
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  // 兼容 Sequelize 实例和普通对象
  const userJson = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };

  // 将 identities 数组转换为简洁格式
  if (userJson.identities && userJson.identities.length > 0) {
    userJson.identities = userJson.identities.map(i => i.identity);
  } else {
    // 向后兼容，如果没有 identities 记录，使用旧的 identity 字段
    userJson.identities = userJson.identity ? [userJson.identity] : [userIdentity.FAN];
  }

  return userJson;
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('用户不存在');
  }

  await user.update(updateData);

  return getUserProfile(userId);
};

const changeUserIdentity = async (userId, identity) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('用户不存在');
  }

  await user.update({ identity });
  return getUserProfile(userId);
};

const getUserIdentities = async (userId) => {
  const identities = await UserIdentity.findAll({
    where: { user_id: userId },
    attributes: ['identity'],
  });

  if (identities.length === 0) {
    const user = await User.findByPk(userId);
    if (user && user.identity) {
      return [user.identity];
    }
    return [userIdentity.FAN];
  }

  return identities.map(i => i.identity);
};

const addUserIdentity = async (userId, identity) => {
  const existing = await UserIdentity.findOne({
    where: { user_id: userId, identity: identity },
  });

  if (existing) {
    return getUserIdentities(userId);
  }

  const existingIdentities = await UserIdentity.findAll({
    where: { user_id: userId },
    attributes: ['identity'],
  });

  if (existingIdentities.length === 0) {
    const user = await User.findByPk(userId);
    if (user && user.identity) {
      await UserIdentity.create({
        user_id: userId,
        identity: user.identity,
      });
    }
  }

  await UserIdentity.create({
    user_id: userId,
    identity: identity,
  });

  return getUserIdentities(userId);
};

const removeUserIdentity = async (userId, identity) => {
  await UserIdentity.destroy({
    where: { user_id: userId, identity: identity },
  });

  return getUserIdentities(userId);
};

const getUserStats = async (userId) => {
  const { Follow, ActivitySignup, Post } = require('../models');

  // 我关注的数量（followings）
  const followCount = await Follow.count({
    where: { follower_id: userId },
  });

  // 粉丝数量（followers）
  const fansCount = await Follow.count({
    where: { following_id: userId },
  });

  // 动态数量（帖子）
  const dynamicsCount = await Post.count({
    where: { user_id: userId },
  });

  // 报名的活动数量
  const activityCount = await ActivitySignup.count({
    where: { user_id: userId },
  });

  return {
    followCount,
    fansCount,
    dynamicsCount,
    activityCount,
  };
};

const getMyFollows = async (userId, query = {}) => {
  const { page = 1, pageSize = 10 } = query;
  const { getPagination, getPaginationMeta } = require('../utils/pagination');
  const { limit, offset } = getPagination(page, pageSize);
  const { Follow, Band } = require('../models');

  // 查询我关注且target_type为band的记录，通过following_id关联band
  const { rows: follows, count: total } = await Follow.findAndCountAll({
    where: {
      follower_id: userId,
      target_type: 'band',
    },
    include: [{
      model: Band,
      as: 'band',
      attributes: ['id', 'name', 'avatar', 'style', 'intro'],
    }],
    order: [['id', 'DESC']],
    limit,
    offset,
  });

  const list = follows.map(f => f.band).filter(b => b);

  const meta = getPaginationMeta(page, pageSize, total);

  return {
    list,
    pagination: meta,
  };
};

const getMyActivities = async (userId, query = {}) => {
  const { page = 1, pageSize = 10 } = query;
  const { getPagination, getPaginationMeta } = require('../utils/pagination');
  const { limit, offset } = getPagination(page, pageSize);
  const { ActivitySignup, Activity } = require('../models');

  const { rows: signups, count: total } = await ActivitySignup.findAndCountAll({
    where: { user_id: userId },
    include: [{
      model: Activity,
      as: 'activity',
      attributes: ['id', 'title', 'cover_image', 'start_time', 'end_time', 'location', 'type', 'status'],
    }],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  const list = signups.map(s => ({
    ...s.activity?.dataValues,
    signup_status: s.status,
    signup_time: s.created_at,
  }));

  const meta = getPaginationMeta(page, pageSize, total);

  return {
    list,
    pagination: meta,
  };
};

const getMyFavorites = async (userId, query = {}) => {
  const { page = 1, pageSize = 10, type } = query;
  const { getPagination, getPaginationMeta } = require('../utils/pagination');
  const { limit, offset } = getPagination(page, pageSize);
  const { Favorite, Band, Activity, Product, Post } = require('../models');

  const where = { user_id: userId };
  if (type) {
    where.target_type = type;
  }

  const { rows: favorites, count: total } = await Favorite.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  // 分别获取每个类型的详情（简化实现，避免复杂JOIN）
  const list = await Promise.all(favorites.map(async (fav) => {
    let targetData = null;
    if (fav.target_type === 'band') {
      const band = await Band.findByPk(fav.target_id, { attributes: ['id', 'name', 'avatar', 'style'] });
      targetData = band;
    } else if (fav.target_type === 'activity') {
      const activity = await Activity.findByPk(fav.target_id, { attributes: ['id', 'title', 'cover_image', 'start_time'] });
      targetData = activity;
    } else if (fav.target_type === 'product') {
      const product = await Product.findByPk(fav.target_id, { attributes: ['id', 'title', 'cover', 'price'] });
      targetData = product;
    } else if (fav.target_type === 'post') {
      const post = await Post.findByPk(fav.target_id, { attributes: ['id', 'content', 'images'] });
      targetData = post;
    }
    return {
      id: fav.id,
      target_type: fav.target_type,
      target_id: fav.target_id,
      target_data: targetData,
      created_at: fav.created_at,
    };
  }));

  const meta = getPaginationMeta(page, pageSize, total);

  return {
    list,
    pagination: meta,
  };
};

const toggleFavorite = async (userId, targetType, targetId) => {
  const { Favorite } = require('../models');

  if (!targetType || !targetId) {
    throw new Error('参数错误：targetType 和 targetId 是必需的');
  }

  const existing = await Favorite.findOne({
    where: {
      user_id: userId,
      target_type: String(targetType),
      target_id: String(targetId),
    },
  });

  if (existing) {
    await existing.destroy();
    return { favorited: false };
  }

  await Favorite.create({
    user_id: userId,
    target_type: String(targetType),
    target_id: String(targetId),
  });
  return { favorited: true };
};

const getMyBookings = async (userId, query = {}) => {
  const { page = 1, pageSize = 10 } = query;
  const { getPagination, getPaginationMeta } = require('../utils/pagination');
  const { limit, offset } = getPagination(page, pageSize);
  const { Booking, Room } = require('../models');

  const { rows: bookings, count: total } = await Booking.findAndCountAll({
    where: { user_id: userId },
    include: [{
      model: Room,
      as: 'room',
      attributes: ['id', 'name', 'cover'],
    }],
    order: [['book_date', 'DESC'], ['created_at', 'DESC']],
    limit,
    offset,
  });

  const list = bookings.map(b => ({
    id: b.id,
    room_id: b.room_id,
    book_date: b.book_date,
    time_slot: b.time_slot,
    status: b.status,
    contact_phone: b.contact_phone,
    note: b.note,
    room_name: b.room?.name,
    room_avatar: b.room?.cover,
    created_at: b.created_at,
  }));

  const meta = getPaginationMeta(page, pageSize, total);

  return {
    list,
    pagination: meta,
  };
};

const createBooking = async (userId, bookingData) => {
  const { Booking } = require('../models');
  const { room_id, book_date, time_slot, contact_phone, note } = bookingData;

  const booking = await Booking.create({
    room_id,
    user_id: userId,
    book_date,
    time_slot,
    status: 'pending',
    contact_phone,
    note,
  });

  return booking;
};

const getMyOrders = async (userId, query = {}) => {
  const { page = 1, pageSize = 10, type, status } = query;
  const { getPagination, getPaginationMeta } = require('../utils/pagination');
  const { limit, offset } = getPagination(page, pageSize);
  const { Order } = require('../models');

  const where = { user_id: userId };
  if (status) {
    where.status = status;
  }

  const { rows: orders, count: total } = await Order.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  const meta = getPaginationMeta(page, pageSize, total);

  return {
    list: orders,
    pagination: meta,
  };
};

const createOrder = async (userId, orderData) => {
  const { Order } = require('../models');
  const { type, target_id, total_amount, payment_method, note } = orderData;

  const orderNo = 'GOJ' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

  const order = await Order.create({
    order_no: orderNo,
    user_id: userId,
    type,
    target_id: target_id || null,
    total_amount: total_amount || 0,
    payment_method: payment_method || null,
    note: note || null,
    status: 'pending',
  });

  return order;
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserIdentity,
  getUserIdentities,
  addUserIdentity,
  removeUserIdentity,
  getUserStats,
  getMyFollows,
  getMyActivities,
  getMyFavorites,
  toggleFavorite,
  getMyBookings,
  createBooking,
  getMyOrders,
  createOrder,
};
