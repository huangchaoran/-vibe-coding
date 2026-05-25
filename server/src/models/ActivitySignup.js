const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const ActivitySignup = sequelize.define(
  'ActivitySignup',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '活动ID（关联activities表）',
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID（关联users表）',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'checked_in', 'cancelled'),
      allowNull: false,
      defaultValue: 'approved',
      comment: '报名状态：pending(待审核)、approved(已通过)、checked_in(已签到)、cancelled(已取消)',
    },
    participant_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '参与人数',
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '备注信息',
    },
    checked_in_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '签到时间',
    },
  },
  {
    tableName: 'activity_signups',
    timestamps: true,
    indexes: [
      { name: 'idx_signup_activity', fields: ['activity_id'] },
      { name: 'idx_signup_user', fields: ['user_id'] },
      { name: 'uk_activity_user', fields: ['activity_id', 'user_id'], unique: true },
    ],
  }
);

module.exports = ActivitySignup;