module.exports = {
  validBanners: [
    {
      id: 1,
      title: 'Welcome Banner',
      image_url: '/uploads/banner/welcome.jpg',
      link_type: 'none',
      link_value: null,
      sort: 1,
      status: 1,
      start_time: null,
      end_time: null
    },
    {
      id: 2,
      title: 'Activity Banner',
      image_url: '/uploads/banner/activity.jpg',
      link_type: 'activity',
      link_value: '1',
      sort: 2,
      status: 1,
      start_time: null,
      end_time: null
    },
    {
      id: 3,
      title: 'Disabled Banner',
      image_url: '/uploads/banner/disabled.jpg',
      link_type: 'none',
      link_value: null,
      sort: 3,
      status: 0,
      start_time: null,
      end_time: null
    }
  ],

  expiredBanner: {
    id: 4,
    title: 'Expired Banner',
    image_url: '/uploads/banner/expired.jpg',
    link_type: 'none',
    link_value: null,
    sort: 4,
    status: 1,
    start_time: new Date('2026-01-01'),
    end_time: new Date('2026-01-31')
  }
};
