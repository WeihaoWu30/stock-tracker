const Portfolio = require("../models/portfolio");
const Stock = require("../models/stock");
const User = require("../models/user");
const axios = require("axios");

// Helper: Get Current Price
const getPrice = async (symbol) => {
   try {
      const response = await axios.get('https://api.twelvedata.com/quote', {
         params: {
            symbol: symbol,
            apikey: process.env.STOCK_API_KEY,
         }
      });

      return response.data;
   } catch (err) {
      console.log("Error fetching price:", err.message);
      return null;
   }
}

// Controller: Get Quote
const getQuote = async (req, res) => {
   try {
      const { symbol } = req.query;
      if (!symbol) return res.status(400).json({ message: "Symbol is required" });

      const data = await getPrice(symbol);
      if (!data) return res.status(404).json({ message: "Stock not found" });

      res.json(data);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}

// Helper: Get Logo
const getLogo = async (symbol, country) => {
   const logo = {
      method: 'GET',
      URL: "https://api.twelvedata.com/logo",
      params: {
         symbol: symbol,
         country: country,
         apikey: process.env.STOCK_API_KEY,
      }
   };
   try {
      const response = await axios.get(logo);
      const data = await response.data;
      if (response.status == '404') console.log("No logo found");
      if (data) console.log("Logo found");
   } catch (err) {
      console.log(err.message);
   }
}

// Get User Portfolio
const getUser = async (req, res) => {
   try {
      // Find portfolio for the logged-in user
      // req.user is populated by passport
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      let portfolio = await Portfolio.findOne({ user: req.user._id });

      if (!portfolio) {
         // Create empty portfolio if not exists
         portfolio = await Portfolio.create({ user: req.user._id, assets: [], cashBalance: 0 });
      }

      // Fetch current prices for all assets
      const enrichedAssets = await Promise.all(
         portfolio.assets.map(async (asset) => {
            const marketData = await getPrice(asset.symbol);
            const currentPrice = marketData && marketData.close ? parseFloat(marketData.close) : asset.avgPrice;
            return {
               symbol: asset.symbol,
               quantity: asset.quantity,
               avgPrice: asset.avgPrice,
               currentPrice: currentPrice,
               currentValue: asset.quantity * currentPrice
            }
         })
      );

      res.json({ assets: enrichedAssets, cashBalance: portfolio.cashBalance });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}

const addShares = async (req, res) => {
   try {
      const { symbol, quantity } = req.body;
      const marketData = await getPrice(symbol);
      const price = marketData && marketData.close ? parseFloat(marketData.close) : null;

      if (!price) return res.status(400).json({ message: "Could not fetch current price for symbol" });

      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user._id;

      let portfolio = await Portfolio.findOne({ user: userId });
      if (!portfolio) {
         portfolio = new Portfolio({ user: userId, assets: [] });
      }

      // Check if user has enough cash (logic omitted for now, implies cashBalance check)

      // Find if asset exists
      const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol);

      if (assetIndex > -1) {
         // Update existing asset
         const asset = portfolio.assets[assetIndex];
         const totalCost = (asset.quantity * asset.avgPrice) + (quantity * price);
         asset.quantity += quantity;
         asset.avgPrice = totalCost / asset.quantity; // Weighted average
      } else {
         // Add new asset
         portfolio.assets.push({ symbol, quantity, avgPrice: price });
      }

      await portfolio.save();
      res.status(200).json(portfolio);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

const sellShares = async (req, res) => {
   try {
      const { symbol, quantity, price } = req.body;
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user._id;

      const portfolio = await Portfolio.findOne({ user: userId });
      if (!portfolio) {
         return res.status(404).json({ message: "Portfolio not found" });
      }

      const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol);

      if (assetIndex > -1) {
         const asset = portfolio.assets[assetIndex];
         if (asset.quantity >= quantity) {
            asset.quantity -= quantity;
            // Add cash logic here: portfolio.cashBalance += quantity * price;

            if (asset.quantity === 0) {
               portfolio.assets.splice(assetIndex, 1); // Remove if 0
            }
         } else {
            return res.status(400).json({ message: "Not enough shares" });
         }
      } else {
         return res.status(404).json({ message: "Asset not found in portfolio" });
      }

      await portfolio.save();
      res.json(portfolio);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }

}

// Delete Asset (Manual Remove)
const deleteAsset = async (req, res) => {
   try {
      const { symbol } = req.body;
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user._id;
      const portfolio = await Portfolio.findOne({ user: userId });
      if (!portfolio) {
         return res.status(404).json("Portfolio not found");
      }
      portfolio.assets = portfolio.assets.filter(a => a != symbol);
      portfolio.save();
      res.json(portfolio);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}

module.exports = {
   getUser,
   getPrice,
   getQuote,
   addShares,
   sellShares,
   deleteAsset
};