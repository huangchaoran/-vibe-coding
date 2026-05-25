const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const { userIdentity } = require('../constants');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    openid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      comment: '微信openid',
    },
    unionid: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: '微信unionid',
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '新用户',
      comment: '昵称',
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '/static/images/default-avatar.png',
      comment: '头像',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号',
    },
    identity: {
      type: DataTypes.ENUM(...Object.values(userIdentity)),
      allowNull: false,
      defaultValue: userIdentity.FAN,
      comment: '用户身份',
    },
    instrument: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '擅长乐器',
    },
    music_style: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '音乐风格',
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '位置',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '简介',
    },
    video_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '视频链接',
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: '状态: 0禁用 1正常',
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        fields: ['openid'],
      },
      {
        fields: ['identity'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

module.exports = User;
