const { Product, Band, User } = require('../models');
const ApiResponse = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { Op } = require('sequelize');

const getList = async (req, res) => {
  try {
    const { page, pageSize, offset } = getPagination(req.query);
    const { keyword, category, type, band_id, sort = 'created_at', order = 'DESC' } = req.query;

    const where = { status: 1 };

    // 修复：category 参数映射到 type 字段
    if (category) {
      where.type = category;
    } else if (type) {
      where.type = type;
    }

    if (band_id) {
      where.band_id = band_id;
    }

    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
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

    const product = await Product.findByPk(id, {
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

    if (!product) {
      return ApiResponse.notFound(res, '商品不存在');
    }

    ApiResponse.success(res, product);
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '商品不存在');
    }
    throw error;
  }
};

const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, cover, price, original_price, stock, category, band_id } = req.body;

    const product = await Product.create({
      title,
      description,
      cover,
      price,
      original_price: original_price || price,
      stock,
      category,
      band_id,
      seller_id: userId,
      status: 1,
      sales_count: 0,
    });

    ApiResponse.created(res, product, '商品创建成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '商品表不存在');
    }
    throw error;
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return ApiResponse.notFound(res, '商品不存在');
    }

    await product.update(updateData);

    ApiResponse.updated(res, product, '商品更新成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '商品不存在');
    }
    throw error;
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return ApiResponse.notFound(res, '商品不存在');
    }

    await product.destroy();

    ApiResponse.deleted(res, '商品删除成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '商品不存在');
    }
    throw error;
  }
};

const collect = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findByPk(id);

    if (!product) {
      return ApiResponse.notFound(res, '商品不存在');
    }

    ApiResponse.success(res, { collected: true }, '收藏成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '商品不存在');
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
  collect,
};