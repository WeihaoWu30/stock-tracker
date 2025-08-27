const User = require("../models/user");
const axios = require("axios");

const getUser = async(req, res) =>{
    try{
        // const user = await User.findOne({userID: req.userID});
        const stockPrices = await Promise.all(
            user.stocks.map(async (stock) => {
                const response = await axios.get("https://api.twelvedata.com/s=price",{
                    params: {
                        symbol: stock.symbol,
                        apikey: process.env.STOCK_API_KEY,
                    }
                });
                return {
                    name: stock.symbol,
                    price: response.data.price,
                    shares : stock.shares,
                }
            })
        );
        // if (!user) return res.status(404).json({message: "User not found"});
        res.json({stocks: stockPrices, balance: user.balance});
    } catch (err){
        res.status(500).json({error: err.message});
    }
}

const addShares = async(req, res) => {
    try{
        const {name, shares, price} = req.body;
        // const user = await User.findOne({userID: req.userID});
        // if (!user) return res.status(404).json({message: "User not Found"});

        const stock = user.stocks.find(s => s.name === name);

        if (stock){
            stock.shares += shares;
        }
        else{
            user.stocks.push({name, shares, price});
        }
        await user.save();
        res.status(200).json(user.stocks);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

const sellShares = async(req, res) =>{
    try{
        const {name, shares, price} = req.body;
        // const user = await User.findOne({userID: req.userID});
        // if (!user) return res.status(404).json({message: "User not Found"});

        const stock = user.stocks.find(s => s.name === name);
        if (stock & stock.shares > 0){
            stock.shares -= shares;
        }else{
            res.status(404).json({message: "Stock not found"});
        }

        await user.save();
        res.json(user.stocks);
    } catch (err){
        res.status(500).json({error: err.message});
    }

}

// const addAsset = async(req, res) => {
//     try{
//         const user = await User.findOne({userID: req.userID});
//         user.stocks.push({
//             name: req.stocks.name,
//             shares: req.stocks.shares,
//             buyPrice : req.stocks.buyPrice,
//         });
//         await user.save();
//         res.json(user);
//     }catch(err){
//         res.status(500).json({error: err.message});
//     }
// }

const deleteAsset = async(req, res) => {

}