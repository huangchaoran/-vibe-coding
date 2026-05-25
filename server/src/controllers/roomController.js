const { Room, User, Band } = require('../models');
const ApiResponse = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { Op } = require('sequelize');

const getList = async (req, res) => {
  try {
    const { page, pageSize, offset } = getPagination(req.query);
    const { keyword, type, band_id, sort = 'created_at', order = 'DESC' } = req.query;

    const where = { status: 1 };

    if (type) {
      where.type = type;
    }

    if (band_id) {
      where.band_id = band_id;
    }

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await Room.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[sort, order]],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Band,
          as: 'band',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    const pagination = getPaginationMeta(page, pageSize, count);

    ApiResponse.paginated(res, rows, pagination);
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.paginated(res, [], { page: 1, pageSize: 10, total: 0, totalPages: 0 });
    }
    throw error;
  }
};

const getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Band,
          as: 'band',
          attributes: ['id', 'name', 'avatar'],
        },
      ],
    });

    if (!room) {
      return ApiResponse.notFound(res, '房间不存在');
    }

    ApiResponse.success(res, room);
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '房间不存在');
    }
    throw error;
  }
};

const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, type = 'chat', description, cover, band_id, max_users = 50 } = req.body;

    const room = await Room.create({
      name,
      type,
      description,
      cover,
      band_id,
      creator_id: userId,
      max_users,
      current_users: 0,
      status: 1,
    });

    ApiResponse.created(res, room, '房间创建成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '房间表不存在');
    }
    throw error;
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const room = await Room.findByPk(id);

    if (!room) {
      return ApiResponse.notFound(res, '房间不存在');
    }

    if (room.creator_id !== req.user.userId) {
      return ApiResponse.forbidden(res, '无权修改此房间');
    }

    await room.update(updateData);

    ApiResponse.updated(res, room, '房间更新成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '房间不存在');
    }
    throw error;
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return ApiResponse.notFound(res, '房间不存在');
    }

    if (room.creator_id !== req.user.userId) {
      return ApiResponse.forbidden(res, '无权删除此房间');
    }

    await room.destroy();

    ApiResponse.deleted(res, '房间删除成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '房间不存在');
    }
    throw error;
  }
};

const join = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return ApiResponse.notFound(res, '房间不存在');
    }

    if (room.status !== 1) {
      return ApiResponse.badRequest(res, '房间未开放');
    }

    if (room.current_users >= room.max_users) {
      return ApiResponse.badRequest(res, '房间已满');
    }

    await room.increment('current_users');

    ApiResponse.success(res, null, '加入房间成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '房间不存在');
    }
    throw error;
  }
};

const leave = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return ApiResponse.notFound(res, '房间不存在');
    }

    if (room.current_users > 0) {
      await room.decrement('current_users');
    }

    ApiResponse.success(res, null, '离开房间成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '房间不存在');
    }
    throw error;
  }
};

module.exports = {
  getList,
  getDetail,
  create,
  update,
  delete: remove,
  join,
  leave,
};