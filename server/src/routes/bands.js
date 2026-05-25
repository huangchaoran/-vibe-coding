const express = require('express');
const router = express.Router();
const bandController = require('../controllers/bandController');
const { asyncHandler } = require('../middlewares/errorHandler');
const { requireAuth, requireIdentity, requireOwnerOrAdmin } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { createBandValidator, updateBandValidator } = require('../validators/bandValidator');
const { userIdentity } = require('../constants');

router.get('/', asyncHandler(bandController.getList));

router.get('/create-follows-table', asyncHandler(bandController.createFollowsTable));

router.get('/:id', asyncHandler(bandController.getDetail));

router.post(
  '/',
  requireAuth(),
  requireIdentity(userIdentity.MUSICIAN, userIdentity.BAND),
  createBandValidator,
  validate,
  asyncHandler(bandController.create)
);

router.put(
  '/:id',
  requireAuth(),
  requireOwnerOrAdmin(async (req) => {
    const band = await require('../models/Band').findByPk(req.params.id);
    return band ? band.owner_id : null;
  }),
  updateBandValidator,
  validate,
  asyncHandler(bandController.update)
);

router.delete(
  '/:id',
  requireAuth(),
  requireOwnerOrAdmin(async (req) => {
    const band = await require('../models/Band').findByPk(req.params.id);
    return band ? band.owner_id : null;
  }),
  asyncHandler(bandController.delete)
);

router.post('/:id/follow', requireAuth(), asyncHandler(bandController.follow));

router.delete('/:id/follow', requireAuth(), asyncHandler(bandController.unfollow));

router.get('/:id/members', asyncHandler(bandController.getMembers));

router.post(
  '/:id/members',
  requireAuth(),
  requireOwnerOrAdmin(async (req) => {
    const band = await require('../models/Band').findByPk(req.params.id);
    return band ? band.owner_id : null;
  }),
  asyncHandler(bandController.addMember)
);

router.delete(
  '/:id/members/:memberId',
  requireAuth(),
  requireOwnerOrAdmin(async (req) => {
    const band = await require('../models/Band').findByPk(req.params.id);
    return band ? band.owner_id : null;
  }),
  asyncHandler(bandController.removeMember)
);

router.get('/:id/activities', asyncHandler(bandController.getBandActivities));

module.exports = router;
