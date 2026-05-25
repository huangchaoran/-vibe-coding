const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { updateProfileValidator } = require('../validators/userValidator');

// /me 是 /profile 的别名
router.get('/me', requireAuth(), asyncHandler(userController.getProfile));
router.get('/profile', requireAuth(), asyncHandler(userController.getProfile));

router.put(
  '/profile',
  requireAuth(),
  updateProfileValidator,
  validate,
  asyncHandler(userController.updateProfile)
);

router.post(
  '/bind-identity',
  requireAuth(),
  asyncHandler(userController.bindIdentity)
);

router.get('/identities', requireAuth(), asyncHandler(userController.getIdentities));
router.post('/identities/add', requireAuth(), asyncHandler(userController.addIdentity));
router.post('/identities/remove', requireAuth(), asyncHandler(userController.removeIdentity));

router.get('/stats', requireAuth(), asyncHandler(userController.getStats));

router.get('/favorites', requireAuth(), asyncHandler(userController.getFavorites));
router.post('/favorites/toggle', requireAuth(), asyncHandler(userController.toggleFavorite));

router.get('/activities', requireAuth(), asyncHandler(userController.getActivities));

router.get('/bookings', requireAuth(), asyncHandler(userController.getBookings));
router.post('/bookings', requireAuth(), asyncHandler(userController.createBooking));

router.get('/orders', requireAuth(), asyncHandler(userController.getOrders));
router.post('/orders', requireAuth(), asyncHandler(userController.createOrder));

router.get('/follows', requireAuth(), asyncHandler(userController.getFollows));

module.exports = router;
