const { Post, User, Band, Comment } = require('../models');
const ApiResponse = require('../utils/response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { Op } = require('sequelize');

const getList = async (req, res) => {
  try {
    const { page, pageSize, offset } = getPagination(req.query);
    const { user_id, band_id, keyword, sort = 'created_at', order = 'DESC' } = req.query;

    const where = { status: 1 };

    if (user_id) {
      where.user_id = user_id;
    }

    if (band_id) {
      where.band_id = band_id;
    }

    if (keyword) {
      where[Op.or] = [
        { content: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await Post.findAndCountAll({
      where,
      offset,
      limit: pageSize,
      order: [[sort, order]],
      include: [
        {
          model: User,
          as: 'author',
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

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: Band,
          as: 'band',
          attributes: ['id', 'name', 'avatar'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar'],
            },
          ],
          order: [['created_at', 'ASC']],
        },
      ],
    });

    if (!post) {
      return ApiResponse.notFound(res, '帖子不存在');
    }

    await post.increment('view_count');

    ApiResponse.success(res, post);
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '帖子不存在');
    }
    throw error;
  }
};

const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { content, images, band_id } = req.body;

    const post = await Post.create({
      content,
      images: images ? JSON.stringify(images) : null,
      band_id,
      user_id: userId,
      status: 1,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
    });

    ApiResponse.created(res, post, '帖子发布成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '帖子表不存在');
    }
    throw error;
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, images } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return ApiResponse.notFound(res, '帖子不存在');
    }

    if (post.user_id !== req.user.userId) {
      return ApiResponse.forbidden(res, '无权修改此帖子');
    }

    const updateData = { content };
    if (images !== undefined) {
      updateData.images = JSON.stringify(images);
    }

    await post.update(updateData);

    ApiResponse.updated(res, post, '帖子更新成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '帖子不存在');
    }
    throw error;
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return ApiResponse.notFound(res, '帖子不存在');
    }

    if (post.user_id !== req.user.userId) {
      return ApiResponse.forbidden(res, '无权删除此帖子');
    }

    await post.destroy();

    ApiResponse.deleted(res, '帖子删除成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '帖子不存在');
    }
    throw error;
  }
};

const like = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (!post) {
      return ApiResponse.notFound(res, '帖子不存在');
    }

    await post.increment('like_count');

    ApiResponse.success(res, null, '点赞成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '帖子不存在');
    }
    throw error;
  }
};

const comment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { content } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return ApiResponse.notFound(res, '帖子不存在');
    }

    const comment = await Comment.create({
      post_id: id,
      user_id: userId,
      content,
    });

    await post.increment('comment_count');

    ApiResponse.created(res, comment, '评论成功');
  } catch (error) {
    if (error.message && error.message.includes("doesn't exist")) {
      return ApiResponse.notFound(res, '帖子不存在');
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
  like,
  comment,
};