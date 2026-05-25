const { Band, Activity, Product, User } = require('../models');
const ApiResponse = require('../utils/response');
const { Op } = require('sequelize');

const search = async (req, res) => {
  const { q, type = 'all', page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  const limit = parseInt(pageSize, 10);

  if (!q) {
    return ApiResponse.badRequest(res, '搜索关键词不能为空');
  }

  const keyword = { [Op.like]: `%${q}%` };
  const results = {};

  if (type === 'all' || type === 'band') {
    try {
      const bands = await Band.findAndCountAll({
        where: {
          status: 1,
          name: keyword,
        },
        offset,
        limit,
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'nickname', 'avatar'],
          },
        ],
      });
      results.bands = {
        list: bands.rows.map(item => item.toJSON()),
        total: bands.count,
      };
    } catch (error) {
      results.bands = {
        list: [],
        total: 0,
      };
    }
  }

  if (type === 'all' || type === 'activity') {
    try {
      const activities = await Activity.findAndCountAll({
        where: {
          title: keyword,
        },
        offset,
        limit,
      });
      results.activities = {
        list: activities.rows.map(item => item.toJSON()),
        total: activities.count,
      };
    } catch (error) {
      results.activities = {
        list: [],
        total: 0,
      };
    }
  }

  if (type === 'all' || type === 'product') {
    try {
      const products = await Product.findAndCountAll({
        where: {
          title: keyword,
          status: 1,
        },
        offset,
        limit,
      });
      results.products = {
        list: products.rows.map(item => item.toJSON()),
        total: products.count,
      };
    } catch (error) {
      results.products = {
        list: [],
        total: 0,
      };
    }
  }

  ApiResponse.success(res, results);
};

module.exports = {
  search,
};
