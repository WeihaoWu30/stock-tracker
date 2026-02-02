const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   name: { type: String, required: true },
   assets: [
      {
         symbol: { type: String, required: true },
         quantity: { type: Number, required: true, default: 0 },
         avgPrice: { type: Number, required: true },
      }
   ],
   totalBalance: { type: Number, default: 0 },
   previousBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);