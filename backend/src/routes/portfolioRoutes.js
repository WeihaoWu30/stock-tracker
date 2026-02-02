const express = require('express');
const checkUser = require('../middleware/portfolioMiddleware.js');
const { getUser, createPortfolio, deletePortfolio, listPortfolios, getPortfolio, addShares, sellShares, deleteAsset, getQuote, searchAsset } = require('../controllers/portfolioControllers.js')

const router = express.Router();

router.use(checkUser);

router.get("/list", listPortfolios);
router.delete("/delete", deletePortfolio);
router.post("/create", createPortfolio);
router.post("/profile", getPortfolio);
router.get("/price", getQuote);
// router.get("/profile", getUser);
router.post("/buy", addShares);
router.post("/sell", sellShares);
// router.delete("delete", deleteAsset);
router.get("/query", searchAsset);

module.exports = router;