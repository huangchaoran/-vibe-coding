module.exports = {
  validBand: {
    id: 1,
    name: 'Test Rock Band',
    style: 'Rock',
    intro: 'A test rock band from Beijing',
    avatar: '/uploads/band/test-band.jpg',
    cover: '/uploads/band/test-band-cover.jpg',
    owner_id: 3,
    status: 1,
    reject_reason: null,
    member_count: 4
  },

  pendingBand: {
    id: 2,
    name: 'Pending Jazz Band',
    style: 'Jazz',
    intro: 'A test jazz band pending approval',
    avatar: '/uploads/band/pending-band.jpg',
    cover: '/uploads/band/pending-band-cover.jpg',
    owner_id: 2,
    status: 0,
    reject_reason: null,
    member_count: 3
  },

  rejectedBand: {
    id: 3,
    name: 'Rejected Band',
    style: 'Pop',
    intro: 'A rejected band',
    avatar: '/uploads/band/rejected-band.jpg',
    cover: '/uploads/band/rejected-band-cover.jpg',
    owner_id: 2,
    status: 2,
    reject_reason: 'Inappropriate content',
    member_count: 2
  },

  bandMembers: [
    {
      id: 1,
      band_id: 1,
      user_id: 3,
      role: 'leader',
      instrument: 'Guitar',
      joined_at: new Date('2026-01-01'),
      status: 1
    },
    {
      id: 2,
      band_id: 1,
      user_id: 2,
      role: 'member',
      instrument: 'Drums',
      joined_at: new Date('2026-01-15'),
      status: 1
    }
  ]
};
