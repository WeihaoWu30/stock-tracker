const User = require("../models/user");


// const register = async(req, username, password) =>{
//     if (!username && !password){
//         return{
//             "status": 401,
//             "message": "Invalid",
//         }
//     }

//     const user = await User.findOne({
//         username: username,
//     });

//     if (user){
//         return {
//             "message": "Username is already used."
//         }
//     }


// }

const loginSuccess = (req, res) => {
   if (!req.user) {
      return res.redirect("/");
   }
   res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
}

const loginFailure = (req, res) => {
   // Redirect to frontend login with error param
   res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=failed`);
}

const getUserProfile = (req, res) => {
   if (!req.user) {
      return res.status(404).json({ message: "No user found" });
   }
   else {
      res.json(req.user);
   }
}

const logout = (req, res) => {
   req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logout successful" });
   });
}

module.exports = { loginFailure, loginSuccess, getUserProfile, logout };