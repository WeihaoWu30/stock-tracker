const User = require("../models/user");

const checkUser = async(req, res, next) => {
    try{
        const user = await User.findOne({userID: req.userID});
        if (!user) res.status(404).json({message: "User not Found"});
        next()
    }
    catch(e){
        return res;
    }
}

module.exports = checkUser