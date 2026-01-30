const User = require("../models/user");
const checkUser = (req, res, next) => {
   try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      next();
   }
   catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
   }
}


module.exports = checkUser;