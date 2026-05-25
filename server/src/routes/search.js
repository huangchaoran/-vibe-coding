const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { asyncHandler } = require('../middlewares/errorHandler');

router.get('/', asyncHandler(searchController.search));

module.exports = router;
