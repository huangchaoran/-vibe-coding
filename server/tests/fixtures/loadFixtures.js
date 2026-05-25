require('dotenv').config({ path: '.env.test' });

const { User, Band, BandMember } = require('../../src/models');
const usersFixtures = require('./users');
const bandsFixtures = require('./bands');

const createTestUsers = async () => {
  console.log('正在创建测试用户数据...');
  
  try {
    for (const [key, userData] of Object.entries(usersFixtures)) {
      const existingUser = await User.findByPk(userData.id);
      if (existingUser) {
        console.log(`用户 ${userData.nickname} 已存在，跳过`);
      } else {
        await User.create(userData);
        console.log(`✅ 创建用户: ${userData.nickname}`);
      }
    }
    console.log('测试用户数据创建完成');
  } catch (error) {
    console.error('创建测试用户失败:', error.message);
    throw error;
  }
};

const createTestBands = async () => {
  console.log('正在创建测试乐队数据...');
  
  try {
    for (const [key, bandData] of Object.entries(bandsFixtures)) {
      if (key === 'bandMembers') continue; // 跳过成员数据，单独处理
      
      const existingBand = await Band.findByPk(bandData.id);
      if (existingBand) {
        console.log(`乐队 ${bandData.name} 已存在，跳过`);
      } else {
        await Band.create(bandData);
        console.log(`✅ 创建乐队: ${bandData.name}`);
      }
    }
    
    // 创建乐队成员
    for (const memberData of bandsFixtures.bandMembers) {
      const existingMember = await BandMember.findByPk(memberData.id);
      if (existingMember) {
        console.log(`成员 ${memberData.user_id} 已存在，跳过`);
      } else {
        await BandMember.create(memberData);
        console.log(`✅ 创建成员: 用户 ${memberData.user_id}`);
      }
    }
    
    console.log('测试乐队数据创建完成');
  } catch (error) {
    console.error('创建测试乐队失败:', error.message);
    throw error;
  }
};

const clearTestData = async () => {
  console.log('正在清理测试数据...');
  
  try {
    await BandMember.destroy({ where: {}, truncate: true });
    await Band.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    console.log('测试数据清理完成');
  } catch (error) {
    console.error('清理测试数据失败:', error.message);
    throw error;
  }
};

module.exports = {
  createTestUsers,
  createTestBands,
  clearTestData,
};
