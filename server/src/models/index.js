const { sequelize } = require('../database/connection');
const User = require('./User');
const Band = require('./Band');
const BandMember = require('./BandMember');
const Follow = require('./Follow');
const Banner = require('./Banner');
const Activity = require('./Activity');
const ActivitySignup = require('./ActivitySignup');
const Product = require('./Product');
const Post = require('./Post');
const Comment = require('./Comment');
const Room = require('./Room');
const Recruitment = require('./Recruitment');
const Favorite = require('./Favorite');
const Booking = require('./Booking');
const Order = require('./Order');
const UserIdentity = require('./UserIdentity');

User.hasMany(Band, { foreignKey: 'owner_id', as: 'ownedBands' });
Band.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(BandMember, { foreignKey: 'user_id', as: 'bandMemberships' });
BandMember.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Band.hasMany(BandMember, { foreignKey: 'band_id', as: 'members' });
BandMember.belongsTo(Band, { foreignKey: 'band_id', as: 'band' });

User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'following_id',
  otherKey: 'follower_id',
});

User.belongsToMany(User, {
  through: Follow,
  as: 'followings',
  foreignKey: 'follower_id',
  otherKey: 'following_id',
});

Follow.belongsTo(Band, { foreignKey: 'following_id', as: 'band' });

User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Band.hasMany(Post, { foreignKey: 'band_id', as: 'posts' });
Post.belongsTo(Band, { foreignKey: 'band_id', as: 'band' });

Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });

User.hasMany(Room, { foreignKey: 'creator_id', as: 'rooms' });
Room.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

Band.hasMany(Room, { foreignKey: 'band_id', as: 'rooms' });
Room.belongsTo(Band, { foreignKey: 'band_id', as: 'band' });

Band.hasMany(Activity, { foreignKey: 'band_id', as: 'activities' });
Activity.belongsTo(Band, { foreignKey: 'band_id', as: 'band' });

User.hasMany(Activity, { foreignKey: 'organizer_id', as: 'organizedActivities' });
Activity.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });

Activity.hasMany(ActivitySignup, { foreignKey: 'activity_id', as: 'signups' });
ActivitySignup.belongsTo(Activity, { foreignKey: 'activity_id', as: 'activity' });

User.hasMany(ActivitySignup, { foreignKey: 'user_id', as: 'activitySignups' });
ActivitySignup.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Band.hasMany(Product, { foreignKey: 'band_id', as: 'products' });
Product.belongsTo(Band, { foreignKey: 'band_id', as: 'band' });

Band.hasMany(Recruitment, { foreignKey: 'band_id', as: 'recruitments' });
Recruitment.belongsTo(Band, { foreignKey: 'band_id', as: 'band' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserIdentity, { foreignKey: 'user_id', as: 'identities' });
UserIdentity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Band,
  BandMember,
  Follow,
  Banner,
  Activity,
  ActivitySignup,
  Product,
  Post,
  Comment,
  Room,
  Recruitment,
  Favorite,
  Booking,
  Order,
  UserIdentity,
};
