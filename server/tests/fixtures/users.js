module.exports = {
  validUser: {
    id: 1,
    openid: 'test_openid_001',
    unionid: 'test_unionid_001',
    nickname: 'Test User',
    avatar: '/uploads/avatar/test.jpg',
    phone: '13800138000',
    identity: 'fan',
    instrument: 'Guitar',
    music_style: 'Rock',
    location: 'Beijing',
    bio: 'A passionate musician',
    status: 1
  },

  musicianUser: {
    id: 2,
    openid: 'test_openid_002',
    unionid: 'test_unionid_002',
    nickname: 'Musician User',
    avatar: '/uploads/avatar/musician.jpg',
    phone: '13800138001',
    identity: 'musician',
    instrument: 'Drums',
    music_style: 'Jazz',
    location: 'Shanghai',
    bio: 'Professional drummer',
    status: 1
  },

  bandUser: {
    id: 3,
    openid: 'test_openid_003',
    unionid: 'test_unionid_003',
    nickname: 'Band User',
    avatar: '/uploads/avatar/band.jpg',
    phone: '13800138002',
    identity: 'band',
    instrument: null,
    music_style: 'Metal',
    location: 'Guangzhou',
    bio: 'Band leader',
    status: 1
  },

  venueUser: {
    id: 4,
    openid: 'test_openid_004',
    unionid: 'test_unionid_004',
    nickname: 'Venue User',
    avatar: '/uploads/avatar/venue.jpg',
    phone: '13800138003',
    identity: 'venue',
    instrument: null,
    music_style: null,
    location: 'Shenzhen',
    bio: 'Rehearsal room owner',
    status: 1
  },

  adminUser: {
    id: 5,
    openid: 'test_openid_005',
    unionid: 'test_unionid_005',
    nickname: 'Admin User',
    avatar: '/uploads/avatar/admin.jpg',
    phone: '13800138004',
    identity: 'fan',
    role: 'admin',
    instrument: null,
    music_style: null,
    location: 'Beijing',
    bio: 'System administrator',
    status: 1
  },

  disabledUser: {
    id: 6,
    openid: 'test_openid_006',
    unionid: 'test_unionid_006',
    nickname: 'Disabled User',
    avatar: '/uploads/avatar/disabled.jpg',
    phone: '13800138005',
    identity: 'fan',
    instrument: null,
    music_style: null,
    location: null,
    bio: null,
    status: 0
  }
};
