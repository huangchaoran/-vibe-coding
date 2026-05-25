const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activityController');
const activityValidator = require('../validators/activityValidator');
const validate = require('../middlewares/validator');
const { requireAuth } = require('../middlewares/auth');

router.get('/', activityValidator.getList, validate, ActivityController.getList);

router.get('/:id', activityValidator.paramId, validate, ActivityController.getDetail);

router.post('/', requireAuth(), activityValidator.create, validate, ActivityController.create);

router.put('/:id', requireAuth(), activityValidator.update, validate, ActivityController.update);

router.delete('/:id', requireAuth(), activityValidator.paramId, validate, ActivityController.delete);

router.post('/:id/signup', requireAuth(), activityValidator.signup, validate, ActivityController.signup);
router.post('/:id/participate', requireAuth(), activityValidator.signup, validate, ActivityController.signup);

router.post('/:id/cancel', requireAuth(), activityValidator.paramId, validate, ActivityController.cancelSignup);
router.delete('/:id/cancel', requireAuth(), activityValidator.paramId, validate, ActivityController.cancelSignup);

router.post('/:id/checkin', requireAuth(), activityValidator.paramId, validate, ActivityController.checkin);

router.get('/:id/signups', requireAuth(), activityValidator.getSignups, validate, ActivityController.getSignups);

router.get('/user/activities', requireAuth(), ActivityController.getUserActivities);

module.exports = router;