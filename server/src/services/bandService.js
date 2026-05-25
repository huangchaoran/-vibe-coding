const { Band, User, BandMember } = require('../models');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const { Op } = require('sequelize');

class BandService {
  static async getBands(query = {}, userId = null) {
    const { page = 1, pageSize = 10, style, keyword } = query;
    const { limit, offset } = getPagination(page, pageSize);

    const where = { status: 1 };

    if (style) {
      where.style = style;
    }

    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like] : `%${keyword}%` } },
        { intro: { [Op.like] : `%${keyword}%` } },
      ];
    }

    const result = await Band.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'nickname', 'avatar'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    const meta = getPaginationMeta(page, pageSize, result.count);

    let list = result.rows;
    
    // 如果有 userId，为每个乐队补充 is_followed 状态
    if (userId) {
      const { sequelize } = require('../database/connection');
      const bandIds = list.map(band => band.id);
      
      if (bandIds.length > 0) {
        const follows = await sequelize.query(
          'SELECT following_id FROM follows WHERE follower_id = ? AND following_id IN (?) AND target_type = ?',
          { replacements: [userId, bandIds, 'band'], type: sequelize.QueryTypes.SELECT }
        );
        
        // 获取第一个结果数组
        const followRows = Array.isArray(follows[0]) ? follows[0] : follows;
        
        const followedIds = new Set();
        if (followRows && Array.isArray(followRows)) {
          followRows.forEach(f => {
            if (f && f.following_id) {
              followedIds.add(f.following_id);
            }
          });
        }
        
        list = list.map(band => {
          const bandData = band.toJSON();
          bandData.isFollowed = followedIds.has(band.id);
          return bandData;
        });
      }
    }

    return {
      list,
      pagination: meta,
    };
  }

  static async getBandById(id, userId = null) {
    const { sequelize } = require('../database/connection');
    const band = await Band.findOne({
      where: { id, status: 1 },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'nickname', 'avatar'],
        },
        {
          model: BandMember,
          as: 'members',
          where: { status: 1 },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nickname', 'avatar', 'instrument'],
            },
          ],
        },
      ],
    });

    if (!band) {
      return null;
    }

    const result = band.toJSON();

    if (userId) {
      const [followed] = await sequelize.query(
        'SELECT id FROM follows WHERE follower_id = ? AND following_id = ?',
        { replacements: [userId, id], type: sequelize.QueryTypes.SELECT }
      );
      result.isFollowed = !!followed;
    }

    return result;
  }

  static async createBand(data) {
    return Band.create(data);
  }

  static async updateBand(id, data) {
    const band = await Band.findByPk(id);
    if (!band) {
      throw new Error('乐队不存在');
    }
    return band.update(data);
  }

  static async deleteBand(id) {
    const band = await Band.findByPk(id);
    if (!band) {
      throw new Error('乐队不存在');
    }
    return band.destroy();
  }

  static async followBand(bandId, userId) {
    const { sequelize } = require('../database/connection');
    const band = await Band.findOne({ where: { id: bandId, status: 1 } });
    if (!band) {
      throw new Error('乐队不存在');
    }

    const existingFollow = await sequelize.query(
      'SELECT id FROM follows WHERE follower_id = ? AND following_id = ? AND target_type = ?',
      { replacements: [userId, bandId, 'band'], type: sequelize.QueryTypes.SELECT }
    );

    const followRows = Array.isArray(existingFollow[0]) ? existingFollow[0] : existingFollow;
    
    if (followRows && followRows.length > 0) {
      await sequelize.query(
        'DELETE FROM follows WHERE follower_id = ? AND following_id = ? AND target_type = ?',
        { replacements: [userId, bandId, 'band'] }
      );
      return { followed: false };
    }

    // 修复：添加时间戳字段
    await sequelize.query(
      'INSERT INTO follows (follower_id, following_id, target_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      { replacements: [userId, bandId, 'band'] }
    );

    return { followed: true };
  }

  static async unfollowBand(bandId, userId) {
    const { sequelize } = require('../database/connection');
    const band = await Band.findOne({ where: { id: bandId, status: 1 } });
    if (!band) {
      throw new Error('乐队不存在');
    }

    await sequelize.query(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ? AND target_type = ?',
      { replacements: [userId, bandId, 'band'] }
    );
    return { followed: false };
  }

  static async getFollowedBands(userId, query = {}) {
    const { sequelize } = require('../database/connection');
    const { page = 1, pageSize = 10 } = query;
    const { limit, offset } = getPagination(page, pageSize);

    const countResult = await sequelize.query(
      'SELECT COUNT(*) as total FROM follows f JOIN bands b ON f.following_id = b.id WHERE f.follower_id = ? AND f.target_type = ? AND b.status = 1',
      { replacements: [userId, 'band'], type: sequelize.QueryTypes.SELECT }
    );
    const total = countResult[0]?.total || 0;

    const follows = await sequelize.query(
      `SELECT b.*, u.id as owner_id, u.nickname as owner_nickname, u.avatar as owner_avatar, f.created_at as follow_created_at
       FROM follows f
       JOIN bands b ON f.following_id = b.id
       LEFT JOIN users u ON b.owner_id = u.id
       WHERE f.follower_id = ? AND f.target_type = ? AND b.status = 1
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      { replacements: [userId, 'band', limit, offset], type: sequelize.QueryTypes.SELECT }
    );

    const meta = getPaginationMeta(page, pageSize, total);

    return {
      list: follows.map((f) => ({
        ...f,
        owner: f.owner_id ? {
          id: f.owner_id,
          nickname: f.owner_nickname,
          avatar: f.owner_avatar,
        } : null,
        isFollowed: true,
      })),
      pagination: meta,
    };
  }

  static async getBandMembers(bandId) {
    const members = await BandMember.findAll({
      where: { band_id: bandId, status: 1 },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nickname', 'avatar', 'instrument'],
        },
      ],
    });

    return members.map(member => ({
      id: member.id,
      user_id: member.user_id,
      nickname: member.user?.nickname || '',
      avatar: member.user?.avatar || '',
      instrument: member.user?.instrument || member.instrument || '',
      role: member.role || '',
      joined_at: member.created_at,
    }));
  }

  static async addBandMember(bandId, userId, role = '', instrument = '') {
    const band = await Band.findByPk(bandId);
    if (!band) {
      throw new Error('乐队不存在');
    }

    const existingMember = await BandMember.findOne({
      where: { band_id: bandId, user_id: userId },
    });

    if (existingMember) {
      if (existingMember.status === 1) {
        throw new Error('用户已经是该乐队成员');
      } else {
        await existingMember.update({ status: 1, role, instrument });
        return existingMember;
      }
    }

    const member = await BandMember.create({
      band_id: bandId,
      user_id: userId,
      role,
      instrument,
      status: 1,
    });

    await band.increment('member_count');

    return member;
  }

  static async removeBandMember(bandId, memberId) {
    const member = await BandMember.findOne({
      where: { id: memberId, band_id: bandId },
    });

    if (!member) {
      throw new Error('成员不存在');
    }

    await member.update({ status: 0 });

    const band = await Band.findByPk(bandId);
    if (band && band.member_count > 0) {
      await band.decrement('member_count');
    }

    return true;
  }

  static async getBandActivities(bandId, query = {}) {
    const { sequelize } = require('../database/connection');
    const { page = 1, pageSize = 10 } = query;
    const { limit, offset } = getPagination(page, pageSize);

    const countResult = await sequelize.query(
      'SELECT COUNT(*) as total FROM activities WHERE band_id = ? AND status = 1',
      { replacements: [bandId], type: sequelize.QueryTypes.SELECT }
    );
    const total = countResult[0]?.total || 0;

    const activities = await sequelize.query(
      `SELECT a.*, b.name as band_name, b.avatar as band_avatar
       FROM activities a
       LEFT JOIN bands b ON a.band_id = b.id
       WHERE a.band_id = ? AND a.status = 1
       ORDER BY a.start_time DESC
       LIMIT ? OFFSET ?`,
      { replacements: [bandId, limit, offset], type: sequelize.QueryTypes.SELECT }
    );

    const meta = getPaginationMeta(page, pageSize, total);

    return {
      list: activities,
      pagination: meta,
    };
  }
}

module.exports = BandService;