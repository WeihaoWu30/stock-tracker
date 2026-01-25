const express = require('express');
const checkUser = require('../middleware/portfolioMiddleware.js');

const router = express.Router();

router.use(checkUser);

module.exports = router;