const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/home', require('./home'));
router.use('/users', require('./users'));
router.use('/bands', require('./bands'));
router.use('/activities', require('./activities'));
router.use('/rooms', require('./rooms'));
router.use('/products', require('./products'));
router.use('/recruitments', require('./recruitments'));
router.use('/posts', require('./posts'));
router.use('/search', require('./search'));
router.use('/upload', require('./upload'));

module.exports = router;
