const Portfolio = require("../models/portfolio");
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


const createPortfolio = async (req, res) => {
   const { name } = req.body;
   let portfolio = await Portfolio.create({ user: req.user._id, name: name, assets: [], totalBalance: 0, previousBalance: 0 });
   res.json(portfolio);
}

const listPortfolios = async (req, res) => {
   try {
      let portfolios = await Portfolio.find({ user: req.user._id });
      const activePortfolios = portfolios.map((p) => {
         return {
            id: p._id,
            name: p.name,
            totalBalance: p.totalBalance
         }
      });

      res.json({ allPortfolios: activePortfolios });
   } catch (error) {
      res.status(500).json(error);
   }
}

const deletePortfolio = async (req, res) => {
   try {
      let { id } = req.query;
      await Portfolio.deleteOne({ _id: id });
      res.status(200).json({ message: "Portfolio deleted" });
   } catch (error) {
      res.status(500).json(error.message);
   }
}

const getPortfolio = async (req, res) => {
   try {
      let { id } = req.body;
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      let portfolio = await Portfolio.findOne({ _id: id, user: req.user._id });

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
      res.json({ assets: enrichedAssets, name: portfolio.name, totalBalance: portfolio.totalBalance, previousBalance: portfolio.previousBalance });
   } catch (error) {
      res.status(500).json({ message: error.message });
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
         portfolio = await Portfolio.create({ user: req.user._id, assets: [], totalBalance: 0, previousBalance: 0 });
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

      res.json({ assets: enrichedAssets, totalBalance: portfolio.totalBalance, previousBalance: portfolio.previousBalance });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
}

const getHistoricalData = async (req, res) => {
   try {
      const { symbol } = req.body;
      if (!symbol) return res.status(400).json({ message: "Symbol is required" });

      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const fetchHistoricalData = await axios.get('https://api.twelvedata.com/time_series', {
         params: {
            symbol: symbol,
            interval: '1month',
            outputsize: 60,
            apikey: process.env.STOCK_API_KEY,
         }
      });

      if (fetchHistoricalData.data.status == 'error') {
         return res.status(400).json({ message: fetchHistoricalData.data.message });
      }
      res.json(fetchHistoricalData.data);
   } catch (error) {
      console.error("Historical Data Error:", error);
      res.status(500).json({ error: error.message });
   }
}

const addShares = async (req, res) => {
   try {
      const { symbol, quantity, id } = req.body;
      const marketData = await getPrice(symbol);
      const price = marketData && marketData.close ? parseFloat(marketData.close) : null;

      if (!price) return res.status(400).json({ message: "Could not fetch current price for symbol" });

      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user._id;

      let portfolio = await Portfolio.findOne({ _id: id, user: userId });
      // Find if asset exists
      const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol);

      if (assetIndex > -1) {
         // Update existing asset
         const asset = portfolio.assets[assetIndex];
         const totalCost = (asset.quantity * asset.avgPrice) + (quantity * price);
         asset.quantity += quantity;
         asset.avgPrice = totalCost / asset.quantity; // Weighted average
         portfolio.previousBalance = portfolio.totalBalance;
         portfolio.totalBalance += quantity * asset.avgPrice;
      } else {
         // Add new asset
         portfolio.previousBalance = portfolio.totalBalance;
         portfolio.totalBalance += quantity * price;
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
      const { symbol, quantity, id } = req.body;
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const userId = req.user._id;

      const portfolio = await Portfolio.findOne({ _id: id, user: userId });
      if (!portfolio) {
         return res.status(404).json({ message: "Portfolio not found" });
      }

      const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol);

      if (assetIndex > -1) {
         const asset = portfolio.assets[assetIndex];
         if (asset.quantity >= quantity) {
            const marketData = await getPrice(symbol);
            const currentPrice = marketData && marketData.close ? parseFloat(marketData.close) : asset.avgPrice;

            asset.quantity -= quantity;
            portfolio.previousBalance = portfolio.totalBalance;
            portfolio.totalBalance -= quantity * currentPrice;

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

const searchAsset = async (req, res) => {
   const { symbol } = req.query;
   if (!symbol) return res.json({ results: [] });

   try {
      const response = await axios.get('https://api.twelvedata.com/symbol_search', {
         params: {
            symbol: symbol,
            outputsize: 10,
            apikey: process.env.STOCK_API_KEY,
         }
      });

      const matches = response.data.data || [];

      const queryResults = matches.map((r) => {
         return ({
            qSymbol: r.symbol,
            qName: r.instrument_name,
            qTimezone: r.exchange_timezone,
         })
      })

      res.json({ results: queryResults });
   } catch (error) {
      console.error(error);
      res.json({ results: [] });
   }
}

module.exports = {
   getUser,
   getPortfolio,
   createPortfolio,
   deletePortfolio,
   listPortfolios,
   getPrice,
   getQuote,
   addShares,
   sellShares,
   deleteAsset,
   searchAsset,
   getHistoricalData
};