const checkAuth = async (req, res, next) => {
   if (req.isAuthenticated()){
      return next();
   }
   else{
      return res.status(401).json({"message": "Unauthorized Access"});
   }
}

module.exports = checkAuth;