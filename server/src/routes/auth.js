const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { createLoginLimiter } = require('../middlewares/rateLimit');
const validate = require('../middlewares/validator');
const { loginValidator, registerValidator } = require('../validators/authValidator');
const { requireAuth } = require('../middlewares/auth');

router.post(
  '/login',
  createLoginLimiter(),
  loginValidator,
  validate,
  asyncHandler(authController.login)
);

router.post(
  '/register',
  createLoginLimiter(),
  registerValidator,
  validate,
  asyncHandler(authController.register)
);

router.post('/refresh', asyncHandler(authController.refresh));

router.post('/logout', requireAuth(), asyncHandler(authController.logout));

router.post('/dev-login', asyncHandler(authController.devLogin));

module.exports = router;