const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Activity = sequelize.define(
  'Activity',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '活动标题',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '活动描述',
    },
    cover_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '活动封面图片URL',
    },
    type: {
      type: DataTypes.ENUM('recruitment', 'performance', 'competition', 'other'),
      allowNull: false,
      defaultValue: 'recruitment',
      comment: '活动类型：recruitment(招募)、performance(演出)、competition(比赛)、other(其他)',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'recruiting',
      comment: '活动状态：recruiting(招募中)、in_progress(进行中)、ended(已结束)',
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '活动开始时间',
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '活动结束时间',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '活动地点',
    },
    organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '组织者ID（关联users表）',
    },
    band_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '举办活动的乐队ID（关联bands表）',
    },
    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100,
      comment: '最大参与人数',
    },
    current_participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '当前参与人数',
    },
  },
  {
    tableName: 'activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { name: 'idx_activity_status', fields: ['status'] },
      { name: 'idx_activity_type', fields: ['type'] },
      { name: 'idx_activity_organizer', fields: ['organizer_id'] },
      { name: 'idx_activity_band', fields: ['band_id'] },
    ],
  }
);

module.exports = Activity;