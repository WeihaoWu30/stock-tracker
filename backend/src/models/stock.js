const mongoose = require('mongoose');

const stockHistory = new mongoose.Schema({
   symbol: { type: String, required: true, unique: true },
   company: String,
   price: Number,
   country: String,
   currency: String,
   type: String,
   access: String,
});

const Stock = mongoose.model('Stock', stockHistory);
module.exports = Stock;