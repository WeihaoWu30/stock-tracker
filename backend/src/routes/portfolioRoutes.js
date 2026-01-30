const express = require('express');
const checkUser = require('../middleware/portfolioMiddleware.js');
const { getUser, addShares, sellShares, deleteAsset, getQuote } = require('../controllers/portfolioControllers.js')

const router = express.Router();

router.use(checkUser);

router.get("/price", getQuote);
router.get("/profile", getUser);
router.post("/buy", addShares);
router.post("/sell", sellShares);
router.delete("delete", deleteAsset);

module.exports = router;