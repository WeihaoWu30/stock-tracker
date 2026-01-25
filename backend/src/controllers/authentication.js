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
   // Redirect to frontend dashboard or home
   res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
}

const loginFailure = (req, res) => {
   // Redirect to frontend login with error param
   res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=failed`);
}


module.exports = { loginFailure, loginSuccess };