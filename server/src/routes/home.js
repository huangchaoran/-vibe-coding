const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { asyncHandler } = require('../middlewares/errorHandler');

// 主首页数据 - 支持 /home 和 /home/ 两种路径
router.get('/', asyncHandler(homeController.getHomeData));
// 兼容无斜杠的请求
router.get('', asyncHandler(homeController.getHomeData));

router.get('/banners', asyncHandler(homeController.getBanners));
router.get('/stats', asyncHandler(homeController.getStats));
router.get('/bands', asyncHandler(homeController.getBands));
router.get('/activities', asyncHandler(homeController.getActivities));

module.exports = router;
