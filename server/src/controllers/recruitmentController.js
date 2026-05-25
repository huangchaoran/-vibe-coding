const { Recruitment, Band, User, BandMember } = require('../models');
const { sequelize } = require('../database/connection');
const ApiResponse = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { Op } = require('sequelize');

const getList = async (req, res) => {
  try {
    const { page, pageSize, offset } = getPagination(req.query);
    const { keyword, instrument, band_id, status, sort = 'created_at', order = 'DESC' } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (band_id) {
      where.band_id = band_id;
    }

    if (instrument) {
      where.instrument = instrument;
    }

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await Recruitment.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[sort, order]],
      include: [
        {
          model: Band,
          as: 'band',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'nickname', 'avatar'],
            },
          ],
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

    const recruitment = await Recruitment.findByPk(id, {
      include: [
        {
          model: Band,
          as: 'band',
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'nickname', 'avatar'],
            },
          ],
        },
      ],
    });

    if (!recruitment) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }

    ApiResponse.success(res, recruitment);
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }
    throw error;
  }
};

const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { band_id, title, description, instrument, requirement, contact } = req.body;

    if (!title || !instrument) {
      return res.status(422).json({
        code: 3004,
        message: '验证失败',
        errors: [
          { field: 'title', message: 'title 是必需的' },
          { field: 'instrument', message: 'instrument 是必需的' },
        ],
      });
    }

    let finalBandId = band_id;
    if (!finalBandId) {
      const [band] = await sequelize.query(
        'SELECT id FROM bands ORDER BY id ASC LIMIT 1',
        { type: sequelize.QueryTypes.SELECT }
      );
      if (band) {
        finalBandId = band.id;
      } else {
        return res.status(422).json({
          code: 3004,
          message: '验证失败',
          errors: [{ field: 'band_id', message: '没有可用乐队，请先创建乐队' }],
        });
      }
    }

    const recruitment = await Recruitment.create({
      band_id: finalBandId,
      title,
      description: description || null,
      instrument,
      requirement: requirement || null,
      contact: contact || null,
      status: 1,
    });

    ApiResponse.created(res, recruitment, '招募信息发布成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '招募表不存在');
    }
    throw error;
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const recruitment = await Recruitment.findByPk(id);

    if (!recruitment) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }

    await recruitment.update(updateData);

    ApiResponse.updated(res, recruitment, '招募信息更新成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }
    throw error;
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const recruitment = await Recruitment.findByPk(id);

    if (!recruitment) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }

    await recruitment.destroy();

    ApiResponse.deleted(res, '招募信息删除成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }
    throw error;
  }
};

const apply = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { message } = req.body;

    const recruitment = await Recruitment.findByPk(id);

    if (!recruitment) {
      return ApiResponse.notFound(res, '招募信息不存在');
    }

    if (recruitment.status !== 1) {
      return ApiResponse.badRequest(res, '招募已结束');
    }

    const existingMember = await BandMember.findOne({
      where: {
        band_id: recruitment.band_id,
        user_id: userId,
      },
    });

    if (existingMember) {
      return ApiResponse.badRequest(res, '您已是该乐队成员');
    }

    await BandMember.create({
      band_id: recruitment.band_id,
      user_id: userId,
      role: 'applicant',
      status: 0,
      apply_message: message,
    });

    ApiResponse.success(res, null, '申请成功，等待乐队审核');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '招募信息不存在');
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
  apply,
};