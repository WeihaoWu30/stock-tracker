import mongoose from 'mongoose'

const stockHistory = new mongoose.Schema({
    symbol,
    company,
    price,
    country,
    currency,
    type,
    acess,
    
});

const Stock = mongoose.model('Stock', stockHistory);
export default Stock;