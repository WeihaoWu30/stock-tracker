const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
   assets: [
      {
         symbol: { type: String, required: true },
         quantity: { type: Number, required: true, default: 0 },
         avgPrice: { type: Number, required: true },
      }
   ],
   cashBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);